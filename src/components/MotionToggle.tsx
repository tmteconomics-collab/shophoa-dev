"use client";

import { useEffect, useRef } from "react";
import { bindMotionToggle } from "@/stage/motion-toggle";

/** Header button that pauses all motion on the page. See src/stage/motion-toggle.ts. */
export default function MotionToggle() {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => (ref.current ? bindMotionToggle(ref.current) : undefined), []);
  return (
    <button ref={ref} type="button" className="motion-toggle" data-state="playing" data-motion-toggle>
      <svg className="mt-pause" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" focusable="false">
        <rect x="2.5" y="2" width="3" height="10" rx="1" fill="currentColor" />
        <rect x="8.5" y="2" width="3" height="10" rx="1" fill="currentColor" />
      </svg>
      <svg className="mt-play" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" focusable="false">
        <path d="M4 2.2v9.6a.6.6 0 0 0 .9.5l7.4-4.8a.6.6 0 0 0 0-1L4.9 1.7a.6.6 0 0 0-.9.5Z" fill="currentColor" />
      </svg>
      <span className="mt-label">Pause motion</span>
    </button>
  );
}
