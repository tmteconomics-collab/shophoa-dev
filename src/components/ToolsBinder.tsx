"use client";

import { useEffect } from "react";
import { bindTools } from "@/tools";

/** Binds the tool forms rendered by Tools.tsx. */
export default function ToolsBinder() {
  useEffect(() => bindTools(), []);
  return null;
}
