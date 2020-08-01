precision mediump float;

attribute float t;

uniform vec2 variables;

const float PI = 3.14159265358979;
const float TWO_PI = PI * 2.0;

vec2 angle(float a) {
  float theta = a * TWO_PI;
  return vec2(cos(theta), sin(theta));
}

void main()
{
  const float R = 1.0;
  float r = variables.x;
  float p = variables.y;

  float t1 = t * 16.0;
  float t2 = t1 * (R - r) / r;

  vec2 pos = (R - r) * angle(t1) + p * angle(t2);
  gl_Position = vec4(pos, 0.0, 1.0);
}
