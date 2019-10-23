run();

async function run() {
  const canvas = document.createElement('canvas');
  const gl =
    canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) {
    throw new Error('Could not create WebGL context');
  }

  const displayShader = await DisplayShader.loadShaderProgram(gl);

  createBuffer(gl);

  const container = document.getElementById('container') || document.body;
  container.appendChild(canvas);

  draw();

  function draw() {
    requestAnimationFrame(draw);

    if (
      canvas.width !== canvas.clientWidth ||
      canvas.height !== canvas.clientHeight
    ) {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }

    gl.clearColor(0.2, 0.2, 0.2, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    displayShader.use();
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
}
