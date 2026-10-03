// Entry for the standalone preview bundle (scripts/build-preview.mjs): the same
// stage and scroll logic as the Next.js site, without the React runtime.
import { bootStage } from "../src/stage/boot";
import { startScrollScenes } from "../src/stage/scroll-scenes";
import { bindMotionToggle } from "../src/stage/motion-toggle";
import { startSectionDots } from "../src/stage/section-dots";

startScrollScenes();
startSectionDots();
const toggle = document.querySelector<HTMLButtonElement>("[data-motion-toggle]");
if (toggle) bindMotionToggle(toggle);
const canvas = document.querySelector<HTMLCanvasElement>("canvas.stage");
if (canvas) bootStage(canvas);
