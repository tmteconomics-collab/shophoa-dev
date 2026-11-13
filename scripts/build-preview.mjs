// Build a standalone preview from the static export: one HTML fragment, one CSS
// file, one JS bundle and the assets, all with relative paths. Used to publish a
// private preview page; the real deploy is the Next.js export in out/.
// Usage: npm run build && node scripts/build-preview.mjs [outDir]
import { build } from "esbuild";
import fs from "node:fs";
import path from "node:path";

const src = "out";
const dst = process.argv[2] ?? "preview";
fs.rmSync(dst, { recursive: true, force: true });
fs.mkdirSync(dst, { recursive: true });

const html = fs.readFileSync(path.join(src, "index.html"), "utf8");

// The pre-paint boot script (decides WebGL and motion mode).
const boot = html.match(/<script>(\(function\(\)\{var d=document\.documentElement;[\s\S]*?)<\/script>/)?.[1];
if (!boot) throw new Error("boot script not found");

// Stylesheets, with root-relative asset URLs made relative.
const cssFiles = [...html.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map((m) => m[1]);
let css = cssFiles.map((href) => fs.readFileSync(path.join(src, href), "utf8")).join("\n");
css = css.replace(/url\((["']?)\/(fonts|portrait)\//g, "url($1$2/");
fs.writeFileSync(path.join(dst, "site.css"), css);

// Page markup without the framework scripts.
let body = html.slice(html.indexOf("<body>") + 6, html.lastIndexOf("</body>"));
body = body.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "");
body = body.replace(/(src|srcSet|srcset|href)="\/(portrait|fonts)\//g, '$1="$2/');
body = body.replace('data-assets="/"', 'data-assets=""');

const page = `<title>Devan Portfolio</title>
<link rel="stylesheet" href="site.css">
<link rel="preload" href="fonts/bricolage-grotesque-latin-wdth-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="fonts/be-vietnam-pro-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<script>${boot}</script>
${body}
<script src="app.js"></script>
`;
fs.writeFileSync(path.join(dst, "index.html"), page);

await build({
  entryPoints: ["scripts/static-entry.ts"],
  bundle: true,
  minify: true,
  format: "iife",
  target: "es2020",
  outfile: path.join(dst, "app.js"),
  legalComments: "none",
  logLevel: "warning",
});

// Assets the page and the stage load.
for (const dir of ["fonts", "portrait"]) {
  fs.mkdirSync(path.join(dst, dir), { recursive: true });
  for (const f of fs.readdirSync(path.join("public", dir))) {
    if (/\.(woff2|webp|png)$/.test(f)) fs.copyFileSync(path.join("public", dir, f), path.join(dst, dir, f));
  }
}
const files = fs.readdirSync(dst, { recursive: true }).filter((f) => fs.statSync(path.join(dst, f)).isFile());
console.log(`preview: ${files.length} files in ${dst}`);
