// Render the CV PDFs (A4) from the built site: public/devan-cv.pdf from /cv/
// (English) and public/devan-cv-vi.pdf from /vi/cv/ (Vietnamese).
// Usage: npm run build && npx serve out -l 4173 & node scripts/render-cv-pdf.mjs
// Build with NEXT_PUBLIC_SITE_URL set so the PDF carries the site address.
// Needs Playwright with a Chromium build (npx playwright install chromium).
import { chromium } from "playwright";

const base = process.env.BASE_URL ?? "http://localhost:4173";
const targets = [
  { path: "/cv/", out: "public/devan-cv.pdf" },
  { path: "/vi/cv/", out: "public/devan-cv-vi.pdf" },
];

// CHROME_PATH lets a CI or container point at a preinstalled Chromium; without
// it Playwright uses its own downloaded browser (npx playwright install chromium).
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
  args: ["--no-sandbox"],
});
const page = await browser.newPage();
for (const { path, out } of targets) {
  await page.goto(`${base}${path}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.emulateMedia({ media: "print" });
  await page.pdf({ path: out, preferCSSPageSize: true, printBackground: true });
  console.log(`rendered ${out} from ${path}`);
}
await browser.close();
