class ShaderProgram {
  /**
   * Create and compile a shader program
   * @param {WebGLRenderingContext} gl The context to create the shaderprogram for
   * @param {string} vertSource The vertex shader source
   * @param {string} fragSource The fragment shader source
   */
  constructor(gl, vertSource, fragSource) {
    if (typeof gl !== 'string') {
      this.gl = gl;

      const vert = this.compileShader(vertSource, this.gl.VERTEX_SHADER);
      const frag = this.compileShader(fragSource, this.gl.FRAGMENT_SHADER);

      const program = this.gl.createProgram();
      this.gl.attachShader(program, vert);
      this.gl.attachShader(program, frag);
      this.gl.linkProgram(program);

      if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
        console.warn(
          'Could not link program',
          this.gl.getProgramInfoLog(program)
        );
      }

      this.program = program;
    } else {
      /**@type {WebGLRenderingContext} */
      this.gl = vertSource.gl;
      /**@type {WebGLProgram} */
      this.program = vertSource.program;
    }
  }

  /**
   * Use the program
   */
  use() {
    this.gl.useProgram(this.program);
  }

  /**
   * Create and compile a shader
   * @param {string} source The shader source
   * @param {number} type The shader type
   * @private
   */
  compileShader(source, type) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.warn(
        'Could not compile shader',
        this.gl.getShaderInfoLog(shader)
      );
    }

    return shader;
  }

  /**
   * Fetch and compile a shader program
   * @param {WebGLRenderingContext} gl The context
   * @param {string} name The id of the shader
   */
  static loadShaderProgram(gl, name) {
    return Promise.all([
      fetchText(`shaders/${name}.vert.glsl`),
      fetchText(`shaders/${name}.frag.glsl`)
    ]).then(sources => new ShaderProgram(gl, sources[0], sources[1]));
  }
}

class DisplayShader extends ShaderProgram {
  /**
   * Create a display shader program
   * @param {ShaderProgram} gl The old shader
   */
  constructor(gl) {
    super(gl);
  }

  /**
   * Fetch and compile a shader program
   * @param {WebGLRenderingContext} gl The context
   */
  static loadShaderProgram(gl) {
    return ShaderProgram.loadShaderProgram(gl, 'display').then(
      p => new DisplayShader(gl, p)
    );
  }
}
