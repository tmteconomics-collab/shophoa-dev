// Target positions for every particle, one buffer per shape.
// All shapes are built once on the CPU; the GPU blends between them.
import { fillStarry, starryFlowField, type StarryLayout } from "./starry";

export const SHAPE = {
  cloud: 0,
  portrait: 1,
  rails: 2,
  browser: 3,
  funnel: 4,
  prompt: 5,
  starry: 6,
  chart: 7,
  blocks: 8,
} as const;
export type ShapeName = keyof typeof SHAPE;
export const SHAPE_COUNT = 9;

/** Rails geometry, shared with the shader for station highlights. */
export const RAILS = {
  gauge: 0.2,
  y: -0.42,
  near: 0.9,
  far: -6,
  sleeperGap: 0.32,
  stations: [0.35, -0.95, -2.25, -3.55],
};

/** 3D bar chart (measurement section): bar heights rise left to right. */
export const CHART = {
  bars: [0.42, 0.58, 0.5, 0.76, 0.7, 0.98, 1.08, 1.3, 1.52],
  base: -0.9,
  half: 0.07,
  lineZ: 0.6,
};

/** Page blocks (WordPress section): x0, x1, y0, y1 in the local box, plus group. */
export const BLOCKS: [number, number, number, number, number][] = [
  [-1, 1, 0.82, 0.98, 0], // header
  [-1, 1, 0.3, 0.74, 1], // hero
  [-1, -0.04, -0.22, 0.22, 2], // columns
  [0.04, 1, -0.22, 0.22, 2],
  [-1, -0.36, -0.68, -0.3, 3], // cards
  [-0.32, 0.32, -0.68, -0.3, 3],
  [0.36, 1, -0.68, -0.3, 3],
  [-1, 1, -0.98, -0.82, 4], // footer
];

