import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Points,
  ShaderMaterial,
  Vector2,
  Vector4,
} from "three";
import { RAILS, SHAPE_COUNT, type ShapeBuffers } from "./shapes";
import { palette } from "./palette";

const vertex = /* glsl */ `
uniform float uTime;
uniform float uFrom;
uniform float uTo;
uniform float uMix;
uniform vec4 uXf[${SHAPE_COUNT}];
uniform float uZs[${SHAPE_COUNT}];
uniform vec2 uRot[${SHAPE_COUNT}];
uniform float uAspect;
uniform float uCamD;
uniform float uSize;
uniform float uPortraitSize;
uniform float uDpr;
uniform vec2 uMouse;
uniform float uMouseOn;
uniform float uMouseR;
uniform float uTurb;
uniform vec2 uHi;
uniform float uAlpha;
uniform float uDensity;
uniform float uPortraitBg; // how much to dim the photo's background particles
uniform vec4 uPortraitWin; // visible part of the portrait, in its local -0.5..0.5 space
uniform vec3 uInk;
uniform vec3 uSun;
uniform vec3 uSoft;
uniform float uStations[4];

attribute vec3 aPortrait;
attribute vec3 aRails;
attribute vec3 aBrowser;
attribute vec3 aFunnel;
attribute vec3 aPrompt;
attribute vec4 aColor;
attribute vec4 aRand;

varying vec4 vColor;
varying float vSoft;

vec3 rotate(vec3 p, vec2 r) {
  float cy = cos(r.x), sy = sin(r.x);
  p = vec3(cy * p.x + sy * p.z, p.y, -sy * p.x + cy * p.z);
  float cx = cos(r.y), sx = sin(r.y);
  return vec3(p.x, cx * p.y - sx * p.z, sx * p.y + cx * p.z);
}

float funnelRadius(float y) {
  float t = (y + 1.0) * 0.5;
  return 0.2 + 0.8 * pow(max(t, 0.0), 1.6);
}

vec3 local(int id) {
  if (id == 0) {
    vec3 p = position;
    float t = uTime * 0.12;
    p += 0.06 * vec3(sin(t + aRand.y * 6.28), cos(t * 0.8 + aRand.z * 6.28), sin(t * 0.6 + aRand.w * 6.28));
    return p;
  }
  if (id == 1) return aPortrait;
  if (id == 2) return aRails;
  if (id == 3) return aBrowser;
  if (id == 4) {
    vec3 p = aFunnel;
    if (aRand.z < 0.1) {
      // Users flowing down through the funnel.
      float y = 1.0 - fract(uTime * 0.06 + aRand.x) * 2.0;
      float a = atan(p.z, p.x) + uTime * 0.5 + y * 2.0;
      float r = funnelRadius(y) * (0.25 + 0.5 * aRand.w);
      p = vec3(cos(a) * r, y, sin(a) * r);
    }
    return p;
  }
  return aPrompt;
}

// Returns the shape-space position scaled to world units; center goes out in NDC.
vec3 placed(int id, out vec2 center) {
  vec3 p = rotate(local(id), uRot[id]);
  vec4 xf = uXf[id];
  center = xf.xy;
  return vec3(p.xy * xf.zw, p.z * uZs[id]);
}

float weightOf(int id, float m) {
  return (int(uFrom + 0.5) == id ? 1.0 - m : 0.0) + (int(uTo + 0.5) == id ? m : 0.0);
}

void main() {
  int from = int(uFrom + 0.5);
  int to = int(uTo + 0.5);

  // Stagger so the cloud flows instead of moving as one block.
  float m = clamp(uMix * 1.35 - aRand.x * 0.35, 0.0, 1.0);
  m = m * m * (3.0 - 2.0 * m);

  vec2 cA, cB;
  vec3 pA = placed(from, cA);
  vec3 pB = placed(to, cB);
  vec3 p = mix(pA, pB, m);
  vec2 center = mix(cA, cB, m);

  // Turbulence peaks mid-morph.
  float swirl = sin(3.14159 * m) * uTurb * (0.25 + 0.75 * aRand.y);
  p += swirl * vec3(
    sin(p.y * 3.1 + uTime * 0.9 + aRand.y * 6.28),
    sin(p.z * 2.7 + uTime * 0.7 + aRand.z * 6.28),
    sin(p.x * 2.3 + uTime * 0.6 + aRand.w * 6.28)
  ) * 0.35;
  // Constant faint shimmer.
  p += 0.003 * vec3(sin(uTime * 1.3 + aRand.w * 40.0), cos(uTime * 1.1 + aRand.z * 40.0), 0.0);

  float wPortrait = weightOf(1, m);
  float wRails = weightOf(2, m);
  float wBrowser = weightOf(3, m);
  float wFunnel = weightOf(4, m);
  float wCloud = weightOf(0, m);
  float wPrompt = weightOf(5, m);

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vec4 clip = projectionMatrix * mv;
  clip.xy += center * clip.w;

  // Gentle pull toward the cursor, in screen space.
  vec2 ndc = clip.xy / clip.w;
  vec2 d = uMouse - ndc;
  d.x *= uAspect;
  float f = exp(-dot(d, d) / (uMouseR * uMouseR)) * uMouseOn * (1.0 - wPortrait * 0.85);
  ndc += vec2(d.x / uAspect, d.y) * f * 0.18;
  clip.xy = ndc * clip.w;
  gl_Position = clip;

  // Colour: palette for shapes, photo colours for the portrait.
  vec3 pal = aRand.y < 0.1 ? uSun : (aRand.y < 0.32 ? uSoft : uInk);
  vec3 col = mix(pal, aColor.rgb * 1.08, wPortrait);
  float alpha = 0.8;

  // Funnel: light up the active stage.
  float band = aFunnel.y > ${(1 / 3).toFixed(4)} ? 0.0 : (aFunnel.y > ${(-1 / 3).toFixed(4)} ? 1.0 : 2.0);
  float hiF = (1.0 - clamp(abs(band - uHi.y), 0.0, 1.0)) * step(-0.5, uHi.y);
  col = mix(col, uSun, hiF * wFunnel * 0.9);
  alpha *= mix(1.0, 0.55 + 0.6 * hiF, wFunnel * step(-0.5, uHi.y));

  // Portrait: hide particles that fall outside the visible window of the hero.
  float inWin = step(uPortraitWin.x, aPortrait.x) * step(aPortrait.x, uPortraitWin.z)
              * step(uPortraitWin.y, aPortrait.y) * step(aPortrait.y, uPortraitWin.w);
  alpha *= mix(1.0, inWin, wPortrait);
  // Sparse background samples have a larger size factor; dim them so the person leads.
  float bgness = smoothstep(1.05, 1.75, aColor.w);
  alpha *= mix(1.0, 1.0 - uPortraitBg * bgness, wPortrait);

  // Rails: light up the active station.
  float st = 0.0;
  for (int i = 0; i < 4; i++) {
    float k = 1.0 - clamp(abs(float(i) - uHi.x), 0.0, 1.0);
    float dz = (aRails.z - uStations[i]) / 0.16;
    st += k * exp(-dz * dz);
  }
  float onStage = step(-0.5, uHi.x);
  st *= onStage;
  // Station markers float above the track and only show in the How I work scene.
  float marker = step(${(-0.42 + 0.08).toFixed(3)}, aRails.y);
  col = mix(col, uSun, clamp(st, 0.0, 1.0) * wRails);
  alpha *= mix(1.0, (0.55 + 0.9 * st) * mix(1.0, onStage * (0.35 + 0.65 * clamp(st, 0.0, 1.0)), marker), wRails);

  // Browser: the frame glows, the inside stays faint.
  float inside = step(max(abs(aBrowser.x), abs(aBrowser.y)), 0.985);
  alpha *= mix(1.0, mix(0.85, 0.12, inside), wBrowser);

  // Prompt: the underscore blinks like a caret.
  float caret = step(aPrompt.y, -0.36) * step(0.05, aPrompt.x) * step(aPrompt.x, 0.75);
  alpha *= mix(1.0, mix(1.0, 0.25 + 0.75 * step(0.5, fract(uTime * 0.9)), caret), wPrompt);

  alpha *= mix(1.0, 0.55, wCloud);
  alpha *= mix(1.0, 0.75, wPortrait);
  alpha += f * 0.5;
  // Fewer particles on small devices: let each one carry more light.
  alpha *= mix(uDensity, 1.0, wPortrait);

  // Depth of field: particles in front of the focal plane grow and soften.
  float depth = -mv.z;
  float near = clamp((uCamD - depth) / 1.6, 0.0, 1.0);
  float persp = uCamD / max(depth, 0.2);
  float base = uSize * (0.55 + aRand.w * 0.9);
  float size = mix(base, uPortraitSize * aColor.w, wPortrait) * persp * (1.0 + near * 3.0);
  gl_PointSize = min(size * uDpr, 64.0);
  alpha *= 1.0 - near * 0.75;

  vSoft = near;
  vColor = vec4(col, alpha * uAlpha);
}
`;

