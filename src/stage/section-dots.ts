/**
 * Marks the section dot for the part of the page in view (aria-current), in every
 * motion mode. The current section is the last one whose top has passed the middle
 * of the screen. Returns a cleanup function.
 */
export function startSectionDots(): () => void {
  const dots = Array.from(document.querySelectorAll<HTMLAnchorElement>("[data-dot]"));
  const targets = dots.map((d) => document.getElementById(d.dataset.dot ?? ""));
  if (!dots.length) return () => {};

  let raf = 0;
  let last = -1;
  const update = () => {
    raf = 0;
    const mid = window.innerHeight * 0.5;
    let current = 0;
    targets.forEach((el, i) => {
      if (el && el.getBoundingClientRect().top <= mid) current = i;
    });
    if (current === last) return;
    last = current;
    dots.forEach((d, i) => {
      if (i === current) d.setAttribute("aria-current", "true");
      else d.removeAttribute("aria-current");
    });
  };
  const schedule = () => {
    if (!raf) raf = requestAnimationFrame(update);
  };
  update();
  addEventListener("scroll", schedule, { passive: true });
  addEventListener("resize", schedule);
  return () => {
    removeEventListener("scroll", schedule);
    removeEventListener("resize", schedule);
    cancelAnimationFrame(raf);
  };
}
