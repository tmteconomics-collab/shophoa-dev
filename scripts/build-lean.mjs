// Lean production build: takes the Next.js static export in out/ and swaps the
// React runtime for one small framework-free bundle (scripts/static-entry.ts).
// The HTML stays exactly what Next.js rendered, so content never drifts between
// the two builds; only the framework scripts and the RSC payload are removed.
// three.js stays a separate chunk that loads only on WebGL-capable devices.
// Usage: next build && node scripts/build-lean.mjs   (npm run build:lean)
import { build } from "esbuild";
import fs from "node:fs";
import path from "node:path";

const out = "out";
const leanDir = path.join(out, "_lean");
fs.rmSync(leanDir, { recursive: true, force: true });

const result = await build({
  entryPoints: { app: "scripts/static-entry.ts" },
  bundle: true,
  minify: true,
  splitting: true,
  format: "esm",
  target: "es2020",
  outdir: leanDir,
  entryNames: "[name]-[hash]",
  chunkNames: "chunk-[hash]",
  legalComments: "none",
  metafile: true,
  logLevel: "warning",
});
const entry = Object.entries(result.metafile.outputs).find(([, o]) => o.entryPoint)?.[0];
if (!entry) throw new Error("lean entry not found");
const entryUrl = "/" + path.relative(out, entry).split(path.sep).join("/");

const isFrameworkScript = (attrs, body) => /\bsrc="\/_next\//.test(attrs) || /self\.__next_f|\$RC|\$RS|\$RT/.test(body);

function lean(html) {
  // Scripts: keep the pre-paint boot script and JSON-LD, drop the framework.
  html = html.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/g, (m, attrs, body) =>
    isFrameworkScript(attrs, body) ? "" : m,
  );
  // Preloads of framework chunks.
  html = html.replace(/<link\b[^>]*\bas="script"[^>]*\/?>/g, "");
  html = html.replace(/<link\b[^>]*rel="modulepreload"[^>]*\/?>/g, "");
  // Duplicate font preloads (one from React's resource hoisting, one from the layout).
  const seen = new Set();
  html = html.replace(/<link\b[^>]*rel="preload"[^>]*href="([^"]+)"[^>]*\/?>/g, (m, href) => {
    if (seen.has(href)) return "";
    seen.add(href);
    return m;
  });
  if (/\/_next\/static\/chunks\/[^"]+\.js/.test(html)) throw new Error("framework script left behind");
  return html.replace("</head>", `<script type="module" src="${entryUrl}"></script></head>`);
}

let pages = 0;
let before = 0;
let after = 0;
for (const f of fs.readdirSync(out, { recursive: true })) {
  const file = path.join(out, f);
  if (!file.endsWith(".html") || f.startsWith("_next") || f.startsWith("_lean")) continue;
  const html = fs.readFileSync(file, "utf8");
  const next = lean(html);
  fs.writeFileSync(file, next);
  pages++;
  before += html.length;
  after += next.length;
}

// Framework chunks and RSC payloads are no longer referenced (the CSS stays).
const chunks = path.join(out, "_next", "static", "chunks");
for (const f of fs.readdirSync(chunks)) if (f.endsWith(".js")) fs.rmSync(path.join(chunks, f));
for (const f of fs.readdirSync(out, { recursive: true })) {
  const name = path.basename(f);
  if (name === "index.txt" || (name.startsWith("__next.") && name.endsWith(".txt"))) fs.rmSync(path.join(out, f));
}

const js = Object.entries(result.metafile.outputs)
  .filter(([f]) => f.endsWith(".js"))
  .map(([f, o]) => `${path.basename(f)} ${(o.bytes / 1024).toFixed(1)} KB`);
console.log(
  `lean: ${pages} pages, HTML ${(before / 1024).toFixed(0)} KB -> ${(after / 1024).toFixed(0)} KB; JS: ${js.join(", ")}`,
);
