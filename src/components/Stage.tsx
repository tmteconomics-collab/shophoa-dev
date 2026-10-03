"use client";

import { useEffect, useRef } from "react";

/**
 * The fixed WebGL stage behind the page. Loads three.js only on capable devices
 * (decided before first paint by the inline script in layout.tsx) and only after
 * the page is idle, so the static poster and text paint first.
 */
export default function Stage() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.gl !== "pending" || !ref.current) return;
    const canvas = ref.current;
    let cancelled = false;
    let handle: { destroy(): void } | null = null;

    const boot = () => {
      import("@/stage/engine")
        .then(({ createStage }) => (cancelled ? null : createStage(canvas)))
        .then((h) => {
          if (!h) return;
          if (cancelled) h.destroy();
          else handle = h;
        })
        .catch((err) => {
          console.warn("Stage disabled:", err);
          root.dataset.gl = "off";
          root.dataset.intro = "off";
        });
    };

    const idle = "requestIdleCallback" in window;
    const id = idle ? window.requestIdleCallback(boot, { timeout: 600 }) : window.setTimeout(boot, 120);

    return () => {
      cancelled = true;
      if (idle) window.cancelIdleCallback(id);
      else window.clearTimeout(id);
      handle?.destroy();
      handle = null;
    };
  }, []);

  return <canvas ref={ref} className="stage" aria-hidden="true" />;
}
