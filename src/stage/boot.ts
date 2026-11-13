/**
 * Start the WebGL stage on a canvas, if the boot script in layout.tsx marked this
 * device as capable (data-gl="pending"). three.js loads only here, after the page
 * is idle, so the static poster and text paint first. Returns a cleanup function.
 */
export function bootStage(canvas: HTMLCanvasElement): () => void {
  const root = document.documentElement;
  if (root.dataset.gl !== "pending") return () => {};
  let cancelled = false;
  let handle: { destroy(): void } | null = null;

  const boot = () => {
    import("./engine")
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
}
