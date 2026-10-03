# Devan · personal portfolio

A scroll-driven portfolio for Devan (Tuan Tran), Strategic Account Executive at Cốc Cốc Ad Platform in Hanoi. The hero is a living particle portrait: thousands of particles assemble into Devan's photo and then follow your cursor with depth parallax, leading eyes and idle blinks. Built by vibe coding with Claude Code.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # static export to out/
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

## Preview without deploying

`npm run preview:build` writes `preview/`: one HTML fragment, `site.css`, a single `app.js` (esbuild, no React runtime) and the assets, all with relative paths. It runs the same stage and scroll code as the site (`src/stage/boot.ts`, `src/stage/scroll-scenes.ts`) and is what the private claude.ai preview is published from.

## Deploy

Static export, no server code. Vercel picks up `vercel.json`; Cloudflare Pages uses `public/_headers` (build command `npm run build`, output `out`). Set `NEXT_PUBLIC_SITE_URL` to the production URL so canonical and Open Graph links are absolute.

## How it is built

| Path | What it does |
| --- | --- |
| `src/content/site.ts` | All copy. Facts only from the owner's LinkedIn and notes. |
| `src/app/page.tsx` | The seven scenes as semantic HTML. Works without JavaScript. |
| `src/app/layout.tsx` | Metadata, JSON-LD, and the inline boot script that picks motion and WebGL mode before first paint. |
| `src/stage/boot.ts`, `src/components/Stage.tsx` | Load the WebGL engine only on capable devices, after the page is idle. |
| `src/stage/scroll-scenes.ts`, `src/components/ScrollScenes.tsx` | DOM half of the scroll timeline: typed search query, bio lines, active funnel stage and step. |
| `src/stage/engine.ts` | three.js renderer, render loop, input, intro, adaptive quality, pause when hidden. |
| `src/stage/timeline.ts` | One shared timeline: each `data-scene` section maps scroll position to a particle shape and a morph. |
| `src/stage/gaze.ts` | Eyes ease faster than the head; idle sway, glances and blinks. Reads `character.config.json`. |
| `src/stage/shapes.ts` | Particle targets: cloud, portrait, rails, browser window, funnel, `>_` prompt. |
| `src/stage/particles.ts` | GPU-only particle shader: shape morphs, and on the portrait the depth parallax, iris shift and blink (eye particles sample the photo). Portrait particles paint over each other; other shapes add light. |
| `src/stage/trails.ts`, `cage.ts` | Cursor trails that keep off the face; wireframe cages. |
| `character.config.json` | Single source of truth for the portrait: crops, landmarks, tracking, idle life, particles. |
| `scripts/prepare_portrait.py` | Rebuilds `public/portrait/depthmask-*.png` (R = depth, G = mask). |
| `scripts/particle_poster.py` | Pre-renders the static particle portraits and blur-up posters with the same sampling and grade as the shader. |
| `scripts/render-og.mjs` | Renders `public/og.jpg` from the static hero. |

Scene flow: particle portrait → rails → browser window (About) → rails → funnel (Ad solutions) → rails with four stations (How I work) → `>_` prompt (Built with AI) → ambient cloud (Skills) → particle portrait (Contact).

Fallbacks: reduced motion, no WebGL, software WebGL, low memory or Save-Data all get the same static layout with SVG drawings and a pre-rendered particle portrait. No content lives only in WebGL.

## Checks run

- axe-core: 0 violations (static desktop, reduced-motion mobile)
- Lighthouse with brotli (as on Vercel or Cloudflare), mobile: Performance 98, Accessibility 100, Best Practices 100, SEO 100. Desktop: 100, 100, 100, 100. Software-rendered WebGL (as in Lighthouse) gets the static layout; real GPUs get the full stage.
- No horizontal scroll at 390px; layouts checked at 390x844 and 1440x900.

## Credits

Fonts: Bricolage Grotesque and Be Vietnam Pro (SIL Open Font License, self-hosted in `public/fonts`). Portrait: the owner's own photo. Technique ideas (depth-map parallax, scene timelines) were learned from public references listed in `docs/research-references.md`; no code, shaders, layout or assets were copied.
