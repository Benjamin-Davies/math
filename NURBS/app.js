const canvas = document.createElement('canvas');
canvas.width = canvas.height = 400;
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');
ctx.fillStyle = 'black';

const points = [
  [0, 0],
  [50, 300],
  [250, 250],
  [300, 400],
  [400, 0],
  [250, 50],
];

const t = points.map((_, i) => i / (points.length - 1));

const N = 1;

ctx.beginPath();
for (const [x, y] of points) {
  ctx.lineTo(x, y);
}
ctx.stroke();

function add(a, b) {
  return a + b;
}

function B(x, i, n) {
  if (n === 0) return t[i] <= x && x < t[i + 1] ? 1 : 0;

  const k = n - 1;
  const omega = (i) => (x - t[i]) / (t[i + k] - t[i]);
  return omega(i) * B(x, i, k) + (1 - omega(i + 1)) * B(x, i + 1, k);
}

ctx.beginPath();
for (let t = 0; t <= 1; t += 0.1) {
  const [x, y] = [
    points.map((p, i) => p[0] * B(t, i, N)).reduce(add),
    points.map((p, i) => p[1] * B(t, i, N)).reduce(add),
  ];
  console.log(t, x, y);
  ctx.lineTo(x, y);
}
ctx.stroke();
