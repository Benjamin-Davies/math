import * as fs from 'fs';
import { join } from 'path';
import { execSync } from 'child_process'

const excludedDirs = ['node_modules', '.git', 'build'];
const files = fs
  .readdirSync(__dirname)
  .filter((file) => !excludedDirs.includes(file));

const npmDirs = files.filter((file) =>
  fs.existsSync(join(__dirname, file, 'package.json'))
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
};

const command = process.argv[2];
if (commands.hasOwnProperty(command)) {
  commands[command]();
} else {
  console.error(`Available commands are ${Object.keys(commands).join(', ')}`);
}
