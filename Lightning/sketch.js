// @ts-nocheck

const PERMITTIVITY = 8.854e-12; // Vacuum permittivity in F/m

const PIXEL_SCALE = 2.58e-2 / 96; // 1 in per 96 pixels
const CELL_WIDTH = 4;
const CELL_SCALE = PIXEL_SCALE * CELL_WIDTH;

const particles = [
  {
    x: 50,
    y: 100,
    charge: 1e-6,
  },
  {
    x: 150,
    y: 100,
    charge: -1e-6,
  },
];

let img, field;
function setup() {
  createCanvas(800, 800);
  img = createImage(width / CELL_WIDTH, height / CELL_WIDTH);

  // field = new CoulombField(particles);
  field = new GaussField(particles, img.width, img.height);
}

function draw() {
  for (let i = 0; i < 10; i++) {
    field.solve();
  }

  img.loadPixels();
  for (let x = 0; x < img.width; x++) {
    for (let y = 0; y < img.height; y++) {
      const [fieldX, fieldY] = field.getField(x, y);
      const fieldMagnitude = sqrt(fieldX * fieldX + fieldY * fieldY);
      const index = (x + y * img.width) * 4;
      img.pixels[index] = map(fieldMagnitude, 0, 1e8, 0, 255);
      img.pixels[index + 1] = map(fieldX, -1e8, 1e8, 0, 255);
      img.pixels[index + 2] = map(fieldY, -1e8, 1e8, 0, 255);
      img.pixels[index + 3] = 255;
    }
  }
  img.updatePixels();
  image(img, 0, 0, width, height);

  if (mouseX && mouseY) {
    stroke(0);
    const [fieldX, fieldY] = field.getField(
      mouseX / CELL_WIDTH,
      mouseY / CELL_WIDTH
    );
    line(mouseX, mouseY, mouseX + fieldX * 1e-6, mouseY + fieldY * 1e-6);
  }
}

// https://en.wikipedia.org/wiki/Coulomb's_law#Electric_field
class CoulombField {
  constructor(particles) {
    this.particles = particles;
  }

  solve() {}

  getField(x, y) {
    let fieldX = 0;
    let fieldY = 0;
    for (const p of particles) {
      const dx = CELL_SCALE * (x - p.x);
      const dy = CELL_SCALE * (y - p.y);
      const r = sqrt(dx * dx + dy * dy);
      const a = p.charge / (4 * PI * PERMITTIVITY * r * r * r);
      fieldX += a * dx;
      fieldY += a * dy;
    }
    return [fieldX, fieldY];
  }
}

// https://en.wikipedia.org/wiki/Gauss's_law#Differential_form
class GaussField {
  constructor(particles, width, height) {
    this.particles = particles;
    this.width = width;
    this.height = height;

    this.chargeDensity = new Float32Array(width * height);
    for (const p of particles) {
      const x = floor(p.x);
      const y = floor(p.y);
      const index = x + y * width;
      this.chargeDensity[index] +=
        p.charge / (CELL_SCALE * CELL_SCALE * CELL_SCALE);
    }

    // Placed on the vertical edges between cells
    this.fieldX = new Float32Array((width + 1) * height);
    // Placed on the horizontal edges between cells
    this.fieldY = new Float32Array(width * (height + 1));
  }

  solve() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const index = x + y * this.width;
        const northIndex = x + y * this.width;
        const southIndex = x + (y + 1) * this.width;
        const westIndex = x + y * (this.width + 1);
        const eastIndex = x + 1 + y * (this.width + 1);

        const northField = this.fieldY[northIndex];
        const southField = this.fieldY[southIndex];
        const westField = this.fieldX[westIndex];
        const eastField = this.fieldX[eastIndex];

        const dE_dx = (eastField - westField) / CELL_SCALE;
        const dE_dy = (southField - northField) / CELL_SCALE;
        const divergence = dE_dx + dE_dy;

        const requiredDivergence = this.chargeDensity[index] / PERMITTIVITY;
        const error = requiredDivergence - divergence;

        const correction = (error * CELL_SCALE) / 4;
        this.fieldX[westIndex] -= correction;
        this.fieldX[eastIndex] += correction;
        this.fieldY[northIndex] -= correction;
        this.fieldY[southIndex] += correction;
      }
    }
  }

  getField(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return [0, 0];
    }
    x = floor(x);
    y = floor(y);

    const northIndex = x + y * this.width;
    const southIndex = x + (y + 1) * this.width;
    const westIndex = x + y * (this.width + 1);
    const eastIndex = x + 1 + y * (this.width + 1);

    const northField = this.fieldY[northIndex];
    const southField = this.fieldY[southIndex];
    const westField = this.fieldX[westIndex];
    const eastField = this.fieldX[eastIndex];

    return [0.5 * (eastField + westField), 0.5 * (southField + northField)];
  }
}
