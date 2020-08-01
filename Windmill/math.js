export const compose2 = (g, f) => x => g(f(x));
export const compose = (...fns) => fns.reduce(compose2);

export const modulo = (x, _) => x;
//export const modulo = (x, y) => (x >= 0 ? x % y : modulo(x + y, y));

export const add = ([x1, y1], [x2, y2]) => [x1+x2, y1+y2];
export const sub = ([x1, y1], [x2, y2]) => [x1-x2, y1-y2];
export const scale = (s, [x, y]) => [s*x, s*y];

export const dot = ([x1, y1], [x2, y2]) => x1*x2 + y1*y2;

export const magSq = ([x, y]) => x*x + y*y;
export const mag = compose(Math.sqrt, magSq);

export const normalize = v => scale(1 / mag(v), v);
