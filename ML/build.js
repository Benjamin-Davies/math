const Bundler = require('parcel');
const path = require('path');
const fs = require('fs');

const isDev = process.argv.includes('--dev');

fs
  .readdirSync(__dirname)
  .filter(dir => {
    const c = dir[0];
    return c.toUpperCase() === c;
  })
  .map(dir => path.join(__dirname, dir))
  .forEach(dir => {
    fs.readdirSync(dir).forEach(subDir => {
      fs.unlinkSync(path.join(dir, subDir));
    });
    fs.rmdirSync(dir);
  });

const options = { watch: isDev };
const publicUrl = isDev ? '/' : '/math/ML/';
const srcDir = path.join(__dirname, 'src/');

fs.readdirSync(srcDir).forEach(dir => {
  new Bundler(path.join(srcDir, dir, 'index.html'), {
    ...options,
    outDir: path.join(__dirname, dir),
    publicUrl: publicUrl + dir
  }).bundle();
});

if (isDev) {
  const express = require('express');
  const app = express();
  app.use(express.static(__dirname));
  app.listen(8080, () => {
    console.log('Dev server running at http://localhost:8080/');
  });
}
