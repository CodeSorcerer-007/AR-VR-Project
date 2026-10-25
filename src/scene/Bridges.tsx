import React from 'react';
import { useCampusStore } from '../store/useCampusStore';
import { CampusMaterials } from './materials';

interface BridgeProps {
  yOffset: number;
  levelName: string;
}

const SingleBridge: React.FC<BridgeProps> = ({ yOffset, levelName }) => {
  const materials = CampusMaterials.getInstance();
  const bridgeLength = 12; // Spans X: 21 (Main) to 33 (Annexure), center = 27
  const bridgeWidth = 3.0; // Z: 0 to 3, center = 1.5
  const parapetH = 1.15;
  const parapetT = 0.2;

  return (
    <group position={[27, yOffset, 1.5]}>
      {/* ── 1. Structural Walkway Slab ────────────────────────────── */}
      <mesh position={[0, -0.15, 0]} material={materials.roofSlab} castShadow receiveShadow>
        <boxGeometry args={[bridgeLength, 0.3, bridgeWidth]} />
      </mesh>

      {/* ── 2. Walkway Granite Floor Surface with Ramp Crown ─────── */}
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]} material={materials.interiorFloorTile} receiveShadow>
        <planeGeometry args={[bridgeLength, bridgeWidth - 0.1]} />
      </mesh>

      {/* ── 3. Open-Air Safety Railings & Solid Concrete Parapets (Photo 9.29.11 PM (2)) ── */}
      {/* North Parapet Wall & Railing (Z = +1.4) */}
      <group position={[0, parapetH / 2, bridgeWidth / 2 - parapetT / 2]}>
        <mesh material={materials.exteriorWall} castShadow receiveShadow>
          <boxGeometry args={[bridgeLength, parapetH, parapetT]} />
        </mesh>
        {/* Parapet Coping Top Cap */}
        <mesh position={[0, parapetH / 2 + 0.03, 0]} material={materials.windowWhiteFrame}>
          <boxGeometry args={[bridgeLength + 0.05, 0.06, parapetT + 0.06]} />
        </mesh>
        {/* Stainless Steel Handrail Tube on top of parapet */}
        <mesh position={[0, parapetH / 2 + 0.12, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.railingSteel}>
          <cylinderGeometry args={[0.03, 0.03, bridgeLength, 8]} />
        </mesh>
        {/* Vertical railing posts */}
        {[-5, -2.5, 0, 2.5, 5].map((rx) => (
          <mesh key={rx} position={[rx, parapetH / 2 + 0.06, 0]} material={materials.railingSteel}>
            <cylinderGeometry args={[0.02, 0.02, 0.12, 8]} />
          </mesh>
        ))}
        {/* 15cm Black Skirting along walkway base */}
        <mesh position={[0, -parapetH / 2 + 0.075, -parapetT / 2 - 0.01]} material={materials.skirtingBlack}>
          <boxGeometry args={[bridgeLength, 0.15, 0.02]} />
        </mesh>
      </group>

      {/* South Parapet Wall & Railing (Z = -1.4) */}
      <group position={[0, parapetH / 2, -bridgeWidth / 2 + parapetT / 2]}>
        <mesh material={materials.exteriorWall} castShadow receiveShadow>
          <boxGeometry args={[bridgeLength, parapetH, parapetT]} />
        </mesh>
        {/* Parapet Coping Top Cap */}
        <mesh position={[0, parapetH / 2 + 0.03, 0]} material={materials.windowWhiteFrame}>
          <boxGeometry args={[bridgeLength + 0.05, 0.06, parapetT + 0.06]} />
        </mesh>
        {/* Stainless Steel Handrail Tube on top of parapet */}
        <mesh position={[0, parapetH / 2 + 0.12, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.railingSteel}>
          <cylinderGeometry args={[0.03, 0.03, bridgeLength, 8]} />
        </mesh>
        {/* Vertical railing posts */}
        {[-5, -2.5, 0, 2.5, 5].map((rx) => (
          <mesh key={rx} position={[rx, parapetH / 2 + 0.06, 0]} material={materials.railingSteel}>
            <cylinderGeometry args={[0.02, 0.02, 0.12, 8]} />
          </mesh>
        ))}
        {/* 15cm Black Skirting along walkway base */}
        <mesh position={[0, -parapetH / 2 + 0.075, parapetT / 2 + 0.01]} material={materials.skirtingBlack}>
          <boxGeometry args={[bridgeLength, 0.15, 0.02]} />
        </mesh>
      </group>

      {/* ── 4. Structural Portal Frames Anchoring to Buildings ─────────────────── */}
      {/* Navy blue structural portal columns at ends (X = -5.8 anchoring to Annexure, X = +5.8 anchoring to Main) */}
      {[-5.8, 5.8].map((px) => (
        <group key={px} position={[px, 0, 0]}>
          <mesh position={[0, 1.6, bridgeWidth / 2 - 0.1]} material={materials.columnNavyBlue}>
            <boxGeometry args={[0.3, 3.2, 0.25]} />
          </mesh>
          <mesh position={[0, 1.6, -bridgeWidth / 2 + 0.1]} material={materials.columnNavyBlue}>
            <boxGeometry args={[0.3, 3.2, 0.25]} />
          </mesh>
          <mesh position={[0, 3.1, 0]} material={materials.columnNavyBlue}>
            <boxGeometry args={[0.3, 0.25, bridgeWidth]} />
          </mesh>
        </group>
      ))}

      {/* ── 5. Cantilevered Steel Under-Girders (Driveway underneath remains completely open!) ── */}
      <mesh position={[0, -0.4, bridgeWidth / 2 - 0.15]} material={materials.columnNavyBlue}>
        <boxGeometry args={[bridgeLength, 0.25, 0.2]} />
      </mesh>
      <mesh position={[0, -0.4, -bridgeWidth / 2 + 0.15]} material={materials.columnNavyBlue}>
        <boxGeometry args={[bridgeLength, 0.25, 0.2]} />
      </mesh>
    </group>
  );
};

