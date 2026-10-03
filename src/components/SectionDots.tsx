"use client";

// Fixed dot navigation on wide screens: where you are on a long page, and a
// one-click jump to any section. The active dot is set by src/stage/section-dots.ts.
import { useEffect } from "react";
import { startSectionDots } from "@/stage/section-dots";
import type { SectionId } from "@/content/roles";

const middle: Record<SectionId, string> = {
  solutions: "Ad solutions",
  process: "How I work",
  measurement: "Measurement",
  websites: "WordPress",
};

export default function SectionDots({ order }: { order: SectionId[] }) {
  useEffect(() => startSectionDots(), []);
  const sections: [string, string][] = [
    ["top", "Start"],
    ["summary", "The short version"],
    ["about", "About"],
    ...order.map((id): [string, string] => [id, middle[id]]),
    ["built-with-ai", "Built with AI"],
    ["skills", "Skills"],
    ["contact", "Contact"],
  ];
  return (
    <nav className="dots" aria-label="Sections">
      <ol>
        {sections.map(([id, label]) => (
          <li key={id}>
            <a href={`#${id}`} data-dot={id}>
              <span className="dots-label">{label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
