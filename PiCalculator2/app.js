const TWO_PI = 2 * Math.PI;

/** @type {HTMLCanvasElement} */
const circleCanvas = document.getElementById('circle-canvas');
circleCanvas.width = circleCanvas.height = 300;
const circleCtx = circleCanvas.getContext('2d');

/** @type {HTMLCanvasElement} */
const graphCanvas = document.getElementById('graph-canvas');
graphCanvas.width = graphCanvas.height = 300;
const graphCtx = graphCanvas.getContext('2d');

const totalSpan = document.getElementById('total');
const estSpan = document.getElementById('est');
const bestEstSpan = document.getElementById('best-est');
const bestDiffSpan = document.getElementById('best-diff');

let total = 0;
let inside = 0;
let est = 0;
let bestEst = 0;
let bestDiff = Infinity;
let estimates = [];

function draw() {
  requestAnimationFrame(draw);

  for (let i = 0; i < 10; i++) {
    const x = Math.random();
    const y = Math.random();

    const isInside = calculateIsInside(x, y);

    total++;
    if (isInside) {
      inside++;
    }

    circleCtx.fillStyle = isInside ? '#0f05' : '#f005';
    circleCtx.beginPath();
    circleCtx.arc(300 * x, 300 * y, 5, 0, TWO_PI);
    circleCtx.fill();

    est = 4 * inside / total;
    estimates.push(est);

    const diff = Math.abs(Math.PI - est);
    if (diff < bestDiff) {
      bestEst = est;
      bestDiff = diff;
      bestEstSpan.innerText = bestEst.toFixed(10);
      bestDiffSpan.innerText = bestDiff.toExponential(5);
    }
  }

  graphCtx.fillStyle = 'white';
  graphCtx.fillRect(0, 0, 400, 400);

  graphCtx.strokeStyle = 'green';
  graphCtx.beginPath();
  graphCtx.moveTo(0, 400 - Math.PI * 100);
  graphCtx.lineTo(400, 400 - Math.PI * 100);
  graphCtx.stroke();

  graphCtx.strokeStyle = 'blue';
  graphCtx.lineWidth = 0.5;
  graphCtx.beginPath();
  estimates.forEach((x, i) => {
    graphCtx.lineTo(400 * i / estimates.length, 400 - x * 100);
  });
  graphCtx.stroke();

  totalSpan.innerText = total.toLocaleString();
  estSpan.innerText = est.toFixed(10);
}

function calculateIsInside(x, y) {
  const cx = x * 2 - 1;
  const cy = y * 2 - 1;

  return cx * cx + cy * cy < 1;
}

function reset() {
  total = 0;
  inside = 0;
  est = 0;
  bestEst = 0;
  bestDiff = Infinity;
  estimates = [];

  circleCtx.fillStyle = 'white';
  circleCtx.strokeStyle = 'black';
  circleCtx.lineWidth = 2;
  circleCtx.beginPath();
  circleCtx.rect(0, 0, 300, 300);
  circleCtx.moveTo(300, 150);
  circleCtx.arc(150, 150, 150, 0, TWO_PI);
  circleCtx.fill();
  circleCtx.stroke();
}

reset();
requestAnimationFrame(draw);
