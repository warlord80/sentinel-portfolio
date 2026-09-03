import * as THREE from "three";

/**
 * Abstract Monolith — engineered geometric artifact.
 * Built natively in Three.js with sharp bevels, planar surfaces, flat shading.
 * No curves, no smooth shading. Feels like an artifact of engineered intelligence.
 *
 * Structure: A tall faceted obelisk (ExtrudeGeometry from a custom
 * octagonal cross-section) with a secondary smaller shard floating above.
 * Material: Matte obsidian PBR (#08090B, roughness 0.9, metalness 0.1).
 */
export function createMonolithGeometry(detail: number): THREE.Group {
  const group = new THREE.Group();
  group.name = "monolith";

  const obsidian = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#1a1d21"),
    roughness: 0.85,
    metalness: 0.15,
    flatShading: true,
  });

  // ── Primary Obelisk ──────────────────────────────────────────────
  // Custom octagonal cross-section extruded upward with sharp bevels
  const shape = new THREE.Shape();
  const sides = 8;
  const radius = 0.5;
  for (let i = 0; i <= sides; i++) {
    const angle = (i / sides) * Math.PI * 2 - Math.PI / 8;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }

  const extrudeSettings = {
    steps: detail,
    depth: 2.8,
    bevelEnabled: true,
    bevelThickness: 0.08,
    bevelSize: 0.06,
    bevelOffset: 0,
    bevelSegments: 1,
  };

  const obeliskGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  obeliskGeo.computeVertexNormals();
  const obelisk = new THREE.Mesh(obeliskGeo, obsidian);
  // Rotate so the extrusion runs along Y (vertical)
  obelisk.rotation.x = -Math.PI / 2;
  obelisk.position.y = -1.4;
  obelisk.name = "monolith-body";
  group.add(obelisk);

  // ── Crown Shard ──────────────────────────────────────────────────
  // Smaller octahedron floating above the obelisk tip
  const crownGeo = new THREE.OctahedronGeometry(0.22, 0);
  crownGeo.scale(1, 1.6, 1);
  const crown = new THREE.Mesh(crownGeo, obsidian);
  crown.position.y = 1.65;
  crown.name = "monolith-crown";
  group.add(crown);

  // ── Base Plinth ──────────────────────────────────────────────────
  // Low, wide, faceted base
  const baseShape = new THREE.Shape();
  const baseSides = 6;
  const baseRadius = 0.65;
  for (let i = 0; i <= baseSides; i++) {
    const angle = (i / baseSides) * Math.PI * 2;
    const x = Math.cos(angle) * baseRadius;
    const y = Math.sin(angle) * baseRadius;
    if (i === 0) baseShape.moveTo(x, y);
    else baseShape.lineTo(x, y);
  }

  const baseExtrudeSettings = {
    steps: 1,
    depth: 0.1,
    bevelEnabled: true,
    bevelThickness: 0.04,
    bevelSize: 0.03,
    bevelOffset: 0,
    bevelSegments: 1,
  };

  const baseGeo = new THREE.ExtrudeGeometry(baseShape, baseExtrudeSettings);
  baseGeo.computeVertexNormals();
  const baseMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#121417"),
    roughness: 0.9,
    metalness: 0.1,
    flatShading: true,
  });
  const base = new THREE.Mesh(baseGeo, baseMat);
  base.rotation.x = -Math.PI / 2;
  base.position.y = -1.5;
  group.add(base);

  // ── Accent Lines ─────────────────────────────────────────────────
  // Thin brass edges at key geometric transitions
  const edgeMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#c5a059"),
    roughness: 0.4,
    metalness: 0.6,
    flatShading: true,
  });

  // Ring at obelisk mid-section
  const ringGeo = new THREE.TorusGeometry(0.38, 0.012, 4, sides);
  const ring = new THREE.Mesh(ringGeo, edgeMat);
  ring.position.y = 0.0;
  ring.rotation.x = Math.PI / 2;
  ring.name = "monolith-accent";
  group.add(ring);

  // Small accent at crown base
  const crownRingGeo = new THREE.TorusGeometry(0.14, 0.008, 4, sides);
  const crownRing = new THREE.Mesh(crownRingGeo, edgeMat);
  crownRing.position.y = 1.42;
  crownRing.rotation.x = Math.PI / 2;
  group.add(crownRing);

  // Second accent ring near base
  const baseRingGeo = new THREE.TorusGeometry(0.45, 0.01, 4, sides);
  const baseRing = new THREE.Mesh(baseRingGeo, edgeMat);
  baseRing.position.y = -1.2;
  baseRing.rotation.x = Math.PI / 2;
  group.add(baseRing);

  return group;
}
