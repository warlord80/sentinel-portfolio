"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo, type ReactNode } from "react";
import { Particles } from "./particles";
import { detectTier } from "./performance";

interface SceneProps {
  children?: ReactNode;
}

/**
 * Three.js scene — rendered at z-index -1 with pointer-events: none.
 * Lightweight floating dust particles. Continuous animation.
 */
export function Scene({ children }: SceneProps) {
  const tier = detectTier();

  const cameraConfig = useMemo(
    () => ({
      fov: 50,
      near: 0.1,
      far: 50,
      position: [0, 0, 8] as [number, number, number],
    }),
    [],
  );

  const dpr = useMemo(() => {
    const raw = tier === "high" ? [1, 1.5] : tier === "medium" ? [0.75, 1.25] : [0.5, 1];
    return [raw[0], Math.min(raw[1], 1.5)] as [number, number];
  }, [tier]);

  const particleCount = tier === "high" ? 100 : tier === "medium" ? 60 : 30;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[-1]"
      data-environment-layer
      aria-hidden="true"
    >
      <Canvas
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "low-power",
        }}
        camera={cameraConfig}
        dpr={dpr}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <Particles count={particleCount} />
        </Suspense>

        {children}
      </Canvas>
    </div>
  );
}
