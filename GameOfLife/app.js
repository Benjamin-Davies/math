var colors = ["black", "blue", "red"];
var grid = [], cols = 32, rows = 32;

function setup() {
  createCanvas(512, 512);
  frameRate(5);
  for (var i = 0; i < cols * rows; i++) {
    grid[i] = round(random());
  }
}

function draw() {
  var newGrid = [];
  for (var x = 0; x < cols; x++) {
    for (var y = 0; y < rows; y++) {
      var count = 0;
      
      for (var i = -1; i <= 1; i++) {
        for (var j = -1; j <= 1; j++) {
          if (grid[ (x + i + (y + j) * cols) % (cols * rows) ] != 0)
            count++;
        }
      }

      var state = grid[x + y * cols];
      var newState = 0;

      if (state == 0) {
        if (count == 3)
          newState = 1;
      } else {
        if (count < 5 && count > 2)
          newState = 1;
      }

      newGrid[x + y * cols] = newState;
    }
  }
  grid = newGrid;

  for (var x = 0; x < cols; x++) {
    for (var y = 0; y < rows; y++) {
      fill(colors[grid[x + y * cols]]);
      rect(x * 16, y * 16, 16, 16);
    }
  }
}