// ════════════════════════════════════════════════════════════
// CONNECTING CORRIDOR ARCHED BLUE CANOPY (Multi-floor Corridor)
// Prominently shown in 3D Isometric Overview & Satellite Top View
// Spans X: 21 (Main) to 33 (Annexure) at Z = 1.5
// Features arched translucent cyan/blue polycarbonate canopy with
// steel structural rib frames and side glazing.
// ════════════════════════════════════════════════════════════
const ConnectingCorridorCanopy: React.FC<{ yBase: number }> = ({ yBase }) => {
  const materials = CampusMaterials.getInstance();
  const span = 12.2;

  // Barrel-vault arch facets curving over the corridor walkway (cross-section in Y-Z plane)
  const archFacets = [
    { z: -1.45, y: 0.25, rotX: 0.65, w: 0.82 },
    { z: -0.78, y: 0.68, rotX: 0.32, w: 0.82 },
    { z: 0,     y: 0.82, rotX: 0,    w: 0.82 },
    { z: 0.78,  y: 0.68, rotX: -0.32, w: 0.82 },
    { z: 1.45,  y: 0.25, rotX: -0.65, w: 0.82 },
  ];

  return (
    <group position={[27, yBase, 1.5]}>
      {/* ── 1. Arched Polycarbonate Blue Canopy Roof ─────────────── */}
      {archFacets.map((f, idx) => (
        <mesh
          key={`canopy-facet-${idx}`}
          position={[0, f.y, f.z]}
          rotation={[f.rotX, 0, 0]}
          material={materials.canopyBlue}
          castShadow
        >
          <boxGeometry args={[span, 0.03, f.w]} />
        </mesh>
      ))}

      {/* ── 2. Arched Structural Steel Ribs ──────────────────────── */}
      {[-5.8, -2.9, 0, 2.9, 5.8].map((rx) => (
        <group key={`arch-rib-${rx}`} position={[rx, 0, 0]}>
          {archFacets.map((f, idx) => (
            <mesh
              key={`rib-seg-${idx}`}
              position={[0, f.y - 0.02, f.z]}
              rotation={[f.rotX, 0, 0]}
              material={materials.metalTrussGray}
            >
              <boxGeometry args={[0.08, 0.06, f.w + 0.02]} />
            </mesh>
          ))}
          {/* Vertical canopy support posts anchored to bridge slab */}
          <mesh position={[0, -0.6, -1.6]} material={materials.metalTrussGray}>
            <boxGeometry args={[0.08, 1.4, 0.08]} />
          </mesh>
          <mesh position={[0, -0.6, 1.6]} material={materials.metalTrussGray}>
            <boxGeometry args={[0.08, 1.4, 0.08]} />
          </mesh>
        </group>
      ))}

      {/* ── 3. Longitudinal Ridge & Eave Purlins ─────────────────── */}
      <mesh position={[0, 0.84, 0]} material={materials.metalTrussGray}>
        <boxGeometry args={[span + 0.1, 0.06, 0.06]} />
      </mesh>
      <mesh position={[0, 0.1, -1.65]} material={materials.metalTrussGray}>
        <boxGeometry args={[span + 0.1, 0.06, 0.06]} />
      </mesh>
      <mesh position={[0, 0.1, 1.65]} material={materials.metalTrussGray}>
        <boxGeometry args={[span + 0.1, 0.06, 0.06]} />
      </mesh>

      {/* ── 4. Upper Corridor Glazed Side Windows / Enclosure ─────── */}
      {/* North side glazing */}
      <mesh position={[0, -0.8, 1.62]} material={materials.canopyBlue}>
        <boxGeometry args={[span - 0.4, 1.4, 0.02]} />
      </mesh>
      <mesh position={[0, -0.8, 1.63]} material={materials.windowWhiteFrame}>
        <boxGeometry args={[span, 0.05, 0.04]} />
      </mesh>
      {/* South side glazing */}
      <mesh position={[0, -0.8, -1.62]} material={materials.canopyBlue}>
        <boxGeometry args={[span - 0.4, 1.4, 0.02]} />
      </mesh>
      <mesh position={[0, -0.8, -1.63]} material={materials.windowWhiteFrame}>
        <boxGeometry args={[span, 0.05, 0.04]} />
      </mesh>
    </group>
  );
};

