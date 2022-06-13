const DELTA_T = 0.01;

const canvas = document.createElement('canvas');
const width = (canvas.width = 500);
const height = (canvas.height = 500);
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');

/**
 * @param {[number, number]} origin a_0
 * @param {[number, number][]} circles Array of [a_n, b_n] pairs
 * @param {number} time Draw curve where 0 <= t < time
 */
export function drawCircles(origin, circles, time) {
  ctx.fillStyle = '#eee';
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = '#000a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let t = 0; t < time; t += DELTA_T) {
    let [x, y] = origin;
    let n = 1;
    for (const [a_n, b_n] of circles) {
      [x, y] = [
        x + a_n * Math.cos(n * t) - b_n * Math.sin(n * t),
        y + a_n * Math.sin(n * t) + b_n * Math.cos(n * t),
      ];
      n++;
    }
    ctx.lineTo(x, y);
  }
  ctx.stroke();

  const rPhiCircles = circles.map(([a_n, b_n]) => [
    Math.sqrt(a_n * a_n + b_n * b_n),
    Math.atan2(b_n, a_n),
  ]);

  ctx.strokeStyle = '#0003';
  ctx.lineWidth = 2;
  ctx.beginPath();
  let [x, y] = origin;
  let n = 1;
  for (const [r, phi] of rPhiCircles) {
    ctx.moveTo(x + r, y);
    ctx.ellipse(x, y, r, r, 0, 0, 2 * Math.PI);
    [x, y] = [
      x + r * Math.cos(phi + n * time),
      y + r * Math.sin(phi + n * time),
    ];
    n++;
  }
  ctx.stroke();
}
