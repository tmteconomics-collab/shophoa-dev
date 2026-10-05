# Devan portfolio: notes for Claude Code

The full original brief is in `docs/original-brief.md`. This file records what was decided and how the code is laid out. Read `README.md` for the file map.

## Decisions made by the owner
- Display name: **Devan** (LinkedIn name Tuan Tran appears only in JSON-LD `alternateName`).
- Palette: **Cobalt & sun**. Night `#070b3a`, cobalt `#2b35f5`, soft `#8c93ff`, sun `#ffd23f`, ink `#f2f3ff`. Tokens live in `src/app/globals.css` and `src/stage/palette.ts`; keep them in sync.
- Contact: **LinkedIn only**. Do not put the email address on the site.
- Vibe coding: **both the Claude app and Claude Code**. This site was built with Claude Code.
- Dark theme only (particles need the dark stage). Revisit only if the owner asks.
- Hero: a **particle painting after Van Gogh's The Starry Night** (owner request, 2026-10-03), not the owner's photo. Built procedurally in `src/stage/starry.ts`; never trace or copy a reproduction of the painting (the owner's reference was a photo of a 3D print, used for mood only). A small credit line names the painting.
- Portrait: the particle portrait (gaze, blinks) lives in Contact. The 1:1 photo looked soft on 2x screens, so it is never shown; it is only a texture for particle colours and the eyes.
- Static stills: `public/portrait/starry-*.webp` (hero, from `scripts/render-starry-poster.mjs`) and `particles-*.webp` (Contact, from `scripts/particle_poster.py`).

- Sections added on request (2026-10-03): **Measurement and performance marketing** (Google Tag Manager, GA4, Google Ads) and **Websites on WordPress**. Their panels are illustrations in the site's style: no product screenshots or logos, every figure labelled sample data and kept internally consistent (campaign rows add up to the report scorecards).

## Decisions delegated to Claude (2026-10-03)
- Positioning line: the hero lead names all three pillars (Cốc Cốc ads, Google measurement, WordPress builds), since the owner added the last two on 2026-10-03.
- Platform reach: "tens of millions of users" (public figures range 22–30 million by year); no "decade" claim.
- CPD on Cốc Cốc = cost per duration (fixed price for a placement over a set time).
- Certifications listed by name only. MBA research focus not shown. No extra vibe-coding projects: the site is the project.
- Built with AI lesson line written from how this site was made; the owner can edit it in `src/content/site.ts`.
- WooCommerce confirmed by the owner (2026-10-03): the WordPress section has an Online store step.
- The owner does not use Looker Studio (2026-10-04): no report step, no Looker Studio anywhere. The owner chose not to say whether he builds with the block editor or a page builder, so the WordPress copy and panels stay tool-neutral (no "site editor", "patterns", "global styles").
- Funnel mapping: new-tab banner and CPM under Awareness; search, native, targeting under Consideration; shopping, retargeting, CPC and CPD under Conversion.

- Quick-read path: a "The short version" card after the hero (`summary` in `src/content/site.ts`), section dots on wide screens, a Sections menu in the header up to 1000px, and a reading progress bar under the header. One section list feeds both (`src/content/sections.ts`); `src/stage/section-nav.ts` marks the current section. Keep that list in step with the section ids.
- Job-hunting kit: a one-page A4 CV at `/cv/` with `public/devan-cv.pdf` rendered from it (`scripts/render-cv-pdf.mjs`; keep the PDF in sync whenever CV facts change), and role versions at `/for/<slug>/` (`src/content/roles.ts`): same facts, own hero line and section order, noindex. The CV shows "Devan" only and no email, like the site.
- Proof slots (`proof` in `src/content/site.ts`): results, testimonials and work samples stay empty until the owner supplies them; the section is hidden while empty. Testimonials only with the person's written permission. Certifications can take issuer, year and a verification link.
- Tools section: UTM builder and budget estimator. They never ship platform prices; every rate comes from the visitor.
- Devices (2026-10-04): checked from 320px phones to 2560px screens. The header turns solid once the hero painting has scrolled past it (`data-scrolled`); phones get shorter vh gaps, near-solid panels without backdrop blur (except the short-version card, which keeps its frosted glass over the dissolving painting), and the tool forms folded behind a button; short screens (small phones, phones held sideways) show one illustration per section instead of the pinned panel; screens from 1800px scale the type. Re-run the device sweep after layout changes.
- Phone smoothness (2026-10-05): the hero painting is the stage's heaviest scene (fill rate), so phones start at pixel ratio 1.25 and adaptive quality lowers the pixel ratio before the particle count (values in `character.config.json`, `performance`). The stage canvas is sized to the large viewport (`100lvh`) and only resizes when its CSS size changes, so a phone's address bar never reallocates it. On phones no glass layer blurs the stage except the short-version card. Startup work is split with pauses between steps, and shaders compile in the background where the browser allows.

## Content rules
- English only, sentence case, plain verbs, no hype.
- Facts come only from the brief or the owner. No invented metrics, clients, quotes or projects.
- No client names or logos, no case studies.
- Unconfirmed items are marked `TODO:` in `src/content/site.ts`. Empty `ai.lesson` stays hidden.

## Technical rules
- Static export (`output: "export"`). No server code, no tracking scripts.
- `npm run build` is the lean build: `scripts/build-lean.mjs` strips the React runtime from the export and loads `scripts/static-entry.ts`. Any interactive behaviour must live in plain TypeScript bound to the markup and be started from `static-entry.ts`; React client components only wrap those functions. A new `onClick` in React alone will not work in production.
- WebGL is decided before first paint by the boot script in `src/app/layout.tsx` (`data-gl`, `data-motion`, `data-intro` on `<html>`). Every scene must stay fully readable with `data-gl="off"`.
- Character behaviour numbers come from `character.config.json`; do not hard-code them in the shaders.
- The painting has two layouts (wide and tall) in `src/stage/starry.ts`; keep the hero text area (bottom left on wide screens, bottom half on tall ones) free of bright features.
- Particle shapes are blended on the GPU; per-frame CPU work is uniforms only. Values that depend only on a particle's place (the sky's flow direction and warm tint, `starryFlowField`) are computed once on the CPU and again only when the hero's shape changes.
- Every looping or automatic motion must stop when `<html data-paused="on">` (the header Pause motion button, WCAG 2.2.2): the stage freezes its clock, CSS animations are switched off.
- `assets/portrait/source.png` is the original photo. Never edit it, never move it into `public/`. Keep EXIF stripped on any new export.

## Licensing
The reference portfolio (rayenchatti) is for learning only. Do not copy its code, shaders, layout, copy, choreography or visual identity. Do not reproduce shapes from the owner's video reference (X, hand, tree).
