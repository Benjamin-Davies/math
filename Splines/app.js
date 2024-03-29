const WIDTH = 400;
const HEIGHT = 400;
const DELTA_T = 1e-3;

const shapes = ['circle', 'parabola', 'zig-zag'];
let shape = shapes[0];

const canvas = document.createElement('canvas');
canvas.width = WIDTH;
canvas.height = HEIGHT;
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');

/**
 * @param {number} degree
 * @param {number[][]} controlPoints
 * @param {number[]} weights
 * @param {number[]} knotVector
 */
function drawSpline(degree, controlPoints, weights, knotVector) {
  const lastKnot = knotVector[knotVector.length - 1];

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

  const applyBases = (
    /** @type {number[]} */ bases,
    /** @type {number} */ offset,
    /** @type {number} */ component
  ) => {
    const numerator = bases.reduce((acc, basis, j) => {
      const i = offset + j;
      const w_i = weights[i];
      const P_i = controlPoints[i][component];
      return acc + basis * w_i * P_i;
    }, 0);
    const denominator = bases.reduce((acc, basis, j) => {
      const i = offset + j;
      const w_i = weights[i];
      return acc + basis * w_i;
    }, 0);
    return numerator / denominator;
  };

  let segment = 0;
  for (let u = 0; u < lastKnot; u += DELTA_T) {
    while (knotVector[segment + 1] <= u) segment++;
    // Index of the first control point that is active (starts out negative)
    const offset = segment - degree;

    ctx.fillStyle = `hsl(${u * 360}deg, 95%, 40%)`;

    const bases = [
      N(offset, degree, u),
      N(offset + 1, degree, u),
      N(offset + 2, degree, u),
    ];
    const x = applyBases(bases, offset, 0);
    const y = applyBases(bases, offset, 1);
    ctx.fillRect(x, y, 1, 1);
  }
}

function draw() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  ctx.save();
  ctx.translate(WIDTH / 2, HEIGHT / 2);
  ctx.scale(1, -1);

  let controlPoints, weights, knotVector;
  switch (shape) {
    case 'circle':
      controlPoints = [
        [100, 0],
        [100, 100],
        [0, 100],
        [-100, 100],
        [-100, 0],
        [-100, -100],
        [0, -100],
        [100, -100],
        [100, 0],
      ];
      weights = [
        1,
        Math.SQRT1_2,
        1,
        Math.SQRT1_2,
        1,
        Math.SQRT1_2,
        1,
        Math.SQRT1_2,
        1,
      ];
      knotVector = [0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 4];
      break;

    case 'parabola':
      controlPoints = [
        [-100, 100],
        [0, -100],
        [100, 100],
      ];
      weights = [1, 1, 1];
      knotVector = [0, 0, 0, 1, 1, 1];
      break;

    case 'zig-zag':
      controlPoints = [
        [-100, 100],
        [100, 100],
        [-100, -100],
        [100, -100],
      ];
      weights = [1, 4, 8, 1];
      knotVector = [0, 0, 0, 1, 2, 2, 2];
      break;
  }

  ctx.fillStyle = '#e77';
  drawSpline(2, controlPoints, weights, knotVector);

  ctx.fillStyle = '#77e';
  for (const [x, y] of controlPoints) {
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, 2 * Math.PI);
    ctx.fill();
  }

  ctx.restore();
}

draw();

const select = document.createElement('select');
for (const shape of shapes) {
  const option = document.createElement('option');
  option.innerText = shape;
  option.value = shape;
  select.appendChild(option);
}
select.value = shape;
select.addEventListener('input', () => {
  shape = select.value;
  draw();
});
document.body.appendChild(select);
