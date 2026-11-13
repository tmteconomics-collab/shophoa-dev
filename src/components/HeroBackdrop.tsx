/**
 * Static hero painting (rendered from the live stage by scripts/render-starry-poster.mjs):
 * the poster before WebGL takes over, and the fallback when it never does. Decorative.
 */
export default function HeroBackdrop() {
  return (
    <picture>
      <source media="(max-aspect-ratio: 19/20)" srcSet="/portrait/starry-mobile.webp" type="image/webp" />
      <img
        className="hero-photo"
        src="/portrait/starry-desktop.webp"
        alt=""
        width={1500}
        height={1000}
        fetchPriority="high"
        decoding="async"
      />
    </picture>
  );
}
