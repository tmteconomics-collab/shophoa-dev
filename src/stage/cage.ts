import { BufferAttribute, BufferGeometry, Color, LineSegments, ShaderMaterial, Vector2, Vector4 } from "three";
import { palette } from "./palette";

// Faint wireframe "stage" around a shape. Uses the same placement as the particles:
// local coords, rotation, world scale, then a shift of the shape center in clip space.
const vertex = /* glsl */ `
uniform vec4 uXf;
uniform float uZs;
uniform vec2 uRot;
varying float vFade;
vec3 rotate(vec3 p, vec2 r) {
  float cy = cos(r.x), sy = sin(r.x);
  p = vec3(cy * p.x + sy * p.z, p.y, -sy * p.x + cy * p.z);
  float cx = cos(r.y), sx = sin(r.y);
  return vec3(p.x, cx * p.y - sx * p.z, sx * p.y + cx * p.z);
}
void main() {
  vec3 p = rotate(position, uRot);
  vFade = 0.55 + 0.45 * smoothstep(-1.2, 1.2, p.z);
  p = vec3(p.xy * uXf.zw, p.z * uZs);
  vec4 clip = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  clip.xy += uXf.xy * clip.w;
  gl_Position = clip;
}
`;

const fragment = /* glsl */ `
uniform vec3 uColor;
uniform float uAlpha;
varying float vFade;
void main() {
  gl_FragColor = vec4(uColor, uAlpha * vFade);
}
`;

function cylinder(radius: number, half: number, verticals = 18, rings = 7, seg = 64) {
  const v: number[] = [];
  for (let i = 0; i < verticals; i++) {
    const a = (i / verticals) * Math.PI * 2;
    const x = Math.cos(a) * radius;
    const z = Math.sin(a) * radius;
    v.push(x, -half, z, x, half, z);
  }
  for (let r = 0; r < rings; r++) {
    const y = -half + (r / (rings - 1)) * half * 2;
    for (let i = 0; i < seg; i++) {
      const a0 = (i / seg) * Math.PI * 2;
      const a1 = ((i + 1) / seg) * Math.PI * 2;
      v.push(Math.cos(a0) * radius, y, Math.sin(a0) * radius, Math.cos(a1) * radius, y, Math.sin(a1) * radius);
    }
  }
  return new Float32Array(v);
}

function box(hx: number, hy: number, hz: number, grid = 6) {
  const v: number[] = [];
  const xs = [-hx, hx];
  const ys = [-hy, hy];
  const zs = [-hz, hz];
  // 12 edges
  for (const y of ys) for (const z of zs) v.push(-hx, y, z, hx, y, z);
  for (const x of xs) for (const z of zs) v.push(x, -hy, z, x, hy, z);
  for (const x of xs) for (const y of ys) v.push(x, y, -hz, x, y, hz);
  // Grid on the back wall and the floor
  for (let i = 1; i < grid; i++) {
    const tx = -hx + (i / grid) * hx * 2;
    const ty = -hy + (i / grid) * hy * 2;
    const tz = -hz + (i / grid) * hz * 2;
    v.push(tx, -hy, -hz, tx, hy, -hz);
    v.push(-hx, ty, -hz, hx, ty, -hz);
    v.push(tx, -hy, -hz, tx, -hy, hz);
    v.push(-hx, -hy, tz, hx, -hy, tz);
  }
  return new Float32Array(v);
}

function makeCage(positions: Float32Array) {
  const g = new BufferGeometry();
  g.setAttribute("position", new BufferAttribute(positions, 3));
  const material = new ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    uniforms: {
      uXf: { value: new Vector4(0, 0, 1, 1) },
      uZs: { value: 1 },
      uRot: { value: new Vector2() },
      uColor: { value: new Color(palette.soft) },
      uAlpha: { value: 0 },
    },
  });
  const lines = new LineSegments(g, material);
  lines.frustumCulled = false;
  lines.renderOrder = 1;
  return { lines, material };
}

export const createFunnelCage = () => makeCage(cylinder(1.12, 1.12));
export const createPromptCage = () => makeCage(box(1.05, 0.78, 0.45));
