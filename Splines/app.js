const WIDTH = 400;
const HEIGHT = 400;
const DELTA_T = 1e-3;

const canvas = document.createElement('canvas');
canvas.width = WIDTH;
canvas.height = HEIGHT;
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');

const controlPoints = [
  [100, 100, 1],
  [300, 100, 1],
  [300, 300, 1],
  [100, 300, 1],
  [100, 200, 1],
  [400, 400, 2],
];

const quadBezier = (/** @type {number} */ t) => [
  1 - 2 * t + t * t,
  2 * t - 2 * t * t,
  t * t,
];
const cubicBezier = (/** @type {number} */ t) => [
  1 - 3 * t + 3 * (t * t) - t * t * t,
  3 * t - 6 * (t * t) + 3 * t * t * t,
  3 * t * t - 3 * t * t * t,
  t * t * t,
];
const quadBSpline = (/** @type {number} */ t) => [
  0.5 * t * t - t + 0.5,
  -t * t + t + 0.5,
  0.5 * t * t,
];
const cubicBSpline = (/** @type {number} */ t) => [
  (-1 / 6) * t * t * t + (1 / 2) * t * t - (1 / 2) * t + 1 / 6,
  (1 / 2) * t * t * t - t * t + 2 / 3,
  (-1 / 2) * t * t * t + (1 / 2) * t * t + (1 / 2) * t + 1 / 6,
  (1 / 6) * t * t * t,
];

/**
 * @param {(t: number) => number[]} weightFn
 * @param {number[][]} controlPoints
 */
function drawSpline(weightFn, controlPoints) {
  const pointsPerSegment = weightFn(0).length;
  const segments = controlPoints.length - pointsPerSegment + 1;

  const applyWeights = (
    /** @type {number[]} */ weights,
    /** @type {number} */ offset,
    /** @type {number} */ component
  ) =>
    weights.reduce(
      (acc, w, i) => acc + w * controlPoints[offset + i][component],
      0
    );

  ctx.beginPath();
  for (let t = 0; t < segments; t += DELTA_T) {
    let i = Math.floor(t);
    const weights = weightFn(t - i);
    const x = applyWeights(weights, i, 0);
    const y = applyWeights(weights, i, 1);
    const w = applyWeights(weights, i, 2) || 1;
    ctx.lineTo(x / w, y / w);
  }
  ctx.stroke();
}

function draw() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  drawSpline(cubicBSpline, controlPoints);
}

draw();
