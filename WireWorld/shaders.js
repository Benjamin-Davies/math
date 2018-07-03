class ShaderProgram {
  /**
   * Create and compile a shader program
   * @param {WebGLRenderingContext} gl The context to create the shaderprogram for
   * @param {string} vertSource The vertex shader source
   * @param {string} fragSource The fragment shader source
   */
  constructor(gl, vertSource, fragSource) {
    this.gl = gl;

    const vert = this.compileShader(vertSource, gl.VERTEX_SHADER);
    const frag = this.compileShader(fragSource, gl.FRAGMENT_SHADER);

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
  }

  /**
   * Create and compile a shader
   * @param {string} source The shader source
   * @param {number} type The shader type
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
   * Fetch and compile a shader program
   * @param {WebGLRenderingContext} gl The context
   */
  static loadShaderProgram(gl) {
    return this.init(gl, ShaderProgram.loadShaderProgram(gl, 'display'));
  }
}
