"use client";

import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface ParticlesProps {
  count?: number;
}

function initParticles(count: number) {
  const pos = new Float32Array(count * 3);
  const vel = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    pos[i3] = (Math.random() - 0.5) * 20;
    pos[i3 + 1] = (Math.random() - 0.5) * 14;
    pos[i3 + 2] = (Math.random() - 0.5) * 8 - 2;
    vel[i3] = (Math.random() - 0.5) * 0.001;
    vel[i3 + 1] = Math.random() * 0.002 + 0.0005;
    vel[i3 + 2] = (Math.random() - 0.5) * 0.0005;
    sizes[i] = Math.random() * 0.015 + 0.005;
  }
  return { pos, vel, sizes };
}

/**
 * Floating dust particles — drift slowly upward through the scene.
 * Lightweight: no cursor interaction, just gentle ambient motion.
 */
export function Particles({ count = 80 }: ParticlesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dataRef = useRef<ReturnType<typeof initParticles>>(initParticles(count));
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    const mesh = meshRef.current;
    const data = dataRef.current;
    if (!mesh || !data) return;

    const { pos, vel, sizes } = data;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      pos[i3] += vel[i3];
      pos[i3 + 1] += vel[i3 + 1];
      pos[i3 + 2] += vel[i3 + 2];

      // Wrap around
      if (pos[i3 + 1] > 8) {
        pos[i3 + 1] = -7;
        pos[i3] = (Math.random() - 0.5) * 20;
      }
      if (Math.abs(pos[i3]) > 12) {
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
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        color="#c5a059"
        transparent
        opacity={0.3}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  );
}
