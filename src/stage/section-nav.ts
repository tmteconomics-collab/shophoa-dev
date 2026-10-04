/**
 * Where you are on a long page, in every motion mode:
 * - marks the current section's links (section dots and the Sections menu) with
 *   aria-current: the last section whose top has passed the middle of the screen;
 * - fills the reading progress bar under the header;
 * - closes the Sections menu after a jump, on Escape, or on a click outside it.
 * Returns a cleanup function.
 */
export function startSectionNav(): () => void {
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>("a[data-dot]"));
  const ids = [...new Set(links.map((a) => a.dataset.dot ?? ""))];
  const targets = ids.map((id) => document.getElementById(id));
  const bar = document.querySelector<HTMLElement>("[data-read]");
  const menu = document.querySelector<HTMLDetailsElement>("details[data-toc]");

  let raf = 0;
  let last = "";
  const update = () => {
    raf = 0;
    const root = document.documentElement;
    const max = root.scrollHeight - window.innerHeight;
    if (bar) bar.style.transform = `scaleX(${max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)).toFixed(4) : 0})`;

    const mid = window.innerHeight * 0.5;
    let current = ids[0] ?? "";
    targets.forEach((el, i) => {
      if (el && el.getBoundingClientRect().top <= mid) current = ids[i];
    });
    if (current === last) return;
    last = current;
    for (const a of links) {
      if (a.dataset.dot === current) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    }
  };
  const schedule = () => {
    if (!raf) raf = requestAnimationFrame(update);
  };

  const close = (focus: boolean) => {
    if (!menu?.open) return;
    menu.open = false;
    if (focus) menu.querySelector("summary")?.focus();
  };
  const onMenuClick = (e: Event) => {
    if ((e.target as Element).closest("a")) close(false);
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") close(true);
  };
  const onDocClick = (e: Event) => {
    if (menu && !menu.contains(e.target as Node)) close(false);
  };

  update();
  addEventListener("scroll", schedule, { passive: true });
  addEventListener("resize", schedule);
  menu?.addEventListener("click", onMenuClick);
  document.addEventListener("keydown", onKey);
  document.addEventListener("click", onDocClick);
  return () => {
    removeEventListener("scroll", schedule);
    removeEventListener("resize", schedule);
    menu?.removeEventListener("click", onMenuClick);
    document.removeEventListener("keydown", onKey);
    document.removeEventListener("click", onDocClick);
    cancelAnimationFrame(raf);
  };
}
