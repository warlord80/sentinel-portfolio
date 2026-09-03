"use client";

import { Scene } from "@/components/three";

/**
 * Fixed background environment layer. The Three.js canvas mounts here at
 * z-index -1 with pointer-events: none (PRD §9 and the 2D/3D separation
 * mandate). Falls back to a plain div when WebGL is unavailable.
 */
export function EnvironmentLayer() {
  return <Scene />;
}
