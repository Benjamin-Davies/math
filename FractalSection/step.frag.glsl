precision mediump float;

varying vec2 fragPosition;

uniform sampler2D texture;

void main() {
  float a = texture2D(texture, fragPosition + vec2(-1.0, 0.0) / 512.0).x;
  float b = texture2D(texture, fragPosition + vec2(0.0, -1.0) / 512.0).x;
  gl_FragColor = vec4(mod(a + b + texture2D(texture, fragPosition).x, 2.0), 0.0, 0.0, 1.0);
}
