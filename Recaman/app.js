//@ts-check

const canvas = document.createElement('canvas');
canvas.width = canvas.height = 400;
document.getElementById('container').appendChild(canvas);

const nElement = document.getElementById('n');
const currentElement = document.getElementById('current');

const ctx = canvas.getContext('2d');
ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)';

let n = 0;
let current = 0;
let above = false;
const visitedMap = { 0: true };

const scale = 2;
const padding = 5;

setInterval(cycle, 200);

function cycle() {
  n++;

  const reverse = !visitedMap.hasOwnProperty(current - n) && current - n >= 0;
  const next = reverse ? current - n : current + n;
  const mid = (current + next) / 2;

  ctx.beginPath();
  if (above) {
    ctx.arc(
      mid * scale + padding,
      mid * scale + padding,
      (n / 2) * Math.SQRT2 * scale,
      Math.PI * 1.25,
      Math.PI * 0.25
    );
  } else {
    ctx.arc(
      mid * scale + padding,
      mid * scale + padding,
      (n / 2) * Math.SQRT2 * scale,
      Math.PI * 0.25,
      Math.PI * 1.25
    );
  }
  ctx.stroke();

  visitedMap[current] = true;
  current = next;
  above = !above;

  nElement.innerText = n.toString(10);
  currentElement.innerText = current.toString(10);
}
