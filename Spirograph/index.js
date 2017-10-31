import { loadShader } from './shaders.js';

export class Spirograph {
  /**
   * Create an instance of the Spirograph class
   * @param {HTMLCanvasElement} canvas The canvas to draw to
   */
  constructor(canvas) {
    this.canvas = canvas;
    this.totalPoints = 1024;

    this.gl =
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    if (!this.gl) throw 'Could not create webgl drawing context';
  }

  /**
   * Resizes the canvas
   * @param {number} w The new width of the canvas
   * @param {number} h The new height of the canvas
   */
  resize(w, h) {
    this.canvas.width = w;
    this.canvas.height = h;

    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;

    this.gl.viewport(0, 0, w, h);
  }

  /**
   * 
   * @param {number} r The radius of the inner gear
   * @param {number} p The position of the 'pen'
   */
  setVars(r, p) {
    this.gl.uniform2f(this.variablesUniformLocation, r, p);
  }

  async init() {
    const gl = this.gl;

    const vertShader = await loadShader(
      gl,
      gl.VERTEX_SHADER,
      './main.vert.glsl'
    );
    const fragShader = await loadShader(
      gl,
      gl.FRAGMENT_SHADER,
      './main.frag.glsl'
    );

    this.program = gl.createProgram();
    gl.attachShader(this.program, vertShader);
    gl.attachShader(this.program, fragShader);
    gl.linkProgram(this.program);

    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      throw 'linking program: ' + gl.getProgramInfoLog(this.program);
    }

    const verticies = Array(this.totalPoints);
    for (let i = 0; i < this.totalPoints; i++)
      verticies[i] = i / this.totalPoints;

    this.vertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticies), gl.STATIC_DRAW);

    const timeAttribLocation = gl.getAttribLocation(this.program, 't');
    gl.vertexAttribPointer(
      timeAttribLocation,
      1,
      gl.FLOAT,
      false,
      Float32Array.BYTES_PER_ELEMENT,
      0
    );
    gl.enableVertexAttribArray(timeAttribLocation);

    this.variablesUniformLocation = gl.getUniformLocation(
      this.program,
      'variables'
    );
  }

  /**
   * Redraw the Spirograph
   */
  draw() {
    const gl = this.gl;

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (!this.program) return;

    gl.useProgram(this.program);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBufferObject);
    gl.drawArrays(gl.LINE_STRIP, 0, this.totalPoints);
  }
}
