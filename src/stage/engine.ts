import {
  ColorManagement,
  Vector4,
  Color,
  LinearFilter,
  PerspectiveCamera,
  Scene as ThreeScene,
  Texture,
  TextureLoader,
  WebGLRenderer,
} from "three";
import { character, pickVariant, variantInfo, type Variant } from "./config";
import { Gaze } from "./gaze";
import { palette } from "./palette";
import { createParticles } from "./particles";
import { buildShapes, SHAPE, type PortraitSample } from "./shapes";
import { starryLayout, vortexUniforms } from "./starry";
import { collectScenes, frameAt, measureScenes, type Frame, type Scene } from "./timeline";
import { createTrails } from "./trails";
import { createFunnelCage, createPromptCage } from "./cage";

ColorManagement.enabled = false;

const FOV = 30;
const CAM_D = 1 / Math.tan(((FOV / 2) * Math.PI) / 180);
const P = character.particles;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

export interface StageHandle {
  destroy(): void;
}

function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("image failed: " + url));
    img.src = url;
  });
}

function sampleImage(img: HTMLImageElement, w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("2d context unavailable");
  ctx.drawImage(img, 0, 0, w, h);
  return ctx.getImageData(0, 0, w, h).data;
}

function texture(img: HTMLImageElement) {
  const t = new Texture(img);
  t.flipY = false;
  t.generateMipmaps = false;
  t.minFilter = LinearFilter;
  t.magFilter = LinearFilter;
  t.needsUpdate = true;
  return t;
}

