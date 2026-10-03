# Research references (ideas only; do not copy code, assets or design)

Primary reference: Rayen Chatti's portfolio, github.com/rayenchatti/Portfolio (live: rayenchatti.vercel.app). Published for reading and learning only; the author reserves the design, portrait and content. Learn the techniques, rebuild everything independently.

Other cursor-tracking character examples reviewed:
- github.com/Aditya-P-Yadav/aditya-portfolio-3d: static 3D bust, eased and clamped rotation toward the pointer, idle sway, no framework
- github.com/vaibhavkundu123/3d-interactive-portfolio: stylized avatar, mouse and touch tracking with spring damping, breathing and blinking
- github.com/MubeenAmjad205/portfolio: light sprite shown first, heavy 3D loaded only on interaction
- github.com/hxxtsxxh/updatedPortfolioWebsite/pull/4: WebGL loaded only on large screens, paused off-screen, reduced-motion support
- contra.com/p/qRNclLX2-the-cursor-tracking-cute-robot: Spline character that follows the cursor (no-code route; Look At event)

Notes:
- Ready Player Me shut down on 31 Jan 2026, so older tutorials that use it no longer work. Not needed here because the portrait is the owner's own photo.
- Technique summary for this project: flat photo + depth map + fragment shader parallax; eyes lead the head; idle blink and glance; scroll progress (0 to 1) drives camera and DOM text from one timeline per scene; pause WebGL off-screen; reduced-motion and no-WebGL fallbacks.

Owner's video reference (screen recording of a particle-based WebGL site): see docs/video-reference-frames.jpg and docs/video-reference-detail.jpg. Ideas taken: particles assembling into a shape, glowing cursor trails, morphing between shapes, wireframe cage, frosted-glass panels. No prompt or source was provided; build independently and do not reproduce its shapes, layout, wording or identity.
