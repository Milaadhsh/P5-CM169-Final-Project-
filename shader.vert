attribute vec3 aPosition;
void main(){
  vec4 pos4 = vec4(aPosition, 1.0);
  pos4 *= 2.0;
  pos4 -= 1.0;
  gl_Position = pos4;
}
