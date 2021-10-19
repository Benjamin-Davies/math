import { Renderer } from './renderer.js';

const canvas = document.createElement('canvas');
canvas.width = 400;
canvas.height = 400;
document.body.appendChild(canvas);

const renderer = new Renderer(canvas);
renderer.run();

document.addEventListener('mousemove', (ev) => {
  renderer.mouseX = ev.clientX;
  renderer.mouseY = ev.clientY;
});
