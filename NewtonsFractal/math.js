/**
 * @param {[number, number]} x
 * @param {[number, number]} y
 * @return {[number, number]}
 */
export function compMul([xr, xi], [yr, yi]) {
  return [xr * yr - xi * yi, xr * yi + xi * yr];
}

/**
 * @param {[number, number]} x
 * @param {[number, number]} y
 * @return {[number, number]}
 */
export function compDiv([xr, xi], [yr, yi]) {
  const a = 1 / (yr * yr + yi * yi);
  return [a * (xr * yr + xi * yi), a * (xi * yr - xr * yi)];
}

/**
 * @param {[number, number]} x
 * @param {[number, number]} y
 * @return {[number, number]}
 */
export function compAdd([xr, xi], [yr, yi]) {
  return [xr + yr, xi + yi];
}

/**
 * @param {[number, number]} x
 * @param {[number, number]} y
 * @return {[number, number]}
 */
export function compSub([xr, xi], [yr, yi]) {
  return [xr - yr, xi - yi];
}

export class Polynomial {
  /**
   * @param {[number, number][]} coefficients
   */
  constructor(coefficients) {
    this.coefficients = coefficients;
  }

  /**
   * @param {[number, number][]} roots
   */
  static fromRoots(roots) {
    let p = new Polynomial([[1, 0]]);
    for (const [re, im] of roots) {
      p = p.mulPoly(
        new Polynomial([
          [-re, -im],
          [1, 0],
        ])
      );
    }
    return p;
  }

  /**
   * @param {[number, number]} x
   */
  mulComp(x) {
    return new Polynomial(this.coefficients.map((c) => compMul(c, x)));
  }

  /**
   * @param {Polynomial} other
   */
  mulPoly(other) {
    let p = new Polynomial([]);
    for (let i = 0; i < this.coefficients.length; i++) {
      const term = this.coefficients[i];
      p = p.addPoly(other.leftShift(i).mulComp(term));
    }
    return p;
  }

  /**
   * @param {Polynomial} other
   */
  addPoly(other) {
    if (other.coefficients.length > this.coefficients.length) {
      return other.addPoly(this);
    }
    return new Polynomial(
      this.coefficients.map((a, i) => {
        const b = other.coefficients[i];
        if (!b) {
          return a;
        }
        return compAdd(a, b);
      })
    );
  }

  /**
   * @param {number} n
   */
  leftShift(n) {
    const extraZeros = Array(n).fill([0, 0]);
    return new Polynomial([...extraZeros, ...this.coefficients]);
  }

  derivative() {
    return new Polynomial(
      this.coefficients.slice(1).map(([a, b], i) => [(i + 1) * a, (i + 1) * b])
    );
  }

  /**
   * @param {[number, number]} z
   */
  apply(z) {
    return this.coefficients.reduce(
      (total, coefficient, order) => {
        let x = coefficient;
        for (let i = 0; i < order; i++) {
          x = compMul(x, z);
        }
        return compAdd(total, x);
      },
      [0, 0]
    );
  }
}

export function newtonsMethodStep(p, pPrime, z) {
  return compSub(z, compDiv(p.apply(z), pPrime.apply(z)));
}

const N_ITER = 20;
/**
 * @param {Polynomial} p
 * @param {Polynomial} pPrime
 * @param {[number, number]} seed
 */
export function newtonsMethod(p, pPrime, seed) {
  let z = seed;
  for (let i = 0; i < N_ITER; i++) {
    z = newtonsMethodStep(p, pPrime, z);
  }
  return z;
}
