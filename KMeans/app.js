import './math.js';

const width = window.innerWidth,
  height = window.innerHeight;
const n = Math.floor(5e-3 * width * height),
  k = 10;

const canvas = document.createElement('canvas');
canvas.width = width;
canvas.height = height;
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

const points = Array(n)
  .fill(null)
  .map(() => [width * Math.random(), height * Math.random()]);

let centroids = Array(k)
  .fill(null)
  .map(() => [width * Math.random(), height * Math.random()]);

function closestCentroid(x, y) {
  let minDSq = Infinity;
  let closest;

  for (let i = 0; i < centroids.length; i++) {
    const [cx, cy] = centroids[i];
    const dx = x - cx;
    const dy = y - cy;
    const dSq = dx * dx + dy * dy;
    if (dSq < minDSq) {
      minDSq = dSq;
      closest = i;
    }
  }

  return closest;
}

function draw() {
  requestAnimationFrame(draw);
  ctx.clearRect(0, 0, width, height);

  const groups = Array(k)
    .fill(null)
    .map(() => []);

  for (const [x, y] of points) {
    const i = closestCentroid(x, y);
    groups[i].push([x, y]);

    ctx.fillStyle = `hsl(${(i * 360) / k}deg, 100%, 50%)`;
    ctx.fillRect(x - 2, y - 2, 4, 4);
  }

  for (const [x, y] of centroids) {
    ctx.fillStyle = 'white';
    ctx.fillRect(x - 4, y - 4, 8, 8);
  }

  centroids = groups.map((group) => {
    let sumX = 0,
      sumY = 0;
    for (const [x, y] of group) {
      sumX += x;
      sumY += y;
    }
    return [sumX / group.length, sumY / group.length];
  });
}

draw();
