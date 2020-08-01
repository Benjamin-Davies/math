const path = require('path');
const fs = require('fs');
const child_process = require('child_process');

const isDev = process.argv.includes('--dev');

// const options = { watch: isDev };
const publicUrl = isDev ? '/' : '/math/ML/';
const srcDir = path.join(__dirname, 'src/');
const distDir = path.join(__dirname, 'dist/');

fs.readdirSync(srcDir).forEach(dir => {
  // new Bundler(path.join(srcDir, dir, 'index.html'), {
  //   ...options,
  //   outDir: path.join(distDir, dir),
  //   publicUrl: publicUrl + dir
  // }).bundle();
  child_process.execSync(
    `npx parcel build ${path.join(
      srcDir,
      dir,
      'index.html'
    )} --out-dir ${path.join(distDir, dir)} --public-url ${publicUrl + dir}`,
    { stdio: 'inherit' }
  );
});

for (const file of ['index.html', 'style.css']) {
  fs.copyFileSync(path.join(__dirname, file), path.join(distDir, file));
}

if (isDev) {
  const express = require('express');
  const app = express();
  app.use(express.static(__dirname));
  app.listen(8080, () => {
    console.log('Dev server running at http://localhost:8080/');
  });
}
