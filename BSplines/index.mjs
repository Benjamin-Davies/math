const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

const P = 3;
const DELTA_T = 0.1;

/**@type {[number, number][]} */
const points = [];

/**
 * @param i {number}
 * @param p {number}
 * @param t {number}
 */
function basis(i, p, t) {
  if (p === 0) {
    return t >= i && t < i + 1 ? 1 : 0;
  } else if (t < i - p || t > i + p + 1) {
    return 0;
  }
  return (
    ((t - i) / p) * basis(i, p - 1, t) +
    ((i + p + 1 - t) / p) * basis(i + 1, p - 1, t)
  );
}

function drawBSpline() {
  if (points.length === 0) {
    return;
  }

  for (let t = P - 1; t < points.length + 2 * P; t += DELTA_T) {
    let x = 0;
    let y = 0;
    for (let i = 0; i < points.length + 2 * P; i++) {
      const b = basis(i, P, t);

      let j = i;
      if (j < 0) {
        j = 0;
      } else if (j >= points.length) {
        j = points.length - 1;
      }
      x += b * points[j][0];
      y += b * points[j][1];
    }

    ctx.lineTo(x, y);
  }
}

function draw() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = 'lightgreen';
  ctx.beginPath();
  drawBSpline();
  ctx.stroke();

  ctx.fillStyle = 'white';
  for (const [x, y] of points) {
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fill();
  }
}

draw();

window.addEventListener('resize', draw);
document.addEventListener('mousedown', (e) => {
  const x = e.clientX;
  const y = e.clientY;
  points.push([x, y]);

  draw();
});
