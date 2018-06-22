let currentPoint;

function setup() {
  createCanvas(400, 400);
  background(25, 25, 112);
  stroke(113, 188, 120);

  currentPoint = createVector(0, 0);
}

function draw() {
  for (let i = 0; i < 10; i++) {
    currentPoint = iterate(currentPoint);
    drawPoint(currentPoint);
  }
}

const options = [
  {
    a: 0,
    b: 0,
    c: 0,
    d: 0.16,
    e: 0,
    f: 0,
    p: 0.02
  },
  {
    a: 0.85,
    b: 0.04,
    c: -0.04,
    d: 0.85,
    e: 0,
    f: 1.6,
    p: 0.84
  },
  {
    a: 0.2,
    b: -0.26,
    c: 0.23,
    d: 0.22,
    e: 0,
    f: 1.6,
    p: 0.07
  },
  {
    a: -0.15,
    b: 0.28,
    c: 0.26,
    d: 0.24,
    e: 0,
    f: 0.44,
    p: 0.07
  }
];

function iterate(pt) {
  let r = random();
  let selected;
  for (const option of options) {
    r -= option.p;
    if (r < 0) {
      selected = option;
      break;
    }
  }
  return createVector(
    pt.x * selected.a + pt.y * selected.b + selected.e,
    pt.x * selected.c + pt.y * selected.d + selected.f
  );
}

function drawPoint(pt) {
  point(map(pt.x, -5, 5, 0, width), map(pt.y, 10, 0, 0, height));
}
