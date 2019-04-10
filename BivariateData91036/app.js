const width = 100,
  height = 100;

let currentGrid = Array(width * height).fill(false);
let nextGrid = Array(width * height).fill(false);

let stepCount = 0;

// Initialize grid with random values
for (let i = 0; i < width * height; i++) {
  // Math.random returns a random value that is 0 <= x < 1
  // these are randomly distributed
  // therefore P(x < 0.5) = 0.5
  currentGrid[i] = Math.random() < 0.5;
}

function getCell(x, y) {
  if (x < 0 || x >= width || y < 0 || y >= height) return false;

  // Equation to find index of cell in array
  const i = x + y * width;
  return currentGrid[i];
}

function setCell(x, y, value) {
  const i = x + y * width;
  // Only set values on the next grid
  // so that we dont overwrite stuff
  nextGrid[i] = value;
}

function step() {
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const current = getCell(x, y);

      let neighboors = 0;
      for (let xOff = -1; xOff <= 1; xOff++) {
        for (let yOff = -1; yOff <= 1; yOff++) {
          // Don't count a cell as it's own neighboor
          if (xOff !== 0 || yOff !== 0) {
            if (getCell(x + xOff, y + yOff)) neighboors++;
          }
        }
      }

      // If we are alive, then continiue living if we have 2-3 neighboors
      if (current) setCell(x, y, neighboors === 2 || neighboors === 3);
      // A new cell is born if it has 3 neighboors
      else setCell(x, y, neighboors === 3);
    }
  }

  // Swap next and current grid
  const temp = nextGrid;
  nextGrid = currentGrid;
  currentGrid = temp;

  stepCount++;
}

function countChanges() {
  // Even though we do the grid swap
  // we can still count the differences
  let total = 0;
  for (let i = 0; i < width * height; i++) {
    const a = currentGrid[i];
    const b = nextGrid[i];

    if (a !== b) total++;
  }
  return total;
}

// Next line is to improve editor suggestions
/**@type {HTMLCanvasElement} */
const canvas = document.getElementById('sim');
const ctx = canvas.getContext('2d');

const tbody = document.getElementById('data');

function draw() {
  if (stepCount >= 200) return;

  requestAnimationFrame(draw);

  for (let i = 0; i < 5; i++) {
    step();
  }

  const changes = countChanges();

  ctx.clearRect(0, 0, 400, 400);

  ctx.fillStyle = 'black';
  ctx.beginPath();
  for (let x = 0; x < width; x++)
    for (let y = 0; y < width; y++)
      if (getCell(x, y)) ctx.rect(4 * x, 4 * y, 4, 4);
  ctx.fill();

  const row = document.createElement('tr');

  const timeCell = document.createElement('td');
  timeCell.innerText = stepCount.toString();
  row.appendChild(timeCell);

  const changesCell = document.createElement('td');
  changesCell.innerText = changes.toString();
  row.appendChild(changesCell);

  tbody.appendChild(row);
}

draw();
