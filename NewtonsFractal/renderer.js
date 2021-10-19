import { newtonsMethod, Polynomial } from './math.js';

const SCAN_STEP = 1;

export class Renderer {
  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.currentRow = 0;

    this.mouseX = 0;
    this.mouseY = 0;

    /**@type {[number, number][]} */
    this.roots = [
      [1, 0],
      [-Math.sqrt(0.75), 0.5],
      [-Math.sqrt(0.75), -0.5],
    ];
    this.p = Polynomial.fromRoots(this.roots);
    this.pPrime = this.p.derivative();
    console.log(this.p);
    console.log(this.pPrime);

    this.animate = this.animate.bind(this);
  }

  run() {
    requestAnimationFrame(this.animate);
  }

  animate() {
    const startRow = this.currentRow;
    for (
      ;
      this.currentRow < this.canvas.height &&
      this.currentRow < startRow + SCAN_STEP;
      this.currentRow++
    ) {
      const y = this.currentRow;
      for (let x = 0; x < this.canvas.width; x++) {
        const root = this.sample(x, y);
        this.ctx.fillStyle = `hsl(${
          (360 * root) / this.roots.length
        }deg, 100%, 80%)`;
        this.ctx.fillRect(x, y, 1, 1);
      }
    }

    if (this.currentRow < this.canvas.height)
      requestAnimationFrame(this.animate);
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  sample(x, y) {
    const zr = (x - 200) / 100;
    const zi = (y - 200) / -100;
    const res = newtonsMethod(this.p, this.pPrime, [zr, zi]);
    const root = this.closestRoot(res);
    return root;
  }

  closestRoot([x, y]) {
    let index = 0;
    let minDsq = Infinity;
    for (let i = 0; i < this.roots.length; i++) {
      const [a, b] = this.roots[i];
      const dx = x - a;
      const dy = y - b;
      const dsq = dx * dx + dy * dy;
      if (dsq < minDsq) {
        minDsq = dsq;
        index = i;
      }
    }
    return index;
  }
}
