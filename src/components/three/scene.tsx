"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo, type ReactNode } from "react";
import * as THREE from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Monolith } from "./monolith";
import { Particles } from "./particles";
import { detectTier, type Tier } from "./performance";

interface SceneProps {
  children?: ReactNode;
}

/**
 * Three.js scene — rendered at z-index -1 with pointer-events: none.
 * Houses the Monolith, lighting, fog, bloom, particles, and cursor-driven effects.
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
          outputColorSpace: THREE.SRGBColorSpace,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.9,
        }}
        camera={cameraConfig}
        dpr={tier === "high" ? [1, 2] : tier === "medium" ? [1, 1.5] : [0.75, 1]}
        frameloop="always"
        style={{ background: "transparent" }}
      >
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

        {/* Fill light — faint brass warmth from the left */}
        <directionalLight
          position={[-3, 2, -1]}
          intensity={0.15}
          color="#c5a059"
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
          {tier !== "low" && <Particles count={tier === "high" ? 180 : 90} />}
        </Suspense>

        {/* Postprocessing — bloom makes brass accents glow */}
        {tier !== "low" && (
          <EffectComposer>
            <Bloom
              luminanceThreshold={0.35}
              luminanceSmoothing={0.9}
              intensity={0.6}
              mipmapBlur
            />
          </EffectComposer>
        )}

        {children}
      </Canvas>
    </div>
  );
}
