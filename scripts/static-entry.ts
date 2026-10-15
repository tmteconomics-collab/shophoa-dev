// Framework-free entry: the same stage, scroll, dots, tools and buttons as the
// Next.js site, bound to the exported HTML without the React runtime. Used by the
// lean build (scripts/build-lean.mjs) and the preview bundle (scripts/build-preview.mjs).
import { bootStage } from "../src/stage/boot";
import { startScrollScenes } from "../src/stage/scroll-scenes";
import { bindMotionToggle } from "../src/stage/motion-toggle";
import { startSectionNav } from "../src/stage/section-nav";
import { bindTools } from "../src/tools";

startScrollScenes();
startSectionNav();
bindTools();
const toggle = document.querySelector<HTMLButtonElement>("[data-motion-toggle]");
if (toggle) bindMotionToggle(toggle);
document
  .querySelectorAll<HTMLButtonElement>("[data-print]")
  .forEach((b) => b.addEventListener("click", () => window.print()));
const canvas = document.querySelector<HTMLCanvasElement>("canvas.stage");
if (canvas) bootStage(canvas);
