// The hero: a night sky after Vincent van Gogh's "The Starry Night" (1889, public
// domain), drawn and moved as particles. Nothing is traced from the painting or
// any reproduction: the scene is a handful of parametric features (spirals,
// stars, a crescent moon, a wind band, a cypress, hills and a village) laid out
// for this page, and every particle moves along its feature like a brushstroke.
//
// Each particle stores its feature ("family") and parameters in two vec4
// attributes. The shader (STARRY_GLSL) turns them into a position at time t,
// a stroke direction and a colour, so the motion costs no CPU work per frame.
//
// Scene space: u (0 left to 1 right) and v (0 top to 1 bottom) across the hero
// box. Radii and offsets are in units of the hero height so circles stay round.

export const FAMILY = {
  sky: 0,
  spiral: 1,
  ring: 2,
  core: 3,
  band: 4,
  cypress: 5,
  hills: 6,
  village: 7,
} as const;

type P = [number, number];

export interface StarryLayout {
  spirals: { c: P; r: number; spin: number }[];
  stars: { c: P; r: number }[];
  moon: { c: P; r: number };
  cypress: { x: number; top: number; base: number; width: number };
  band: { v: number; amp: number; tilt: number; thick: number };
  horizon: number;
  village: { u0: number; u1: number };
}

// Wide screens: the text sits bottom left, so the sky's drama sits to the right.
const WIDE: StarryLayout = {
  spirals: [
    { c: [0.665, 0.37], r: 0.17, spin: 1 },
    { c: [0.82, 0.57], r: 0.085, spin: 1 },
  ],
  moon: { c: [0.9, 0.15], r: 0.075 },
  stars: [
    { c: [0.31, 0.13], r: 0.045 },
    { c: [0.12, 0.22], r: 0.036 },
    { c: [0.55, 0.1], r: 0.04 },
    { c: [0.75, 0.09], r: 0.034 },
    { c: [0.965, 0.4], r: 0.03 },
    { c: [0.6, 0.66], r: 0.042 },
    { c: [0.43, 0.32], r: 0.028 },
  ],
  cypress: { x: 0.47, top: 0.1, base: 1.04, width: 0.075 },
  band: { v: 0.53, amp: 0.055, tilt: -0.07, thick: 0.055 },
  horizon: 0.79,
  village: { u0: 0.55, u1: 0.98 },
};

// Tall screens: the text sits in the bottom half, so the sky fills the top.
const TALL: StarryLayout = {
  spirals: [
    { c: [0.6, 0.2], r: 0.095, spin: 1 },
    { c: [0.25, 0.31], r: 0.05, spin: 1 },
  ],
  moon: { c: [0.85, 0.075], r: 0.045 },
  stars: [
    { c: [0.36, 0.085], r: 0.026 },
    { c: [0.62, 0.06], r: 0.02 },
    { c: [0.92, 0.23], r: 0.022 },
    { c: [0.1, 0.17], r: 0.024 },
    { c: [0.82, 0.36], r: 0.024 },
  ],
  cypress: { x: 0.15, top: 0.06, base: 0.75, width: 0.05 },
  band: { v: 0.31, amp: 0.022, tilt: -0.04, thick: 0.03 },
  horizon: 0.45,
  village: { u0: 0.32, u1: 0.98 },
};

export const MAX_VORTICES = 10;

export function starryLayout(aspect: number): StarryLayout {
  return aspect < 0.95 ? TALL : WIDE;
}

/** Swirl centres for the sky's flow field: u, v, radius, strength. */
export function vortexUniforms(l: StarryLayout): number[][] {
  const v = [
    ...l.spirals.map((s) => [s.c[0], s.c[1], s.r, 1.0 * s.spin]),
    [l.moon.c[0], l.moon.c[1], l.moon.r, 0.55],
    ...l.stars.map((s) => [s.c[0], s.c[1], s.r, 0.4]),
  ];
  while (v.length < MAX_VORTICES) v.push([0, 0, 0.001, 0]);
  return v.slice(0, MAX_VORTICES);
}

