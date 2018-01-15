// @ts-check
(() => {
  'use strict';

  const digits = 10,
    beadSpace = 24,
    beadR = 10;

  const canvasContainer = document.getElementById('canvasContainer');
  const canvas = document.createElement('canvas');
  canvasContainer.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let size = 0;
  let buffer = 0,
    input = 0,
    output = 0,
    adding = true;

  const draw = () => {
    if (adding) output = buffer + input;
    else output = buffer - input;

    const inputStr = input.toString(),
      outputStr = output.toString();

    const rowW = size / digits;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.font = `${size / digits}px sans-serif`;

    ctx.fillStyle = 'black';
    ctx.fillRect(0, beadSpace * 2.25 - 2, size, 4);

    for (let d = 0; d < digits; d++) {
      const inChar = inputStr[d - (digits - inputStr.length)] || '0',
        outChar = outputStr[d - (digits - outputStr.length)] || '0';

      ctx.save();
      ctx.translate(d * rowW, 0);

      ctx.fillStyle = 'black';
      ctx.fillRect(rowW / 2 - 2, 0, 4, size / 2);

      ctx.fillStyle = '#4caf50';
      ctx.fillText(inChar, size / 20, size * 5 / 8);
      ctx.fillText(outChar, size / 20, size * 3 / 4);

      ctx.fillStyle = '#2196f3';
      const n = parseInt(outChar),
        a = Math.floor(n / 5),
        b = n % 5;
      ctx.beginPath();
      ctx.arc(rowW / 2, beadSpace * (1.5 - a), beadR, 0, Math.PI * 2);
      for (let i = 0; i < 4; i++) {
        ctx.arc(
          rowW / 2,
          beadSpace * (4 + i - (b > i ? 1 : 0)),
          beadR,
          0,
          Math.PI * 2
        );
      }
      ctx.fill();

      ctx.restore();
    }
  };

  /**
   * @param {number} i The number of the button
   * @returns {(ev: MouseEvent) => void} A button handler for that button
   */
  const numberBtnClick = i => () => {
    input *= 10;
    input += i;
    requestAnimationFrame(draw);
  };

  const resize = () => {
    size = canvasContainer.clientWidth;
    canvas.width = size;
    canvas.height = size * 3 / 4;
    requestAnimationFrame(draw);
  };

  for (let i = 0; i < 10; i++)
    document
      .getElementById(`btn-no${i}`)
      .addEventListener('click', numberBtnClick(i));

  document.getElementById(`btn-add`).addEventListener('click', () => {
    buffer = output;
    input = 0;
    adding = true;
    requestAnimationFrame(draw);
  });
  document.getElementById(`btn-sub`).addEventListener('click', () => {
    buffer = output + Math.pow(10, digits);
    input = 0;
    adding = false;
    requestAnimationFrame(draw);
  });
  document.getElementById(`btn-res`).addEventListener('click', () => {
    buffer = 0;
    input = 0;
    adding = true;
    requestAnimationFrame(draw);
  });

  window.addEventListener('resize', resize);
  resize();
})();
