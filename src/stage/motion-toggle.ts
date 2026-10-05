// The "Pause motion" button (WCAG 2.2.2). It sets data-paused on <html>; the
// stage freezes its clock and CSS stops every animation. The choice is kept in
// localStorage and applied before first paint by the boot script in layout.tsx.

export const MOTION_KEY = "devan-motion";

export function bindMotionToggle(button: HTMLButtonElement): () => void {
  const root = document.documentElement;
  const label = button.querySelector<HTMLElement>(".mt-label");
  // The visible label is the action the button will take (no aria-pressed, so the
  // name and the state never contradict each other).
  const sync = () => {
    const paused = root.dataset.paused === "on";
    button.dataset.state = paused ? "paused" : "playing";
    if (label) label.textContent = paused ? "Play motion" : "Pause motion";
  };
  const onClick = () => {
    const paused = root.dataset.paused !== "on";
    root.dataset.paused = paused ? "on" : "off";
    if (paused) root.dataset.intro = "off";
    try {
      localStorage.setItem(MOTION_KEY, paused ? "paused" : "on");
    } catch {
      // Storage can be blocked; the toggle still works for this visit.
    }
    sync();
  };
  sync();
  button.addEventListener("click", onClick);
  return () => button.removeEventListener("click", onClick);
}
