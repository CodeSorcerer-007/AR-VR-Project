import React from 'react';
import { useCampusStore } from '../store/useCampusStore';
import { CampusMaterials } from './materials';

// ============================================================
// Bridge dimensions (shared constants)
// Spans X: 21 (Main east wall) → 33 (Annexure west wall) = 12m
// Corridor Z: 0 → 3, centre = 1.5
// ============================================================
const BRIDGE_LEN   = 12.0;  // X span
const BRIDGE_W     = 3.0;   // Z width
const PARAPET_H    = 1.15;
const PARAPET_T    = 0.2;
// Roof overhang above walkway: rises to Y+1.2 above slab, matching photos
const ROOF_RISE    = 1.2;

interface BridgeProps {
  yOffset: number;
  levelName: string;
}

// ============================================================
// POLYCARBONATE ROOF STRUCTURE (flat / very slightly pitched)
// Photos show a flat corrugated polycarbonate / sheet-metal roof
// stretched between the two buildings, supported by steel ribs.
// ============================================================
const BridgeRoof: React.FC<{ halfLen: number; materials: CampusMaterials }> = ({ halfLen, materials }) => {
  // Longitudinal steel purlins
  const purlinZ = [-BRIDGE_W / 2 + 0.15, 0, BRIDGE_W / 2 - 0.15];
  // Cross-ribs every 2.5m
  const ribX = Array.from({ length: 6 }, (_, i) => -halfLen + i * (BRIDGE_LEN / 5));

  return (
    <group position={[0, ROOF_RISE, 0]}>
      {/* Polycarbonate panel: one large translucent sheet */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} material={materials.polycarbonateRoof} castShadow>
        <planeGeometry args={[BRIDGE_LEN + 0.2, BRIDGE_W + 0.2]} />
      </mesh>

      {/* Steel cross-ribs (structural frames every ~2.4m) */}
      {ribX.map((rx) => (
        <mesh key={`rib-${rx}`} position={[rx, 0.02, 0]} material={materials.metalTrussGray}>
          <boxGeometry args={[0.06, 0.08, BRIDGE_W + 0.3]} />
        </mesh>
      ))}

      {/* Steel longitudinal purlins */}
      {purlinZ.map((pz) => (
        <mesh key={`purl-${pz}`} position={[0, 0.02, pz]} material={materials.metalTrussGray}>
          <boxGeometry args={[BRIDGE_LEN + 0.25, 0.06, 0.06]} />
        </mesh>
      ))}

      {/* Fascia edge beam (south, visible from approach) */}
      <mesh position={[0, -0.04, -BRIDGE_W / 2 - 0.06]} material={materials.columnNavyBlue}>
        <boxGeometry args={[BRIDGE_LEN + 0.25, 0.18, 0.08]} />
      </mesh>
      {/* Fascia edge beam (north) */}
      <mesh position={[0, -0.04, BRIDGE_W / 2 + 0.06]} material={materials.columnNavyBlue}>
        <boxGeometry args={[BRIDGE_LEN + 0.25, 0.18, 0.08]} />
      </mesh>
    </group>
  );
};

