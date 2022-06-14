import { clear, drawCircles, drawLines } from './draw.js';

const N = 3;

let time = 0;
/**@type {[number, number][]} */
const points = [];

/**@type {[number, number]} */
let origin = [250, 250];
/**@type {[number, number][]} */
let circles = [
  [20, 50],
  [100, 0],
  [50, 100],
];

document.addEventListener('mousedown', (ev) => {
  points.push([ev.clientX, ev.clientY]);

  calculateCircles();
});

/**
 * Convert an index to alternating positive negative integers
 * @param {number} i
 */
export function iToN(i) {
  if (i % 2 === 0) {
    return i / 2 + 1;
  } else {
    return -(i + 1) / 2;
  }
}

function calculateCircles() {
  const [x_total, y_total] = points.reduce(([x_1, y_1], [x_2, y_2]) => [
    x_1 + x_2,
    y_1 + y_2,
  ]);
  origin = [x_total / points.length, y_total / points.length];

  circles = Array(2 * N)
    .fill(0)
    .map((_, i) => {
      const n = iToN(i);
      console.log(i, n);
      const [a_total, b_total] = points
        .map(([x, y], i) => {
          x -= origin[0];
          y -= origin[1];
          const theta = (2 * n * Math.PI * i) / points.length;
          return [
            x * Math.cos(theta) + y * Math.sin(theta),
            -x * Math.sin(theta) + y * Math.cos(theta),
          ];
        })
        .reduce(([a_1, b_1], [a_2, b_2]) => [a_1 + a_2, b_1 + b_2]);
      return [a_total / points.length, b_total / points.length];
    });
}

function draw() {
  clear();
  drawLines(points);
  drawCircles(origin, circles, time);

  time += 0.01;
  time %= 2 * Math.PI;
  // time = 2 * Math.PI;

  requestAnimationFrame(draw);
}

draw();
