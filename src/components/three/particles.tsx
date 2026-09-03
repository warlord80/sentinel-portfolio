"use client";

import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useThreeContext } from "./context";

interface ParticlesProps {
  count?: number;
}

function initParticles(count: number) {
  const pos = new Float32Array(count * 3);
  const vel = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    pos[i3] = (Math.random() - 0.5) * 16;
    pos[i3 + 1] = (Math.random() - 0.5) * 10;
    pos[i3 + 2] = (Math.random() - 0.5) * 12 - 2;
    vel[i3] = (Math.random() - 0.5) * 0.002;
    vel[i3 + 1] = Math.random() * 0.003 + 0.001;
    vel[i3 + 2] = (Math.random() - 0.5) * 0.001;
    sizes[i] = Math.random() * 0.02 + 0.005;
  }
  return { pos, vel, sizes };
}

/**
 * Floating dust particles — drift slowly through the scene.
 * React to cursor proximity: pushed away when the cursor gets close.
 * Uses squared-distance checks and plane geometry for performance.
 */
export function Particles({ count = 120 }: ParticlesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { cursor } = useThreeContext();

  const smoothCursor = useRef({ cursorX: 0, cursorY: 0 });
  const dataRef = useRef<ReturnType<typeof initParticles>>(initParticles(count));

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    const data = dataRef.current;
    if (!mesh || !data) return;

    const s = smoothCursor.current;
    s.cursorX += (cursor.x * 5 - s.cursorX) * 1.5 * delta;
    s.cursorY += (cursor.y * 3 - s.cursorY) * 1.5 * delta;

    const { pos, vel, sizes } = data;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Base drift
      pos[i3] += vel[i3];
      pos[i3 + 1] += vel[i3 + 1];
      pos[i3 + 2] += vel[i3 + 2];

      // Cursor repulsion — use squared distance (no sqrt)
      const dx = pos[i3] - s.cursorX;
      const dy = pos[i3 + 1] - s.cursorY;
      const distSq = dx * dx + dy * dy;
      if (distSq < 4.0 && distSq > 0.0001) {
        const dist = Math.sqrt(distSq);
        const force = (2.0 - dist) * 0.015;
        pos[i3] += (dx / dist) * force;
        pos[i3 + 1] += (dy / dist) * force;
      }

      // Wrap around
      if (pos[i3 + 1] > 6) {
        pos[i3 + 1] = -5;
        pos[i3] = (Math.random() - 0.5) * 16;
      }
      if (Math.abs(pos[i3]) > 10) {
        pos[i3] *= -0.5;
      }

      dummy.position.set(pos[i3], pos[i3 + 1], pos[i3 + 2]);
      dummy.scale.setScalar(sizes[i]);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      {/* Plane geometry (4 verts) instead of sphere (26 verts) for performance */}
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        color="#c5a059"
        transparent
        opacity={0.35}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  );
}
