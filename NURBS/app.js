const canvas = document.createElement('canvas');
canvas.width = canvas.height = 400;
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');
ctx.fillStyle = 'black';

const points = [
  [0, 0],
  [400, 100],
  [400, 200],
  [000, 400],
];

ctx.beginPath();
for (let t = 0; t < 1; t += 0.01) {
  const u = 1 - t;
  const a = t * t * t;
  const b = 3 * t * t * u;
  const c = 3 * t * u * u;
  const d = u * u * u;
  ctx.lineTo(
    a * points[0][0] + b * points[1][0] + c * points[2][0] + d * points[3][0],
    a * points[0][1] + b * points[1][1] + c * points[2][1] + d * points[3][1]
  );
}
ctx.stroke();
