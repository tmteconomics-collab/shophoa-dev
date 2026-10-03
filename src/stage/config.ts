import raw from "../../character.config.json";

export type Variant = "desktop" | "mobile";

export const character = raw;

export type Vec2 = [number, number];

export interface VariantInfo {
  image: string;
  depth: string;
  size: Vec2;
  landmarks: Record<"leftEye" | "rightEye" | "noseTip" | "mouthCenter" | "faceCenter", Vec2>;
  eyeRadius: Vec2;
}

// Files in public/ are served next to the page. Relative URLs keep the stage
// working wherever the page is hosted (site root or the preview bundle).
const toUrl = (p: string) => p.replace(/^public\//, "");

export function variantInfo(v: Variant): VariantInfo {
  const src = character.variants[v];
  return {
    image: toUrl(src.image),
    depth: toUrl(src.depth),
    size: [src.cropPx.w, src.cropPx.h],
    landmarks: src.landmarks as VariantInfo["landmarks"],
    eyeRadius: src.eyeRadius as Vec2,
  };
}

// Where the face sits inside the hero, as a fraction of the hero box.
// The photo is scaled up just enough to put the face there and still cover the box.
export const heroFraming: Record<Variant, { target: Vec2; overscan: number }> = {
  desktop: { target: [0.62, 0.4], overscan: 1.04 },
  mobile: { target: [0.5, 0.3], overscan: 1.04 },
};

export interface ImageBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Cover-fit an image into a box so that focus (0-1 in image) lands on target (0-1 in box). */
export function focalCover(
  boxW: number,
  boxH: number,
  imgW: number,
  imgH: number,
  focus: Vec2,
  target: Vec2,
  overscan = 1,
): ImageBox {
  const [fx, fy] = focus;
  const [tx, ty] = target;
  let s = Math.max(boxW / imgW, boxH / imgH);
  s = Math.max(
    s,
    (tx * boxW) / (fx * imgW),
    ((1 - tx) * boxW) / ((1 - fx) * imgW),
    (ty * boxH) / (fy * imgH),
    ((1 - ty) * boxH) / ((1 - fy) * imgH),
  );
  s *= overscan;
  const w = imgW * s;
  const h = imgH * s;
  const x = Math.min(0, Math.max(boxW - w, tx * boxW - fx * w));
  const y = Math.min(0, Math.max(boxH - h, ty * boxH - fy * h));
  return { x, y, w, h };
}

/** Pick the crop that suits the viewport shape. */
export function pickVariant(w: number, h: number): Variant {
  return w / h < 0.95 ? "mobile" : "desktop";
}
