// in vec4 gl_FragCoord;
// in bool gl_FrontFacing;
// in vec2 gl_PointCoord;

void main() {
  gl_FragColor = vec4(gl_FragCoord.y / 1000.0, gl_FragCoord.x / 1000.0, 1.0, 1.0);
}
