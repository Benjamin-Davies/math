import {
  variable,
  scalar,
  tidy,
  train,
  Tensor1D,
  tensor1d,
  Tensor,
  Rank
} from '@tensorflow/tfjs';

const canvas = document.getElementById('main-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

const w = 500;
const h = 500;

const xArr = [] as number[];
const yArr = [] as number[];

const m = variable(scalar(Math.random()));
const c = variable(scalar(Math.random()));

canvas.width = w;
canvas.height = h;

canvas.addEventListener('mousedown', e => {
  const x = e.clientX - canvas.offsetLeft;
  const y = e.clientY - canvas.offsetTop;

  xArr.push(x / w);
  yArr.push(y / h);
});

const predict = (data: Tensor1D) => tidy(() => data.mul(m).add(c)) as Tensor1D;
const loss = (pred: Tensor1D, labels: Tensor1D) =>
  pred
    .sub(labels)
    .square()
    .mean() as Tensor<Rank.R0>;
const optimizer = train.sgd(0.2);

const draw = () => {
  if (xArr.length > 0) {
    tidy(() => {
      const xs = tensor1d(xArr);
      const ys = tensor1d(yArr);
      optimizer.minimize(() => loss(predict(xs), ys));
    });
  }

  ctx.fillStyle = '#eee';
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = 'black';
  ctx.beginPath();
  for (let i = 0; i < xArr.length; i++) {
    const x = xArr[i];
    const y = yArr[i];
    ctx.rect(x * w - 4, y * h - 4, 8, 8);
  }
  ctx.fill();

  ctx.strokeStyle = 'blue';
  ctx.lineWidth = 4;
  const mVal = m.dataSync()[0];
  const cVal = c.dataSync()[0];
  ctx.beginPath();
  ctx.moveTo(0, cVal * h);
  ctx.lineTo(w, (mVal + cVal) * h);
  ctx.stroke();

  requestAnimationFrame(draw);
};

requestAnimationFrame(draw);
