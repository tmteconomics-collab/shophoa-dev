/**
 * Static portrait: the poster before WebGL takes over, and the fallback.
 * Framing is pure CSS (see .hero-photo in globals.css) so nothing moves after
 * first paint; it mirrors heroFraming + focalCover in src/stage/config.ts.
 */
export default function HeroPhoto({ alt }: { alt: string }) {
  return (
    <picture>
      <source media="(max-aspect-ratio: 19/20)" srcSet="/portrait/portrait-mobile.webp" type="image/webp" />
      <img
        className="hero-photo"
        src="/portrait/portrait-desktop.webp"
        alt={alt}
        width={1800}
        height={1200}
        fetchPriority="high"
        decoding="async"
      />
    </picture>
  );
}
