var pts, table, i;
var r = 200;

function setup() {
  createCanvas(400, 400).parent("#canvasContainer");

  iterationSpan = document.getElementById("iteration");

  initGrid();
}

function initGrid() {
  pts = document.getElementById("pts").value * 1;
  table = document.getElementById("tbl").value * 1;
  i = 0;

  loop();
  background(255);
  stroke(0);
}

function draw() {
  iterationSpan.innerText = i;

  push();
  translate(width / 2, height / 2);

  var theta1 = TWO_PI * i / pts;
  var theta2 = TWO_PI * i / pts * table;
  var x1 = r * cos(theta1);
  var y1 = r * sin(theta1);
  var x2 = r * cos(theta2);
  var y2 = r * sin(theta2);
  line(x1, y1, x2, y2);

  pop();

  i++;
  if (i >= pts) {
    iterationSpan.innerText = "Done";
    noLoop();
    return;
  }
}
