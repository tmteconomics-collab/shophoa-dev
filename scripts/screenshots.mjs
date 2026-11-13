// Screenshots of the built site for review: every section of the home page and a
// role version, plus the CV, on a phone and a desktop viewport. Reduced motion is
// on, so the static layout is captured and runs are repeatable (CI has no GPU).
// Usage: npm run build && npm run screenshots   (writes screenshots/, git-ignored)
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const root = path.resolve("out");
const dest = path.resolve("screenshots");
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
};

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (p.endsWith("/")) p += "index.html";
  const file = path.join(root, p);
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { "Content-Type": types[path.extname(file)] ?? "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const base = `http://127.0.0.1:${server.address().port}`;

const viewports = [
  { name: "phone", width: 390, height: 844, isMobile: true, hasTouch: true },
  { name: "desktop", width: 1440, height: 900, isMobile: false, hasTouch: false },
];
const pages = [
  { name: "home", path: "/", sections: true },
  { name: "for-performance-marketing", path: "/for/performance-marketing/", sections: true },
  { name: "cv", path: "/cv/", sections: false },
];
// Fixed chrome would cover the top of every section shot.
const hideChrome = ".site-header,.dots,.skip-link,canvas.stage{visibility:hidden!important}";

fs.rmSync(dest, { recursive: true, force: true });
const browser = await chromium.launch();
let count = 0;
for (const vp of viewports) {
  const { name, ...size } = vp;
  const context = await browser.newContext({
    viewport: { width: size.width, height: size.height },
    isMobile: size.isMobile,
    hasTouch: size.hasTouch,
    reducedMotion: "reduce",
  });
  for (const pg of pages) {
    const page = await context.newPage();
    await page.goto(base + pg.path, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const dir = path.join(dest, name, pg.name);
    fs.mkdirSync(dir, { recursive: true });
    const shot = async (file, target) => {
      const opts = { path: path.join(dir, file), type: "jpeg", quality: 75 };
      if (target) await target.screenshot(opts);
      else await page.screenshot(opts);
      count++;
    };
    if (!pg.sections) {
      await page.screenshot({ path: path.join(dir, "page.jpg"), type: "jpeg", quality: 75, fullPage: true });
      count++;
      await page.close();
      continue;
    }
    await shot("00-first-screen.jpg");
    await page.addStyleTag({ content: hideChrome });
    // The first screen already shows the hero, with the header.
    const sections = await page.$$("main > section:not(#top)");
    for (const [i, el] of sections.entries()) {
      const id = (await el.getAttribute("id")) ?? `section-${i + 1}`;
      await el.scrollIntoViewIfNeeded();
      await page.waitForFunction((s) => [...s.querySelectorAll("img")].every((img) => img.complete), el, {
        timeout: 5000,
      });
      await shot(`${String(i + 1).padStart(2, "0")}-${id}.jpg`, el);
    }
    await page.close();
  }
  await context.close();
}
await browser.close();
server.close();
console.log(`screenshots: ${count} images in ${path.relative(process.cwd(), dest)}/`);
