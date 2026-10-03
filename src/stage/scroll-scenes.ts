/**
 * DOM half of the scroll timeline. Reads the same section ranges as the WebGL
 * stage and writes revealed lines and the active step back to the DOM.
 * With reduced motion it does nothing, and every line stays visible.
 * Returns a cleanup function.
 */
export function startScrollScenes(): () => void {
  const root = document.documentElement;
  if (root.dataset.motion !== "full") return () => {};
  root.dataset.scenes = "on";

  const about = document.querySelector<HTMLElement>("[data-scene='browser']");
  const lines = about ? Array.from(about.querySelectorAll<HTMLElement>("[data-line]")) : [];
  const typed = about?.querySelector<HTMLElement>("[data-typed]");
  const query = typed?.dataset.typed ?? "";
  const stepped = Array.from(document.querySelectorAll<HTMLElement>("[data-steps]"));

  let raf = 0;
  const update = () => {
    raf = 0;
    const vh = window.innerHeight;
    const mid = vh * 0.5;

    if (about) {
      const r = about.getBoundingClientRect();
      const span = Math.max(1, r.height - vh);
      const p = Math.min(1, Math.max(0, -r.top / span));
      if (typed) {
        const n = Math.round(Math.min(1, Math.max(0, (p + 0.02) / 0.12)) * query.length);
        if (typed.textContent !== query.slice(0, n)) typed.textContent = query.slice(0, n);
      }
      lines.forEach((li, i) => {
        const on = p >= 0.1 + i * 0.13;
        if (li.classList.contains("is-on") !== on) li.classList.toggle("is-on", on);
      });
    }

    const narrow = window.innerWidth < 900;
    for (const section of stepped) {
      const sr = section.getBoundingClientRect();
      let active = -1;
      // On phones a sticky panel covers the top of the screen, so read lower down.
      const focus = narrow && section.dataset.focusMobile ? Number(section.dataset.focusMobile) * vh : mid;
      if (sr.top < vh * 0.75 && sr.bottom > vh * 0.25) {
        const items = section.querySelectorAll<HTMLElement>("[data-step]");
        let best = Infinity;
        items.forEach((item, i) => {
          const ir = item.getBoundingClientRect();
          const d = Math.abs(ir.top + ir.height / 2 - focus);
          if (d < best) {
            best = d;
            active = i;
          }
        });
        items.forEach((item, i) => item.classList.toggle("is-active", i === active));
      }
      const next = active < 0 ? "" : String(active);
      if (section.dataset.active !== next) section.dataset.active = next;
      // Illustration panels follow the step; the first one shows before any step is reached.
      const mocks = section.querySelectorAll<HTMLElement>("[data-mock]");
      mocks.forEach((m, i) => {
        const on = i === Math.max(0, active);
        if (m.classList.contains("is-on") !== on) m.classList.toggle("is-on", on);
      });
    }
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
    delete root.dataset.scenes;
    lines.forEach((li) => li.classList.remove("is-on"));
    if (typed) typed.textContent = query;
  };
}
