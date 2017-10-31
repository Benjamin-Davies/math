/**
 * Load a shader from a file and compile it
 * @param {WebGLRenderingContext} gl The drawing context
 * @param {number} type The type of shader
 * @param {string} src The path of the shader
 */
export async function loadShader(gl, type, src) {
  const source = await fetch(src).then(res => res.text());

  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);

  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    throw 'compiling shader: ' + gl.getShaderInfoLog(shader);

  return shader;
}
