const width = 512;
const height = 512;
const quadVertices = [0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0];

const canvas = document.createElement('canvas');
canvas.width = width;
canvas.height = height;
document.body.appendChild(canvas);

const gl = canvas.getContext('webgl');

run();

async function run() {
  const [
    sharedVertSource,
    stepFragSource,
    renderFragSource
  ] = await Promise.all([
    fetchText('./shared.vert.glsl'),
    fetchText('./step.frag.glsl'),
    fetchText('./render.frag.glsl')
  ]);

  const sharedVert = createShader(sharedVertSource, gl.VERTEX_SHADER);
  const stepFrag = createShader(stepFragSource, gl.FRAGMENT_SHADER);
  const renderFrag = createShader(renderFragSource, gl.FRAGMENT_SHADER);

  const stepProgram = createProgram(sharedVert, stepFrag);
  const renderProgram = createProgram(sharedVert, renderFrag);

  const buffer = createBuffer(quadVertices);

  let lastFrame = createTexture();
  let thisFrame = createTexture();

  const framebuffer = gl.createFramebuffer();

  draw();

  function draw() {
    requestAnimationFrame(draw);

    gl.viewport(0, 0, width, height);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      thisFrame,
      0
    );
    gl.useProgram(stepProgram);
    gl.bindTexture(gl.TEXTURE_2D, lastFrame);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.useProgram(renderProgram);
    gl.bindTexture(gl.TEXTURE_2D, thisFrame);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    const temp = thisFrame;
    thisFrame = lastFrame;
    lastFrame = temp;
  }
}

/**
 * Uses the fetch api to download a text resource
 * @param {string | Request} input The url to fetch from
 * @param {RequestInit} [init] The url to fetch from
 */
async function fetchText(input, init) {
  const res = await fetch(input, init);
  return await res.text();
}

/**
 * Creates a new shader
 * @param {string} source The source code for the shader
 * @param {number} type The type of shader
 */
function createShader(source, type) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(
      `Could not compile shader:\n${gl.getShaderInfoLog(shader)}`
    );
  }
  return shader;
}

/**
 * Create a new shader program
 * @param {...WebGLShader} shaders The shaders to add to the program
 */
function createProgram(...shaders) {
  const program = gl.createProgram();
  for (const shader of shaders) {
    gl.attachShader(program, shader);
  }
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(
      `Could not link program:\n${gl.getProgramInfoLog(program)}`
    );
  }
  gl.bindAttribLocation(program, 0, 'position');
  return program;
}

/**
 * Create a buffer
 * @param {ArrayBuffer | ArrayLike<number>} data The data to place into the buffer
 */
function createBuffer(data) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0);

  return buffer;
}

/**
 * Create a new texture
 */
function createTexture() {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  const pixels = new Uint8Array(4 * width * height);
  pixels[0] = 255;
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    width,
    height,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    pixels
  );

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

  return texture;
}
