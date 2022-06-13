import { drawCircles } from './draw.js';

let t = 0;

function draw() {
  drawCircles(
    [250, 250],
    [
      [20, 50],
      [100, 0],
      [50, 100],
    ],
    t
  );

  t += 0.01;
  t %= 2 * Math.PI;

  requestAnimationFrame(draw);
}

draw();
