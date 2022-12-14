const WIDTH = 400;
const HEIGHT = 400;
const DELTA_T = 1e-3;

const canvas = document.createElement('canvas');
canvas.width = WIDTH;
canvas.height = HEIGHT;
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');

/**
 * @param {number} degree
 * @param {number[][]} controlPoints
 * @param {number[]} knotVector
 */
function drawSpline(degree, controlPoints, knotVector) {
  const lastKnot = knotVector[knotVector.length - 1];
  let knotIndex = 0;

  const applyWeights = (
    /** @type {number[]} */ weights,
    /** @type {number} */ offset,
    /** @type {number} */ component
  ) =>
    weights.reduce((acc, w, i) => {
      const cp = Math.min(Math.max(0, i + offset), controlPoints.length - 1);
      return acc + w * controlPoints[cp][component];
    }, 0);

  const f = (
    /** @type {number} */ i,
    /** @type {number} */ n,
    /** @type {number} */ u
  ) => {
    if (knotVector[i + n] === knotVector[i]) {
      return 0;
    }

    return (u - knotVector[i]) / (knotVector[i + n] - knotVector[i]);
  };
  const g = (
    /** @type {number} */ i,
    /** @type {number} */ n,
    /** @type {number} */ u
  ) => 1 - f(i, n, u);
  const N = (
    /** @type {number} */ i,
    /** @type {number} */ n,
    /** @type {number} */ u
  ) => {
    if (n <= 0) {
      return knotVector[i] <= u && u < knotVector[i + 1] ? 1 : 0;
    }

    return f(i, n, u) * N(i, n - 1, u) + g(i + 1, n, u) * N(i + 1, n - 1, u);
  };

  for (let u = 0; u < lastKnot; u += DELTA_T) {
    while (knotVector[knotIndex + 1] <= u) knotIndex++;
    const offset = knotIndex - degree;

    ctx.fillStyle = `hsl(${u * 360}deg, 95%, 40%)`;

    const weights = [
      N(offset, degree, u),
      N(offset + 1, degree, u),
      N(offset + 2, degree, u),
    ];
    const x = applyWeights(weights, offset, 0);
    const y = applyWeights(weights, offset, 1);
    const w = applyWeights(weights, offset, 2) || 1;
    ctx.fillRect(x / w, y / w, 1, 1);
  }
}

function draw() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  ctx.save();
  ctx.translate(WIDTH / 2, HEIGHT / 2);
  ctx.scale(1, -1);

  // Circle
  const controlPoints = [
    [100, 0, 1],
    [100 * Math.SQRT1_2, 100 * Math.SQRT1_2, Math.SQRT1_2],
    [0, 100, 1],
    [-100 * Math.SQRT1_2, 100 * Math.SQRT1_2, Math.SQRT1_2],
    [-100, 0, 1],
    [-100 * Math.SQRT1_2, -100 * Math.SQRT1_2, Math.SQRT1_2],
    [0, -100, 1],
    [100 * Math.SQRT1_2, -100 * Math.SQRT1_2, Math.SQRT1_2],
    [100, 0, 1],
  ];
  const knotVector = [0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 4];

  // Parabola
  // const controlPoints = [
  //   [100, 100, 1],
  //   [0, -100, 0],
  //   [-100, 100, 1],
  // ];
  // const knotVector = [0, 0, 0, 1, 1, 1];

  ctx.fillStyle = '#e77';
  drawSpline(2, controlPoints, knotVector);

  ctx.fillStyle = '#77e';
  for (const [x, y, w] of controlPoints) {
    ctx.beginPath();
    ctx.arc(x / w, y / w, 3, 0, 2 * Math.PI);
    ctx.fill();
  }

  ctx.restore();
}

draw();
