# Project brief: Tuan Tran's personal portfolio (3D, cursor-tracking portrait)

## Goal
A scroll-driven personal portfolio that builds a professional and academic personal brand in digital advertising, and shows hands-on vibe-coding skill by being built that way itself. Visitors (brand marketers, agencies, recruiters, partners, academics) should understand within 10 seconds who he is, what he helps brands achieve, and how to contact him.

## Source of truth for content
All facts come from the owner's LinkedIn profile (exported PDF) plus the owner's own notes. Use only these facts. Do not invent achievements, metrics, quotes or client results. Anything missing goes in a clearly marked `TODO:` placeholder.

### Identity
- Name on LinkedIn: Tuan Tran (TODO: confirm display name; owner may prefer a nickname)
- Headline: AM at Cốc Cốc Platform / Lifelong learning
- Location: Hanoi, Vietnam
- Languages: English (professional working), Vietnamese (native)
- Contact (public on LinkedIn): [email withheld: the owner chose LinkedIn only], linkedin.com/in/tuantran-ams
- Do not include the personal Facebook link.

### Experience
**Cốc Cốc Ad Platform (about 2 years)**
- Strategic Account Executive, June 2025 to present
- Account Manager, November 2024 to June 2025

Role (paraphrase, do not copy verbatim): client engagement from first meeting to campaign management; oversight of multiple accounts and deadlines; handling client requests and escalations; negotiating and closing contracts that work for both sides; guiding internal teams and external partners; business development through long-term relationships, hunting new opportunities to beat targets, and tracking and forecasting key metrics.

About the platform (from his LinkedIn summary; TODO: verify figures before publishing): nearly a decade of development; positioned as one of Vietnam's leading ad platforms by reach; about 30 million users across PC and mobile inherited from the Cốc Cốc browser.

Ad solutions he works with: CPM, CPC and CPD cost models; big banners on the new tab page, search keyword ads, shopping product ads, native ads; audience targeting across industries; retargeting that combines display and search; third-party transparent tracking and measurement.

Key clients on his LinkedIn: PepsiCo, VNG, Uniqlo, VinFast, Techcombank, MISA. DEFAULT: do NOT show client names or logos on the site, and do NOT write case studies (the owner chose not to give specific case studies). Show only the kinds of work and the solutions he handles. Add client names only if the owner later says so.

### Skills and interests
- LinkedIn top skills: SEO, Inbound Marketing, Digital Marketing
- Self-described interests and skills: advertising and vibe coding. He does vibe coding with Claude (TODO: confirm whether this means Claude Code, the Claude app, or both). TODO (optional): 1 to 3 things he has built, and how long he has been doing it. Do not invent any projects; if none are given, the site itself is the project.

### Certifications
SEO Certificate, SEO II, Social Media Marketing, Graphic Design Essentials. (TODO: issuers and dates)

### Education
Master of Business Administration, Foreign Trade University, Hanoi, 2026 to 2028 (in progress, part-time alongside full-time work). TODO: research focus or thesis topic.

## Positioning (proposal, owner to confirm)
"I help brands reach Vietnamese users at scale and turn awareness into measurable results, and I build my own tools with AI." Primary audience: brand and performance marketers and agencies. Secondary: recruiters, academic peers.

## Signature concept: a portrait that looks at you
The hero shows Tuan's portrait as a living WebGL element that follows the cursor. Behavior to achieve (inspired by the reference below, implemented independently):
- A flat photo plus a depth map; a fragment shader shifts pixels by depth so small offsets read as the head turning (fake 3D parallax, no 3D model or rig needed)
- Eyes lead the head: gaze reacts first, head follows with easing and a clamped range
- Idle life: blinks and occasional glances when the cursor is still
- Smooth damping, no jitter, returns to neutral when the cursor leaves
- Advertising tie-in (proposal): the gaze reacts when the cursor hovers key CTAs or ad-solution items

