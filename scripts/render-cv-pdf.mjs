// Render public/devan-cv.pdf (A4) from the /cv/ page of a built site.
// Usage: npm run build && npx serve out -l 4173 & node scripts/render-cv-pdf.mjs
// Build with NEXT_PUBLIC_SITE_URL set so the PDF carries the site address.
// Needs Playwright with a Chromium build (npx playwright install chromium).
import { chromium } from "playwright";

const base = process.env.BASE_URL ?? "http://localhost:4173";
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(`${base}/cv/`, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.emulateMedia({ media: "print" });
await page.pdf({ path: "public/devan-cv.pdf", preferCSSPageSize: true, printBackground: true });
await browser.close();
