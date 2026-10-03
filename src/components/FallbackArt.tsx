// Static drawings shown in place of the particle shapes when WebGL is off
// (reduced motion, low-power devices, no WebGL). Decorative only.

const stroke = { fill: "none", stroke: "currentColor", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export function FunnelArt() {
  return (
    <svg className="fallback-art" viewBox="0 0 400 400" aria-hidden="true" focusable="false">
      <g {...stroke} strokeWidth={1.5} opacity={0.35}>
        <ellipse cx="200" cy="70" rx="170" ry="34" />
        <path d="M30 70 C 60 220, 150 260, 162 330 M370 70 C 340 220, 250 260, 238 330" />
      </g>
      <g {...stroke} strokeWidth={2.5}>
        <ellipse cx="200" cy="70" rx="170" ry="34" className="art-sun" />
        <ellipse cx="200" cy="160" rx="112" ry="22" />
        <ellipse cx="200" cy="250" rx="62" ry="13" />
        <ellipse cx="200" cy="330" rx="38" ry="8" />
      </g>
    </svg>
  );
}

export function RailsArt() {
  const sleepers = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  return (
    <svg className="fallback-art" viewBox="0 0 400 400" aria-hidden="true" focusable="false">
      <g {...stroke} strokeWidth={2}>
        {sleepers.map((i) => {
          const t = i / 8;
          const y = 380 - 300 * (1 - Math.pow(1 - t, 2.2));
          const half = 150 * Math.pow(1 - t, 1.6) + 12;
          return <line key={i} x1={200 - half} y1={y} x2={200 + half} y2={y} opacity={0.35 + 0.65 * (1 - t)} />;
        })}
        <path d="M95 390 L194 80 M305 390 L206 80" strokeWidth={3} />
      </g>
      <g className="art-sun" fill="currentColor">
        {[0.08, 0.32, 0.56, 0.8].map((t, i) => {
          const y = 380 - 300 * (1 - Math.pow(1 - t, 2.2));
          return <circle key={i} cx={200} cy={y} r={6 - i} />;
        })}
      </g>
    </svg>
  );
}

export function PromptArt() {
  return (
    <svg className="fallback-art" viewBox="0 0 400 300" aria-hidden="true" focusable="false">
      <rect x="20" y="20" width="360" height="260" rx="18" {...stroke} strokeWidth={1.5} opacity={0.35} />
      <g {...stroke} strokeWidth={22}>
        <path d="M95 85 L180 150 L95 215" />
        <path d="M215 215 L305 215" className="art-sun" />
      </g>
    </svg>
  );
}
