"use client";

import { useEffect } from "react";
import { startScrollScenes } from "@/stage/scroll-scenes";

/** Mounts the DOM side of the scroll timeline. See src/stage/scroll-scenes.ts. */
export default function ScrollScenes() {
  useEffect(() => startScrollScenes(), []);
  return null;
}
