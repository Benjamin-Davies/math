import * as v from './vector.js';

const temp = v.create();

export class Sphere {
  constructor(pos, r) {
    this.pos = pos;
    this.r = r;
  }

  dist(p) {
    v.sub(temp, p, this.pos);
    return v.mag(temp) - this.r;
  }
}

export class Scene {
  constructor() {
    this.objects = [];
  }

  dist(p) {
    let d = Infinity;
    for (const obj of this.objects)
      d = Math.min(d, obj.dist(p));
    return d;
  }
}
