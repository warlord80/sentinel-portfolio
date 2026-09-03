"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useMemo, type ReactNode } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Monolith } from "./monolith";
import { Particles } from "./particles";
import { detectTier, type Tier } from "./performance";

interface SceneProps {
  children?: ReactNode;
}

/**
 * Invalidate trigger — calls invalidate() on cursor/scroll changes so the
 * scene only renders when something actually changed (frameloop="demand").
 */
function InvalidationBridge() {
  const { invalidate } = useThree();

  // Subscribe to window events and invalidate the render loop
  useMemo(() => {
    const onMove = () => invalidate();
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("scroll", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onMove);
    };
  }, [invalidate]);

  return null;
}

/**
 * Three.js scene — rendered at z-index -1 with pointer-events: none.
 * Houses the Monolith, lighting, fog, bloom, particles, and cursor-driven effects.
 *
 * Uses frameloop="demand" to avoid rendering when nothing changes.
 */
export function Scene({ children }: SceneProps) {
  const tier: Tier = detectTier();

  const cameraConfig = useMemo(
    () => ({
      fov: 35,
      near: 0.1,
      far: 100,
      position: [0, 1.5, 5] as [number, number, number],
    }),
    [],
  );

  // Cap DPR to 1.5 max to avoid 4K performance issues
  const dpr = useMemo(() => {
    const raw = tier === "high" ? [1, 2] : tier === "medium" ? [1, 1.5] : [0.75, 1];
    return [raw[0], Math.min(raw[1], 1.5)] as [number, number];
  }, [tier]);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[-1]"
      data-environment-layer
      aria-hidden="true"
    >
      <Canvas
        gl={{
          antialias: tier !== "low",
          alpha: true,
          powerPreference: tier === "low" ? "low-power" : "high-performance",
        }}
        camera={cameraConfig}
        dpr={dpr}
        frameloop="demand"
        style={{ background: "transparent" }}
      >
        <InvalidationBridge />

        {/* Volumetric fog — deep, atmospheric */}
        <fog attach="fog" args={["#0f1014", 5, 22]} />

        {/* Ambient — enough to see form */}
        <ambientLight intensity={0.15} color="#eae9e4" />

        {/* Key light — directional from upper right */}
        <directionalLight
          position={[3, 5, 4]}
          intensity={0.6}
          color="#eae9e4"
        />

        {/* Back rim — silhouette edge glow */}
        <pointLight
          position={[0, 3, -4]}
          intensity={0.4}
          color="#c5a059"
          distance={12}
          decay={2}
        />

        <Suspense fallback={null}>
          <Monolith tier={tier} />
          {tier === "high" && <Particles count={120} />}
        </Suspense>

        {/* Postprocessing — bloom only on high tier (expensive) */}
        {tier === "high" && (
          <EffectComposer>
            <Bloom
              luminanceThreshold={0.35}
              luminanceSmoothing={0.6}
              intensity={0.5}
              mipmapBlur
            />
          </EffectComposer>
        )}

        {children}
      </Canvas>
    </div>
  );
}
