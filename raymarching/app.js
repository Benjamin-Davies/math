import * as v from './vector.js';
import { Scene, Sphere } from './shapes.js';

// Constants
const width = 400;
const height = 400;

// Dom Stuff
const container = document.getElementById('container');
const canvas = document.createElement('canvas');
canvas.width = width;
canvas.height = height;
container.appendChild(canvas);

// Actual code
const ctx = canvas.getContext('2d');
const imgData = ctx.createImageData(width, height)

const scene = new Scene();
for (let i = 0; i < 5; i++) {
  const pos = v.create();
  v.set(pos, Math.random() - 0.5, Math.random() - 0.5, Math.random() + 1);
  scene.objects.push(new Sphere(pos, 0.2));
}

const rayNormal = v.create();
const position = v.create();
const temp = v.create();

for (let x = 0; x < width; x++) {
  for (let y = 0; y < height; y++) {
    v.scale(position, position, 0);

    v.set(rayNormal, (x - width / 2) / height, (y - height / 2) / height, 1);
    v.norm(rayNormal, rayNormal);
    
    let minD = Infinity;

    for (let i = 0; i < 50; i++) {
      const d = scene.dist(position);
      minD = Math.min(minD, d);
      if (d < 0.001) break;
      v.scale(temp, rayNormal, d);
      v.add(position, position, temp);
    }

    const i = 4 * (x + y * width);
    const a = 0xFF / v.magSq(position);
    const b = 1 / minD;

    imgData.data[i+0] = a + b;
    imgData.data[i+1] = a;
    imgData.data[i+2] = a;
    imgData.data[i+3] = 0xFF;
  }
}

ctx.putImageData(imgData, 0, 0);