export async function createStage(canvas: HTMLCanvasElement): Promise<StageHandle> {
  const root = document.documentElement;
  const params = new URLSearchParams(location.search);
  const coarse = matchMedia("(pointer: coarse)").matches;
  const small = innerWidth < 768;
  const tier = coarse || small ? P.quality.mobile : P.quality.desktop;
  const trailsOn = tier.trails && P.cursorTrail.enabled && !coarse;
  const dprCap = coarse || small ? 1.5 : character.performance.maxDevicePixelRatio;

  const variant: Variant = pickVariant(innerWidth, innerHeight);
  const info = variantInfo(variant);

  // Asset base from the canvas: "/" on the site (pages live at any depth), "" in the preview bundle.
  const base = canvas.dataset.assets ?? "";
  const [photo, depth] = await Promise.all([loadImage(base + info.image), loadImage(base + info.depth)]);

  // Sample colour, depth and mask on a small grid to place the portrait particles.
  const sw = variant === "desktop" ? 540 : 360;
  const shRows = Math.round((sw * info.size[1]) / info.size[0]);
  const fb = character.faceBoxPx;
  const crop = character.variants[variant].cropPx;
  const sample: PortraitSample = {
    width: sw,
    height: shRows,
    color: sampleImage(photo, sw, shRows),
    depthMask: sampleImage(depth, sw, shRows),
    eyes: {
      left: info.landmarks.leftEye,
      right: info.landmarks.rightEye,
      rx: info.eyeRadius[0],
      ry: info.eyeRadius[1],
    },
    face: {
      x: (fb.x + fb.w / 2 - crop.x) / crop.w,
      y: (fb.hairTopY + (fb.y + fb.h - fb.hairTopY) / 2 - crop.y) / crop.h,
      rx: (fb.w * 0.62) / crop.w,
      ry: ((fb.y + fb.h - fb.hairTopY) * 0.58) / crop.h,
    },
  };
  // ?count=N overrides the particle budget (testing and tuning).
  const count = clamp(Number(params.get("count")) || tier.count, 2000, 200000);
  // The hero painting is laid out for the viewport's shape (wide or tall).
  const heroAspect = innerWidth / Math.max(1, innerHeight);
  const layout = starryLayout(heroAspect);
  const shapes = buildShapes(count, sample, { layout, aspect: heroAspect });

  const renderer = new WebGLRenderer({
    canvas,
    antialias: false,
    alpha: false,
    powerPreference: "high-performance",
  });
  renderer.setClearColor(new Color(palette.night), 1);
  const scene = new ThreeScene();
  const camera = new PerspectiveCamera(FOV, 1, 0.05, 60);
  camera.position.set(0, 0, CAM_D);

  // The photo is kept as a texture so eye particles can sample it for gaze and blinks.
  const photoTex = texture(photo);
  const particles = createParticles(shapes, photoTex, {
    left: info.landmarks.leftEye,
    right: info.landmarks.rightEye,
    radius: info.eyeRadius,
  });
  const trails = trailsOn ? createTrails(1536) : null;
  const funnelCage = createFunnelCage();
  const promptCage = createPromptCage();
  scene.add(funnelCage.lines, promptCage.lines, particles.points);
  if (trails) scene.add(trails.points);

  const U = particles.material.uniforms;

  // ---------- Scenes ----------
  let scenes: Scene[] = collectScenes();
  const hero = scenes.find((s) => s.kind === "hero");
  const contact = scenes.find((s) => s.kind === "portrait");
  const railsScene = scenes.find((s) => s.kind === "rails");
  if (!hero) throw new Error("hero scene missing");
  const remeasure = () => measureScenes(scenes);
  remeasure();
  const ro = new ResizeObserver(remeasure);
  ro.observe(document.body);

  // ---------- Input ----------
  let vw = innerWidth;
  let vh = innerHeight;
  const pointer = { x: vw / 2, y: vh / 2, inside: false, touch: false };
  let gazeEl: HTMLElement | null = null;
  const gaze = new Gaze(performance.now());
  let faceScreen = { x: vw / 2, y: vh / 3 };

  const gazeFromPoint = (x: number, y: number, now: number, gain = 1) => {
    gaze.pointTo(((x - faceScreen.x) / (vw * 0.5)) * gain, ((y - faceScreen.y) / (vh * 0.5)) * gain, now);
  };
  const elCenter = (el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  };

  const onMove = (e: PointerEvent) => {
    const now = performance.now();
    pointer.touch = e.pointerType === "touch";
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.inside = !pointer.touch;
    let x = e.clientX;
    let y = e.clientY;
    if (gazeEl && character.tracking.ctaGaze.enabled) {
      const c = elCenter(gazeEl);
      const k = character.tracking.ctaGaze.blendTowardElement;
      x += (c.x - x) * k;
      y += (c.y - y) * k;
    }
    gazeFromPoint(x, y, now, pointer.touch ? 0.6 : 1);
    if (trails && !pointer.touch && root.dataset.paused !== "on") {
      trails.push((e.clientX / vw) * 2 - 1, -((e.clientY / vh) * 2 - 1), now / 1000, vw / vh);
    }
  };
  const onLeave = (e: PointerEvent | MouseEvent) => {
    if ((e as MouseEvent).relatedTarget) return;
    pointer.inside = false;
    gaze.release(performance.now());
  };
  const onOver = (e: Event) => {
    const t = (e.target as HTMLElement | null)?.closest?.("[data-gaze]") as HTMLElement | null;
    gazeEl = t;
  };
  const onFocus = (e: FocusEvent) => {
    const t = (e.target as HTMLElement | null)?.closest?.("[data-gaze]") as HTMLElement | null;
    if (t) {
      const c = elCenter(t);
      gazeFromPoint(c.x, c.y, performance.now());
    }
  };
  addEventListener("pointermove", onMove, { passive: true });
  addEventListener("pointerdown", onMove, { passive: true });
  document.addEventListener("mouseout", onLeave);
  document.addEventListener("pointerover", onOver, { passive: true });
  document.addEventListener("focusin", onFocus);

  // ---------- Intro ----------
  const hp = P.heroAssembly;
  // Skip the opening if the visitor has scrolled, asked for it, or the stage started late
  // (the static photo is already showing by then). The formed particle portrait is the
  // hero's resting state; there is no hand-off to the photo.
  const introAllowed =
    hp.enabled &&
    scrollY < innerHeight * 0.3 &&
    !params.has("nointro") &&
    performance.now() < 4000 &&
    root.dataset.paused !== "on";
  let introStart = introAllowed ? performance.now() : -1e9;
  const introEnd = hp.maxDurationMs;
  const skip = () => {
    if (performance.now() - introStart < introEnd) introStart = performance.now() - introEnd;
  };
  const onSkipClick = (e: Event) => {
    if ((e.target as HTMLElement | null)?.closest?.("[data-skip-intro]")) skip();
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") skip();
  };
  document.addEventListener("click", onSkipClick);
  document.addEventListener("keydown", onKey);
  root.dataset.intro = introAllowed ? "on" : "off";

  // ---------- Layout helpers ----------
  const ndcX = (px: number) => (px / vw) * 2 - 1;
  const ndcY = (py: number) => -((py / vh) * 2 - 1);
  const wpp = () => 2 / vh; // world units per CSS pixel at the focal plane
  const face = info.landmarks.faceCenter;

  // The particle portrait lives in the Contact scene, fitted inside its box.
  const placePortrait = () => {
    if (!contact) return;
    const r = contact.anchor.getBoundingClientRect();
    const ia = info.size[0] / info.size[1];
    const w = Math.min(r.width, r.height * ia);
    const h = w / ia;
    particles.xf[SHAPE.portrait].set(ndcX(r.left + r.width / 2), ndcY(r.top + r.height / 2), w * wpp(), h * wpp());
    U.uZs.value[SHAPE.portrait] = h * wpp() * 0.2;
    portraitPx = { w, h };
    portraitFace = { x: r.left + (r.width - w) / 2 + face[0] * w, y: r.top + (r.height - h) / 2 + face[1] * h };
  };

  // The painting fills the hero box.
  const placeHero = () => {
    const r = heroRect;
    particles.xf[SHAPE.starry].set(ndcX(r.left + r.width / 2), ndcY(r.top + r.height / 2), (r.width / 2) * wpp(), (r.height / 2) * wpp());
    U.uZs.value[SHAPE.starry] = r.height * wpp() * 0.5;
    U.uHeroAspect.value = r.width / Math.max(1, r.height);
    U.uStarSize.value = Math.sqrt((r.width * r.height) / Math.max(1, drawCount)) * 2.5;
  };
  vortexUniforms(layout).forEach((v, i) => (U.uVort.value[i] as Vector4).set(v[0], v[1], v[2], v[3]));
  U.uBand.value.set(layout.band.v, layout.band.amp, layout.band.tilt, layout.band.thick);

  const placeAnchor = (shape: number, el: HTMLElement, mode: "box" | "square", fill = 1) => {
    const r = el.getBoundingClientRect();
    const cx = ndcX(r.left + r.width / 2);
    const cy = ndcY(r.top + r.height / 2);
    if (mode === "box") {
      particles.xf[shape].set(cx, cy, (r.width / 2) * wpp(), (r.height / 2) * wpp());
      U.uZs.value[shape] = (r.height / 2) * wpp();
    } else {
      const s = (Math.min(r.width, r.height) / 2) * wpp() * fill;
      particles.xf[shape].set(cx, cy, s, s);
      U.uZs.value[shape] = s;
    }
    return r;
  };

  let heroRect = hero.el.getBoundingClientRect();
  let portraitPx = { w: 1, h: 1 };
  let portraitFace = { x: 0, y: 0 };

  // ---------- Quality ----------
  // ?fixed keeps the full particle budget (for screenshots on slow test machines).
  const adaptive = !params.has("fixed");
  let drawCount = count;
  let slowSince = -1;
  let ema = 16;
  const started = performance.now();
  let lastDrop = 0;

  // ---------- Loop ----------
  let raf = 0;
  let last = performance.now();
  let running = true;
  let ready = false;
  const hi = { x: -1, y: -1 };
  let mouseOn = 0;
  let animTime = performance.now() / 1000;
  let lastScroll = -1;
  let wasPaused = false;

  const resize = () => {
    vw = innerWidth;
    vh = innerHeight;
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, dprCap));
    renderer.setSize(vw, vh, false);
    camera.aspect = vw / vh;
    camera.updateProjectionMatrix();
  };
  resize();

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    let resized = false;
    if (innerWidth !== vw || innerHeight !== vh) {
      resize();
      remeasure();
      resized = true;
    }

    // Pause motion (header button, WCAG 2.2.2): time stops, so the painting, idle
    // gaze and loops freeze. Scrolling still morphs the shapes, since the visitor
    // drives that. While paused, frames are drawn only when something changed.
    const paused = root.dataset.paused === "on";
    if (paused && ready && !resized && scrollY === lastScroll && paused === wasPaused) return;
    lastScroll = scrollY;
    wasPaused = paused;
    if (!paused) animTime += dt;
    else skip(); // a paused visitor sees the finished painting, not a frozen assembly

    // Shared timeline from scroll position.
    let f = frameAt(scenes, scrollY, vh);

    // Hero opening overrides the timeline until it finishes.
    const el = now - introStart;
    const intro = el >= 0 && el < introEnd;
    if (intro && scrollY > 40) skip();
    if (intro) {
      f = {
        ...f,
        a: hero,
        b: hero,
        from: SHAPE.cloud,
        to: SHAPE.starry,
        mix: smooth(150, introEnd - 300, el),
        alpha: smooth(0, 450, el),
        travel: 0,
      };
    } else if (root.dataset.intro === "on") {
      root.dataset.intro = "off";
    }

    // Hero framing.
    heroRect = hero.el.getBoundingClientRect();
    const contactInView = !!contact && (f.a === contact || f.b === contact);

    // Shape placement. The gaze is measured from the face in Contact, and from the
    // centre of the hero elsewhere (it drives the painting's depth parallax).
    placeHero();
    placePortrait();
    faceScreen = contactInView
      ? portraitFace
      : { x: heroRect.left + heroRect.width / 2, y: Math.max(heroRect.top + heroRect.height * 0.4, vh * 0.4) };

    // Gaze: the particle portrait follows the cursor, eyes first.
    if (!paused) gaze.update(now, dt);
    U.uLook.value.set(gaze.head.x, gaze.head.y);
    const iris = gaze.iris();
    U.uIris.value.set(iris.x, iris.y);
    U.uBlink.value = paused ? 0 : gaze.blink;
    const ls = character.tracking.headParallax.strengthFractionOfWidth;
    U.uLookStrength.value.set(ls, ls * character.tracking.headParallax.yAxisGain * (info.size[0] / info.size[1]));
    const t = animTime;
    const active3d = pointer.inside && !paused;
    const mx = active3d ? ndcX(pointer.x) : 0;
    const my = active3d ? ndcY(pointer.y) : 0;
    particles.xf[SHAPE.cloud].set(0, 0, (vw / vh) * 1.05, 1.25);
    U.uZs.value[SHAPE.cloud] = 1;
    const anchorOf = (kind: string) => scenes.find((s) => s.kind === kind)?.anchor;
    const browserEl = anchorOf("browser");
    if (browserEl) placeAnchor(SHAPE.browser, browserEl, "box");
    const funnelEl = anchorOf("funnel");
    if (funnelEl) placeAnchor(SHAPE.funnel, funnelEl, "square", 0.74);
    particles.rot[SHAPE.funnel].set(t * 0.22 + mx * 0.25, 0.42 - my * 0.1);
    // Measurement: a 3D bar chart rising behind the dashboard panel.
    const chartEl = anchorOf("chart");
    if (chartEl) {
      const r = chartEl.getBoundingClientRect();
      particles.xf[SHAPE.chart].set(ndcX(r.left + r.width / 2), ndcY(r.top + r.height * 0.56), r.width * 0.64 * wpp(), r.height * 0.5 * wpp());
      U.uZs.value[SHAPE.chart] = r.width * 0.5 * wpp();
    }
    particles.rot[SHAPE.chart].set(-0.38 + mx * 0.15, 0.2 - my * 0.06);
    // WordPress: page blocks floating behind the editor panel.
    const blocksEl = anchorOf("blocks");
    if (blocksEl) {
      const r = blocksEl.getBoundingClientRect();
      particles.xf[SHAPE.blocks].set(ndcX(r.left + r.width / 2), ndcY(r.top + r.height / 2), r.width * 0.62 * wpp(), r.height * 0.6 * wpp());
      U.uZs.value[SHAPE.blocks] = r.width * 0.5 * wpp();
    }
    particles.rot[SHAPE.blocks].set(0.42 + mx * 0.12, 0.2 - my * 0.06);
    const promptEl = anchorOf("prompt");
    if (promptEl) placeAnchor(SHAPE.prompt, promptEl, "square", 1.1);
    particles.rot[SHAPE.prompt].set(mx * 0.35 + Math.sin(t * 0.4) * 0.12, -my * 0.15);
    const railsInScene = railsScene && (f.a === railsScene || f.b === railsScene);
    if (railsInScene) {
      placeAnchor(SHAPE.rails, railsScene.anchor, "square", 1.3);
      const xr = particles.xf[SHAPE.rails];
      xr.y += 0.3 * xr.w;
    } else {
      particles.xf[SHAPE.rails].set(0, 0.05, 1, 1);
      U.uZs.value[SHAPE.rails] = 1;
    }
    const railsPitch = railsInScene ? 0.42 : 0.06;
    particles.rot[SHAPE.rails].set(mx * 0.12, railsPitch - my * 0.05);

    // Highlights driven by the DOM side of each scene.
    const active = (kind: string) => {
      const s = scenes.find((x) => x.kind === kind);
      const v = s?.el.dataset.active;
      return v === undefined || v === "" ? -1 : Number(v);
    };
    const tf = active("funnel");
    const tr = active("rails");
    const k = 1 - Math.pow(0.001, dt);
    hi.y = tf < 0 ? -1 : hi.y < 0 ? tf : hi.y + (tf - hi.y) * k;
    hi.x = tr < 0 ? -1 : hi.x < 0 ? tr : hi.x + (tr - hi.x) * k;
    U.uHi.value.set(hi.x, hi.y);
    // Chart lights one more stretch of bars per step; blocks light the group each step is about.
    const tc = active("chart");
    const blockKey = scenes.find((x) => x.kind === "blocks")?.el.dataset.activeKey ?? "";
    const chartTarget = tc < 0 ? 0.15 : (tc + 1) / 4;
    U.uChartLevel.value += (chartTarget - U.uChartLevel.value) * k;
    // Page-block groups (header, hero, columns, cards, footer) each step is about.
    const groupTargets: Record<string, number[]> = {
      theme: [1, 0, 0, 0, 1],
      blocks: [0, 1, 1, 1, 0],
      store: [0, 0.3, 0, 1, 0], // the cards become the product grid
      responsive: [0.35, 0.35, 0.35, 0.35, 0.35],
      speed: [0.7, 0.7, 0.7, 0.7, 0.7],
    };
    const gt = groupTargets[blockKey] ?? [0, 0, 0, 0, 0];
    const gh = U.uGroupHi.value as number[];
    for (let i = 0; i < 5; i++) gh[i] += (gt[i] - gh[i]) * k;
    // On the responsive step the page squeezes from desktop to phone width and back.
    const squeezeTarget = blockKey === "responsive" ? 0.5 + 0.5 * Math.sin(t * 0.9) : 0;
    U.uSqueeze.value += (squeezeTarget - U.uSqueeze.value) * k;

    // Particle uniforms.
    U.uTime.value = t;
    U.uFrom.value = f.from;
    U.uTo.value = f.to;
    U.uMix.value = f.mix;
    U.uAlpha.value = f.alpha;
    U.uDensity.value = Math.min(1, 35000 / drawCount);
    U.uTurb.value = intro ? 0.9 : 0.6;
    U.uAspect.value = vw / vh;
    U.uDpr.value = renderer.getPixelRatio();
    U.uCamD.value = CAM_D;
    U.uPortraitSize.value = Math.sqrt((portraitPx.w * portraitPx.h) / Math.max(1, drawCount));
    U.uSize.value = coarse || small ? 2.4 : 2.1;
    mouseOn += ((pointer.inside && !paused ? 1 : 0) - mouseOn) * Math.min(1, dt * 4);
    U.uMouseOn.value = mouseOn;
    U.uMouse.value.set(ndcX(pointer.x), ndcY(pointer.y));
    U.uMouseR.value = P.cursorTrail.influenceRadiusFractionOfWidth * 2 * (vw / vh) * 0.5;
    particles.points.visible = f.alpha > 0.002;

    // Cages follow their shapes.
    const w = (id: number) => (f.from === id ? 1 - f.mix : 0) + (f.to === id ? f.mix : 0);
    funnelCage.material.uniforms.uXf.value.copy(particles.xf[SHAPE.funnel]);
    funnelCage.material.uniforms.uZs.value = U.uZs.value[SHAPE.funnel];
    funnelCage.material.uniforms.uRot.value.copy(particles.rot[SHAPE.funnel]);
    funnelCage.material.uniforms.uAlpha.value = w(SHAPE.funnel) * 0.16 * f.alpha;
    funnelCage.lines.visible = funnelCage.material.uniforms.uAlpha.value > 0.002;
    promptCage.material.uniforms.uXf.value.copy(particles.xf[SHAPE.prompt]);
    promptCage.material.uniforms.uZs.value = U.uZs.value[SHAPE.prompt];
    promptCage.material.uniforms.uRot.value.copy(particles.rot[SHAPE.prompt]);
    promptCage.material.uniforms.uAlpha.value = w(SHAPE.prompt) * 0.16 * f.alpha;
    promptCage.lines.visible = promptCage.material.uniforms.uAlpha.value > 0.002;

    // Trails stay off the face.
    if (trails) {
      trails.points.visible = !paused && drawCount >= 30000;
      const TU = trails.material.uniforms;
      TU.uTime.value = now / 1000;
      TU.uAspect.value = vw / vh;
      TU.uDpr.value = renderer.getPixelRatio();
      TU.uLife.value = P.cursorTrail.lifetimeMs / 1000;
      const faceR = (character.faceBoxPx.h / character.variants[variant].cropPx.h) * portraitPx.h * 1.1;
      TU.uFace.value.set(ndcX(portraitFace.x), ndcY(portraitFace.y), faceR * wpp());
      TU.uFaceOn.value = P.cursorTrail.keepClearOfFace && contactInView ? 1 : 0;
    }

    // A short trip down the rails between scenes.
    camera.position.z = CAM_D - f.travel * 0.22;

    renderer.render(scene, camera);

    if (!ready) {
      ready = true;
      root.dataset.gl = "on";
    }

    // Adaptive quality: drop particles if frames stay slow.
    ema += (dt * 1000 - ema) * 0.1;
    if (adaptive && now - started > 2500) {
      if (ema > 20) {
        if (slowSince < 0) slowSince = now;
        if (now - slowSince > 1000 && now - lastDrop > 1500 && drawCount > 8000) {
          drawCount = Math.max(8000, Math.floor(drawCount * 0.6));
          particles.geometry.setDrawRange(0, drawCount);
          lastDrop = now;
          slowSince = -1;
          if (drawCount < 30000 && trails) trails.points.visible = false;
        }
      } else {
        slowSince = -1;
      }
    }
  };

  const start = () => {
    if (running) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };
  const onVisibility = () => (document.hidden ? stop() : start());
  document.addEventListener("visibilitychange", onVisibility);

  const onLost = (e: Event) => {
    e.preventDefault();
    stop();
    root.dataset.gl = "off";
  };
  canvas.addEventListener("webglcontextlost", onLost);

  raf = requestAnimationFrame(frame);

  return {
    destroy() {
      stop();
      ro.disconnect();
      removeEventListener("pointermove", onMove);
      removeEventListener("pointerdown", onMove);
      document.removeEventListener("mouseout", onLeave);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("focusin", onFocus);
      document.removeEventListener("click", onSkipClick);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onLost);
      scene.traverse((o) => {
        const m = o as unknown as { geometry?: { dispose(): void }; material?: { dispose(): void } };
        m.geometry?.dispose();
        m.material?.dispose();
      });
      photoTex.dispose();
      renderer.dispose();
      scenes = [];
      delete root.dataset.intro;
    },
  };
}
