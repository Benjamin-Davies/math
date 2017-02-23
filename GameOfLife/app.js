var colors = ["black", "blue", "red"];
var grid = [], cols = 32, rows = 32;

function setup() {
  createCanvas(512, 512);
  frameRate(5);
  for (var i = 0; i < cols * rows; i++) {
    grid[i] = random() > 4/7 ? floor(random() * 2 + 1) : 0;
  }
}

function render() {
  for (var x = 0; x < cols; x++) {
    for (var y = 0; y < rows; y++) {
      fill(colors[grid[x + y * cols]]);
      rect(x * 16, y * 16, 16, 16);
    }
  }
}

function draw() {
  var newGrid = [];
  for (var x = 0; x < cols; x++) {
    for (var y = 0; y < rows; y++) {
      var neighboors = 0;
      var blue = 0, red = 0;
      
      for (var i = -1; i <= 1; i++) {
        for (var j = -1; j <= 1; j++) {
          var state = grid[ (x + i + (y + j) * cols) % (cols * rows) ];
          if (!(i == 0 && j == 0) && state) {
            neighboors++;
            if (state == 1)
              blue++;
            else
              red++;
          }
        }
      }

      var state = grid[x + y * cols];
      var newState = state;

      if (state && !(neighboors == 2 || neighboors == 3))
        newState = 0;
      if (!state && neighboors == 3) {
        newState = blue > red ? 1 : 2;
      }

      newGrid[x + y * cols] = newState;
    }
  }
  grid = newGrid;

  render();
}

function mousePressed() {
  if (mouseButton == "left" &&
      mouseX > 0 && mouseX < width &&
      mouseY > 0 && mouseY < height) {
    var x = floor(mouseX / 16);
    var y = floor(mouseY / 16);
    if (grid[x + y * cols])
      grid[x + y * cols] = 0;
    else
      grid[x + y * cols] = 1 + floor(2 * random());

    render();
  }
}
