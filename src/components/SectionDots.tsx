"use client";

// Fixed dot navigation on wide screens: where you are on a long page, and a
// one-click jump to any section. Also starts src/stage/section-nav.ts, which marks
// the current section here and in the Sections menu and fills the progress bar.
import { useEffect } from "react";
import { startSectionNav } from "@/stage/section-nav";
import type { SectionId } from "@/content/roles";
import { sectionList } from "@/content/sections";

export default function SectionDots({ order, proof }: { order: SectionId[]; proof: boolean }) {
  useEffect(() => startSectionNav(), []);
  return (
    <nav className="dots" aria-label="Sections">
      <ol>
        {sectionList(order, proof).map(([id, label]) => (
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
