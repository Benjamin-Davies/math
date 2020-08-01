var primes = [], i;
var cols, cw, ch;
var iterationSpan;

function setup() {
  createCanvas(600, 600).parent("#canvasContainer");

  iterationSpan = document.getElementById("iteration");

  initGrid();
}

function initGrid() {
  cols = document.getElementById("cols").value;
  cw = floor(width / cols);
  ch = floor(height / cols);
  i = 0;

  loop();
  background(255);
}

function draw() {
  fill(0);
  noStroke();

  iterationSpan.innerText = "Elimating multiples of: " + i;

  elimateMultiples();

  i++;
  if (i >= cols) {
    iterationSpan.innerText = "Done";
    noLoop();
  }
}

function elimateMultiples() {
  if (primes[i]) return;
  
  if (i <= 1)
    rect(floor(i % cols) * cw, floor(i / cols) * ch, cw, ch);
  else {
    for (var j = 0; j < cols * cols; j += i) {
      if (j > i) {
        primes[j] = true;
        rect(floor(j % cols) * cw, floor(j / cols) * ch, cw, ch);
      }
    }
  }
}