/**
 * The sky's flow direction and the warm tint near stars and the moon depend only on
 * where a stroke sits, so they are worked out here once per hero shape instead of
 * in the vertex shader every frame (two loops over every swirl, per particle).
 * Writes (dir x, dir y, warm) per particle into out; zeros for other families.
 */
export function starryFlowField(A: Float32Array, n: number, l: StarryLayout, aspect: number, out: Float32Array) {
  const vort = vortexUniforms(l);
  for (let i = 0; i < n; i++) {
    const o = i * 3;
    if (Math.round(A[i * 4]) !== FAMILY.sky) {
      out[o] = out[o + 1] = out[o + 2] = 0;
      continue;
    }
    const sx = A[i * 4 + 1] * aspect;
    const sy = A[i * 4 + 2];
    let vx = 0.7;
    let vy = 0.18 * Math.sin(sx * 3.1 + 0.6);
    let warm = 0;
    for (let k = 0; k < vort.length; k++) {
      const [u, v, r, w] = vort[k];
      const dx = sx - u * aspect;
      const dy = sy - v;
      const d2 = dx * dx + dy * dy;
      const R = r * 1.9;
      const f = (Math.exp(-d2 / (R * R)) * w * 2.2) / Math.max(Math.sqrt(d2), 0.004);
      vx -= dy * f;
      vy += dx * f;
      // Stars and the moon warm the strokes around them; the spirals (first two) do not.
      if (k >= 2 && w >= 0.01) {
        const R2 = r * 1.7;
        warm = Math.max(warm, Math.exp(-d2 / (R2 * R2)));
      }
    }
    const len = Math.hypot(vx, vy) || 1;
    out[o] = vx / len;
    out[o + 1] = vy / len;
    out[o + 2] = warm;
  }
  return out;
}

export function horizonAt(l: StarryLayout, u: number) {
  return l.horizon + 0.035 * Math.sin(u * 7 + 1.3) + 0.018 * Math.sin(u * 17 + 0.4) - 0.04 * u;
}

function cypressHalfWidth(l: StarryLayout, v: number) {
  const { top, base, width } = l.cypress;
  if (v < top || v > base) return -1;
  const rel = (base - v) / (base - top); // 0 at the base, 1 at the tip
  return width * Math.pow(1 - rel, 0.75) * (0.82 + 0.18 * Math.sin(rel * 22)) + 0.003;
}

function cypressCenter(l: StarryLayout, v: number) {
  const rel = (l.cypress.base - v) / (l.cypress.base - l.cypress.top);
  return l.cypress.x + 0.018 * Math.sin(rel * 3.2) * rel;
}

function inCypress(l: StarryLayout, u: number, v: number, aspect: number) {
  const hw = cypressHalfWidth(l, v);
  return hw > 0 && Math.abs(u - cypressCenter(l, v)) < hw / aspect;
}

/**
 * Fill two vec4 buffers (family, u, v, a) and (b, c, d, depth) for n particles.
 * Field meanings per family are documented next to each branch in STARRY_GLSL.
 */
