"use client";

import { useEffect, useRef } from "react";
import { bootStage } from "@/stage/boot";

/** The fixed WebGL stage behind the page. See src/stage/boot.ts. */
export default function Stage() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => (ref.current ? bootStage(ref.current) : undefined), []);
  return <canvas ref={ref} className="stage" aria-hidden="true" />;
}
