const canvas = <HTMLCanvasElement>document.getElementById('main-canvas');
const ctx = canvas.getContext('2d');
var row = 0;

function map(n: number, a: number, b: number) {
  return n * (b - a) + a;
}

function hue(h: number | string) {
  return `hsl(${h}, 100%, 50%)`;
}

function inBounds(x: number, y: number) {
  return x * x + y * y < 4;
}

function calculateCanvasSize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  row = 0;
}

function calculateCell(x: number, y: number) {
  const mx = map(x / canvas.width, -2.5, 1.5);
  const my = map(y / canvas.height, -1.5, 1.5);

  var cx = mx;
  var cy = my;

  var i: number;
  var temp: number;

  for (i = 0; i < 500 && inBounds(cx, cy); i++) {
    temp = 2 * cx * cy + my;
    cx = cx * cx - cy * cy + mx;
    cy = temp;
  }

  if (inBounds(cx, cy))
    ctx.fillStyle = 'black';
  else
    ctx.fillStyle = hue(i * 30);

  ctx.fillRect(x, y, 1, 1);
}

function calculateRow() {
  for (var col = 0; col < canvas.width; col++) {
    calculateCell(col, row);
  }
  row++;
}

function draw() {
  requestAnimationFrame(draw);

  var start = performance.now();
  do {
    if (row > canvas.height)
      return;

    calculateRow();
  } while (performance.now() < start + 10);
}

window.addEventListener('resize', calculateCanvasSize);
calculateCanvasSize();
draw();