export function fillStarry(
  A: Float32Array,
  B: Float32Array,
  n: number,
  r: () => number,
  l: StarryLayout,
  aspect: number,
) {
  const gauss = () => {
    const a = Math.max(1e-6, r());
    return Math.sqrt(-2 * Math.log(a)) * Math.cos(2 * Math.PI * r());
  };
  const put = (i: number, f: number, u: number, v: number, a: number, b: number, c: number, d: number, z: number) => {
    A[i * 4] = f;
    A[i * 4 + 1] = u;
    A[i * 4 + 2] = v;
    A[i * 4 + 3] = a;
    B[i * 4] = b;
    B[i * 4 + 1] = c;
    B[i * 4 + 2] = d;
    B[i * 4 + 3] = z;
  };
  const glows = [...l.stars.map((s) => ({ ...s, moon: 0 })), { ...l.moon, moon: 1 }];
  const houses: P[] = [];
  for (let k = 0; k < 26; k++) {
    const u = l.village.u0 + r() * (l.village.u1 - l.village.u0);
    houses.push([u, horizonAt(l, u) + 0.05 + r() * 0.09]);
  }
  const glowArea = glows.reduce((s, g) => s + g.r * g.r, 0);
  const spiralArea = l.spirals.reduce((s, g) => s + g.r * g.r, 0);

  for (let i = 0; i < n; i++) {
    const t = r();
    if (t < 0.4) {
      // Sky: short strokes that slide along the local flow.
      let u = 0;
      let v = 0;
      for (let k = 0; k < 30; k++) {
        u = r() * 1.04 - 0.02;
        v = r() * 1.02 - 0.02;
        if (v < horizonAt(l, u) + 0.01 && !inCypress(l, u, v, aspect)) break;
      }
      put(i, FAMILY.sky, u, v, r(), 0.7 + r() * 0.8, 0, 0, -0.6 + r() * 0.12);
    } else if (t < 0.53) {
      // Spirals: two arms of strokes turning around each centre.
      let pick = r() * spiralArea;
      let s = l.spirals[0];
      for (const sp of l.spirals) {
        pick -= sp.r * sp.r;
        if (pick <= 0) {
          s = sp;
          break;
        }
      }
      const rad = s.r * (0.1 + 0.9 * Math.sqrt(r()));
      const arm = r() < 0.5 ? 0 : Math.PI;
      const th = arm + 3.1 * Math.log(rad / s.r) + gauss() * 0.28;
      put(i, FAMILY.spiral, s.c[0], s.c[1], rad, th, 0.16 * s.spin, rad / s.r, -0.46 + r() * 0.05);
    } else if (t < 0.64) {
      // Halo rings around stars and the moon, turning in alternate directions.
      let pick = r() * glowArea;
      let g = glows[0];
      for (const gl of glows) {
        pick -= gl.r * gl.r;
        if (pick <= 0) {
          g = gl;
          break;
        }
      }
      const k = 1 + ((r() * 4) | 0);
      const rad = g.r * (0.32 + 0.68 * (k / 4)) + gauss() * g.r * 0.05;
      const w = (k % 2 ? 0.32 : -0.22) * (0.85 + r() * 0.3);
      put(i, FAMILY.ring, g.c[0], g.c[1], rad, r() * Math.PI * 2, w, k / 4, -0.5 + r() * 0.04);
    } else if (t < 0.67) {
      // Bright cores: a disc for stars, a crescent for the moon.
      const g = glows[(r() * glows.length) | 0];
      // Moon: a bright crescent around a dim ochre shadow (kind 1 and 2).
      const a = r() * Math.PI * 2;
      const rr = Math.sqrt(r()) * g.r * (g.moon ? 0.6 : 0.3);
      const ox = Math.cos(a) * rr;
      const oy = Math.sin(a) * rr;
      let kind = 0;
      if (g.moon) {
        const dx = ox - g.r * 0.24;
        const dy = oy + g.r * 0.14;
        kind = dx * dx + dy * dy > (g.r * 0.52) ** 2 ? 1 : 2;
      }
      put(i, FAMILY.core, g.c[0], g.c[1], ox, oy, r(), kind, -0.49);
    } else if (t < 0.8) {
      // Wind band: a river of light crossing the sky, left to right.
      const lane = Math.max(-1, Math.min(1, gauss() * 0.5));
      put(i, FAMILY.band, r(), lane, 0.012 + r() * 0.01, r() * 6.28, 0, 0, -0.42 + r() * 0.04);
    } else if (t < 0.89) {
      // Cypress: dark strokes licking upward like a flame.
      const { top, base } = l.cypress;
      let u = 0;
      let v = 0;
      for (let k = 0; k < 40; k++) {
        v = top + r() * (base - top);
        const hw = cypressHalfWidth(l, v);
        u = cypressCenter(l, v) + (r() * 2 - 1) * (hw / aspect);
        if (hw > 0) break;
      }
      const rel = (base - v) / (base - top);
      put(i, FAMILY.cypress, u, v, r(), rel, 0, 0, 0.28 + r() * 0.16);
    } else if (t < 0.985) {
      // Hills: strokes following the contours below the horizon.
      const u = r() * 1.04 - 0.02;
      const h = horizonAt(l, u);
      const v = h + Math.pow(r(), 0.8) * (1.03 - h);
      if (inCypress(l, u, v, aspect)) {
        put(i, FAMILY.cypress, u, v, r(), (l.cypress.base - v) / (l.cypress.base - l.cypress.top), 0, 0, 0.3);
      } else {
        put(i, FAMILY.hills, u, v, r(), Math.floor((v - h) / 0.028), 0, 0, -0.12 + r() * 0.06);
      }
    } else {
      // Village: houses with lit windows, nestled below the horizon.
      const hsN = houses.length;
      const [hu, hv] = houses[(r() * hsN) | 0];
      const lit = r() < 0.45 ? 1 : 0;
      const u = hu + ((r() - 0.5) * (lit ? 0.006 : 0.016)) / aspect;
      const v = hv + (r() - 0.5) * (lit ? 0.006 : 0.012);
      put(i, FAMILY.village, u, v, r(), lit, 0, 0, -0.05);
    }
  }
}

