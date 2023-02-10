const fragment = `
varying float v_distance;

void main(){
//   vec3 color = vec3(0.34, 0.53, 0.96);

//     float strength = distance(gl_PointCoord, vec2(.5));
//     // strength -= 1.;
//       strength = 1.0 - strength;

//     strength = pow(strength, 3.);
//     color = mix(color, vec3(0.97, 0.70, 0.45), v_distance * 0.5);
//     color = mix(vec3(0.0), color, strength);

//     gl_FragColor = vec4(color, strength);

vec3 color = vec3(0.34, 0.53, 0.96);
  float strength = distance(gl_PointCoord, vec2(0.5));
  strength = 1.0 - strength;
  strength = pow(strength, 3.0);

  color = mix(color, vec3(0.97, 0.70, 0.45), v_distance * 0.5);
  color = mix(vec3(0.0), color, strength);
  gl_FragColor = vec4(color, strength);
}
`;

export default fragment;
