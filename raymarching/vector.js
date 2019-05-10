export function create() {
  return new Float32Array(3);
}

export function set(out, x, y, z) {
  out[0] = x;
  out[1] = y;
  out[2] = z;
}

export function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
}

export function sub(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
}

export function mul(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  out[2] = a[2] * b[2];
}

export function scale(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
}

export function mag(v) {
  return Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
}

export function magSq(v) {
  return v[0]*v[0] + v[1]*v[1] + v[2]*v[2];
}

export function norm(out, v) {
  return scale(out, v, 1 / mag(v));
}
