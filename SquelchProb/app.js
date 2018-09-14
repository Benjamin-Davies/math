const text = document.createElement('p');
document.body.appendChild(text);

const canvas = document.createElement('canvas');
canvas.width = 600;
canvas.height = 500;
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

let total = 0;
let lossCount = 0;

let dice = Array(6).fill(1);

loop();
function loop() {
  for (let i = 0; i < 100; i++) {
    if (!runTest(dice)) {
      lossCount++;
    }
    total++;

    dice = nextDice(dice);

    ctx.fillRect((total / Math.pow(6, 6)) * 600, 500 - 0.34 * lossCount, 1, 1);

    if (!dice) {
      break;
    }
  }

  const r = gcd(lossCount, total);
  text.innerText = `${100 *
    (lossCount / total)}%\n${lossCount}/${total} or ${lossCount / r}/${total /
    r}`;

  if (dice) {
    requestAnimationFrame(loop);
  }
}

function randomDice() {
  /**@type {number[]} */
  const dice = [];
  for (let i = 0; i < 6; i++) {
    dice.push(Math.floor(1 + 6 * Math.random()));
  }
  return dice;
}

/**
 * @param {number[]} dice
 */
function nextDice(dice) {
  const next = dice.slice();

  let carry = 1;
  for (let i = 0; i < next.length; i++) {
    next[i] += carry;
    carry = 0;
    while (next[i] > 6) {
      next[i] -= 6;
      carry++;
    }
  }

  if (carry) {
    return null;
  }

  return next;
}

/**
 * @param {number[]} dice
 */
function runTest(dice) {
  if (dice.indexOf(1) >= 0 || dice.indexOf(5) >= 0) {
    return true;
  }

  const nums = [];
  for (const die of dice) {
    if (nums.hasOwnProperty(die)) nums[die]++;
    else nums[die] = 1;
  }
  if (nums.some(n => n >= 3)) {
    return true;
  }

  return false;
}

/**
 * @param {number} a
 * @param {number} b
 */
function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  if (b > a) {
    var temp = a;
    a = b;
    b = temp;
  }
  while (true) {
    if (b == 0) return a;
    a %= b;
    if (a == 0) return b;
    b %= a;
  }
}
