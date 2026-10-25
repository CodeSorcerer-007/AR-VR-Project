import React from 'react';
import * as THREE from 'three';
import { CampusMaterials } from './materials';

// Tree model helper for forecourt landscaping (matching reference photos)
const CampusTree: React.FC<{ pos: [number, number, number]; scale?: number }> = ({ pos, scale = 1 }) => (
  <group position={pos} scale={scale}>
    {/* Trunk */}
    <mesh position={[0, 1.1, 0]} castShadow>
      <cylinderGeometry args={[0.14, 0.2, 2.2, 8]} />
      <meshStandardMaterial color="#4a3728" roughness={0.9} />
    </mesh>
    {/* Foliage base */}
    <mesh position={[0, 2.4, 0]} castShadow>
      <sphereGeometry args={[1.15, 8, 8]} />
      <meshStandardMaterial color="#2d6a4f" roughness={0.85} />
    </mesh>
    {/* Foliage crown */}
    <mesh position={[0, 3.2, 0]} castShadow>
      <sphereGeometry args={[0.85, 8, 8]} />
      <meshStandardMaterial color="#40916c" roughness={0.8} />
    </mesh>
  </group>
);

let barricadeTexture: THREE.CanvasTexture | null = null;
function getBarricadeTexture(): THREE.CanvasTexture {
  if (barricadeTexture) return barricadeTexture;
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#eab308';
  ctx.fillRect(0, 0, 512, 128);
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 54px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('SATHYABAMA', 256, 64);
  barricadeTexture = new THREE.CanvasTexture(canvas);
  barricadeTexture.colorSpace = THREE.SRGBColorSpace;
  return barricadeTexture;
}

// Sathyabama yellow collegiate safety barricade (Photo 9.29.07 PM (1))
const SathyabamaBarricade: React.FC<{ pos: [number, number, number]; rotY?: number }> = ({ pos, rotY = 0 }) => {
  const materials = CampusMaterials.getInstance();
  const barricadeTex = getBarricadeTexture();

  return (
    <group position={pos} rotation={[0, rotY, 0]}>
      {/* Outer yellow tubular frame */}
      <mesh position={[0, 0.55, 0]} material={materials.barricadeYellow} castShadow>
        <boxGeometry args={[2.0, 0.08, 0.08]} />
      </mesh>
      <mesh position={[-0.96, 0.3, 0]} material={materials.barricadeYellow}>
        <boxGeometry args={[0.08, 0.6, 0.08]} />
      </mesh>
      <mesh position={[0.96, 0.3, 0]} material={materials.barricadeYellow}>
        <boxGeometry args={[0.08, 0.6, 0.08]} />
      </mesh>
      {/* Black base outrigger feet */}
      <mesh position={[-0.96, 0.04, 0]} material={materials.chairBlack}>
        <boxGeometry args={[0.08, 0.08, 0.6]} />
      </mesh>
      <mesh position={[0.96, 0.04, 0]} material={materials.chairBlack}>
        <boxGeometry args={[0.08, 0.08, 0.6]} />
      </mesh>
      {/* Center Yellow Panel with SATHYABAMA lettering */}
      <mesh position={[0, 0.32, 0]}>
        <boxGeometry args={[1.8, 0.36, 0.02]} />
        <meshBasicMaterial map={barricadeTex} />
      </mesh>
    </group>
  );
};