const fragment = /* glsl */ `
varying vec4 vColor;
varying float vSoft;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, mix(0.12, 0.0, vSoft), d);
  if (a < 0.01) discard;
  gl_FragColor = vec4(vColor.rgb, vColor.a * a);
}
`;

export function createParticles(b: ShapeBuffers) {
  const g = new BufferGeometry();
  g.setAttribute("position", new BufferAttribute(b.cloud, 3));
  g.setAttribute("aPortrait", new BufferAttribute(b.portrait, 3));
  g.setAttribute("aRails", new BufferAttribute(b.rails, 3));
  g.setAttribute("aBrowser", new BufferAttribute(b.browser, 3));
  g.setAttribute("aFunnel", new BufferAttribute(b.funnel, 3));
  g.setAttribute("aPrompt", new BufferAttribute(b.prompt, 3));
  g.setAttribute("aColor", new BufferAttribute(b.color, 4));
  g.setAttribute("aRand", new BufferAttribute(b.rand, 4));

  const xf = Array.from({ length: SHAPE_COUNT }, () => new Vector4(0, 0, 1, 1));
  const rot = Array.from({ length: SHAPE_COUNT }, () => new Vector2());
  const material = new ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uFrom: { value: 0 },
      uTo: { value: 0 },
      uMix: { value: 0 },
      uXf: { value: xf },
      uZs: { value: new Array(SHAPE_COUNT).fill(1) },
      uRot: { value: rot },
      uAspect: { value: 1 },
      uCamD: { value: 3.7 },
      uSize: { value: 2.2 },
      uPortraitSize: { value: 3 },
      uDpr: { value: 1 },
      uMouse: { value: new Vector2(9, 9) },
      uMouseOn: { value: 0 },
      uMouseR: { value: 0.2 },
      uTurb: { value: 0.6 },
      uHi: { value: new Vector2(-1, -1) },
      uAlpha: { value: 0 },
      uDensity: { value: 1 },
      uPortraitBg: { value: 0 },
      uPortraitWin: { value: new Vector4(-0.5, -0.5, 0.5, 0.5) },
      uInk: { value: new Color(palette.ink) },
      uSun: { value: new Color(palette.sun) },
      uSoft: { value: new Color(palette.soft) },
      uStations: { value: RAILS.stations.slice() },
    },
  });
  const points = new Points(g, material);
  points.frustumCulled = false;
  points.renderOrder = 2;
  return { points, material, geometry: g, xf, rot };
}
