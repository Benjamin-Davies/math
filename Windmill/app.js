import { dot, add, sub, scale, modulo } from './math.js';

const width = 400;
const height = 400;
const debugVectors = false;

const canvas = document.createElement('canvas');
canvas.width = width;
canvas.height = height;
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');

const pointCount = 25;
const points = [];
for (let i = 0; i < pointCount; i++)
  points.push([width * Math.random(), height * Math.random()]);
points.sort(([x1, _], [x2, _2]) => x1 - x2);

let axis = points[Math.floor(points.length / 2)];
let theta = 0;

const normal = () => [Math.cos(theta), Math.sin(theta)];
const tangent = () => [Math.sin(theta), -Math.cos(theta)];

const isRightOfLine = p => dot(sub(p, axis), normal()) > 0;

const angleFromAxis = p => Math.atan2(...sub(p, axis));
const angleFromLine = p => Math.PI - (Math.PI + theta + angleFromAxis(p)) % Math.PI;

let t = performance.now() / 1000;
let deltaTheta = 0;

draw();

function draw() {
  const nextT = performance.now() / 1000;
  const deltaT = nextT - t;
  deltaTheta = deltaT;

  let newAxis = axis;
  for (const p of points) {
    if (p === axis) continue;
    if (angleFromLine(p) <= deltaTheta)
      newAxis = p;
  }
  axis = newAxis;

  t += deltaT;
  theta += deltaTheta;
  theta %= 2 * Math.PI;

  ctx.fillStyle = '#eee';
  ctx.fillRect(0, 0, width, height);

  drawLine();
  drawPoints();

  requestAnimationFrame(draw);
}

function drawPoints() {
  for (const p of points) {
    if (p === axis)
      ctx.fillStyle = '#000';
    else if (isRightOfLine(p))
      ctx.fillStyle = '#00f';
    else
      ctx.fillStyle = '#0c0';
    ctx.beginPath();
    ctx.arc(...p, 5, 0, 2 * Math.PI);
    ctx.fill();

    if (debugVectors) {
      const a = angleFromLine(p);
      ctx.beginPath();
      ctx.moveTo(...p);
      ctx.lineTo(...add(p, [10*Math.cos(a), 10*Math.sin(a)]));
      ctx.stroke();
    }
  }
}

function drawLine() {
  const v = scale(1000, tangent());
  ctx.strokeStyle = '#f00';
  ctx.beginPath();
  ctx.moveTo(...sub(axis, v));
  ctx.lineTo(...add(axis, v));
  ctx.stroke();
}
