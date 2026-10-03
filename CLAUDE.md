# Devan portfolio: notes for Claude Code

The full original brief is in `docs/original-brief.md`. This file records what was decided and how the code is laid out. Read `README.md` for the file map.

## Decisions made by the owner
- Display name: **Devan** (LinkedIn name Tuan Tran appears only in JSON-LD `alternateName`).
- Palette: **Cobalt & sun**. Night `#070b3a`, cobalt `#2b35f5`, soft `#8c93ff`, sun `#ffd23f`, ink `#f2f3ff`. Tokens live in `src/app/globals.css` and `src/stage/palette.ts`; keep them in sync.
- Contact: **LinkedIn only**. Do not put the email address on the site.
- Vibe coding: **both the Claude app and Claude Code**. This site was built with Claude Code.
- Dark theme only (particles need the dark stage). Revisit only if the owner asks.
- Hero: the **particle portrait is the resting state**. The 1:1 photo looked soft on 2x screens, so it is never shown; it is only a texture for particle colours and the eyes. Static visitors get `public/portrait/particles-*.webp` from `scripts/particle_poster.py`.

## Decisions delegated to Claude (2026-10-03)
- Positioning line: kept as proposed in the brief.
- Platform reach: "tens of millions of users" (public figures range 22–30 million by year); no "decade" claim.
- CPD on Cốc Cốc = cost per duration (fixed price for a placement over a set time).
- Certifications listed by name only. MBA research focus not shown. No extra vibe-coding projects: the site is the project.
- Built with AI lesson line written from how this site was made; the owner can edit it in `src/content/site.ts`.
- Funnel mapping: new-tab banner and CPM under Awareness; search, native, targeting under Consideration; shopping, retargeting, CPC and CPD under Conversion.

## Content rules
- English only, sentence case, plain verbs, no hype.
- Facts come only from the brief or the owner. No invented metrics, clients, quotes or projects.
- No client names or logos, no case studies.
- Unconfirmed items are marked `TODO:` in `src/content/site.ts`. Empty `ai.lesson` stays hidden.

## Technical rules
- Static export (`output: "export"`). No server code, no tracking scripts.
- WebGL is decided before first paint by the boot script in `src/app/layout.tsx` (`data-gl`, `data-motion`, `data-intro` on `<html>`). Every scene must stay fully readable with `data-gl="off"`.
- Character behaviour numbers come from `character.config.json`; do not hard-code them in the shaders.
- Hero framing is defined twice on purpose: `heroFraming`/`focalCover` in `src/stage/config.ts` (WebGL) and the `.hero-photo` container-unit rules in `globals.css` (static, no layout shift). Change both together.
- Particle shapes are blended on the GPU; per-frame CPU work is uniforms only.
- `assets/portrait/source.png` is the original photo. Never edit it, never move it into `public/`. Keep EXIF stripped on any new export.

## Licensing
The reference portfolio (rayenchatti) is for learning only. Do not copy its code, shaders, layout, copy, choreography or visual identity. Do not reproduce shapes from the owner's video reference (X, hand, tree).
