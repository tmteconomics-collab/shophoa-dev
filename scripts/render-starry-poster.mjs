// Render the static hero (public/portrait/starry-*.webp) from the live WebGL painting,
// so visitors without WebGL or with reduced motion see the same scene, standing still.
// Usage: npm run build && npx serve out -l 4173 & node scripts/render-starry-poster.mjs
// Needs Playwright with Chromium (npx playwright install chromium) and Python Pillow
// for the WebP conversion.
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";

const base = process.env.BASE_URL ?? "http://localhost:4173";
const sizes = { desktop: [1800, 1200], mobile: [1100, 1375] };
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
  args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
});
for (const [name, [w, h]] of Object.entries(sizes)) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await page.goto(`${base}/?gl=force&fixed&nointro`, { waitUntil: "load" });
  await page.waitForFunction(() => document.documentElement.dataset.gl === "on", null, { timeout: 30000 });
  await page.addStyleTag({ content: ".site-header,main,.site-footer,.skip-link{visibility:hidden!important}" });
  await page.waitForTimeout(6000);
  const png = `public/portrait/starry-${name}.png`;
  await page.screenshot({ path: png });
  await page.close();
  execFileSync("python3", [
    "-c",
    // Downscale and soften slightly: the strokes survive, the file stays near 100-220 KB.
    `from PIL import Image, ImageFilter; import os
im = Image.open("${png}").convert("RGB")
small = im.resize((1500, 1000) if "${name}" == "desktop" else (900, 1125), Image.LANCZOS)
small.filter(ImageFilter.GaussianBlur(0.9)).save("public/portrait/starry-${name}.webp", quality=55, method=6)
im.resize((48, 32) if "${name}" == "desktop" else (40, 50), Image.LANCZOS).save("public/portrait/poster-${name}.webp", quality=60)
os.remove("${png}")`,
  ]);
  console.log("wrote", name);
}
await browser.close();