// ============================================================
// SINGLE PEDESTRIAN BRIDGE WITH POLYCARBONATE ROOF
// ============================================================
const SingleBridge: React.FC<BridgeProps> = ({ yOffset }) => {
  const materials = CampusMaterials.getInstance();
  const halfLen = BRIDGE_LEN / 2;

  return (
    <group position={[27, yOffset, 1.5]}>
      {/* ── 1. Structural Walkway Slab ──────────────────────────────── */}
      <mesh position={[0, -0.15, 0]} material={materials.roofSlab} castShadow receiveShadow>
        <boxGeometry args={[BRIDGE_LEN, 0.3, BRIDGE_W]} />
      </mesh>

      {/* ── 2. Walkway Dark Granite Floor Surface (matches photos) ──── */}
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]} material={materials.darkGraniteFoyer} receiveShadow>
        <planeGeometry args={[BRIDGE_LEN - 0.05, BRIDGE_W - 0.1]} />
      </mesh>

      {/* ── 3. Solid Concrete Parapets ──────────────────────────────── */}
      {/* North Parapet (Z = +1.4) */}
      <group position={[0, PARAPET_H / 2, BRIDGE_W / 2 - PARAPET_T / 2]}>
        <mesh material={materials.exteriorWall} castShadow receiveShadow>
          <boxGeometry args={[BRIDGE_LEN, PARAPET_H, PARAPET_T]} />
        </mesh>
        {/* Navy blue coping cap */}
        <mesh position={[0, PARAPET_H / 2 + 0.03, 0]} material={materials.columnNavyBlue}>
          <boxGeometry args={[BRIDGE_LEN + 0.05, 0.07, PARAPET_T + 0.06]} />
        </mesh>
        {/* Black skirting base */}
        <mesh position={[0, -PARAPET_H / 2 + 0.075, -PARAPET_T / 2 - 0.01]} material={materials.skirtingBlack}>
          <boxGeometry args={[BRIDGE_LEN, 0.15, 0.02]} />
        </mesh>
      </group>

      {/* South Parapet (Z = -1.4) */}
      <group position={[0, PARAPET_H / 2, -BRIDGE_W / 2 + PARAPET_T / 2]}>
        <mesh material={materials.exteriorWall} castShadow receiveShadow>
          <boxGeometry args={[BRIDGE_LEN, PARAPET_H, PARAPET_T]} />
        </mesh>
        {/* Navy blue coping cap */}
        <mesh position={[0, PARAPET_H / 2 + 0.03, 0]} material={materials.columnNavyBlue}>
          <boxGeometry args={[BRIDGE_LEN + 0.05, 0.07, PARAPET_T + 0.06]} />
        </mesh>
        {/* Black skirting base */}
        <mesh position={[0, -PARAPET_H / 2 + 0.075, PARAPET_T / 2 + 0.01]} material={materials.skirtingBlack}>
          <boxGeometry args={[BRIDGE_LEN, 0.15, 0.02]} />
        </mesh>
      </group>

      {/* ── 4. Structural Portal Frame Columns (anchoring to buildings) */}
      {[-halfLen + 0.2, halfLen - 0.2].map((px) => (
        <group key={px} position={[px, 0, 0]}>
          {/* South column */}
          <mesh position={[0, 1.6, -BRIDGE_W / 2 + 0.1]} material={materials.columnNavyBlue}>
            <boxGeometry args={[0.28, 3.2, 0.25]} />
          </mesh>
          {/* North column */}
          <mesh position={[0, 1.6, BRIDGE_W / 2 - 0.1]} material={materials.columnNavyBlue}>
            <boxGeometry args={[0.28, 3.2, 0.25]} />
          </mesh>
          {/* Cross-head beam */}
          <mesh position={[0, PARAPET_H + ROOF_RISE, 0]} material={materials.columnNavyBlue}>
            <boxGeometry args={[0.28, 0.22, BRIDGE_W + 0.15]} />
          </mesh>
        </group>
      ))}

      {/* ── 5. Under-bridge structural girders ──────────────────────── */}
      <mesh position={[0, -0.38, BRIDGE_W / 2 - 0.15]} material={materials.columnNavyBlue}>
        <boxGeometry args={[BRIDGE_LEN, 0.24, 0.18]} />
      </mesh>
      <mesh position={[0, -0.38, -BRIDGE_W / 2 + 0.15]} material={materials.columnNavyBlue}>
        <boxGeometry args={[BRIDGE_LEN, 0.24, 0.18]} />
      </mesh>
    </group>
  );
};

