import {
  variable,
  scalar,
  tidy,
  train,
  Tensor1D,
  tensor1d,
  Tensor,
  Rank,
  Variable,
  Optimizer
} from '@tensorflow/tfjs';

const canvas = document.getElementById('main-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

const w = 500;
const h = 500;

const xArr = [] as number[];
const yArr = [] as number[];

const variables = [] as Variable[];

const xArr2 = [];
for (let x = 0; x <= 1.001; x += 0.01) {
  xArr2.push(x);
}
const xs2 = tensor1d(xArr2);

canvas.width = w;
canvas.height = h;

canvas.addEventListener('mousedown', e => {
  const x = e.pageX - canvas.offsetLeft;
  const y = e.pageY - canvas.offsetTop;

  xArr.push(x / w);
  yArr.push(y / h);
});

const predict = (data: Tensor1D) =>
  tidy(() =>
    variables.reduce(
      (acc, v, i) => acc.add(data.pow(scalar(i)).mul(v)),
      data.mul<Tensor1D>(scalar(0))
    )
  ) as Tensor1D;
const loss = (pred: Tensor1D, labels: Tensor1D) =>
  pred
    .sub(labels)
    .square()
    .mean() as Tensor<Rank.R0>;

let optimizerType: (
  learningRate: number
) => Optimizer & { setLearningRate?(rate: number): void } =
  train.sgd;
let optimizer = optimizerType(0.05);
let rate = 0.05;
const updateDegree = (n: number) => {
  const len = n + 1; // We need n+1 terms for polynomials
  if (variables.length > len) {
    variables.splice(len, variables.length - len).forEach(v => v.dispose);
  } else {
    while (variables.length < len) {
      variables.push(variable(scalar(Math.random())));
    }
  }
};
updateDegree(3);
const updateOptimizerType = (str: string) => {
  console.log(str);
  if (train.hasOwnProperty(str)) {
    const type = train[str];
    if (optimizerType !== type) {
      optimizerType = type;
      optimizer = optimizerType(rate);
    }
  }
};
const updateLearningRate = (n: number) => {
  if (rate !== n) {
    rate = n;
    if (typeof optimizer.setLearningRate === 'function') {
      optimizer.setLearningRate(n);
    } else {
      optimizer = optimizerType(rate);
    }
  }
};
// @ts-ignore
window.updateDegree = updateDegree;
// @ts-ignore
window.updateOptimizerType = updateOptimizerType;
//@ts-ignore
window.updateLearningRate = updateLearningRate;

const draw = () => {
  if (xArr.length > 0) {
    tidy(() => {
      const xs = tensor1d(xArr);
      const ys = tensor1d(yArr);
      optimizer.minimize(() => loss(predict(xs), ys), false, variables);
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

  const ys2 = predict(xs2);
  const yArr2 = ys2.dataSync();
  ys2.dispose();
  ctx.strokeStyle = 'blue';
  ctx.lineWidth = 4;
  ctx.beginPath();
  for (let i = 0; i < xArr2.length; i++) {
    ctx.lineTo(xArr2[i] * w, yArr2[i] * h);
  }
  ctx.stroke();

  requestAnimationFrame(draw);
};

requestAnimationFrame(draw);
