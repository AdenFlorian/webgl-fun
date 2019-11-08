precision mediump float;

uniform float uTime;
uniform vec2 uMouse;

float sinNorm(in float x) {
  return (sin(x) * 0.5) + 0.5;
}

// https://github.com/Jam3/glsl-hsl2rgb
float hue2rgb(float f1, float f2, float hue) {
  if (hue < 0.0)
  hue += 1.0;
  else if (hue > 1.0)
  hue -= 1.0;
  float res;
  if ((6.0 * hue) < 1.0)
  res = f1 + (f2 - f1) * 6.0 * hue;
  else if ((2.0 * hue) < 1.0)
  res = f2;
  else if ((3.0 * hue) < 2.0)
  res = f1 + (f2 - f1) * ((2.0 / 3.0) - hue) * 6.0;
  else
  res = f1;
  return res;
}

vec3 hsl2rgb(vec3 hsl) {
  vec3 rgb;
  
  if (hsl.y == 0.0) {
    rgb = vec3(hsl.z); // Luminance
  } else {
    float f2;
    
    if (hsl.z < 0.5)
    f2 = hsl.z * (1.0 + hsl.y);
    else
    f2 = hsl.z + hsl.y - hsl.y * hsl.z;
    
    float f1 = 2.0 * hsl.z - f2;
    
    rgb.r = hue2rgb(f1, f2, hsl.x + (1.0 / 3.0));
    rgb.g = hue2rgb(f1, f2, hsl.x);
    rgb.b = hue2rgb(f1, f2, hsl.x - (1.0 / 3.0));
  }
  return rgb;
}

/* Easing Cubic Out equation */
/* Adapted from Robert Penner easing equations */
float easeCubicOut(float t) {
  return ((t = t - 1.0) * t * t + 1.0);
}

#define rate 0.25

void main() {
  float xOffset = uMouse.x / 4000.0;
  float yOffset = uMouse.y / 4000.0;
  vec2 uv = vec2(gl_FragCoord.x / 1000.0, gl_FragCoord.y / 1000.0);
  vec3 topLeft = hsl2rgb(vec3(sinNorm(uTime * rate + xOffset), 1.0, 0.5));
  vec3 topRight = hsl2rgb(vec3(sinNorm(uTime * rate + 1.1 + xOffset), 1.0, 0.5));
  vec3 bottomLeft = hsl2rgb(vec3(sinNorm(uTime * rate + 2.33 + yOffset), 1.0, 0.5));
  vec3 bottomRight = hsl2rgb(vec3(sinNorm(uTime * rate + 3.03 + yOffset), 1.0, 0.5));
  vec3 final = mix(
    mix(topLeft, topRight, uv.x),
    mix(bottomLeft, bottomRight, uv.x),
  uv.y);
  gl_FragColor = vec4(final, min(easeCubicOut(uTime / 2.0), 1.0));
}