// ============================================================
// CONNECTING CORRIDOR CANOPY BETWEEN BUILDINGS
// Photos show: flat corrugated polycarbonate/metal sheet roof
// running the full height from ground to roofline (~16m)
// spanning the 12m gap between Main and Annexure.
// The canopy in photos is a sloped corrugated metal structure.
// ============================================================
const AlleywayCanopy: React.FC<{ yBase: number }> = ({ yBase }) => {
  const materials = CampusMaterials.getInstance();
  const span = 12.0;       // X: 21 → 33
  const depth = 36.0;      // Z: 0 → 36 (anchored over connecting bridges)
  const canopyH = 0.05;    // sheet thickness

  // Cross ribs at intervals along Z (every 4.5m)
  const ribZ = Array.from({ length: 9 }, (_, i) => -16 + i * 4.5);

  return (
    <group position={[27, yBase, 18]}>
      {/* Structural Central Ridge Purlin */}
      <mesh position={[0, 0.45, 0]} material={materials.metalTrussGray}>
        <boxGeometry args={[0.12, 0.12, depth]} />
      </mesh>

      {/* Realistic gentle dual-pitch roof sheets securely resting on roof edges */}
      {/* West slope toward Main Block (X = 21) */}
      <mesh position={[-3.0, 0.22, 0]} rotation={[0, 0, -0.05]} material={materials.polycarbonateRoof}>
        <boxGeometry args={[6.1, canopyH, depth]} />
      </mesh>
      {/* East slope toward Annexure Block (X = 33) */}
      <mesh position={[3.0, 0.22, 0]} rotation={[0, 0, 0.05]} material={materials.polycarbonateRoof}>
        <boxGeometry args={[6.1, canopyH, depth]} />
      </mesh>

      {/* Supporting steel cross-rib trusses connecting both roof parapets */}
      {ribZ.map((rz) => (
        <group key={`canopy-truss-${rz}`} position={[0, 0, rz]}>
          <mesh position={[-3.0, 0.22, 0]} rotation={[0, 0, -0.05]} material={materials.metalTrussGray}>
            <boxGeometry args={[6.0, 0.08, 0.08]} />
          </mesh>
          <mesh position={[3.0, 0.22, 0]} rotation={[0, 0, 0.05]} material={materials.metalTrussGray}>
            <boxGeometry args={[6.0, 0.08, 0.08]} />
          </mesh>
          {/* Rigid horizontal bottom chord tie bar */}
          <mesh position={[0, 0.02, 0]} material={materials.metalTrussGray}>
            <boxGeometry args={[span, 0.06, 0.06]} />
          </mesh>
        </group>
      ))}

      {/* South and North navy blue fascia edge trims */}
      <mesh position={[0, 0.22, -depth / 2]} material={materials.columnNavyBlue}>
        <boxGeometry args={[span + 0.1, 0.2, 0.06]} />
      </mesh>
      <mesh position={[0, 0.22, depth / 2]} material={materials.columnNavyBlue}>
        <boxGeometry args={[span + 0.1, 0.2, 0.06]} />
      </mesh>
    </group>
  );
};

// ============================================================
// MAIN EXPORT
// ============================================================
export const Bridges: React.FC = () => {
  const explodedView = useCampusStore((s) => s.explodedView);

  const yOffset1  = explodedView ? 4.0  * 1.5  : 4.0;
  const yOffset2  = explodedView ? 8.0  * 2.0  : 8.0;
  const yOffset3  = explodedView ? 12.0 * 2.25 : 12.0;
  const canopyY   = explodedView ? 16.0 * 2.3  : 17.4;

  return (
    <group>
      {/* First-Floor Pedestrian Bridge — with polycarbonate roof */}
      <SingleBridge yOffset={yOffset1} levelName="1st Floor Bridge" />

      {/* Second-Floor Pedestrian Bridge — with polycarbonate roof */}
      <SingleBridge yOffset={yOffset2} levelName="2nd Floor Bridge" />

      {/* Third-Floor Pedestrian Bridge — with polycarbonate roof */}
      <SingleBridge yOffset={yOffset3} levelName="3rd Floor Bridge" />

      {/* Full-Height Alleyway Corrugated Canopy Over Driveway */}
      <AlleywayCanopy yBase={canopyY} />
    </group>
  );
};
