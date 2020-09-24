import {
  existsSync,
  ensureDir,
  emptyDir,
  readdirSync,
  copy,
  readJson,
  remove,
  appendFile,
  readFile,
} from 'fs-extra';
import { join } from 'path';
import { exec, execSync, spawn } from 'child_process';
import { noCase } from 'change-case';
import { titleCase } from 'title-case';

import * as express from 'express';
import * as serveIndex from 'serve-index';
import * as proxy from 'express-http-proxy';

const distDir = join(__dirname, 'dist');

const ignoreNpm = process.argv.includes('--ignore-npm');

const excludedFiles = [
  '.git',
  '.vscode',
  'dist',
  'node_modules',
  'package.json',
  'package-lock.json',
];
const files = readdirSync(__dirname).filter(
  (file) => !excludedFiles.includes(file)
);

const npmDirs = files.filter((file) =>
  existsSync(join(__dirname, file, 'package.json'))
);

const commands = {
  prepare() {
    for (const dir of npmDirs) {
      execSync('npm ci', {
        cwd: join(__dirname, dir),
        stdio: 'inherit',
      });
    }
  },
  async start() {
    const app = express();
    const port = +process.env.PORT || 3000;
    let currentPort = 5000;

    for (const dir of npmDirs) {
      const serverPort = currentPort++;
      const packageJson = await readJson(join(__dirname, dir, 'package.json'));
      if (packageJson.scripts.hasOwnProperty('start')) {
        console.log(`${packageJson.name ?? dir} listening on port ${serverPort}`);

        spawn('npm run start', {
          cwd: join(__dirname, dir),
          shell: true,
          stdio: 'inherit',
          env: {
            ...process.env,
            PORT: `${serverPort}`,
            PUBLIC_URL: `/${dir}/`,
          },
        });

        app.use(`/${dir}`, proxy(`http://localhost:${serverPort}`));
      } else {
        console.warn(
          `Package ${packageJson.name} (${dir}/) has no start script. Skipping...`
        );
      }
    }

    app.use('/', express.static('.'), serveIndex('.', { icons: true }));

    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  },
  async build() {
    await ensureDir(distDir);
    await emptyDir(distDir);

    // Copy non-npm files
    for (const file of files) {
      if (!npmDirs.includes(file)) {
        await copy(join(__dirname, file), join(distDir, file), {
          recursive: true,
        });
      }
    }

    // Build npm projects and copy results
    if (!ignoreNpm) {
      for (const dir of npmDirs) {
        const packageJson = await readJson(
          join(__dirname, dir, 'package.json')
        );
        if (packageJson.scripts.hasOwnProperty('build')) {
          await remove(join(__dirname, dir, 'dist'));
          await remove(join(__dirname, dir, '.cache'));

          execSync('npm run build', {
            cwd: join(__dirname, dir),
            stdio: 'inherit',
          });

          await copy(join(__dirname, dir, 'dist'), join(distDir, dir), {
            recursive: true,
          });
        } else {
          console.warn(
            `Package ${packageJson.name} (${dir}/) has no build script. Skipping...`
          );
        }
      }
    }

    // Compile the readmes into one
    const readmes: { name: string; content: string; commitDate: Date }[] = [];
    for (const name of files) {
      if (existsSync(join(__dirname, name, 'README.md'))) {
        const content = await readFile(join(__dirname, name, 'README.md'), {
          encoding: 'utf8',
        });
        const commitDate = execSync(
          `git log -n 1 --pretty=format:%ci ${join(__dirname, name)}`,
          {
            encoding: 'utf8',
          }
        );
        readmes.push({ name, content, commitDate: new Date(commitDate) });
      }
    }
    readmes.sort((a, b) => (a.commitDate > b.commitDate ? -1 : 1));
    for (const { name, content } of readmes) {
      await appendFile(
        join(distDir, 'README.md'),
        `\n### [${titleCase(noCase(name))}](./${name}/)\n\n${content}`
      );
    }
  },
};

const command = process.argv[2];
if (commands.hasOwnProperty(command)) {
  commands[command]();
} else {
  console.error(`Available commands are ${Object.keys(commands).join(', ')}`);
}