export const Bridges: React.FC = () => {
  const explodedView = useCampusStore((s) => s.explodedView);

  // Bridges span between X = 21 (Main) and X = 33 (Annexure) at Z = 1.5
  // Bridge 1F is at Y = 4.0; Bridge 2F is at Y = 8.0; Bridge 3F is at Y = 12.0
  const yOffset1 = explodedView ? 4.0 * 1.5 : 4.0;
  const yOffset2 = explodedView ? 8.0 * 2.0 : 8.0;
  const yOffset3 = explodedView ? 12.0 * 2.25 : 12.0;
  const canopyY = explodedView ? 16.0 * 2.3 : 16.0;

  return (
    <group>
      {/* First-Floor Pedestrian Bridge with Solid Parapets & Safety Railings */}
      <SingleBridge yOffset={yOffset1} levelName="1st Floor Bridge" />

      {/* Second-Floor Pedestrian Bridge with Solid Parapets & Safety Railings */}
      <SingleBridge yOffset={yOffset2} levelName="2nd Floor Bridge" />

      {/* Third-Floor Pedestrian Bridge with Solid Parapets & Safety Railings */}
      <SingleBridge yOffset={yOffset3} levelName="3rd Floor Bridge" />

      {/* Multi-Floor Connecting Corridor Arched Blue Canopy */}
      <ConnectingCorridorCanopy yBase={canopyY} />
    </group>
  );
};
