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

/** Pick the crop that suits the viewport shape. */
export function pickVariant(w: number, h: number): Variant {
  return w / h < 0.95 ? "mobile" : "desktop";
}
