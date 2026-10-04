# Devan · personal portfolio

A scroll-driven portfolio for Devan (Tuan Tran), Strategic Account Executive at Cốc Cốc Ad Platform in Hanoi. The hero is a living particle painting: thousands of particles assemble into a night sky after Van Gogh's *The Starry Night* (1889, public domain) and keep moving like brushstrokes, layered in depth so the scene shifts with your cursor. The Contact section closes with Devan's particle portrait, which follows your cursor with leading eyes and idle blinks. Built by vibe coding with Claude Code.

Owner guides (Vietnamese): [how to update the site](docs/huong-dan-cap-nhat.md) and [checklists](docs/checklist.md) for quarterly reviews, job applications and real-device tests.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # static export to out/, lean (no React runtime in the browser)
npm run build:next   # plain Next.js export, with the React runtime
npx serve out        # preview the export
```

Testing switches (query string):

| Param | Effect |
| --- | --- |
| `?static` | Force the static layout (what reduced-motion, low-power and no-WebGL visitors see) |
| `?nointro` | Skip the particle opening |
| `?count=30000` | Override the particle budget |
| `?fixed` | Turn off the automatic quality drop (for screenshots on slow machines) |
| `?gl=force` | Keep WebGL on software renderers (SwiftShader, llvmpipe), which normally get the static layout |

## Checks before you push

```bash
npm run lint           # ESLint (Next.js rules) and TypeScript
npm run format:check   # Prettier (npm run format to fix)
npm run build          # lean export to out/
npm run screenshots    # every section on a phone and a desktop, into screenshots/
```

GitHub Actions (`.github/workflows/ci.yml`) runs the same on every pull request and on `main`, then checks the export (no framework scripts left, role versions are noindex, no email address anywhere) and runs Lighthouse CI against `lighthouserc.json`: Accessibility 100, Best Practices and SEO 95 or more, Performance 85 or more on a mobile profile, CLS under 0.05, TBT under 300 ms. Reports are kept as a build artifact, not uploaded anywhere public. It also saves screenshots of every section of the home page and a role version, and of the CV, on a 390px phone and a 1440px desktop (`scripts/screenshots.mjs`, reduced motion so runs are repeatable), as a `screenshots` artifact kept for 14 days: open the run on GitHub to review a change without deploying it.

## Lean build

`npm run build` runs `next build`, then `scripts/build-lean.mjs` swaps the React runtime in every exported page for one small bundle (`scripts/static-entry.ts`, about 7 KB; three.js stays a lazy chunk for WebGL devices only). The HTML is exactly what Next.js rendered, so content cannot drift. Lighthouse mobile, home page: Performance 95 to 99 lean against 79 to 89 with the React runtime; desktop 100.

Rule that keeps this working: interactive behaviour lives in plain TypeScript (`src/stage/`, `src/tools/`) bound to the markup, and is started from `scripts/static-entry.ts`. React client components are only thin wrappers that call the same functions, so `npm run dev` and `npm run build:next` behave the same.

## Preview without deploying

`npm run preview:build` writes `preview/`: one HTML fragment, `site.css`, a single `app.js` (esbuild, no React runtime) and the assets, all with relative paths. It runs the same entry as the lean build (`scripts/static-entry.ts`) and is what the private claude.ai preview is published from.

## Deploy

Static export, no server code. Vercel picks up `vercel.json`; Cloudflare Pages uses `public/_headers` (build command `npm run build`, output `out`). Both get the lean build. Canonical, Open Graph and sitemap links use `NEXT_PUBLIC_SITE_URL` when set (custom domain); otherwise the address Vercel (`VERCEL_PROJECT_PRODUCTION_URL`) or Cloudflare Pages (`CF_PAGES_URL`) gives the build. `robots.txt`, `sitemap.xml` (pages listed in `src/content/routes.ts`) and a custom 404 are generated.

## How it is built

| Path | What it does |
| --- | --- |
| `src/content/site.ts` | All copy. Facts only from the owner's LinkedIn and notes. |
| `src/components/Portfolio.tsx`, `src/app/page.tsx` | The one-page portfolio as semantic HTML. Works without JavaScript. |
| `src/content/roles.ts`, `src/app/for/[role]/page.tsx` | Role versions to send with job applications: `/for/account-management/`, `/for/performance-marketing/`, `/for/web/`. Same facts, a different opening line and section order. Noindex, not in the sitemap. |
| `src/app/cv/page.tsx`, `public/devan-cv.pdf` | Print-ready one-page A4 CV built from `cv` and `credentials` in `src/content/site.ts`. |
| `src/components/Summary.tsx`, `SectionDots.tsx`, `SectionMenu.tsx` | Quick-read path: one card with the whole profile after the hero, section dots on wide screens, a Sections menu in the header on smaller ones, and a reading progress bar under the header. The section list is in `src/content/sections.ts`; `src/stage/section-nav.ts` marks the current section and fills the bar. |
| `src/components/Tools.tsx`, `src/tools/` | Two tools visitors can use: a UTM link builder and a CPM/CPC/CPD budget estimator. Plain TypeScript bound to static markup, so they also run in the preview bundle. No rates built in, nothing sent anywhere. |
| `src/components/Proof.tsx` | Results, testimonials and work samples. Hidden until a list in `proof` (`src/content/site.ts`) has an entry. Certifications take an optional issuer, year and verification link. |
| `src/components/mocks/` | Animated illustration panels for the measurement (Tag Manager, GA4, Google Ads) and WordPress (templates, page editor, WooCommerce store, responsive preview, speed and SEO) sections. Drawn from scratch, sample data, CSS-only motion that stops under reduced motion. |
| `src/app/layout.tsx` | Metadata, JSON-LD, and the inline boot script that picks motion and WebGL mode before first paint. |
| `src/stage/boot.ts`, `src/components/Stage.tsx` | Load the WebGL engine only on capable devices, after the page is idle. |
| `src/stage/scroll-scenes.ts`, `src/components/ScrollScenes.tsx` | DOM half of the scroll timeline: typed search query, bio lines, active funnel stage and step. |
| `src/stage/motion-toggle.ts`, `src/components/MotionToggle.tsx` | Header Pause motion button (WCAG 2.2.2): freezes the stage clock and all CSS animation, remembered per visitor. |
| `src/stage/engine.ts` | three.js renderer, render loop, input, intro, adaptive quality, pause when hidden. |
| `src/stage/timeline.ts` | One shared timeline: each `data-scene` section maps scroll position to a particle shape and a morph. |
| `src/stage/gaze.ts` | Eyes ease faster than the head; idle sway, glances and blinks. Reads `character.config.json`. |
| `src/stage/starry.ts` | The hero painting: layouts for wide and tall screens, particle families (sky, spirals, halos, moon, wind band, cypress, hills, village) and the GLSL that moves them. Drawn from scratch, nothing traced. |
| `src/stage/shapes.ts` | Particle targets: cloud, portrait, rails, browser window, funnel, `>_` prompt, painting, 3D bar chart, page blocks. |
| `src/stage/particles.ts` | GPU-only particle shader: shape morphs, and on the portrait the depth parallax, iris shift and blink (eye particles sample the photo). Portrait particles paint over each other; other shapes add light. |
| `src/stage/trails.ts`, `cage.ts` | Cursor trails that keep off the face; wireframe cages. |
| `character.config.json` | Single source of truth for the portrait: crops, landmarks, tracking, idle life, particles. |
| `scripts/prepare_portrait.py` | Rebuilds `public/portrait/depthmask-*.png` (R = depth, G = mask). |
| `scripts/render-starry-poster.mjs` | Renders the static hero painting and blur-up posters from the live stage. |
| `scripts/particle_poster.py` | Pre-renders the static particle portrait for Contact with the same sampling and grade as the shader. |
| `scripts/build-lean.mjs`, `scripts/static-entry.ts` | Lean build (see above). The same entry runs the preview bundle. |
| `scripts/screenshots.mjs` | Section-by-section screenshots of the built site (local or CI). |
| `scripts/render-og.mjs` | Renders `public/og.jpg` from the static hero. |
| `scripts/render-cv-pdf.mjs` | Renders `public/devan-cv.pdf` from `/cv/`. Rerun after any CV change, with `NEXT_PUBLIC_SITE_URL` set so the PDF prints the site address. |

Scene flow: Starry Night painting → rails → browser window (About) → rails → funnel (Ad solutions) → rails with four stations (How I work) → 3D bar chart behind the dashboard panels (Measurement) → page blocks behind the editor panels (WordPress) → `>_` prompt (Built with AI) → ambient cloud (Skills) → particle portrait that looks at you (Contact).

Fallbacks: reduced motion, no WebGL, software WebGL, low memory or Save-Data all get the same static layout with SVG drawings, a still of the painting and a pre-rendered particle portrait. No content lives only in WebGL.

## Checks run

- axe-core: 0 violations (static desktop, reduced-motion mobile)
- Lighthouse with brotli (as on Vercel or Cloudflare), lean build, mobile: Performance 95 to 99, Accessibility 100, Best Practices 100, SEO 100. Desktop: 100, 100, 100, 100 (home and CV). Role versions score lower on SEO by design (noindex). Software-rendered WebGL (as in Lighthouse) gets the static layout; real GPUs get the full stage.
- No horizontal scroll at 390px; layouts checked at 390x844 and 1440x900.

## Credits

Fonts: Bricolage Grotesque and Be Vietnam Pro (SIL Open Font License, self-hosted in `public/fonts`). Portrait: the owner's own photo. Technique ideas (depth-map parallax, scene timelines) were learned from public references listed in `docs/research-references.md`; no code, shaders, layout or assets were copied.
