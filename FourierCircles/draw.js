import { iToN } from './app.js';

const DELTA_T = 0.01;

const canvas = document.createElement('canvas');
const width = (canvas.width = 500);
const height = (canvas.height = 500);
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');

export function clear() {
  ctx.fillStyle = '#eee';
  ctx.fillRect(0, 0, width, height);
}

/**
 * @param {[number, number][]} points Array of [x, y] pairs
 */
export function drawLines(points) {
  ctx.strokeStyle = '#00f3';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (const [x, y] of points) {
    ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();
}

/**
 * @param {[number, number]} origin a_0
 * @param {[number, number][]} circles Array of [a_n, b_n] pairs
 * @param {number} time Draw curve where 0 <= t < time
 */
export function drawCircles(origin, circles, time) {
  ctx.strokeStyle = '#000a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let t = 0; t < time; t += DELTA_T) {
    let [x, y] = origin;
    let i = 0;
    for (const [a_n, b_n] of circles) {
      const n = iToN(i);
      [x, y] = [
        x + a_n * Math.cos(n * t) - b_n * Math.sin(n * t),
        y + a_n * Math.sin(n * t) + b_n * Math.cos(n * t),
      ];
      i++;
    }
    ctx.lineTo(x, y);
  }
  ctx.stroke();

  const rPhiCircles = circles.map(([a_n, b_n]) => [
    Math.sqrt(a_n * a_n + b_n * b_n),
    Math.atan2(b_n, a_n),
  ]);

  ctx.fillStyle = '#0001';
  ctx.strokeStyle = '#0003';
  ctx.lineWidth = 2;
  let [x, y] = origin;
  let i = 0;
  for (const [r, phi] of rPhiCircles) {
    ctx.beginPath();
    ctx.ellipse(x, y, r, r, 0, 0, 2 * Math.PI);
    ctx.stroke();

    const n = iToN(i);
    [x, y] = [
      x + r * Math.cos(phi + n * time),
      y + r * Math.sin(phi + n * time),
    ];
    i++;

    ctx.beginPath();
    ctx.ellipse(x, y, 5, 5, 0, 0, 2 * Math.PI);
    ctx.fill();
  }
}
