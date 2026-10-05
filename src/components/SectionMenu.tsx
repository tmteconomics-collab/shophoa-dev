import type { SectionId } from "@/content/roles";
import { sectionList } from "@/content/sections";

/**
 * Header menu of every section, for screens without the section dots. A native
 * <details>, so it opens without JavaScript; src/stage/section-nav.ts marks the
 * current section and closes it after a jump.
 */
export default function SectionMenu({ order, proof }: { order: SectionId[]; proof: boolean }) {
  return (
    <details className="toc" data-toc>
      <summary className="toc-btn">
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" focusable="false">
          <path d="M2 3.5h10M2 7h10M2 10.5h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <span className="toc-label">Sections</span>
      </summary>
      <ol className="toc-panel">
        {sectionList(order, proof).map(([id, label]) => (
          <li key={id}>
            <a href={`#${id}`} data-dot={id}>
              {label}
            </a>
          </li>
        ))}
      </ol>
    </details>
  );
}
