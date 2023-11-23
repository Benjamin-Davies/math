import { clear, drawCircles, drawLines } from './draw.js';

const N = 10;

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

document.addEventListener('touchstart', (ev) => {
  points.push([ev.targetTouches[0].clientX, ev.targetTouches[0].clientY]);
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

/**
 * Calculates the DFT of a power of 2 length array
 * @param {[number, number][]} f
 */
function fft(f) {
  if (f.length === 1) {
    return f;
  }

  const f_even = f.filter((_, i) => i % 2 === 0);
  const f_odd = f.filter((_, i) => i % 2 === 1);

  const F_even = fft(f_even);
  const F_odd = fft(f_odd);

  const F = Array(f.length).fill(null);
  for (let i = 0; i < f.length / 2; i++) {
    const theta = (2 * Math.PI * i) / f.length;
    const [a, b] = F_even[i];
    const [c, d] = F_odd[i];
    F[i] = [
      a + c * Math.cos(theta) - d * Math.sin(theta),
      b + c * Math.sin(theta) + d * Math.cos(theta),
    ];
    F[i + f.length / 2] = [
      a - c * Math.cos(theta) + d * Math.sin(theta),
      b - c * Math.sin(theta) - d * Math.cos(theta),
    ];
  }
  return F;
}

function calculateCircles() {
  const count = points.length;
  const nextPow2 = Math.pow(2, Math.ceil(Math.log2(count)));
  const f = [...points, ...Array(nextPow2 - count).fill(points[0])];

  const F = fft(f);

  origin = [F[0][0] / F.length, F[0][1] / F.length];
  circles = [];
  for (let i = 0; i < Math.min(F.length - 1, N); i++) {
    const n = iToN(i);
    const j = n < 0 ? F.length + n : n;
    const [a, b] = F[j];
    circles.push([a / F.length, b / F.length]);
  }
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
