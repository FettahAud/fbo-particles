const vertex = `
uniform float u_time;
uniform float u_radius;
varying float v_distance;

// source https://github.com/dmnsgn/glsl-rotate/blob/main/rotation-3d-y.glsl
mat3 rotation3dY(float angle) {
  float s = sin(angle);
  float c = cos(angle);

  return mat3(
    c, 0.0, -s,
    0.0, 1.0, 0.0,
    s, 0.0, c
  );
}

void main(){
  vec3 pos = position;

  float distanceFactor = pow(u_radius - distance(pos, vec3(0.0)), 2.0);
  float size = distanceFactor * 10. + 10.;
  pos *= rotation3dY(u_time * .2 * distanceFactor);
  v_distance = distanceFactor;

  vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
  gl_PointSize = size;  
  gl_PointSize *= (1. / -viewPosition.z);

}
`;
export default vertex;