Assets are already prepared in this kit (the photo is the owner's own, shared by the owner for this site):
- `public/portrait/source.png` (2048x2048, no EXIF). It is the original; never edit it.
- `public/portrait/portrait-desktop.webp` (1800x1200 crop) and `portrait-mobile.webp` (1100x1375 crop)
- `public/portrait/depth-desktop.png` and `depth-mobile.png` (first-pass depth maps, 0 = far, 1 = near, half resolution)
- `public/portrait/subject-mask.png`, `poster-*.webp` (tiny blur-up placeholders)
- `character.config.json`: crops, face landmarks (eyes, nose, mouth), tracking parameters, idle-life timings, device fallbacks and performance rules. Treat it as the single source of truth for the character's behavior; load it instead of hard-coding numbers.
- `docs/parallax-preview.png`: how the depth map moves the photo (left, center, right).

The photo: the owner sits cross-legged on an old railway track in a green park, facing the camera, black polo, even light, neutral expression, rails converging behind him.
- Use the whole scene, not a cut-out. The converging rails give a strong depth cue, so the background drifts naturally as the head turns.
- The depth map is a first pass built from a person mask plus a face ellipsoid. Before launch, hand-correct hair edges next to the right rail, shoes, and hands, and check for tearing at the strongest offset.
- Landmark values are hand-estimated; verify them on screen.
- The face is small in the frame. Check it stays sharp at 2x pixel density. If the owner has a larger original, replace `source.png`, then regenerate the crops, depth maps and landmark coordinates.
- Design idea (proposal): the rails are the path through the whole page. When the visitor scrolls, the camera "travels" along the rails into the next scene (the ad funnel). Keep it subtle and keep the portrait the star.
- Image rights and privacy: never use another person's portrait, depth map, or shader. Keep EXIF/location metadata stripped from any new export.

## Particle system (from the owner's video reference)
The owner shared a short screen recording of a WebGL particle website (frames in `docs/video-reference-frames.jpg` and `docs/video-reference-detail.jpg`). There is no prompt or source code for it; design and build our own. The owner chose to take these four ideas:
1. **Particles assemble into the portrait (hero opening).** On load, a cloud of particles drifts, then gathers into the shape of the portrait (sample positions and colors from `public/portrait/` using the subject mask, luminance and depth). After the portrait forms, it resolves into the real photo with parallax (crossfade, ~1 to 2 seconds) so the eyes, blinks and gaze tracking work on the real image. Keep the whole opening under about 4 seconds and skippable.
2. **Particle trails that follow the cursor.** Soft glowing trails behind the pointer, fading quickly. Particles near the cursor are gently attracted or pushed. Use sparingly on top of the portrait so it never hides the face.
3. **Particles morph between scenes.** The same particle cloud reforms into a shape that matches each scene: a browser window (About), a funnel (Ad solutions), the rails path between scenes. Morph progress is driven by scroll through the shared scene timelines.
4. **Wireframe grid cage and glass panels.** Shapes sit inside a faint cylindrical or box grid (wireframe) for a "digital stage" feeling. Content cards use frosted-glass panels (blur, thin border, low opacity) that appear over the particles. Keep text contrast WCAG AA: add a darker scrim behind text if needed.

Other traits seen in the video that may inform the mood (optional): headline text split left and right of the focal shape; depth-of-field blur on near particles; deep navy background with white and violet-tinted particles. The owner has not chosen a palette; propose 2 palette options in the design plan, including one close to that mood and one that is not.

Rules:
- All particle logic runs on the GPU (points with shader-based motion, or instanced quads); targets are precomputed textures or buffers.
- Adaptive quality: pick particle counts from device capability and frame time (see `character.config.json`, `particles`). Mobile uses far fewer particles and no trails by default.
- The portrait must remain the star. Particles are the opening and the transitions, not constant noise over content.
- Reduced motion: skip assembly and trails; show the static portrait and static panels. No WebGL: same static layout.
- Do not copy the layout, wording, shapes, or visual identity of the video's website. The shapes used there (X, hand, tree) must not be reproduced; use shapes that belong to this owner's story.

## Primary reference: Rayen Chatti's portfolio (github.com/rayenchatti/Portfolio, live site rayenchatti.vercel.app)
What to learn from it (ideas and techniques only):
- Every section is a pinned "scene": a tall container with a sticky stage, and scroll progress (0 to 1) drives both the 3D camera and the DOM text from one shared timeline per scene, so 3D and text stay in sync
- Hero portrait parallax via depth map (see above)
- Scene transitions with a clear narrative per section, not generic fade-ups
- Pause WebGL loops when a section is off-screen or the tab is hidden; load heavy scenes client-side only; prerender the rest statically
- A `prefers-reduced-motion` fallback for every scene (static layout, no camera moves)
- Accessible dialogs (Escape to close, scroll lock, focus return); decorative layers hidden from screen readers

LICENSING: that repository is published for reading and learning only; the author reserves the design, portrait and content. Therefore:
- Do NOT copy or closely translate any code, shader, depth-map approach details beyond the general technique, layout, copy, assets, scene choreography, or visual identity.
- Write all code from scratch and design original scenes for this owner's story.
- If anything looks too similar to the reference in the final result, change it.

## Scenes (original ideas for this owner; replace if a better idea appears)
1. **Hero:** particles assemble into the portrait, then resolve into the cursor-tracking parallax photo (see Particle system); name, one-line positioning, two CTAs
2. **About:** a floating browser window; as you scroll, a new tab fills with the bio lines (nod to the new-tab ad slot he sells). Keep it short, first person.
3. **Ad solutions:** the particle cloud reforms into a funnel; a funnel path from Awareness to Consideration to Conversion. Each stage lights up the relevant solutions (CPM; native, search, new-tab banners; CPD, shopping, retargeting) with one plain-language line each.
4. **How I work with clients:** replaces a case-study section. Four short steps taken from his real responsibilities (understand the goal, plan and manage the campaign, forecast with data, negotiate and close). No made-up results.
5. **Built with AI (vibe coding):** short section saying this site was built through vibe coding with Claude, how the process worked (brief, references, prototype, iteration), and what he learned. Use only what the owner confirms; do not invent tools, timelines or numbers.
6. **Skills, certifications, education**
7. **Contact:** mailto, LinkedIn, copy-email button

## Design direction
- Creative and bold; spend boldness on the portrait and the scroll scenes, keep everything else calm and disciplined.
- Color and type: free to propose, but the concept must feel specific to advertising and Vietnam's digital market, not a generic dark-neon developer template. Avoid default AI-looking choices: cream plus terracotta, near-black plus acid green, identical rounded cards with soft shadows, all-caps eyebrow labels over every heading, gradient washes.
- `portfolio.html` (attached) is an earlier prototype; use it only for the cobalt/yellow idea if the owner still likes it. Its copy is outdated.
- Motion: purposeful and tied to scroll or user action; no scattered hover effects. Particles are used for the hero opening, cursor trails, and scene transitions only.
- Surfaces: frosted-glass panels over the particle stage, a faint wireframe cage around morphing shapes, strong type, generous spacing.

## Language and tone
English only. Plain verbs, active voice, sentence case. Confident and specific, no hype, no buzzwords. Do not reuse the LinkedIn summary's promotional wording; write fresh copy from the facts.

## Tech (preferred; propose changes with reasons)
- Next.js (App Router) + TypeScript, Tailwind CSS
- WebGL: OGL or three.js for the portrait shader; React Three Fiber only for scenes that need real 3D
- Framer Motion (or GSAP) for scroll timelines
- Static export where possible; deploy to Vercel or Cloudflare Pages
- Contact via mailto (no form needed), no tracking scripts for now, self-host fonts

## Performance and fallback rules (must have)
- Load WebGL code only on the client and only on capable devices; show a static portrait image first (poster) and upgrade when ready
- Mobile: keep it light. Use touch to nudge the gaze, or a gentle idle animation; no heavy scenes on low-power devices
- Pause rendering when off-screen or when the tab is hidden; cap device pixel ratio
- Particles: adaptive count (desktop high, mobile low or none), GPU-only simulation, no per-frame allocations, drop quality automatically if frame time rises
- Fallbacks: no WebGL, reduced motion, slow connection show a static, fully readable layout with no content lost
- Target Lighthouse 90+ on Performance, Accessibility, Best Practices, SEO

## Quality bar
- Responsive from 360px up; no horizontal scroll
- WCAG AA contrast, visible keyboard focus, semantic HTML, alt text, skip link
- Light and dark theme if it does not weaken the concept (owner to decide)
- Title, meta description, Open Graph image rendered from the hero, favicon

## Workflow
1. Read this file.
2. Ask the owner for the missing inputs: a higher-resolution original of the portrait if one exists, the vibe-coding details, and the confirmations marked `TODO:` (display name, public email, Claude vs Claude Code). Do not ask for case studies; the owner decided not to include them.
3. Propose a design plan (palette, type, scene storyboard, shader approach) and wait for approval.
4. Build the hero first as a standalone prototype: particle assembly, handoff to the parallax photo, then gaze tracking (follow speed, eye lead, idle blink) and cursor trails. Get approval on the feel before building other scenes.
5. Build the remaining scenes, then test at mobile and desktop widths, with reduced motion, and without WebGL.
6. Finish with a list of every remaining `TODO:`.
