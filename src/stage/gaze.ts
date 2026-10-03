import { character } from "./config";

const cfg = character;
const rand = (a: number, b: number) => a + Math.random() * (b - a);
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/** Frame-rate independent version of `x += (target - x) * perFrame` at 60 fps. */
const ease = (perFrame: number, dt: number) => 1 - Math.pow(1 - perFrame, dt * 60);

/**
 * Drives where the portrait looks. Values are in image space:
 * x to the right, y downwards, roughly -1..1.
 * Eyes ease faster than the head, so the gaze leads and the head follows.
 */
export class Gaze {
  head = { x: 0, y: 0 };
  eyes = { x: 0, y: 0 };
  blink = 0;

  private target = { x: 0, y: 0 };
  private glance = { x: 0, y: 0, until: 0 };
  private lastInput = -1e9;
  private nextGlance = 0;
  private nextBlink = 0;
  private blinkStart = -1;
  private doubleBlink = false;
  private swayPeriod: [number, number] = [7, 8];
  private returnUntil = 0;

  constructor(now: number) {
    this.nextBlink = now + rand(1.2, 3) * 1000;
    this.nextGlance = now + rand(...(cfg.idleLife.glance.everySeconds as [number, number])) * 1000;
    const [p0, p1] = cfg.idleLife.sway.periodSeconds as [number, number];
    this.swayPeriod = [rand(p0, p1), rand(p0, p1)];
  }

  /** A pointer or touch position relative to the face, already normalised to -1..1. */
  pointTo(x: number, y: number, now: number) {
    const c = cfg.tracking.headParallax.clamp;
    this.target.x = clamp(x, -c, c);
    this.target.y = clamp(y, -c, c);
    this.lastInput = now;
  }

  /** Pointer left the window: drift back to neutral. */
  release(now: number) {
    this.target.x = 0;
    this.target.y = 0;
    this.lastInput = now - cfg.idleLife.startAfterIdleMs + cfg.tracking.pointerLeave.returnToNeutralMs;
    this.returnUntil = now + cfg.tracking.pointerLeave.returnToNeutralMs;
  }

  update(now: number, dt: number, allowIdle = true) {
    const idleFor = now - this.lastInput;
    let tx = this.target.x;
    let ty = this.target.y;

    if (allowIdle && idleFor > cfg.idleLife.startAfterIdleMs && now > this.returnUntil) {
      const t = now / 1000;
      const a = cfg.idleLife.sway.amplitude;
      tx = a * Math.sin((t * Math.PI * 2) / this.swayPeriod[0]);
      ty = a * 0.35 * Math.sin((t * Math.PI * 2) / this.swayPeriod[1] + 1.3);

      if (now > this.nextGlance) {
        const g = cfg.idleLife.glance;
        const ang = rand(0, Math.PI * 2);
        this.glance.x = Math.cos(ang) * g.amplitude;
        this.glance.y = Math.sin(ang) * g.amplitude * 0.5;
        this.glance.until = now + rand(...(g.durationMs as [number, number]));
        this.nextGlance = now + rand(...(g.everySeconds as [number, number])) * 1000;
      }
    }

    const glancing = now < this.glance.until;
    const ex = glancing ? this.glance.x : tx;
    const ey = glancing ? this.glance.y : ty;

    const kh = ease(cfg.tracking.headParallax.easing.perFrameAt60fps, dt);
    const ke = ease(cfg.tracking.eyes.easing.perFrameAt60fps, dt);
    this.head.x += (tx - this.head.x) * kh;
    this.head.y += (ty - this.head.y) * kh;
    this.eyes.x += (ex - this.eyes.x) * ke;
    this.eyes.y += (ey - this.eyes.y) * ke;

    this.updateBlink(now);
  }

  /** Eye offset inside the socket, -1..1. */
  iris() {
    const g = cfg.tracking.eyes.extraGainOverHead;
    return { x: clamp(this.eyes.x * g, -1, 1), y: clamp(this.eyes.y * g, -1, 1) };
  }

  private updateBlink(now: number) {
    const b = cfg.idleLife.blink;
    const dur = b.durationMs;
    if (this.blinkStart < 0 && now > this.nextBlink) {
      this.blinkStart = now;
      this.doubleBlink = Math.random() < b.doubleBlinkChance;
    }
    if (this.blinkStart < 0) {
      this.blink = 0;
      return;
    }
    const total = this.doubleBlink ? dur * 2 + 60 : dur;
    let t = now - this.blinkStart;
    if (t > total) {
      this.blinkStart = -1;
      this.blink = 0;
      this.nextBlink = now + rand(...(b.everySeconds as [number, number])) * 1000;
      return;
    }
    if (this.doubleBlink && t > dur) t = Math.max(0, t - dur - 60);
    const p = clamp(t / dur, 0, 1);
    // Close fast (40%), open a little slower (60%).
    this.blink = p < 0.4 ? p / 0.4 : 1 - (p - 0.4) / 0.6;
    this.blink = this.blink * this.blink * (3 - 2 * this.blink);
  }
}
