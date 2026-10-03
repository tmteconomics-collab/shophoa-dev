import { AdditiveBlending, BufferAttribute, BufferGeometry, Color, Points, ShaderMaterial, Vector3 } from "three";
import { palette } from "./palette";

export const TRAIL_SAMPLES = 64;

const vertex = /* glsl */ `
uniform vec4 uSamples[${TRAIL_SAMPLES}]; // ndc x, ndc y, time (s), speed 0-1
uniform float uTime;
uniform float uLife;
uniform float uAspect;
uniform float uDpr;
uniform vec3 uFace;    // ndc x, ndc y, radius (in ndc y units)
uniform float uFaceOn;
uniform vec3 uSun;
uniform vec3 uInk;
attribute float aIndex;
attribute vec4 aRand;
varying vec4 vColor;

void main() {
  int k = int(mod(aIndex, ${TRAIL_SAMPLES}.0));
  int kp = int(mod(aIndex + ${TRAIL_SAMPLES - 1}.0, ${TRAIL_SAMPLES}.0));
  vec4 s = uSamples[k];
  vec4 sp = uSamples[kp];
  float age = uTime - s.z;
  float alive = step(0.0, age) * step(age, uLife) * step(s.z - sp.z, 0.12) * step(0.0, sp.z);
  float life = clamp(age / uLife, 0.0, 1.0);

  vec2 pos = mix(sp.xy, s.xy, aRand.x);
  vec2 jitter = (aRand.yz - 0.5) * (0.004 + life * 0.07);
  jitter.x /= uAspect;
  pos += jitter + vec2(0.0, life * 0.02 * (aRand.w - 0.3));

  vec2 df = pos - uFace.xy;
  df.x *= uAspect;
  float clear = mix(1.0, smoothstep(uFace.z * 0.55, uFace.z, length(df)), uFaceOn);

  float fade = (1.0 - life);
  float a = fade * fade * clamp(s.w * 1.4, 0.0, 1.0) * alive * clear * 0.9;
  gl_Position = vec4(pos, 0.0, 1.0);
  gl_PointSize = (1.5 + aRand.w * 4.5) * (0.4 + fade * 0.9) * uDpr;
  vColor = vec4(mix(uInk, uSun, 0.35 + aRand.y * 0.65), a);
}
`;

const fragment = /* glsl */ `
varying vec4 vColor;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d);
  if (a * vColor.a < 0.004) discard;
  gl_FragColor = vec4(vColor.rgb, vColor.a * a);
}
`;

export function createTrails(count: number) {
  const g = new BufferGeometry();
  const idx = new Float32Array(count);
  const rand = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) {
    idx[i] = i % TRAIL_SAMPLES;
    for (let j = 0; j < 4; j++) rand[i * 4 + j] = Math.random();
  }
  g.setAttribute("position", new BufferAttribute(new Float32Array(count * 3), 3));
  g.setAttribute("aIndex", new BufferAttribute(idx, 1));
  g.setAttribute("aRand", new BufferAttribute(rand, 4));

  const samples = new Float32Array(TRAIL_SAMPLES * 4).fill(-100);
  const material = new ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: AdditiveBlending,
    uniforms: {
      uSamples: { value: samples },
      uTime: { value: 0 },
      uLife: { value: 0.9 },
      uAspect: { value: 1 },
      uDpr: { value: 1 },
      uFace: { value: new Vector3(0, 0, 0.2) },
      uFaceOn: { value: 0 },
      uSun: { value: new Color(palette.sun) },
      uInk: { value: new Color(palette.ink) },
    },
  });
  const points = new Points(g, material);
  points.frustumCulled = false;
  points.renderOrder = 3;

  let head = 0;
  let last = { x: 0, y: 0, t: -1 };
  /** Record a pointer sample in NDC. Time in seconds. */
  const push = (x: number, y: number, t: number, aspect: number) => {
    const dx = (x - last.x) * aspect;
    const dy = y - last.y;
    const dist = Math.hypot(dx, dy);
    if (last.t >= 0 && dist < 0.004 && t - last.t < 0.05) return;
    const dt = Math.max(0.008, t - (last.t < 0 ? t : last.t));
    const speed = Math.min(1, dist / dt / 2.5);
    head = (head + 1) % TRAIL_SAMPLES;
    samples[head * 4] = x;
    samples[head * 4 + 1] = y;
    samples[head * 4 + 2] = t;
    samples[head * 4 + 3] = speed;
    last = { x, y, t };
  };
  return { points, material, push };
}