export const Exterior: React.FC = () => {
  const materials = CampusMaterials.getInstance();

  // Coordinates:
  // Main Block: X = -21 to +21, Front facade Z = -8
  // Annexure Block (West): X = -53 to -33, Front facade Z = -8
  // Open Alleyway/Driveway: X = -33 to -21 (12m wide), Z = -20 to 46
  // Approach road starts ~20m in front (Z = -28)
  // Forecourt paved zone: Z = -8 to -20
  // Main road: Z = -20 to -30

  return (
    <group>
      {/* ── 1. Ground Terrain ──────────────────────────────────── */}
      <mesh position={[-16, -0.06, 15]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[220, 200]} />
        <meshStandardMaterial color="#c8d3c0" roughness={0.97} />
      </mesh>

      {/* ── 2. Main Approach Road (Z = -20 to -30) ──────────────── */}
      <mesh position={[-16, 0.01, -25]} rotation={[-Math.PI / 2, 0, 0]} material={materials.asphaltRoad} receiveShadow>
        <planeGeometry args={[140, 10]} />
      </mesh>
      {/* Road centre line dashes */}
      {[-50, -38, -26, -14, -2, 10, 22, 34].map((rx) => (
        <mesh key={rx} position={[rx, 0.02, -25]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[5, 0.25]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}

      {/* ── 3. Paved Forecourt / Campus Driveway (Z = -8 to -20) ── */}
      <mesh position={[-16, 0.02, -14]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[140, 12]} />
        <meshStandardMaterial color="#dde3e8" roughness={0.82} />
      </mesh>

      {/* ── 4. Open 12m Wide Connecting Driveway Between Main & Annexure ── */}
      {/* X: -33 to -21, Z: -20 to +46 */}
      <mesh position={[-27, 0.025, 13]} rotation={[-Math.PI / 2, 0, 0]} material={materials.asphaltRoad} receiveShadow>
        <planeGeometry args={[11.8, 66]} />
      </mesh>
      {/* Driveway kerb lines */}
      <mesh position={[-32.9, 0.06, 13]} material={materials.curbStriped}>
        <boxGeometry args={[0.2, 0.12, 66]} />
      </mesh>
      <mesh position={[-21.1, 0.06, 13]} material={materials.curbStriped}>
        <boxGeometry args={[0.2, 0.12, 66]} />
      </mesh>

      {/* ── 5. Landscaped Lawn Islands (matching reference photos) ── */}
      {/* West Island — in front of Annexure Block (X = -43) */}
      <group position={[-43, 0.05, -13]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} material={materials.lawnGrass} receiveShadow>
          <planeGeometry args={[18, 6]} />
        </mesh>
        {/* Black & white kerb edge */}
        <mesh position={[0, 0.09, 3]} material={materials.curbStriped}>
          <boxGeometry args={[18.2, 0.18, 0.22]} />
        </mesh>
        <mesh position={[0, 0.09, -3]} material={materials.curbStriped}>
          <boxGeometry args={[18.2, 0.18, 0.22]} />
        </mesh>
        <mesh position={[-9, 0.09, 0]} material={materials.curbStriped}>
          <boxGeometry args={[0.22, 0.18, 6]} />
        </mesh>
        <mesh position={[9, 0.09, 0]} material={materials.curbStriped}>
          <boxGeometry args={[0.22, 0.18, 6]} />
        </mesh>
        {/* Ornamental Trees */}
        <CampusTree pos={[-5, 0, 0]} scale={1.1} />
        <CampusTree pos={[4, 0, 0.5]} scale={0.9} />
      </group>

      {/* East Island — in front of Main East Wing (X = +12) */}
      <group position={[12, 0.05, -13]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} material={materials.lawnGrass} receiveShadow>
          <planeGeometry args={[16, 6]} />
        </mesh>
        <mesh position={[0, 0.09, 3]} material={materials.curbStriped}>
          <boxGeometry args={[16.2, 0.18, 0.22]} />
        </mesh>
        <mesh position={[0, 0.09, -3]} material={materials.curbStriped}>
          <boxGeometry args={[16.2, 0.18, 0.22]} />
        </mesh>
        <mesh position={[-8, 0.09, 0]} material={materials.curbStriped}>
          <boxGeometry args={[0.22, 0.18, 6]} />
        </mesh>
        <mesh position={[8, 0.09, 0]} material={materials.curbStriped}>
          <boxGeometry args={[0.22, 0.18, 6]} />
        </mesh>
        {/* Ornamental Trees */}
        <CampusTree pos={[-4, 0, -0.4]} scale={1.05} />
        <CampusTree pos={[3, 0, 0.4]} scale={0.95} />
      </group>

      {/* ── 6. Entrance Paved Walkway Path (center X = 0, between driveway and east lawn) */}
      <mesh position={[0, 0.03, -13]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[7, 6]} />
        <meshStandardMaterial color="#e8ecf0" roughness={0.75} />
      </mesh>

      {/* Sathyabama Yellow Safety Barricades flanking entrance driveway (Photo 9.29.07 PM (1)) */}
      <SathyabamaBarricade pos={[-2.8, 0, -16.5]} rotY={0.06} />
      <SathyabamaBarricade pos={[2.8, 0, -16.5]} rotY={-0.06} />

      {/* ── 7. Back of campus – paved service road ──────────────── */}
      <mesh position={[-16, 0.01, 46]} rotation={[-Math.PI / 2, 0, 0]} material={materials.asphaltRoad} receiveShadow>
        <planeGeometry args={[120, 8]} />
      </mesh>
    </group>
  );
};
