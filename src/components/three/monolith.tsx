"use client";

import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useThreeContext } from "./context";
import { createMonolithGeometry } from "./monolith-geometry";
import type { Tier } from "./performance";

interface MonolithProps {
  tier: Tier;
}

// Section-aware brass hue shifts
const sectionColors: Record<string, THREE.Color> = {
  about: new THREE.Color("#c5a059"),
  skills: new THREE.Color("#d4a84b"),
  projects: new THREE.Color("#c5a059"),
  experience: new THREE.Color("#b8965a"),
  certifications: new THREE.Color("#a89060"),
  writeups: new THREE.Color("#c0a255"),
  contact: new THREE.Color("#c5a059"),
};

const defaultColor = new THREE.Color("#c5a059");

/**
 * Abstract Monolith — the sentinel manifest.
 *
 * Behavior:
 * - Slow Y-axis rotation
 * - Complex sine-wave floating
 * - Cursor-driven brass point light across beveled edges
 * - Cursor-driven tilt
 * - Click/proximity pulse ring
 * - Section-aware color shift
 */
export function Monolith({ tier }: MonolithProps) {
  const groupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  const { cursor, scroll } = useThreeContext();
  // Read click from a ref pattern to avoid React render timing issues
  const clickRef = useRef(false);
  const prevClickState = useRef(false);

  const smooth = useRef({
    cursorX: 0,
    cursorY: 0,
    tiltX: 0,
    tiltY: 0,
    scrollY: 0,
    pulseScale: 0,
    pulseOpacity: 0,
    proximityPulse: 0,
  });

  // Cache viewport width, update on resize
  const isMobileRef = useRef(typeof window !== "undefined" && window.innerWidth < 768);
  useEffect(() => {
    const onResize = () => {
      isMobileRef.current = window.innerWidth < 768;
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const detail = useMemo(() => {
    switch (tier) {
      case "high": return 6;
      case "medium": return 4;
      case "low": return 2;
    }
  }, [tier]);

  const geometry = useMemo(() => createMonolithGeometry(detail), [detail]);

  // Pulse ring geometry
  const pulseGeo = useMemo(() => new THREE.RingGeometry(0.3, 0.35, 6), []);
  const pulseMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#c5a059",
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    [],
  );

  useFrame((_, delta) => {
    const group = groupRef.current;
    const light = lightRef.current;
    const pulse = pulseRef.current;
    if (!group) return;

    const t = performance.now() * 0.001;
    const s = smooth.current;

    // ── Cursor smoothing ───────────────────────────────────────────
    s.cursorX += (cursor.x - s.cursorX) * 2.0 * delta;
    s.cursorY += (cursor.y - s.cursorY) * 2.0 * delta;

    // ── Scroll smoothing ───────────────────────────────────────────
    s.scrollY += (scroll.progress - s.scrollY) * 2.5 * delta;

    // ── Slow Y rotation ───────────────────────────────────────────
    group.rotation.y += 0.08 * delta;

    // ── Cursor-driven tilt ─────────────────────────────────────────
    const targetTiltX = s.cursorY * 0.08;
    const targetTiltY = s.cursorX * 0.05;
    s.tiltX += (targetTiltX - s.tiltX) * 1.5 * delta;
    s.tiltY += (targetTiltY - s.tiltY) * 1.5 * delta;
    group.rotation.x = s.tiltX;
    group.rotation.y += s.tiltY;

    // ── Floating ───────────────────────────────────────────────────
    const floatX = Math.sin(t * 0.4) * 0.04 + Math.sin(t * 0.7) * 0.02;
    const floatY =
      Math.sin(t * 0.3) * 0.06 +
      Math.sin(t * 0.55) * 0.03 +
      Math.sin(t * 0.17) * 0.05;
    const floatZ = Math.cos(t * 0.35) * 0.025 + Math.cos(t * 0.6) * 0.012;

    // ── Scroll parallax ────────────────────────────────────────────
    const scrollOffset = s.scrollY;
    const baseY = -scrollOffset * 0.05;

    group.position.x = floatX;
    group.position.y = baseY + floatY;
    group.position.z = floatZ;

    // ── Viewport-aware scale (cached) ─────────────────────────────
    const isMobile = isMobileRef.current;
    const targetScale = isMobile ? 0 : 0.55;
    const currentScale = group.scale.x;
    group.scale.setScalar(
      currentScale + (targetScale - currentScale) * 4 * delta,
    );

    // ── Cursor-driven point light ──────────────────────────────────
    if (light) {
      light.position.x = s.cursorX * 0.8;
      light.position.y = 0.3 + s.cursorY * 0.6;
      light.position.z = 1.0;

      const dist = Math.sqrt(s.cursorX ** 2 + s.cursorY ** 2);
      light.intensity = isMobile ? 0 : 2.0 + dist * 0.8;

      // Section-aware color shift
      const sectionColor = scroll.section
        ? sectionColors[scroll.section] ?? defaultColor
        : defaultColor;
      light.color.lerp(sectionColor, 2.0 * delta);
    }

    // ── Proximity pulse (auto-pulse when cursor is near) ──────────
    const cursorDist = Math.sqrt(s.cursorX ** 2 + s.cursorY ** 2);
    if (cursorDist < 0.5) {
      s.proximityPulse += delta * 0.8;
      if (s.proximityPulse > Math.PI * 2) {
        s.proximityPulse = 0;
        s.pulseScale = 0.3;
        s.pulseOpacity = 0.6;
      }
    }

    // ── Click pulse (read from ref, not React state) ───────────────
    // Detect click state transition by comparing with previous
    const clickNow = clickRef.current;
    if (clickNow && !prevClickState.current) {
      s.pulseScale = 0.3;
      s.pulseOpacity = 0.8;
    }
    prevClickState.current = clickNow;

    // ── Pulse ring animation ───────────────────────────────────────
    if (pulse) {
      const mat = pulse.material as THREE.MeshBasicMaterial;
      if (s.pulseOpacity > 0.01) {
        s.pulseScale += 1.8 * delta;
        s.pulseOpacity *= 0.96;
        pulse.scale.setScalar(s.pulseScale);
        mat.opacity = s.pulseOpacity;
        pulse.rotation.z += 0.3 * delta;
      } else {
        mat.opacity = 0;
      }
    }
  });

  return (
    <group ref={groupRef} position={[1.8, 0, 0]} scale={0.55}>
      <primitive object={geometry} />

      {/* Cursor-driven brass light */}
      <pointLight
        ref={lightRef}
        color="#c5a059"
        intensity={2.0}
        distance={5}
        decay={2}
      />

      {/* Pulse ring — expands outward on click/proximity */}
      <mesh ref={pulseRef} geometry={pulseGeo} material={pulseMat} />
    </group>
  );
}
