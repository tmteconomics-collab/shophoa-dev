// Render public/og.jpg (1200x630) from the static hero (the still of the Starry Night painting).
// Usage: npm run build && npx serve out -l 4173 & node scripts/render-og.mjs
// Needs Playwright with a Chromium build (npx playwright install chromium).
import { chromium } from "playwright";

const base = process.env.BASE_URL ?? "http://localhost:4173";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto(`${base}/?static`, { waitUntil: "networkidle" });
await page.addStyleTag({
  content:
    ".site-header,.skip-intro,.cta-row,.dots{display:none!important}" +
    ".hero{min-height:0!important;height:630px!important}.hero-inner{padding-bottom:56px!important}",
});
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: "public/og.jpg", type: "jpeg", quality: 86 });
await browser.close();