// GLSL: positions in scene space (x = u * aspect, y = v; height units, y down).
export const STARRY_GLSL = /* glsl */ `
uniform float uHeroAspect;
uniform vec4 uBand; // v, amplitude, tilt, thickness

// Set by starryLocal() for the colour and sprite code in main().
vec2 gStarDir = vec2(1.0, 0.0);
float gStarFade = 1.0;
float gStarFamily = 0.0;

float bandV(float u) {
  return uBand.x + uBand.y * sin(u * 5.0 + 0.7) + uBand.z * (u - 0.5);
}

// Returns the local position in the shape box (-1..1, y up) and z.
// F holds the sky's precomputed flow direction (xy) and warm tint (z), see starryFlowField.
vec3 starryLocal(vec4 A, vec4 B, vec3 F, float t) {
  int fam = int(A.x + 0.5);
  float asp = uHeroAspect;
  vec2 S = vec2(A.y * asp, A.z);
  vec2 dir = vec2(1.0, 0.0);
  float fade = 1.0;
  if (fam == 0) {
    // Sky: a = phase, b = stroke length.
    dir = F.xy;
    float ph = fract(t * 0.11 + A.w);
    S += dir * (ph - 0.5) * 0.045 * B.x;
    fade = smoothstep(0.0, 0.18, ph) * smoothstep(1.0, 0.82, ph);
  } else if (fam == 1 || fam == 2) {
    // Spiral arm or halo ring: a = radius, b = start angle, c = angular speed.
    float th = B.x + B.y * t;
    S += A.w * vec2(cos(th), sin(th));
    dir = vec2(-sin(th), cos(th)) * sign(B.y + 1e-4);
  } else if (fam == 3) {
    // Core: a, b = offset; c = twinkle phase.
    S += vec2(A.w, B.x);
    fade = 0.75 + 0.25 * sin(t * 2.3 + B.y * 6.28);
    dir = normalize(vec2(A.w, B.x) + 1e-4);
  } else if (fam == 4) {
    // Wind band: u = phase along the band, v = lane, a = speed, b = wobble phase.
    float x = fract(A.y + A.w * t);
    float u = x * 1.1 - 0.05;
    float lane = A.z;
    float vv = bandV(u) + lane * uBand.w + 0.006 * sin(t * 0.7 + B.x + u * 9.0);
    float dv = uBand.y * 5.0 * cos(u * 5.0 + 0.7) + uBand.z;
    S = vec2(u * asp, vv);
    dir = normalize(vec2(asp, dv));
    fade = smoothstep(0.0, 0.06, x) * smoothstep(1.0, 0.94, x);
  } else if (fam == 5) {
    // Cypress: a = phase, b = height (0 base, 1 tip). Sways more near the tip.
    S.x += 0.012 * sin(t * 0.9 + A.z * 9.0) * B.x;
    float ph = fract(t * 0.16 + A.w);
    S.y -= (ph - 0.5) * 0.03;
    dir = normalize(vec2(0.25 * cos(t * 0.9 + A.z * 9.0), -1.0));
    fade = sin(3.14159 * ph);
  } else if (fam == 6) {
    // Hills: a = phase; strokes slide along the slope.
    float ph = fract(t * 0.07 + A.w);
    float slope = 0.035 * 7.0 * cos(A.y * 7.0 + 1.3) / asp;
    dir = normalize(vec2(1.0, slope));
    S += dir * (ph - 0.5) * 0.03;
    fade = sin(3.14159 * ph);
  } else {
    // Village lights: twinkle in place.
    fade = 0.55 + 0.45 * sin(t * 1.7 + A.w * 6.28);
  }
  gStarDir = dir;
  gStarFade = fade;
  gStarFamily = float(fam);
  return vec3(S.x / asp * 2.0 - 1.0, 1.0 - S.y * 2.0, B.w);
}

vec3 pick4(float k, vec3 a, vec3 b, vec3 c, vec3 d) {
  return k < 0.25 ? a : (k < 0.5 ? b : (k < 0.75 ? c : d));
}

// Colour by family; k and k2 are per-particle randoms.
vec3 starryColor(vec4 A, vec4 B, vec3 F, float k, float k2) {
  int fam = int(A.x + 0.5);
  vec3 deep = vec3(0.07, 0.11, 0.42);
  vec3 cobalt = vec3(0.17, 0.24, 0.86);
  vec3 mid = vec3(0.27, 0.4, 0.88);
  vec3 light = vec3(0.55, 0.65, 0.95);
  vec3 sun = vec3(1.0, 0.82, 0.25);
  vec3 pale = vec3(0.97, 0.91, 0.64);
  vec3 cream = vec3(1.0, 0.96, 0.82);
  vec3 ochre = vec3(0.8, 0.6, 0.2);
  if (fam == 0) {
    vec3 c = k < 0.14 ? deep : (k < 0.5 ? cobalt : (k < 0.8 ? mid : (k2 < 0.6 ? light : vec3(0.75, 0.82, 1.0))));
    // Warm up strokes that sit near a star or the moon.
    float warm = F.z;
    return mix(c, mix(ochre, pale, k2), warm * 0.7);
  }
  if (fam == 1) return pick4(k, pale, light, cream, k2 < 0.5 ? sun : mid);
  if (fam == 2) return B.z > 0.9 ? mix(light, mid, k) : pick4(k, sun, pale, ochre, cream);
  if (fam == 3) {
    if (B.z > 1.5) return mix(vec3(0.42, 0.3, 0.1), ochre, k * 0.5);
    return B.z > 0.5 ? mix(sun, cream, k * 0.6) : mix(cream, vec3(1.0), k);
  }
  if (fam == 4) return pick4(k, pale, cream, light, k2 < 0.6 ? sun : mid);
  if (fam == 5) return pick4(k, vec3(0.02, 0.03, 0.08), vec3(0.04, 0.06, 0.13), vec3(0.05, 0.1, 0.11), k2 < 0.7 ? vec3(0.03, 0.05, 0.15) : vec3(0.1, 0.16, 0.38));
  if (fam == 6) {
    return mod(B.x, 2.0) < 1.0 ? mix(cobalt, mid, k * 0.7) : mix(deep, cobalt, 0.4 + k * 0.6);
  }
  return B.x > 0.5 ? mix(sun, pale, k) : mix(vec3(0.04, 0.06, 0.2), vec3(0.1, 0.12, 0.35), k);
}

// Size multipliers and stroke elongation by family.
vec2 starryStroke(float fam) {
  if (fam < 0.5) return vec2(1.15, 2.6);
  if (fam < 1.5) return vec2(1.1, 2.4);
  if (fam < 2.5) return vec2(1.0, 2.2);
  if (fam < 3.5) return vec2(0.85, 1.0);
  if (fam < 4.5) return vec2(1.2, 3.0);
  if (fam < 5.5) return vec2(1.5, 2.2);
  if (fam < 6.5) return vec2(1.2, 3.0);
  return vec2(0.75, 1.0);
}
`;