/** Funnel band edges in local y (top = 1). */
export const FUNNEL_BANDS = [1 / 3, -1 / 3];

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gauss(r: () => number) {
  const u = Math.max(1e-6, r());
  const v = r();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export interface PortraitSample {
  width: number;
  height: number;
  color: Uint8ClampedArray; // RGBA
  depthMask: Uint8ClampedArray; // R = depth, G = mask
  face: { x: number; y: number; rx: number; ry: number }; // 0-1 image space
  eyes: { left: [number, number]; right: [number, number]; rx: number; ry: number }; // 0-1 image space
}

export interface ShapeBuffers {
  count: number;
  cloud: Float32Array;
  portrait: Float32Array;
  rails: Float32Array;
  browser: Float32Array;
  funnel: Float32Array;
  prompt: Float32Array;
  chart: Float32Array;
  blocks: Float32Array;
  starryA: Float32Array; // family, u, v, a (see starry.ts)
  starryB: Float32Array; // b, c, d, depth
  starryF: Float32Array; // sky flow direction and warm tint, per hero aspect (see starryFlowField)
  color: Float32Array; // rgb + portrait size factor
  rand: Float32Array;
}

// pause() runs between the larger fills so the page can paint and scroll while the
// stage starts on a phone.
export async function buildShapes(
  count: number,
  sample: PortraitSample,
  starry: { layout: StarryLayout; aspect: number },
  pause: () => Promise<void> = async () => {},
): Promise<ShapeBuffers> {
  const r = mulberry32(20260415);
  const b: ShapeBuffers = {
    count,
    cloud: new Float32Array(count * 3),
    portrait: new Float32Array(count * 3),
    rails: new Float32Array(count * 3),
    browser: new Float32Array(count * 3),
    funnel: new Float32Array(count * 3),
    prompt: new Float32Array(count * 3),
    chart: new Float32Array(count * 3),
    blocks: new Float32Array(count * 3),
    starryA: new Float32Array(count * 4),
    starryB: new Float32Array(count * 4),
    starryF: new Float32Array(count * 3),
    color: new Float32Array(count * 4),
    rand: new Float32Array(count * 4),
  };

  for (let i = 0; i < count; i++) {
    b.rand[i * 4] = r();
    b.rand[i * 4 + 1] = r();
    b.rand[i * 4 + 2] = r();
    b.rand[i * 4 + 3] = r();
  }

  fillCloud(b.cloud, count, r);
  await pause();
  fillPortrait(b.portrait, b.color, count, r, sample);
  await pause();
  fillRails(b.rails, count, r);
  fillBrowser(b.browser, count, r);
  fillFunnel(b.funnel, count, r, b.rand);
  fillPrompt(b.prompt, count, r);
  fillChart(b.chart, count, r);
  fillBlocks(b.blocks, count, r);
  await pause();
  fillStarry(b.starryA, b.starryB, count, r, starry.layout, starry.aspect);
  starryFlowField(b.starryA, count, starry.layout, starry.aspect, b.starryF);
  return b;
}

function fillCloud(out: Float32Array, n: number, r: () => number) {
  // A loose drifting field, wider than tall, with some particles near the camera for depth of field.
  for (let i = 0; i < n; i++) {
    const near = r() < 0.06;
    out[i * 3] = gauss(r) * 0.9;
    out[i * 3 + 1] = gauss(r) * 0.55;
    out[i * 3 + 2] = near ? 1.2 + r() * 1.4 : gauss(r) * 0.8 - 0.3;
  }
}

function fillPortrait(out: Float32Array, color: Float32Array, n: number, r: () => number, s: PortraitSample) {
  const { width: W, height: H } = s;
  const maxW = 5.3;
  const { eyes } = s;
  const nearEye = (u: number, v: number) => {
    // A generous box around each eye (lids and brows) gets the densest sampling.
    for (const [ex, ey] of [eyes.left, eyes.right]) {
      const dx = (u - ex) / (eyes.rx * 2.2);
      const dy = (v - ey) / (eyes.ry * 3.2);
      if (dx * dx + dy * dy < 1) return 1;
    }
    return 0;
  };
  let i = 0;
  let guard = 0;
  while (i < n && guard < n * 40) {
    guard++;
    const u = r();
    const v = r();
    const px = Math.min(W - 1, (u * W) | 0);
    const py = Math.min(H - 1, (v * H) | 0);
    const k = (py * W + px) * 4;
    const mask = s.depthMask[k + 1] / 255;
    const fx = (u - s.face.x) / s.face.rx;
    const fy = (v - s.face.y) / s.face.ry;
    const inFace = fx * fx + fy * fy < 1 ? 1 : 0;
    // Denser on the person, denser on the face, densest around the eyes so
    // gaze and blinks read; sparse on the background.
    const w = 0.28 + 0.92 * mask + 1.6 * inFace + 2.5 * nearEye(u, v);
    if (r() * maxW > w) continue;
    const depth = s.depthMask[k] / 255;
    out[i * 3] = u - 0.5;
    out[i * 3 + 1] = 0.5 - v;
    out[i * 3 + 2] = depth - 0.5;
    color[i * 4] = s.color[k] / 255;
    color[i * 4 + 1] = s.color[k + 1] / 255;
    color[i * 4 + 2] = s.color[k + 2] / 255;
    // Sparse areas get bigger points so the image stays filled.
    color[i * 4 + 3] = Math.min(2.2, Math.sqrt(1.0 / w));
    i++;
  }
  for (; i < n; i++) {
    out[i * 3] = r() - 0.5;
    out[i * 3 + 1] = r() - 0.5;
    color[i * 4 + 3] = 1;
  }
}

function fillRails(out: Float32Array, n: number, r: () => number) {
  const { gauge, y, near, far, sleeperGap } = RAILS;
  const len = near - far;
  const sleepers = Math.floor(len / sleeperGap);
  for (let i = 0; i < n; i++) {
    const t = r();
    let x: number;
    let yy = y;
    let z: number;
    if (t < 0.5) {
      // Two rails, with a little height so they read as steel bars.
      const side = r() < 0.5 ? -1 : 1;
      z = far + Math.pow(r(), 0.7) * len;
      x = side * gauge + (r() - 0.5) * 0.018;
      yy = y + r() * 0.03;
    } else if (t < 0.85) {
      // Sleepers across the track.
      const k = (r() * sleepers) | 0;
      z = near - k * sleeperGap + (r() - 0.5) * 0.05;
      x = (r() - 0.5) * gauge * 3.1;
      yy = y - 0.012 + r() * 0.012;
    } else if (t < 0.89) {
      // Station markers: small rings hovering over the track.
      const k = (r() * RAILS.stations.length) | 0;
      const a = r() * Math.PI * 2;
      const rad = 0.075 + gauss(r) * 0.004;
      z = RAILS.stations[k] + Math.sin(a) * rad * 0.35;
      x = Math.cos(a) * rad;
      yy = y + 0.16 + Math.sin(a) * rad;
    } else {
      // Gravel and grass along the bed, sparse.
      z = far + Math.pow(r(), 0.6) * len;
      x = gauss(r) * gauge * 2.4;
      yy = y - 0.03 + r() * 0.02;
    }
    out[i * 3] = x;
    out[i * 3 + 1] = yy;
    out[i * 3 + 2] = z;
  }
}

function fillBrowser(out: Float32Array, n: number, r: () => number) {
  // Local box is -1..1 on both axes; mapped onto the DOM browser panel.
  const perimeter = (t: number): [number, number] => {
    // Walk around the rectangle, t in 0..1.
    const p = t * 4;
    if (p < 1) return [-1 + 2 * p, 1];
    if (p < 2) return [1, 1 - 2 * (p - 1)];
    if (p < 3) return [1 - 2 * (p - 2), -1];
    return [-1, -1 + 2 * (p - 3)];
  };
  for (let i = 0; i < n; i++) {
    const t = r();
    let x: number;
    let y: number;
    let z = (r() - 0.5) * 0.02;
    if (t < 0.34) {
      const [px, py] = perimeter(r());
      const spread = Math.abs(gauss(r)) * 0.01;
      x = px + Math.sign(px) * (Math.abs(px) > 0.999 ? spread : 0);
      y = py + Math.sign(py) * (Math.abs(py) > 0.999 ? spread : 0);
    } else if (t < 0.42) {
      // Corner brackets, slightly outside the frame.
      const cx = r() < 0.5 ? -1 : 1;
      const cy = r() < 0.5 ? -1 : 1;
      const along = r() * 0.16;
      const horiz = r() < 0.5;
      x = cx * (1.025 - (horiz ? along : 0));
      y = cy * (1.04 - (horiz ? 0 : along));
    } else {
      // Faint dust inside the glass.
      x = (r() * 2 - 1) * 0.98;
      y = (r() * 2 - 1) * 0.98;
      z = (r() - 0.5) * 0.3;
    }
    out[i * 3] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z;
  }
}

export function funnelRadius(y: number) {
  const t = (y + 1) / 2; // 0 bottom, 1 top
  return 0.2 + 0.8 * Math.pow(t, 1.6);
}

function fillFunnel(out: Float32Array, n: number, r: () => number, rand: Float32Array) {
  for (let i = 0; i < n; i++) {
    const flow = rand[i * 4 + 2] < 0.1; // animated in the shader
    let y: number;
    let rad: number;
    const ang = r() * Math.PI * 2;
    if (r() < 0.16) {
      // Bright rings at the top rim and at the band edges.
      const rings = [1, FUNNEL_BANDS[0], FUNNEL_BANDS[1], -1];
      y = rings[(r() * rings.length) | 0] + (r() - 0.5) * 0.012;
      rad = funnelRadius(y);
    } else {
      y = r() * 2 - 1;
      // Leave a small gap at each band edge so the three stages read apart.
      for (const e of FUNNEL_BANDS) if (Math.abs(y - e) < 0.035) y += 0.07 * Math.sign(y - e || 1);
      rad = funnelRadius(Math.max(-1, Math.min(1, y))) * (1 + gauss(r) * 0.012);
    }
    if (flow) rad *= 0.5;
    out[i * 3] = Math.cos(ang) * rad;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = Math.sin(ang) * rad;
  }
}

function fillPrompt(out: Float32Array, n: number, r: () => number) {
  // A ">_" prompt glyph, extruded slightly, inside a thin frame.
  const segs: [number, number, number, number, number][] = [
    // x0, y0, x1, y1, weight
    [-0.62, 0.42, -0.08, 0.0, 1],
    [-0.08, 0.0, -0.62, -0.42, 1],
    [0.12, -0.44, 0.68, -0.44, 0.9],
  ];
  const total = segs.reduce((s, x) => s + x[4], 0);
  for (let i = 0; i < n; i++) {
    const t = r();
    let x: number;
    let y: number;
    let z: number;
    if (t < 0.8) {
      let pick = r() * total;
      let s = segs[0];
      for (const seg of segs) {
        pick -= seg[4];
        if (pick <= 0) {
          s = seg;
          break;
        }
      }
      const a = r();
      const thick = 0.075;
      const dx = s[2] - s[0];
      const dy = s[3] - s[1];
      const len = Math.hypot(dx, dy);
      const nx = -dy / len;
      const ny = dx / len;
      const o = (r() - 0.5) * 2 * thick;
      x = s[0] + dx * a + nx * o;
      y = s[1] + dy * a + ny * o;
      z = (r() - 0.5) * 0.22;
    } else {
      // Sparse field around the glyph.
      x = gauss(r) * 0.75;
      y = gauss(r) * 0.55;
      z = gauss(r) * 0.3;
    }
    out[i * 3] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z;
  }
}

/** A point on the surface of a box, with most points on its 12 edges. */
function boxPoint(
  r: () => number,
  x0: number,
  x1: number,
  y0: number,
  y1: number,
  z0: number,
  z1: number,
  edgeShare: number,
) {
  const pick = (a: number, b: number) => (r() < 0.5 ? a : b);
  if (r() < edgeShare) {
    const axis = (r() * 3) | 0;
    const t = r();
    if (axis === 0) return [x0 + (x1 - x0) * t, pick(y0, y1), pick(z0, z1)];
    if (axis === 1) return [pick(x0, x1), y0 + (y1 - y0) * t, pick(z0, z1)];
    return [pick(x0, x1), pick(y0, y1), z0 + (z1 - z0) * t];
  }
  // Faint fill on the front face.
  return [x0 + (x1 - x0) * r(), y0 + (y1 - y0) * r(), z1];
}

function fillChart(out: Float32Array, n: number, r: () => number) {
  const { bars, base, half, lineZ } = CHART;
  const count = bars.length;
  const xAt = (i: number) => -1 + ((i + 0.5) * 2) / count;
  const total = bars.reduce((a, b) => a + b, 0);
  for (let i = 0; i < n; i++) {
    const t = r();
    let p: number[];
    if (t < 0.62) {
      // Bars, chosen by height so tall bars get more particles.
      let pick = r() * total;
      let k = 0;
      for (; k < count - 1; k++) {
        pick -= bars[k];
        if (pick <= 0) break;
      }
      const x = xAt(k);
      p = boxPoint(r, x - half, x + half, base, base + bars[k], -half, half, 0.7);
    } else if (t < 0.8) {
      // Trend line floating in front of the bars.
      const u = r() * (count - 1);
      const k = Math.floor(u);
      const f = u - k;
      const y = base + bars[k] + (bars[k + 1] - bars[k]) * f + 0.14;
      p = [xAt(k) + (xAt(k + 1) - xAt(k)) * f, y + (r() - 0.5) * 0.02, lineZ + (r() - 0.5) * 0.03];
    } else {
      // Floor grid.
      if (r() < 0.6) {
        const z = -0.5 + Math.floor(r() * 5) * 0.25;
        p = [-1.1 + r() * 2.2, base, z];
      } else {
        const x = -1.1 + Math.floor(r() * 12) * 0.2;
        p = [x, base, -0.5 + r()];
      }
    }
    out[i * 3] = p[0];
    out[i * 3 + 1] = p[1];
    out[i * 3 + 2] = p[2];
  }
}

function fillBlocks(out: Float32Array, n: number, r: () => number) {
  const area = BLOCKS.map(([x0, x1, y0, y1]) => (x1 - x0) * (y1 - y0) + 0.4 * (x1 - x0 + y1 - y0));
  const total = area.reduce((a, b) => a + b, 0);
  for (let i = 0; i < n; i++) {
    let pick = r() * total;
    let k = 0;
    for (; k < BLOCKS.length - 1; k++) {
      pick -= area[k];
      if (pick <= 0) break;
    }
    const [x0, x1, y0, y1] = BLOCKS[k];
    const p = boxPoint(r, x0, x1, y0, y1, -0.12, 0.12, 0.72);
    out[i * 3] = p[0];
    out[i * 3 + 1] = p[1];
    out[i * 3 + 2] = p[2];
  }
}
