precision mediump float;

varying vec2 fragPosition;

uniform sampler2D texture;

void main() {
  float value = texture2D(texture, fragPosition).x;
  gl_FragColor = vec4(value, value, value, 1.0);
}
