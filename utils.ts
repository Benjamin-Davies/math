import { existsSync, ensureDir, emptyDir, readdirSync, copy, readJson, remove } from 'fs-extra';
import { join } from 'path';
import { execSync } from 'child_process';

const distDir = join(__dirname, 'dist');

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
  async build() {
    await ensureDir(distDir);
    await emptyDir(distDir);

    for (const file of files) {
      if (!npmDirs.includes(file)) {
        await copy(join(__dirname, file), join(distDir, file), {
          recursive: true,
        });
      }
    }

    for (const dir of npmDirs) {
      const packageJson = await readJson(join(__dirname, dir, 'package.json'));
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
  },
};

const command = process.argv[2];
if (commands.hasOwnProperty(command)) {
  commands[command]();
} else {
  console.error(`Available commands are ${Object.keys(commands).join(', ')}`);
}
