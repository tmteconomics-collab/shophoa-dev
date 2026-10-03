import { SHAPE } from "./shapes";

// One shared timeline for the whole page. Every section that owns a stage shape
// carries data-scene; its scroll range decides which shape the particles hold and
// how far they are through a morph. The DOM side (ScrollScenes) reads the same
// section ranges, so text and particles stay in step.

export type SceneKind = "hero" | "browser" | "funnel" | "rails" | "prompt" | "cloud" | "portrait";

const KINDS: Record<SceneKind, { shape: number; alpha: number }> = {
  hero: { shape: SHAPE.starry, alpha: 1 },
  browser: { shape: SHAPE.browser, alpha: 1 },
  funnel: { shape: SHAPE.funnel, alpha: 1 },
  rails: { shape: SHAPE.rails, alpha: 1 },
  prompt: { shape: SHAPE.prompt, alpha: 1 },
  cloud: { shape: SHAPE.cloud, alpha: 0.45 },
  portrait: { shape: SHAPE.portrait, alpha: 0.9 },
};

export interface Scene {
  kind: SceneKind;
  el: HTMLElement;
  anchor: HTMLElement;
  shape: number;
  alpha: number;
  top: number;
  bottom: number;
}

export interface Frame {
  a: Scene;
  b: Scene;
  /** 0..1 through the transition from a to b (0 while a is held). */
  t: number;
  from: number;
  to: number;
  mix: number;
  alpha: number;
  /** 0..1..0 bump during transitions, used for the camera's short trip down the rails. */
  travel: number;
}

export function collectScenes(root: ParentNode = document): Scene[] {
  const els = Array.from(root.querySelectorAll<HTMLElement>("[data-scene]"));
  return els
    .filter((el) => (el.dataset.scene as SceneKind) in KINDS)
    .map((el) => {
      const kind = el.dataset.scene as SceneKind;
      return {
        kind,
        el,
        anchor: el.querySelector<HTMLElement>("[data-anchor]") ?? el,
        ...KINDS[kind],
        top: 0,
        bottom: 0,
      };
    });
}

export function measureScenes(scenes: Scene[]) {
  const y = window.scrollY;
  for (const s of scenes) {
    const r = s.el.getBoundingClientRect();
    s.top = r.top + y;
    s.bottom = r.bottom + y;
  }
}

export function frameAt(scenes: Scene[], scrollY: number, vh: number): Frame {
  const c = scrollY + vh * 0.5;
  const h = vh * 0.35;
  let ai = scenes.length - 1;
  let t = 0;
  for (let i = 0; i < scenes.length; i++) {
    const s = scenes[i];
    if (i > 0 && c < s.top + h) {
      // Inside the window around the boundary between i-1 and i.
      ai = i - 1;
      t = Math.min(1, Math.max(0, (c - (s.top - h)) / (2 * h)));
      break;
    }
    if (c < s.bottom - h || i === scenes.length - 1) {
      ai = i;
      t = 0;
      break;
    }
  }
  const a = scenes[ai];
  const b = t > 0 ? scenes[ai + 1] : a;

  let from = a.shape;
  let to = b.shape;
  let mix = t;
  const viaRails = t > 0 && a.shape !== b.shape && a.shape !== SHAPE.rails && b.shape !== SHAPE.rails;
  if (a.shape === b.shape) {
    mix = 0;
  } else if (viaRails) {
    if (t < 0.5) {
      to = SHAPE.rails;
      mix = t * 2;
    } else {
      from = SHAPE.rails;
      mix = (t - 0.5) * 2;
    }
  }

  const alpha = a.alpha + (b.alpha - a.alpha) * t;
  const travel = a !== b ? Math.sin(Math.PI * t) : 0;

  return { a, b, t, from, to, mix, alpha, travel };
}
