import React from 'react';
import * as THREE from 'three';
import { useCampusStore } from '../store/useCampusStore';
import { CampusMaterials, createWindowGrillTexture } from './materials';
import { Text } from '@react-three/drei';

// ============================================================
// WALL SEGMENT HELPER — draws a solid wall mesh
// ============================================================
interface WallProps {
  pos: [number, number, number];
  size: [number, number, number]; // [width, height, depth]
  mat: THREE.MeshStandardMaterial;
  castShadow?: boolean;
  receiveShadow?: boolean;
}

const SHARED_UNIT_BOX_SHELL = new THREE.BoxGeometry(1, 1, 1);

const Wall: React.FC<WallProps> = ({ pos, size, mat, castShadow = false, receiveShadow = true }) => (
  <mesh position={pos} scale={size} geometry={SHARED_UNIT_BOX_SHELL} material={mat} castShadow={castShadow} receiveShadow={receiveShadow} />
);

// ============================================================
// MAIN BLOCK DIMENSIONS (world space)
// Campus Horizontally Aligned:
//   Facing facade from road looking North (+Z):
//   - Annexure Block on LEFT (X: 12 → 32)
//   - Pedestrian Bridge in CENTER (X: 0 → 12)
//   - St. Paul's Main on RIGHT (X: -42 → 0)
//   - Entrance centered at X = -21
//   - Signature Tower on FAR RIGHT at X = -42.4
// ============================================================
const MAIN_X0 = -21, MAIN_X1 = 21;
const MAIN_Z0 = -8, MAIN_Z1 = 40;  // front at -8, back at 40
const WALL_T = 0.3;   // exterior wall thickness
const ROOM_H = 3.5;   // clear room height
const CEIL_H = 3.7;   // ceiling slab bottom

// Entrance opening: centered at X=0, width=5.0m (X: -2.5 → 2.5), height=3.5m
const ENT_CX = 0, ENT_W = 5.0, ENT_H = 3.5;

// Window specs for exterior facade
const WIN_W = 2.8, WIN_H = 1.6, WIN_SILL = 0.9; // sill from floor
const WIN_CY = WIN_SILL + WIN_H / 2; // window center relative to current floor level (1.7m)

// Pre-allocated shared geometry singletons for maximum GPU reuse and 0 allocation overhead
const SHARED_WIN_PANE_GEOM = new THREE.PlaneGeometry(WIN_W, WIN_H);
const SHARED_WIN_FRAME_GEOM = new THREE.BoxGeometry(WIN_W + 0.14, WIN_H + 0.14, 0.03);
const SHARED_WIN_SILL_GEOM = new THREE.BoxGeometry(WIN_W + 0.28, 0.10, 0.14);
const SHARED_WIN_SHADE_BASE_GEOM = new THREE.BoxGeometry(WIN_W + 0.32, 0.07, 0.44);
const SHARED_WIN_SHADE_TOP_GEOM = new THREE.BoxGeometry(WIN_W + 0.33, 0.015, 0.45);
const SHARED_WIN_INT_SILL_GEOM = new THREE.BoxGeometry(WIN_W + 0.28, 0.08, 0.18);

const SHARED_AC_BODY_GEOM = new THREE.BoxGeometry(0.84, 0.58, 0.34);
const SHARED_AC_GRILL_GEOM = new THREE.CylinderGeometry(0.21, 0.21, 0.015, 16);
const SHARED_AC_HUB_GEOM = new THREE.CylinderGeometry(0.05, 0.05, 0.01, 12);
const SHARED_AC_BRACKET_GEOM = new THREE.BoxGeometry(0.04, 0.16, 0.34);
const SHARED_AC_PIPE_GEOM = new THREE.CylinderGeometry(0.02, 0.02, 0.2, 8);

export const SHARED_DOWNSPOUT_PIPE_GEOM = new THREE.CylinderGeometry(0.045, 0.045, ROOM_H + 0.3, 8);
export const SHARED_DOWNSPOUT_CLAMP_GEOM = new THREE.BoxGeometry(0.11, 0.03, 0.06);

// ============================================================
// ARCHITECTURAL WINDOW FIXTURE COMPONENT
// Realistic collegiate 2-panel sliding window fixture:
// 1. Recessed dark window aperture cavity
// 2. Reflective glass panes with inner security grills
// 3. Crisp white 3D uPVC perimeter frame
// 4. Physical center vertical white mullion
// 5. Crisp white outer architrave casing
// 6. Projecting white concrete window sill
// 7. Cantilevered concrete sunshade / chajja with top painted navy blue
// ============================================================
interface WindowFixtureProps {
  pos: [number, number, number];
  width?: number;
  height?: number;
  facing: 'south' | 'north' | 'west' | 'east';
  materials: CampusMaterials;
  grillTex: THREE.CanvasTexture;
  hasSunshade?: boolean;
}

const WindowFixture: React.FC<WindowFixtureProps> = ({
  pos,
  facing,
  materials,
  hasSunshade = true
}) => {
  const qualityPreset = useCampusStore((s) => s.qualityPreset);
  const cameraMode = useCampusStore((s) => s.cameraMode);
  const isWalking = cameraMode === 'first-person' || cameraMode === 'third-person';

  const rotY =
    facing === 'south' ? Math.PI :
    facing === 'north' ? 0 :
    facing === 'west'  ? -Math.PI / 2 :
    Math.PI / 2;

  // Ultra-optimized low preset: minimal draw calls
  if (qualityPreset === 'low') {
    return (
      <group position={pos} rotation={[0, rotY, 0]}>
        <mesh position={[0, 0, 0.015]} geometry={SHARED_WIN_PANE_GEOM} material={materials.windowGlass} />
        <mesh position={[0, 0, 0.01]} geometry={SHARED_WIN_FRAME_GEOM} material={materials.windowWhiteFrame} />
        {hasSunshade && (
          <group position={[0, WIN_H / 2 + 0.14, 0.22]}>
            <mesh geometry={SHARED_WIN_SHADE_BASE_GEOM} material={materials.windowSill} />
            <mesh position={[0, 0.038, 0]} geometry={SHARED_WIN_SHADE_TOP_GEOM} material={materials.sunshadeNavyBlue} />
          </group>
        )}
      </group>
    );
  }

  return (
    <group position={pos} rotation={[0, rotY, 0]}>
      {/* 1. Architectural Tinted Glass Pane with Window Grill Pattern */}
      <mesh position={[0, 0, 0.015]} geometry={SHARED_WIN_PANE_GEOM} material={materials.windowGlass} />

      {/* 2. Crisp White uPVC Perimeter Frame */}
      <mesh position={[0, 0, 0.01]} geometry={SHARED_WIN_FRAME_GEOM} material={materials.windowWhiteFrame} />

      {/* 3. White Concrete Window Sill with Drip Edge */}
      <mesh position={[0, -WIN_H / 2 - 0.05, 0.07]} geometry={SHARED_WIN_SILL_GEOM} material={materials.windowSill} />

      {/* 4. Cantilevered Sunshade (Chajja) */}
      {hasSunshade && (
        <group position={[0, WIN_H / 2 + 0.14, 0.22]}>
          <mesh geometry={SHARED_WIN_SHADE_BASE_GEOM} material={materials.windowSill} />
          <mesh position={[0, 0.038, 0]} geometry={SHARED_WIN_SHADE_TOP_GEOM} material={materials.sunshadeNavyBlue} />
        </group>
      )}

      {/* 5. Interior Room-Facing Window Aperture (Only rendered when walking inside or in ultra mode) */}
      {(isWalking || qualityPreset === 'ultra') && (
        <group position={[0, 0, -WALL_T]}>
          <mesh position={[0, 0, -0.015]} rotation={[0, Math.PI, 0]} geometry={SHARED_WIN_PANE_GEOM} material={materials.windowGlass} />
          <mesh position={[0, 0, -0.01]} geometry={SHARED_WIN_FRAME_GEOM} material={materials.windowWhiteFrame} />
          <mesh position={[0, -WIN_H / 2 - 0.05, -0.08]} geometry={SHARED_WIN_INT_SILL_GEOM} material={materials.windowSill} />
        </group>
      )}
    </group>
  );
};

// ============================================================
// ARCHITECTURAL SPLIT-AC OUTDOOR COMPRESSOR UNIT
// ============================================================
interface ACOutdoorUnitProps {
  pos: [number, number, number];
  facing: 'south' | 'north' | 'west' | 'east';
  materials: CampusMaterials;
}

const ACOutdoorUnit: React.FC<ACOutdoorUnitProps> = ({ pos, facing, materials }) => {
  const qualityPreset = useCampusStore((s) => s.qualityPreset);
  if (qualityPreset === 'low') return null; // Skip non-essential outdoor compressors on low preset

  const rotY =
    facing === 'south' ? Math.PI :
    facing === 'north' ? 0 :
    facing === 'west'  ? -Math.PI / 2 :
    Math.PI / 2;

  return (
    <group position={pos} rotation={[0, rotY, 0]}>
      {/* 1. Main Powder-Coated Metal Compressor Housing */}
      <mesh position={[0, 0, 0.22]} geometry={SHARED_AC_BODY_GEOM} material={materials.acCompressorWhite} />

      {/* 2. Front Circular Exhaust Fan (Simplified on medium) */}
      {qualityPreset !== 'medium' && (
        <>
          <mesh position={[0.14, 0, 0.392]} rotation={[Math.PI / 2, 0, 0]} geometry={SHARED_AC_GRILL_GEOM} material={materials.acFanGrill} />
          <mesh position={[0.14, 0, 0.402]} rotation={[Math.PI / 2, 0, 0]} geometry={SHARED_AC_HUB_GEOM} material={materials.acCompressorWhite} />
        </>
      )}

      {/* 3. Steel Wall Mounting Brackets */}
      <mesh position={[-0.30, -0.34, 0.17]} geometry={SHARED_AC_BRACKET_GEOM} material={materials.railingSteel} />
      <mesh position={[0.30, -0.34, 0.17]} geometry={SHARED_AC_BRACKET_GEOM} material={materials.railingSteel} />
    </group>
  );
};

// Helper slab patches for floor and ceiling cutouts
interface SlabPatch {
  x0: number;
  x1: number;
  z0: number;
  z1: number;
}

const MAIN_PERMANENT_PATCHES: SlabPatch[] = [
  // Band 1: Front Wing (Z: -8 to 0)
  { x0: -21, x1: 21, z0: -8, z1: 0 },
  // Band 2: Central Core (Z: 10 to 22)
  { x0: -21, x1: 21, z0: 10, z1: 22 },
  // Band 3: Rear Wing (Z: 32 to 40)
  { x0: -21, x1: 21, z0: 32, z1: 40 },

  // Band 4: Front Inner Zone (Z: 0 to 10)
  { x0: -21, x1: -16.5, z0: 0, z1: 10 },
  { x0: -16.5, x1: -13.5, z0: 5.5, z1: 10 },
  { x0: -13.5, x1: -10.5, z0: 0, z1: 10 },
  { x0: -10.5, x1: -3.5, z0: 0, z1: 3.5 },
  { x0: -10.5, x1: -3.5, z0: 9.5, z1: 10 },
  { x0: -3.5, x1: 3.5, z0: 0, z1: 10 },
  { x0: 3.5, x1: 10.5, z0: 0, z1: 3.5 },
  { x0: 3.5, x1: 10.5, z0: 9.5, z1: 10 },
  { x0: 10.5, x1: 13.5, z0: 0, z1: 10 },
  { x0: 13.5, x1: 16.5, z0: 5.5, z1: 10 },
  { x0: 16.5, x1: 21, z0: 0, z1: 10 },

  // Band 5: Rear Inner Zone (Z: 22 to 32)
  { x0: -21, x1: -10.5, z0: 22, z1: 32 },
  { x0: -10.5, x1: -3.5, z0: 22, z1: 22.5 },
  { x0: -10.5, x1: -3.5, z0: 28.5, z1: 32 },
  { x0: -3.5, x1: 3.5, z0: 22, z1: 32 },
  { x0: 3.5, x1: 10.5, z0: 22, z1: 22.5 },
  { x0: 3.5, x1: 10.5, z0: 28.5, z1: 32 },
  { x0: 10.5, x1: 21, z0: 22, z1: 32 },
];

const MAIN_STAIR_PATCHES: SlabPatch[] = [
  { x0: -16.5, x1: -13.5, z0: 0, z1: 5.5 }, // West stair
  { x0: 13.5, x1: 16.5, z0: 0, z1: 5.5 },   // East stair
];

const ANNEXURE_PERMANENT_PATCHES: SlabPatch[] = [
  // South Wing (Z: -8 to 0)
  { x0: 33, x1: 53, z0: -8, z1: 0 },
  // North Wing (Z: 36 to 44)
  { x0: 33, x1: 53, z0: 36, z1: 44 },
  // Outer Rooms away from Main (Z: 0 to 36, X: 41 to 53)
  { x0: 41, x1: 53, z0: 0, z1: 36 },
  // West/inner corridor & bridge approach (X: 33 to 41)
  { x0: 36.5, x1: 41, z0: 0, z1: 13 },
  { x0: 33.5, x1: 36.5, z0: 5.5, z1: 13 },
  { x0: 33, x1: 33.5, z0: 0, z1: 13 },
  // Around central light court (light court void is X: 41.5..44.5, Z: 13..25)
  { x0: 33, x1: 41.5, z0: 13, z1: 25 },
  // North corridor
  { x0: 33, x1: 41, z0: 25, z1: 36 },
];

const ANNEXURE_STAIR_PATCHES: SlabPatch[] = [
  { x0: 37.5, x1: 40.5, z0: 0, z1: 5.5 }
];

// ============================================================
// PER-FLOOR MAIN BLOCK EXTERIOR SHELL
// ============================================================
const MainFloor: React.FC<{ floorY: number; flIdx: number; grillTex: THREE.CanvasTexture; materials: CampusMaterials }> = ({
  floorY, flIdx, grillTex, materials
}) => {
  const isGround = flIdx === 0;

  // Front facade windows (centered at X=0, entrance is X: -2.5..2.5)
  const frontWinX = isGround ? [-17, -11, -5, 5, 11, 17] : [-17, -11, -5, 0, 5, 11, 17];
  const rearWinX = [-17, -11, -5, 0, 5, 11, 17];
  const westWinZ = [0, 8, 16, 24, 32];
  const eastWinZ = [8, 16, 24, 32]; // Bridge portal at Z=0..3 on 1F/2F

  // Downspout drain pipe X locations between window bays
  const frontDownspoutsX = [-14, -8, 8, 14];
  const rearDownspoutsX = [-14, -8, 8, 14];

  // Split-AC outdoor units mounted on exterior walls of upper floors
  const frontAcX = !isGround ? [-14, -8, 8, 14] : [];
  const rearAcX = !isGround ? [-14, -8, 8, 14] : [];
  const westAcZ = !isGround ? [12, 20, 28] : [];

  // Floor & Ceiling slab patches with stairwell & courtyard cutouts
  const floorPatches = isGround ? [...MAIN_PERMANENT_PATCHES, ...MAIN_STAIR_PATCHES] : MAIN_PERMANENT_PATCHES;
  const ceilPatches = flIdx === 4 ? [...MAIN_PERMANENT_PATCHES, ...MAIN_STAIR_PATCHES] : MAIN_PERMANENT_PATCHES;

  return (
    <group position={[0, floorY, 0]}>
      {/* ── Segmented Floor Slabs & Interior Tile Surfaces ───────── */}
      {floorPatches.map((p, idx) => {
        const w = p.x1 - p.x0;
        const d = p.z1 - p.z0;
        const cx = (p.x0 + p.x1) / 2;
        const cz = (p.z0 + p.z1) / 2;
        return (
          <group key={`mf-slab-${idx}`}>
            <mesh position={[cx, -0.15, cz]} material={materials.roofSlab} receiveShadow>
              <boxGeometry args={[w, 0.3, d]} />
            </mesh>
            <mesh position={[cx, 0.01, cz]} rotation={[-Math.PI / 2, 0, 0]} material={materials.interiorFloorTile} receiveShadow>
              <planeGeometry args={[w - 0.04, d - 0.04]} />
            </mesh>
          </group>
        );
      })}

      {/* ── Segmented Ceiling Slabs (Stairwells and Courtyards open to sky/above) ── */}
      {ceilPatches.map((p, idx) => {
        const w = p.x1 - p.x0;
        const d = p.z1 - p.z0;
        const cx = (p.x0 + p.x1) / 2;
        const cz = (p.z0 + p.z1) / 2;
        return (
          <mesh key={`mf-ceil-${idx}`} position={[cx, CEIL_H, cz]} rotation={[Math.PI / 2, 0, 0]} material={materials.ceilingConcrete}>
            <planeGeometry args={[w - 0.04, d - 0.04]} />
          </mesh>
        );
      })}

      {/* ══════════════════════════════════════════════════════════
          FRONT FACADE  (Z = -8, faces visitor approach / forecourt)
          ══════════════════════════════════════════════════════════ */}

      {/* Ground floor: Left of entrance (X: -21 → -2.5) */}
      {isGround && (
        <Wall pos={[-11.75, ROOM_H / 2, MAIN_Z0 + WALL_T / 2]}
              size={[18.5, ROOM_H, WALL_T]} mat={materials.exteriorWall} />
      )}

      {/* Ground floor: Right of entrance (X: 2.5 → 21) */}
      {isGround && (
        <Wall pos={[11.75, ROOM_H / 2, MAIN_Z0 + WALL_T / 2]}
              size={[18.5, ROOM_H, WALL_T]} mat={materials.exteriorWall} />
      )}

      {/* Upper floors */}
      {!isGround && (
        <>
          <Wall pos={[-11.75, ROOM_H / 2, MAIN_Z0 + WALL_T / 2]}
                size={[18.5, ROOM_H, WALL_T]} mat={materials.exteriorWall} />
          <Wall pos={[0, ROOM_H / 2, MAIN_Z0 + WALL_T / 2]}
                size={[5.0, ROOM_H, WALL_T]} mat={materials.exteriorWall} />
          <Wall pos={[11.75, ROOM_H / 2, MAIN_Z0 + WALL_T / 2]}
                size={[18.5, ROOM_H, WALL_T]} mat={materials.exteriorWall} />
        </>
      )}

      {/* Entrance lintel beam (over opening, ground floor only) */}
      {isGround && (
        <Wall pos={[ENT_CX, ROOM_H - 0.15, MAIN_Z0 + WALL_T / 2]}
              size={[ENT_W + 0.4, 0.3, WALL_T + 0.08]} mat={materials.corniceBronze} />
      )}

      {/* Front facade windows with blue sunshade chajjas */}
      {frontWinX.map((wx) => (
        <WindowFixture
          key={`mf-fw-${wx}`}
          pos={[wx, WIN_CY, MAIN_Z0]}
          facing="south"
          materials={materials}
          grillTex={grillTex}
        />
      ))}

      {/* Wall-mounted Split-AC Outdoor Compressor Units */}
      {frontAcX.map((ax) => (
        <ACOutdoorUnit
          key={`mf-fac-${ax}`}
          pos={[ax, 2.5, MAIN_Z0]}
          facing="south"
          materials={materials}
        />
      ))}

      {/* Vertical PVC Downspouts on front facade with wall mounting clamps */}
      {frontDownspoutsX.map((px) => (
        <group key={`mf-fdsp-${px}`} position={[px, ROOM_H / 2, MAIN_Z0 - 0.08]}>
          <mesh geometry={SHARED_DOWNSPOUT_PIPE_GEOM} material={materials.pvcPipeWhite} />
          {[-1.2, 0, 1.2].map((cy) => (
            <mesh key={cy} position={[0, cy, 0.03]} geometry={SHARED_DOWNSPOUT_CLAMP_GEOM} material={materials.railingSteel} />
          ))}
        </group>
      ))}

      {/* Authentic dark bronze/chocolate horizontal spandrel cornice band */}
      <Wall pos={[0, ROOM_H + 0.15, MAIN_Z0 - 0.02]}
            size={[42.2, 0.35, 0.08]} mat={materials.corniceBronze} />
      {/* Crisp white floor divider reveal line */}
      <Wall pos={[0, ROOM_H + 0.33, MAIN_Z0 - 0.025]}
            size={[42.25, 0.04, 0.09]} mat={materials.windowWhiteFrame} />

      {/* ══════════════════════════════════════════════════════════
          REAR FACADE  (Z = 40)
          ══════════════════════════════════════════════════════════ */}
      <Wall pos={[0, ROOM_H / 2, MAIN_Z1 - WALL_T / 2]}
            size={[42, ROOM_H, WALL_T]} mat={materials.exteriorWall} />

      {rearWinX.map((wx) => (
        <WindowFixture
          key={`mf-rw-${wx}`}
          pos={[wx, WIN_CY, MAIN_Z1]}
          facing="north"
          materials={materials}
          grillTex={grillTex}
        />
      ))}

      {/* Rear facade Split-AC Units */}
      {rearAcX.map((ax) => (
        <ACOutdoorUnit
          key={`mf-rac-${ax}`}
          pos={[ax, 2.5, MAIN_Z1]}
          facing="north"
          materials={materials}
        />
      ))}

      {/* Vertical PVC Downspouts on rear facade */}
      {rearDownspoutsX.map((px) => (
        <group key={`mf-rdsp-${px}`} position={[px, ROOM_H / 2, MAIN_Z1 + 0.08]}>
          <mesh geometry={SHARED_DOWNSPOUT_PIPE_GEOM} material={materials.pvcPipeWhite} />
          {[-1.2, 0, 1.2].map((cy) => (
            <mesh key={cy} position={[0, cy, -0.03]} geometry={SHARED_DOWNSPOUT_CLAMP_GEOM} material={materials.railingSteel} />
          ))}
        </group>
      ))}

      <Wall pos={[0, ROOM_H + 0.15, MAIN_Z1 + 0.02]}
            size={[42.2, 0.35, 0.08]} mat={materials.corniceBronze} />
      <Wall pos={[0, ROOM_H + 0.33, MAIN_Z1 + 0.025]}
            size={[42.25, 0.04, 0.09]} mat={materials.windowWhiteFrame} />

      {/* ══════════════════════════════════════════════════════════
          OUTER WEST FACADE  (X = -21, campus outer lawn side)
          ══════════════════════════════════════════════════════════ */}
      <Wall pos={[MAIN_X0 + WALL_T / 2, ROOM_H / 2, 16]}
            size={[WALL_T, ROOM_H, 48]} mat={materials.exteriorWall} />

      {westWinZ.map((wz) => (
        <WindowFixture
          key={`mf-ww-${wz}`}
          pos={[MAIN_X0, WIN_CY, wz]}
          facing="west"
          materials={materials}
          grillTex={grillTex}
        />
      ))}

      {westAcZ.map((az) => (
        <ACOutdoorUnit
          key={`mf-wac-${az}`}
          pos={[MAIN_X0, 2.5, az]}
          facing="west"
          materials={materials}
        />
      ))}

      <Wall pos={[MAIN_X0 - 0.02, ROOM_H + 0.15, 16]}
            size={[0.08, 0.35, 48.2]} mat={materials.corniceBronze} />
      <Wall pos={[MAIN_X0 - 0.025, ROOM_H + 0.33, 16]}
            size={[0.09, 0.04, 48.25]} mat={materials.windowWhiteFrame} />

      {/* ══════════════════════════════════════════════════════════
          INNER EAST FACADE (X = 21, facing Annexure and Pedestrian Bridge)
          ══════════════════════════════════════════════════════════ */}
      {flIdx === 1 || flIdx === 2 ? (
        <>
          {/* Wall South of bridge portal: Z: -8 -> 0 */}
          <Wall pos={[MAIN_X1 - WALL_T / 2, ROOM_H / 2, -4]}
                size={[WALL_T, ROOM_H, 8]} mat={materials.exteriorWall} />
          {/* Lintel Beam above bridge portal: Z: 0 -> 3 */}
          <Wall pos={[MAIN_X1 - WALL_T / 2, ROOM_H - 0.4, 1.5]}
                size={[WALL_T + 0.04, 0.8, 3.0]} mat={materials.exteriorWall} />
          {/* Wall North of bridge portal: Z: 3 -> 40 */}
          <Wall pos={[MAIN_X1 - WALL_T / 2, ROOM_H / 2, 21.5]}
                size={[WALL_T, ROOM_H, 37]} mat={materials.exteriorWall} />
        </>
      ) : (
        <Wall pos={[MAIN_X1 - WALL_T / 2, ROOM_H / 2, 16]}
              size={[WALL_T, ROOM_H, 48]} mat={materials.exteriorWall} />
      )}

      {eastWinZ.map((wz) => (
        <WindowFixture
          key={`mf-ew-${wz}`}
          pos={[MAIN_X1, WIN_CY, wz]}
          facing="east"
          materials={materials}
          grillTex={grillTex}
        />
      ))}

      <Wall pos={[MAIN_X1 + 0.02, ROOM_H + 0.15, 16]}
            size={[0.08, 0.35, 48.2]} mat={materials.corniceBronze} />
      <Wall pos={[MAIN_X1 + 0.025, ROOM_H + 0.33, 16]}
            size={[0.09, 0.04, 48.25]} mat={materials.windowWhiteFrame} />
    </group>
  );
};

// ============================================================
// ANNEXURE BLOCK
// Width: 20m (X: 33 -> 53)
// Depth: 52m (Z: -8 -> 44)
// ============================================================
const ANN_X0 = 33, ANN_X1 = 53;
const ANN_Z0 = -8, ANN_Z1 = 44;
const ANN_CX = (ANN_X0 + ANN_X1) / 2; // 43

const AnnexureFloor: React.FC<{ floorY: number; flIdx: number; grillTex: THREE.CanvasTexture; materials: CampusMaterials }> = ({
  floorY, flIdx, grillTex, materials
}) => {
  const isGround = flIdx === 0;
  const annWinZ = [-4, 4, 12, 20, 28, 36];
  const annRearX = [35, 39, 43, 47, 51];

  // Split-AC outdoor units mounted on exterior walls of upper floors
  const annAcZ = !isGround ? [4, 16, 28] : [];
  const annDownspoutsZ = [0, 16, 32];

  const annPatches = isGround ? [...ANNEXURE_PERMANENT_PATCHES, ...ANNEXURE_STAIR_PATCHES] : ANNEXURE_PERMANENT_PATCHES;
  const annCeilPatches = flIdx === 4 ? [...ANNEXURE_PERMANENT_PATCHES, ...ANNEXURE_STAIR_PATCHES] : ANNEXURE_PERMANENT_PATCHES;

  return (
    <group position={[0, floorY, 0]}>
      {/* ── Segmented Annexure Floor Slabs & Tile Surfaces ───────── */}
      {annPatches.map((p, idx) => {
        const w = p.x1 - p.x0;
        const d = p.z1 - p.z0;
        const cx = (p.x0 + p.x1) / 2;
        const cz = (p.z0 + p.z1) / 2;
        return (
          <group key={`af-slab-${idx}`}>
            <mesh position={[cx, -0.15, cz]} material={materials.roofSlab} receiveShadow>
              <boxGeometry args={[w, 0.3, d]} />
            </mesh>
            <mesh position={[cx, 0.01, cz]} rotation={[-Math.PI / 2, 0, 0]} material={materials.interiorFloorTile} receiveShadow>
              <planeGeometry args={[w - 0.04, d - 0.04]} />
            </mesh>
          </group>
        );
      })}

      {/* ── CONTINUOUS ARCHITECTURAL CANTILEVER CHAJJA SLAB WITH NAVY BLUE FASCIA (Photos 9.28.50 PM (1) & (2)) ── */}
      {/* Concrete cantilever projecting slab extending 0.65m forward across entire front facade */}
      <mesh position={[ANN_CX, -0.1, ANN_Z0 - 0.325]} material={materials.exteriorWall} castShadow receiveShadow>
        <boxGeometry args={[20.5, 0.20, 0.65]} />
      </mesh>
      {/* Continuous deep navy blue front edge trim */}
      <mesh position={[ANN_CX, -0.1, ANN_Z0 - 0.66]} material={materials.sunshadeNavyBlue}>
        <boxGeometry args={[20.54, 0.20, 0.04]} />
      </mesh>
      {/* West and East side blue return caps */}
      <mesh position={[ANN_X0 - 0.26, -0.1, ANN_Z0 - 0.325]} material={materials.sunshadeNavyBlue}>
        <boxGeometry args={[0.04, 0.20, 0.67]} />
      </mesh>
      <mesh position={[ANN_X1 + 0.26, -0.1, ANN_Z0 - 0.325]} material={materials.sunshadeNavyBlue}>
        <boxGeometry args={[0.04, 0.20, 0.67]} />
      </mesh>

      {/* ── Segmented Ceiling Slabs (Stairwell and Light Court Open) ─ */}
      {annCeilPatches.map((p, idx) => {
        const w = p.x1 - p.x0;
        const d = p.z1 - p.z0;
        const cx = (p.x0 + p.x1) / 2;
        const cz = (p.z0 + p.z1) / 2;
        return (
          <mesh key={`af-ceil-${idx}`} position={[cx, CEIL_H, cz]} rotation={[Math.PI / 2, 0, 0]} material={materials.ceilingConcrete}>
            <planeGeometry args={[w - 0.04, d - 0.04]} />
          </mesh>
        );
      })}

      {/* ── ANNEXURE FRONT FACADE (Z = -8, Photos 9.28.50 PM (1) & (2)) ── */}
      {/* 1. OUTER / LEFT SOLID GREY WALL (X: 39.5 → 53.0) — Monolithic smooth architectural concrete finish */}
      <Wall
        pos={[46.25, ROOM_H / 2, ANN_Z0 + WALL_T / 2]}
        size={[13.5, ROOM_H, WALL_T]}
        mat={materials.exteriorWall}
      />

      {/* 2. INNER / RIGHT VERANDA CORNER BAY (X: 33.0 → 39.5, facing alleyway/Main Block) */}
      {/* Structural Corner Column at X = 33.25 */}
      <mesh position={[33.25, ROOM_H / 2, ANN_Z0 + WALL_T / 2]} material={materials.exteriorWall} castShadow receiveShadow>
        <boxGeometry args={[0.5, ROOM_H, WALL_T + 0.1]} />
      </mesh>

      {/* Structural Pier at X = 39.3 */}
      <mesh position={[39.3, ROOM_H / 2, ANN_Z0 + WALL_T / 2]} material={materials.exteriorWall} castShadow receiveShadow>
        <boxGeometry args={[0.4, ROOM_H, WALL_T]} />
      </mesh>

      {isGround ? (
        /* Ground Floor: Covered Entrance Porch & Plinth (Photo 2) */
        <group>
          {/* Right half service wall with window */}
          <Wall
            pos={[37.6, ROOM_H / 2, ANN_Z0 + WALL_T / 2]}
            size={[3.0, ROOM_H, WALL_T]}
            mat={materials.exteriorWall}
          />
          <WindowFixture
            pos={[37.6, WIN_CY, ANN_Z0]}
            facing="south"
            materials={materials}
            grillTex={grillTex}
          />
          {/* Left half open entrance portal with top lintel */}
          <Wall
            pos={[34.8, ROOM_H - 0.4, ANN_Z0 + WALL_T / 2]}
            size={[2.6, 0.8, WALL_T]}
            mat={materials.exteriorWall}
          />
          {/* Raised Entrance Plinth Steps in front */}
          <mesh position={[34.8, 0.08, ANN_Z0 - 0.5]} material={materials.interiorFloorTile} receiveShadow>
            <boxGeometry args={[2.8, 0.16, 1.0]} />
          </mesh>
          <mesh position={[34.8, 0.165, ANN_Z0 - 0.05]} material={materials.skirtingBlack}>
            <boxGeometry args={[2.82, 0.02, 0.06]} />
          </mesh>
        </group>
      ) : (
        /* Upper Floors (1F, 2F, 3F): Open-Air Recessed Veranda Balconies (Photo 1 & 2) */
        <group>
          {/* Bottom Solid Parapet Wall (Y = 0 to 1.1m) */}
          <Wall
            pos={[36.3, 0.55, ANN_Z0 + WALL_T / 2]}
            size={[5.6, 1.1, WALL_T]}
            mat={materials.exteriorWall}
          />
          {/* Parapet Coping Ledge in Deep Navy Blue */}
          <mesh position={[36.3, 1.12, ANN_Z0 + WALL_T / 2]} material={materials.sunshadeNavyBlue}>
            <boxGeometry args={[5.64, 0.05, WALL_T + 0.06]} />
          </mesh>

          {/* Stainless steel interior guardrail */}
          <mesh position={[36.3, 0.95, ANN_Z0 + 0.12]} material={materials.railingSteel}>
            <boxGeometry args={[5.55, 0.05, 0.05]} />
          </mesh>

          {/* Top Lintel Beam (Y = 3.2 to 3.5m) */}
          <Wall
            pos={[36.3, 3.35, ANN_Z0 + WALL_T / 2]}
            size={[5.6, 0.3, WALL_T]}
            mat={materials.exteriorWall}
          />

          {/* Ceiling LED strip light inside veranda */}
          <mesh position={[36.3, CEIL_H - 0.05, -5.5]} material={materials.ledTubeLight}>
            <boxGeometry args={[2.4, 0.04, 0.08]} />
          </mesh>

          {/* On 1F: Stainless steel water cooler unit against wall (Photo 2) */}
          {flIdx === 1 && (
            <mesh position={[38.9, 1.2, -6.5]} material={materials.waterCoolerSteel} castShadow>
              <boxGeometry args={[0.35, 0.7, 0.35]} />
            </mesh>
          )}
        </group>
      )}

      {/* Continuous cornice bands for Annexure */}
      <Wall pos={[ANN_CX, ROOM_H + 0.15, ANN_Z0 - 0.02]}
            size={[20.2, 0.35, 0.08]} mat={materials.corniceBronze} />
      <Wall pos={[ANN_CX, ROOM_H + 0.33, ANN_Z0 - 0.025]}
            size={[20.25, 0.04, 0.09]} mat={materials.windowWhiteFrame} />

      {/* Rear facade (Z = 44) */}
      <Wall pos={[ANN_CX, ROOM_H / 2, ANN_Z1 - WALL_T / 2]}
            size={[20, ROOM_H, WALL_T]} mat={materials.exteriorWall} />

      {annRearX.map((wx) => (
        <WindowFixture
          key={'af-rw-' + wx}
          pos={[wx, WIN_CY, ANN_Z1]}
          facing="north"
          materials={materials}
          grillTex={grillTex}
        />
      ))}

      <Wall pos={[ANN_CX, ROOM_H + 0.15, ANN_Z1 + 0.02]}
            size={[20.2, 0.35, 0.08]} mat={materials.corniceBronze} />
      <Wall pos={[ANN_CX, ROOM_H + 0.33, ANN_Z1 + 0.025]}
            size={[20.25, 0.04, 0.09]} mat={materials.windowWhiteFrame} />

      {/* Inner West Facade (X = 33, facing driveway and Pedestrian Bridge) */}
      {/* On 1F & 2F: Bridge portal at Z = 0..3; On Ground: Entrance portal at Z = 0..3 */}
      {flIdx === 0 || flIdx === 1 || flIdx === 2 ? (
        <>
          {/* Wall South of portal: Z: -8 -> 0 */}
          <Wall pos={[ANN_X0 + WALL_T / 2, ROOM_H / 2, -4]}
                size={[WALL_T, ROOM_H, 8]} mat={materials.exteriorWall} />
          {/* Lintel Beam above portal: Z: 0 -> 3 */}
          <Wall pos={[ANN_X0 + WALL_T / 2, ROOM_H - 0.4, 1.5]}
                size={[WALL_T + 0.04, 0.8, 3.0]} mat={materials.exteriorWall} />
          {/* Wall North of portal: Z: 3 -> 44 */}
          <Wall pos={[ANN_X0 + WALL_T / 2, ROOM_H / 2, 23.5]}
                size={[WALL_T, ROOM_H, 41]} mat={materials.exteriorWall} />
        </>
      ) : (
        <Wall pos={[ANN_X0 + WALL_T / 2, ROOM_H / 2, 18]}
              size={[WALL_T, ROOM_H, 52]} mat={materials.exteriorWall} />
      )}

      {/* Vertical PVC Downspouts on Annexure Inner Facade */}
      {annDownspoutsZ.map((pz) => (
        <group key={`af-wdsp-${pz}`} position={[ANN_X0 - 0.08, ROOM_H / 2, pz]}>
          <mesh geometry={SHARED_DOWNSPOUT_PIPE_GEOM} material={materials.pvcPipeWhite} />
          {[-1.2, 0, 1.2].map((cy) => (
            <mesh key={cy} position={[0.03, cy, 0]} geometry={SHARED_DOWNSPOUT_CLAMP_GEOM} material={materials.railingSteel} />
          ))}
        </group>
      ))}

      <Wall pos={[ANN_X0 - 0.02, ROOM_H + 0.15, 18]}
            size={[0.08, 0.35, 52.2]} mat={materials.corniceBronze} />
      <Wall pos={[ANN_X0 - 0.025, ROOM_H + 0.33, 18]}
            size={[0.09, 0.04, 52.25]} mat={materials.windowWhiteFrame} />

      {/* Outer East Facade (X = 53, campus outer edge) */}
      <Wall pos={[ANN_X1 - WALL_T / 2, ROOM_H / 2, 18]}
            size={[WALL_T, ROOM_H, 52]} mat={materials.exteriorWall} />

      {annWinZ.map((wz) => (
        <WindowFixture
          key={'af-ew-' + wz}
          pos={[ANN_X1, WIN_CY, wz]}
          facing="east"
          materials={materials}
          grillTex={grillTex}
        />
      ))}

      <Wall pos={[ANN_X1 + 0.02, ROOM_H + 0.15, 18]}
            size={[0.08, 0.35, 52.2]} mat={materials.corniceBronze} />
      <Wall pos={[ANN_X1 + 0.025, ROOM_H + 0.33, 18]}
            size={[0.09, 0.04, 52.25]} mat={materials.windowWhiteFrame} />
    </group>
  );
};

// ============================================================
// MAIN EXPORT: BuildingShell
// ============================================================
export const BuildingShell: React.FC = () => {
  const materials = CampusMaterials.getInstance();
  const explodedView = useCampusStore((s) => s.explodedView);
  const grillTex = materials.windowGrillTexture;

  const floorLevels = [0, 4.0, 8.0, 12.0, 16.0];

  return (
    <group>
      {/* ══ MAIN BLOCK FLOORS ══ */}
      {floorLevels.map((baseY, flIdx) => {
        const y = explodedView ? baseY * (1 + flIdx * 0.25) : baseY;
        return (
          <MainFloor key={`mf-${flIdx}`} floorY={y} flIdx={flIdx} grillTex={grillTex} materials={materials} />
        );
      })}

      {/* ── Main Roof Slab & Rooftop Complex (Y = 20) ────────────────── */}
      <group position={[0, explodedView ? 20 * 1.75 : 20, 0]}>
        {/* Main concrete roof slab */}
        <mesh position={[0, 0.2, 16]} material={materials.roofSlab} receiveShadow>
          <boxGeometry args={[42, 0.4, 48]} />
        </mesh>

        {/* ── CRUCIFORM TERRACOTTA RED TILE WALKWAY (Satellite View) ── */}
        {/* North-South central spine spanning front to rear (Z: -7.5 to 39.5) */}
        <mesh position={[0, 0.41, 16]} rotation={[-Math.PI / 2, 0, 0]} material={materials.roofTerracottaTile} receiveShadow>
          <planeGeometry args={[6.0, 47.0]} />
        </mesh>
        {/* East-West cross arm traversing between light wells (X: -20.5 to 20.5) */}
        <mesh position={[0, 0.415, 16]} rotation={[-Math.PI / 2, 0, 0]} material={materials.roofTerracottaTile} receiveShadow>
          <planeGeometry args={[41.0, 6.0]} />
        </mesh>
        {/* White concrete border edging along the cruciform walkway */}
        <mesh position={[3.05, 0.42, 16]} material={materials.windowWhiteFrame}>
          <boxGeometry args={[0.1, 0.04, 47.0]} />
        </mesh>
        <mesh position={[-3.05, 0.42, 16]} material={materials.windowWhiteFrame}>
          <boxGeometry args={[0.1, 0.04, 47.0]} />
        </mesh>

        {/* Parapet walls around roof perimeter (1.4m high) */}
        <Wall pos={[0, 0.7, MAIN_Z0 - WALL_T / 2]} size={[42, 1.4, WALL_T]} mat={materials.exteriorWall} />
        <Wall pos={[0, 0.7, MAIN_Z1 + WALL_T / 2]} size={[42, 1.4, WALL_T]} mat={materials.exteriorWall} />
        <Wall pos={[MAIN_X0 - WALL_T / 2, 0.7, 16]} size={[WALL_T, 1.4, 48]} mat={materials.exteriorWall} />
        <Wall pos={[MAIN_X1 + WALL_T / 2, 0.7, 16]} size={[WALL_T, 1.4, 48]} mat={materials.exteriorWall} />

        {/* Raised center parapet fascia panel in dark bronze */}
        <Wall pos={[0, 1.45, MAIN_Z0 - WALL_T - 0.08]} size={[20, 1.5, 0.16]} mat={materials.corniceBronze} />
        {/* Crisp white architectural coping cap */}
        <Wall pos={[0, 2.22, MAIN_Z0 - WALL_T - 0.08]} size={[20.4, 0.12, 0.26]} mat={materials.windowWhiteFrame} />

        {/* ═══ PROMINENT 3D GOLD ROOFTOP SIGNAGE: "ST. PAUL'S BLOCK" ═══ */}
        <Text
          position={[0, 1.45, MAIN_Z0 - WALL_T - 0.22]}
          rotation={[0, Math.PI, 0]}
          fontSize={1.25}
          letterSpacing={0.16}
          anchorX="center"
          anchorY="middle"
          material={materials.goldLettering}
        >
          ST. PAUL&apos;S BLOCK
        </Text>

        {/* ═══ 4 CORNER STAIRWELL / LIFT HEADROOM PENTHOUSES (Satellite Purple Dots) ═══ */}
        {[
          { id: 'sw', pos: [-17.5, -4.5] as [number, number] },
          { id: 'se', pos: [17.5, -4.5] as [number, number] },
          { id: 'nw', pos: [-17.5, 36.5] as [number, number] },
          { id: 'ne', pos: [17.5, 36.5] as [number, number] },
        ].map(({ id, pos: [px, pz] }) => (
          <group key={`penthouse-${id}`} position={[px, 0.4, pz]}>
            {/* Main penthouse machine room body */}
            <mesh position={[0, 1.4, 0]} material={materials.exteriorWall} castShadow receiveShadow>
              <boxGeometry args={[4.8, 2.8, 5.4]} />
            </mesh>
            {/* Bronze top cornice fascia band */}
            <mesh position={[0, 2.7, 0]} material={materials.corniceBronze}>
              <boxGeometry args={[4.9, 0.25, 5.5]} />
            </mesh>
            {/* White roof coping slab */}
            <mesh position={[0, 2.85, 0]} material={materials.windowWhiteFrame}>
              <boxGeometry args={[5.0, 0.1, 5.6]} />
            </mesh>
            {/* Rooftop industrial ventilation exhaust unit */}
            <mesh position={[0, 3.2, 0]} material={materials.acCompressorWhite}>
              <boxGeometry args={[1.4, 0.6, 1.4]} />
            </mesh>
            <mesh position={[0, 3.52, 0]} material={materials.acFanGrill}>
              <cylinderGeometry args={[0.5, 0.5, 0.05, 16]} />
            </mesh>
            {/* Metal service access door */}
            <mesh position={[0, 1.0, 2.72]} material={materials.doorMetalFrame}>
              <boxGeometry args={[1.0, 2.0, 0.04]} />
            </mesh>
          </group>
        ))}

        {/* ═══ 4 COURTYARD LIGHT WELL CURBS & PROTECTIVE WIRE MESH COVERS ═══ */}
        {[
          { id: 'cw-fw', cx: -7, cz: 6.5, w: 7, d: 6 },
          { id: 'cw-fe', cx: 7, cz: 6.5, w: 7, d: 6 },
          { id: 'cw-rw', cx: -7, cz: 25.5, w: 7, d: 6 },
          { id: 'cw-re', cx: 7, cz: 25.5, w: 7, d: 6 },
        ].map(({ id, cx, cz, w, d }) => (
          <group key={id} position={[cx, 0.4, cz]}>
            {/* Parapet curb around light well opening (0.8m high) */}
            <Wall pos={[0, 0.4, -d / 2]} size={[w + 0.4, 0.8, 0.2]} mat={materials.exteriorWall} />
            <Wall pos={[0, 0.4, d / 2]} size={[w + 0.4, 0.8, 0.2]} mat={materials.exteriorWall} />
            <Wall pos={[-w / 2, 0.4, 0]} size={[0.2, 0.8, d]} mat={materials.exteriorWall} />
            <Wall pos={[w / 2, 0.4, 0]} size={[0.2, 0.8, d]} mat={materials.exteriorWall} />
            {/* Protective wire mesh security screen covering courtyard void */}
            <mesh position={[0, 0.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[w, d]} />
              <meshStandardMaterial color="#334155" wireframe roughness={0.7} metalness={0.6} />
            </mesh>
          </group>
        ))}

        {/* ═══ 5 PHOTOVOLTAIC SOLAR PANEL ARRAYS (3D Isometric Overview) ═══ */}
        {/* 3 Arrays along front (South half), 2 Arrays along rear (North half) */}
        {[
          { id: 'sp-1', pos: [-12, -1.8] as [number, number], w: 5.8 },
          { id: 'sp-2', pos: [0, -3.2] as [number, number], w: 5.8 },
          { id: 'sp-3', pos: [12, -1.8] as [number, number], w: 5.8 },
          { id: 'sp-4', pos: [-11, 33.2] as [number, number], w: 6.2 },
          { id: 'sp-5', pos: [11, 33.2] as [number, number], w: 6.2 },
        ].map(({ id, pos: [sx, sz], w }) => (
          <group key={id} position={[sx, 0.4, sz]}>
            {/* Aluminum racking frame base stanchions */}
            {[-w / 2 + 0.4, 0, w / 2 - 0.4].map((lx) => (
              <group key={lx} position={[lx, 0, 0]}>
                <mesh position={[0, 0.25, 0.9]} material={materials.solarFrame}>
                  <cylinderGeometry args={[0.03, 0.03, 0.5, 8]} />
                </mesh>
                <mesh position={[0, 0.55, -0.9]} material={materials.solarFrame}>
                  <cylinderGeometry args={[0.03, 0.03, 1.1, 8]} />
                </mesh>
              </group>
            ))}
            {/* Tilted Solar Panel Array Surface (~18 deg facing south) */}
            <group position={[0, 0.72, 0]} rotation={[-0.31, 0, 0]}>
              {/* Aluminum border frame */}
              <mesh material={materials.solarFrame}>
                <boxGeometry args={[w, 0.05, 2.3]} />
              </mesh>
              {/* Dark Photovoltaic Silicon Cells */}
              <mesh position={[0, 0.03, 0]} material={materials.solarPanel}>
                <boxGeometry args={[w - 0.08, 0.02, 2.22]} />
              </mesh>
            </group>
          </group>
        ))}
      </group>

      {/* ── ═══ GRAND ENTRANCE PORTICO (Matching Real Photos) ═══ ── */}
      {/* Centered at X=0, projecting forward from facade (Z = -8 → -12) */}
      <group position={[ENT_CX, 0, -10.0]}>
        {/* Cantilevered Portico Roof Slab */}
        <mesh position={[0, ENT_H + 0.18, 0]} material={materials.porticoMaroon} castShadow receiveShadow>
          <boxGeometry args={[ENT_W + 1.4, 0.36, 4.2]} />
        </mesh>
        {/* Roof coping trim */}
        <mesh position={[0, ENT_H + 0.38, 0]} material={materials.windowWhiteFrame}>
          <boxGeometry args={[ENT_W + 1.5, 0.08, 4.3]} />
        </mesh>

        {/* Linear Teak Wood-Slat False Ceiling Under Portico */}
        <mesh position={[0, ENT_H - 0.02, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.woodSlatCeiling}>
          <planeGeometry args={[ENT_W + 1.3, 4.0]} />
        </mesh>

        {/* ── Department Signboard Banner across front fascia of portico facing approach road ── */}
        <mesh position={[0, ENT_H + 0.18, -2.12]} material={materials.porticoMaroon}>
          <boxGeometry args={[ENT_W + 1.45, 0.44, 0.08]} />
        </mesh>
        <Text
          position={[0, ENT_H + 0.18, -2.18]}
          rotation={[0, Math.PI, 0]}
          fontSize={0.15}
          letterSpacing={0.04}
          maxWidth={ENT_W + 1.4}
          anchorX="center"
          anchorY="middle"
          material={materials.signLettering}
        >
          DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING
        </Text>

        {/* Left Architectural Pillar with Dark Bronze Plinth */}
        <mesh position={[-2.8, ENT_H / 2, -1.5]} material={materials.exteriorWall} castShadow receiveShadow>
          <boxGeometry args={[0.55, ENT_H + 0.36, 0.55]} />
        </mesh>
        <mesh position={[-2.8, 0.25, -1.5]} material={materials.corniceBronze}>
          <boxGeometry args={[0.7, 0.5, 0.7]} />
        </mesh>

        {/* Right Architectural Pillar */}
        <mesh position={[2.8, ENT_H / 2, -1.5]} material={materials.exteriorWall} castShadow receiveShadow>
          <boxGeometry args={[0.55, ENT_H + 0.36, 0.55]} />
        </mesh>
        <mesh position={[2.8, 0.25, -1.5]} material={materials.corniceBronze}>
          <boxGeometry args={[0.7, 0.5, 0.7]} />
        </mesh>

        {/* Recessed Warm Portico Downlights in Canister Housings */}
        {[-1.6, 0, 1.6].map((lx) => (
          <group key={lx} position={[lx, ENT_H - 0.05, -0.5]}>
            <mesh>
              <cylinderGeometry args={[0.14, 0.14, 0.08, 16]} />
              <meshStandardMaterial color="#0f172a" roughness={0.3} />
            </mesh>
            <mesh position={[0, -0.04, 0]}>
              <circleGeometry args={[0.11, 16]} />
              <meshBasicMaterial color="#fef08a" />
            </mesh>
          </group>
        ))}
        {/* Single consolidated warm point light illuminating portico */}
        <pointLight position={[0, ENT_H - 0.2, -0.5]} color="#fed7aa" intensity={2.2} distance={8} decay={2} />

        {/* Granite Entrance Threshold Steps with Black Nosing */}
        <mesh position={[0, 0.06, -1.6]} material={materials.interiorFloorTile} receiveShadow>
          <boxGeometry args={[ENT_W + 1.4, 0.12, 1.8]} />
        </mesh>
        <mesh position={[0, 0.12, -0.7]} material={materials.interiorFloorTile} receiveShadow>
          <boxGeometry args={[ENT_W + 1.0, 0.14, 1.6]} />
        </mesh>
        <mesh position={[0, 0.125, -2.5]} material={materials.skirtingBlack}>
          <boxGeometry args={[ENT_W + 1.42, 0.02, 0.06]} />
        </mesh>
      </group>

      {/* ── ═══ SIGNATURE ARCHITECTURAL END-CAPS (User Answer 2: on BOTH left and right sides) ═══ ── */}
      {/* 5-story corner architectural feature framed in dark bronze with white moulding & terracotta cladding */}
      {[-21, 21].map((cx) => {
        const isWest = cx < 0;
        return (
          <group key={`endcap-${cx}`} position={[cx + (isWest ? -0.4 : 0.4), 0, MAIN_Z0 + 1.8]}>
            {/* Main vertical body in architectural dark bronze */}
            <mesh position={[0, 10.75, 0]} material={materials.corniceBronze} castShadow receiveShadow>
              <boxGeometry args={[1.3, 21.5, 3.8]} />
            </mesh>
            {/* Vertical terracotta wood-slat accent panel */}
            <mesh position={[isWest ? -0.7 : 0.7, 10.75, 0]} material={materials.terracottaAccent} castShadow>
              <boxGeometry args={[0.2, 21.2, 3.4]} />
            </mesh>
            {/* White outer frame moulding perimeter */}
            <mesh position={[isWest ? 0.5 : -0.5, 10.75, 0]}>
              <boxGeometry args={[0.25, 20.6, 2.6]} />
              <meshStandardMaterial color="#ffffff" roughness={0.35} />
            </mesh>
            {/* Reflective dark glass curtain with horizontal transoms */}
            <mesh position={[isWest ? 0.62 : -0.62, 10.75, 0]}>
              <boxGeometry args={[0.08, 20.0, 2.0]} />
              <meshStandardMaterial color="#0f172a" roughness={0.12} metalness={0.88} />
            </mesh>
            {/* Horizontal transom framing bars */}
            {[3.5, 7.5, 11.5, 15.5, 19.5].map((ty) => (
              <mesh key={ty} position={[isWest ? 0.64 : -0.64, ty, 0]}>
                <boxGeometry args={[0.09, 0.08, 2.02]} />
                <meshStandardMaterial color="#ffffff" roughness={0.3} />
              </mesh>
            ))}
          </group>
        );
      })}

      {/* ── ═══ HIGH BREEZEWAY GABLE CANOPY OVER ALLEYWAY (Photo 9.28.50 PM (2)) ═══ ── */}
      {/* Spanning between roof parapets of Main (X = 21) and Annexure (X = 33) at Y = 16.5m */}
      <group position={[27, explodedView ? 16.5 * 1.75 : 16.5, 4.0]}>
        {/* Steel Gable Trusses */}
        {[-3, 1, 5, 9].map((tz) => (
          <group key={`truss-${tz}`} position={[0, 0, tz]}>
            {/* Left rafter */}
            <mesh position={[-3, 0.6, 0]} rotation={[0, 0, -0.2]} material={materials.metalTrussGray}>
              <boxGeometry args={[6.3, 0.12, 0.12]} />
            </mesh>
            {/* Right rafter */}
            <mesh position={[3, 0.6, 0]} rotation={[0, 0, 0.2]} material={materials.metalTrussGray}>
              <boxGeometry args={[6.3, 0.12, 0.12]} />
            </mesh>
            {/* Bottom tie beam */}
            <mesh position={[0, 0, 0]} material={materials.metalTrussGray}>
              <boxGeometry args={[12.2, 0.14, 0.14]} />
            </mesh>
            {/* Center king post */}
            <mesh position={[0, 0.6, 0]} material={materials.metalTrussGray}>
              <boxGeometry args={[0.1, 1.2, 0.1]} />
            </mesh>
          </group>
        ))}
        {/* Corrugated Roof Sheets */}
        <mesh position={[-3, 1.25, 3]} rotation={[0, 0, -0.2]} material={materials.metalTrussGray}>
          <boxGeometry args={[6.5, 0.04, 14]} />
        </mesh>
        <mesh position={[3, 1.25, 3]} rotation={[0, 0, 0.2]} material={materials.metalTrussGray}>
          <boxGeometry args={[6.5, 0.04, 14]} />
        </mesh>
      </group>

      {/* ── ═══ ENTRANCE FOYER INTERIOR APPOINTMENTS (Matching Real Photos) ═══ ── */}
      {/* Ground floor inside portal: X: -2.5 → 2.5, Z: -8 → -2 */}
      <group position={[ENT_CX, 0, -5]}>
        {/* Polished Grey Granite Foyer Floor Surface */}
        <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]} material={materials.interiorFloorTile} receiveShadow>
          <planeGeometry args={[5.2, 5.8]} />
        </mesh>

        {/* Black skirting along foyer sides */}
        <mesh position={[-2.55, 0.08, 0]} material={materials.skirtingBlack}>
          <boxGeometry args={[0.06, 0.16, 5.8]} />
        </mesh>
        <mesh position={[2.55, 0.08, 0]} material={materials.skirtingBlack}>
          <boxGeometry args={[0.06, 0.16, 5.8]} />
        </mesh>

        {/* Foyer Linear Teak Wood-Slat False Ceiling */}
        <mesh position={[0, ROOM_H - 0.02, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.woodSlatCeiling}>
          <planeGeometry args={[5.0, 5.6]} />
        </mesh>

        {/* Collapsible metal security accordion scissor gate at entrance */}
        <group position={[0, 1.2, -2.85]}>
          <mesh material={materials.railingSteel}>
            <boxGeometry args={[4.9, 0.08, 0.04]} />
          </mesh>
          {[-2.0, -1.0, 0, 1.0, 2.0].map((gx) => (
            <mesh key={gx} position={[gx, 0, 0]} material={materials.railingSteel}>
              <boxGeometry args={[0.04, 2.4, 0.04]} />
            </mesh>
          ))}
        </group>

        {/* Reception / Security Desk on right side of foyer */}
        <group position={[-1.9, 0, 0.2]}>
          <mesh position={[0, 0.55, 0]} material={materials.deskWood} castShadow>
            <boxGeometry args={[0.75, 1.1, 1.8]} />
          </mesh>
          <mesh position={[0, 1.12, 0]} material={materials.doorMetalFrame}>
            <boxGeometry args={[0.82, 0.05, 1.9]} />
          </mesh>
          {/* Foyer desktop PC */}
          <mesh position={[0, 1.25, 0.3]} material={materials.computerScreenGlow}>
            <boxGeometry args={[0.35, 0.22, 0.05]} />
          </mesh>
        </group>

        {/* ══ FOUNDER CHANCELLOR MEMORIAL PORTRAIT (Photos 9.29.08 PM (1) & 9.29.09 PM) ══ */}
        {/* Framed portrait of Founder Chancellor "COLONEL Dr. JEPPIAAR" */}
        <group position={[-2.42, 1.8, -1.8]} rotation={[0, Math.PI / 2, 0]}>
          {/* Rich Dark Wood & Gold Accent Frame */}
          <mesh>
            <boxGeometry args={[0.9, 1.2, 0.04]} />
            <meshStandardMaterial color="#3b1f14" roughness={0.4} metalness={0.2} />
          </mesh>
          <mesh position={[0, 0, 0.025]}>
            <boxGeometry args={[0.82, 1.12, 0.02]} />
            <meshStandardMaterial color="#d97706" roughness={0.25} metalness={0.8} />
          </mesh>
          {/* Portrait canvas */}
          <mesh position={[0, 0, 0.038]}>
            <planeGeometry args={[0.76, 1.04]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.5} />
          </mesh>
          <Text
            position={[0, 0.32, 0.045]}
            fontSize={0.055}
            color="#0f172a"
            anchorX="center"
            anchorY="middle"
          >
            COLONEL Dr. JEPPIAAR, M.A., B.L., Ph.D.
          </Text>
          <Text
            position={[0, 0.22, 0.045]}
            fontSize={0.042}
            color="#78350f"
            anchorX="center"
            anchorY="middle"
          >
            Founder Chancellor
          </Text>
          <Text
            position={[0, 0.12, 0.045]}
            fontSize={0.035}
            color="#334155"
            anchorX="center"
            anchorY="middle"
          >
            Sathyabama Institute of Science and Technology
          </Text>
          {/* Brass Memorial Stand Plinth with garland flowers */}
          <mesh position={[0, -0.65, 0.12]}>
            <boxGeometry args={[1.0, 0.08, 0.3]} />
            <meshStandardMaterial color="#eab308" metalness={0.85} roughness={0.2} />
          </mesh>
        </group>

        {/* ══ WEST SNACK & BEVERAGE VENDING MACHINE (Photos 9.29.08 PM (2) & (3)) ══ */}
        <group position={[-2.35, 0, 1.8]} rotation={[0, Math.PI / 2, 0]}>
          <mesh position={[0, 1.0, 0]} castShadow>
            <boxGeometry args={[0.9, 2.0, 0.75]} />
            <meshStandardMaterial color="#0f172a" roughness={0.35} metalness={0.7} />
          </mesh>
          <mesh position={[0, 1.15, 0.38]}>
            <planeGeometry args={[0.75, 1.3]} />
            <meshPhysicalMaterial color="#e0f2fe" transparent opacity={0.45} roughness={0.1} metalness={0.3} transmission={0.8} />
          </mesh>
          {[-0.2, 0.1, 0.4].map((sy, idx) => (
            <mesh key={idx} position={[0, 1.0 + sy, 0.2]}>
              <boxGeometry args={[0.72, 0.04, 0.35]} />
              <meshStandardMaterial color="#cbd5e1" roughness={0.3} metalness={0.8} />
            </mesh>
          ))}
          <mesh position={[0.32, 1.05, 0.39]}>
            <boxGeometry args={[0.14, 0.28, 0.03]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.6} />
          </mesh>
          <mesh position={[0, 0.28, 0.35]}>
            <boxGeometry args={[0.65, 0.22, 0.12]} />
            <meshStandardMaterial color="#1e293b" roughness={0.5} />
          </mesh>
        </group>

        {/* ══ EAST SNACK & BEVERAGE VENDING MACHINE (Photos 9.29.09 PM (1)) ══ */}
        {/* Directly opposite on the other side of entrance foyer */}
        <group position={[2.35, 0, 1.8]} rotation={[0, -Math.PI / 2, 0]}>
          <mesh position={[0, 1.0, 0]} castShadow>
            <boxGeometry args={[0.9, 2.0, 0.75]} />
            <meshStandardMaterial color="#0f172a" roughness={0.35} metalness={0.7} />
          </mesh>
          <mesh position={[0, 1.15, 0.38]}>
            <planeGeometry args={[0.75, 1.3]} />
            <meshPhysicalMaterial color="#e0f2fe" transparent opacity={0.45} roughness={0.1} metalness={0.3} transmission={0.8} />
          </mesh>
          {[-0.2, 0.1, 0.4].map((sy, idx) => (
            <mesh key={idx} position={[0, 1.0 + sy, 0.2]}>
              <boxGeometry args={[0.72, 0.04, 0.35]} />
              <meshStandardMaterial color="#cbd5e1" roughness={0.3} metalness={0.8} />
            </mesh>
          ))}
          <mesh position={[0.32, 1.05, 0.39]}>
            <boxGeometry args={[0.14, 0.28, 0.03]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.6} />
          </mesh>
          <mesh position={[0, 0.28, 0.35]}>
            <boxGeometry args={[0.65, 0.22, 0.12]} />
            <meshStandardMaterial color="#1e293b" roughness={0.5} />
          </mesh>
        </group>

        {/* ══ BLUE CSE DEPARTMENT DIRECTORY & DEDICATION WALL (Photo 9.29.09 PM) ══ */}
        <group position={[2.42, 1.8, -0.6]} rotation={[0, -Math.PI / 2, 0]}>
          {/* Navy Blue Directory Board Panel */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[2.2, 1.3, 0.03]} />
            <meshStandardMaterial color="#1e3a8a" roughness={0.3} metalness={0.2} />
          </mesh>
          <mesh position={[0, 0.62, 0]}>
            <boxGeometry args={[2.24, 0.06, 0.04]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.2} metalness={0.8} />
          </mesh>

          <Text
            position={[0, 0.45, 0.02]}
            fontSize={0.09}
            letterSpacing={0.06}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING
          </Text>
          <Text
            position={[0, 0.32, 0.02]}
            fontSize={0.065}
            color="#fbbf24"
            anchorX="center"
            anchorY="middle"
          >
            ST. PAUL&apos;S BLOCK - FLOOR DIRECTORY
          </Text>
          <Text
            position={[0, -0.05, 0.02]}
            fontSize={0.055}
            lineHeight={1.4}
            color="#f8fafc"
            anchorX="center"
            anchorY="middle"
          >
            GROUND FLOOR: Centre for Computer Security & Society | Dean | HOD&#10;FIRST FLOOR: Design Thinking Lab | Research Project Hub&#10;SECOND FLOOR: Machine Vision Lab | Server Room (Restricted)&#10;THIRD FLOOR: Web 3.0 Lab | Annexure Connecting Bridge
          </Text>

          {/* Dedication Plaque below Directory */}
          <group position={[0, -1.0, 0]}>
            <mesh>
              <boxGeometry args={[1.8, 0.45, 0.025]} />
              <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.5} />
            </mesh>
            <mesh position={[0, 0.21, 0.015]}>
              <boxGeometry args={[1.82, 0.03, 0.03]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.8} />
            </mesh>
            <Text
              position={[0, 0.08, 0.02]}
              fontSize={0.048}
              color="#38bdf8"
              anchorX="center"
              anchorY="middle"
            >
              CENTRE FOR COMPUTER SECURITY AND SOCIETY
            </Text>
            <Text
              position={[0, -0.08, 0.02]}
              fontSize={0.038}
              color="#94a3b8"
              anchorX="center"
              anchorY="middle"
            >
              Inaugurated on 19th April 2023 | Sathyabama Institute
            </Text>
          </group>
        </group>

        {/* Warm entrance foyer ceiling spotlight */}
        <pointLight position={[0, 3.2, 0]} color="#fffbeb" intensity={2.4} distance={10} decay={2} />
      </group>

      {/* ══ ANNEXURE BLOCK FLOORS ══ */}
      {floorLevels.map((baseY, flIdx) => {
        const y = explodedView ? baseY * (1 + flIdx * 0.25) : baseY;
        return (
          <AnnexureFloor key={`af-${flIdx}`} floorY={y} flIdx={flIdx} grillTex={grillTex} materials={materials} />
        );
      })}

      {/* ── Annexure Roof Slab & Parapet (Y = 20, Photo 1 Overhang) ────────────────── */}
      <group position={[0, explodedView ? 20 * 1.75 : 20, 0]}>
        <mesh position={[ANN_CX, 0.2, 18]} material={materials.roofSlab} receiveShadow>
          <boxGeometry args={[20, 0.4, 52]} />
        </mesh>
        {/* Projecting Roof Canopy Slab Overhang with Navy Blue Fascia (Photo 1) */}
        <mesh position={[ANN_CX, 0.2, ANN_Z0 - 0.4]} material={materials.roofSlab} receiveShadow>
          <boxGeometry args={[20.6, 0.25, 0.8]} />
        </mesh>
        <mesh position={[ANN_CX, 0.2, ANN_Z0 - 0.81]} material={materials.sunshadeNavyBlue}>
          <boxGeometry args={[20.64, 0.25, 0.04]} />
        </mesh>
        <mesh position={[ANN_X0 - 0.31, 0.2, ANN_Z0 - 0.4]} material={materials.sunshadeNavyBlue}>
          <boxGeometry args={[0.04, 0.25, 0.82]} />
        </mesh>
        <mesh position={[ANN_X1 + 0.31, 0.2, ANN_Z0 - 0.4]} material={materials.sunshadeNavyBlue}>
          <boxGeometry args={[0.04, 0.25, 0.82]} />
        </mesh>

        <Wall pos={[ANN_CX, 0.7, ANN_Z0 - WALL_T / 2]} size={[20, 1.4, WALL_T]} mat={materials.exteriorWall} />
        <Wall pos={[ANN_CX, 0.7, ANN_Z1 + WALL_T / 2]} size={[20, 1.4, WALL_T]} mat={materials.exteriorWall} />
        <Wall pos={[ANN_X0 - WALL_T / 2, 0.7, 18]} size={[WALL_T, 1.4, 52]} mat={materials.exteriorWall} />
        <Wall pos={[ANN_X1 + WALL_T / 2, 0.7, 18]} size={[WALL_T, 1.4, 52]} mat={materials.exteriorWall} />
        <Wall pos={[ANN_CX, 1.15, ANN_Z0 - WALL_T - 0.06]} size={[20.2, 0.8, 0.12]} mat={materials.corniceBronze} />
        {/* Parapet top navy blue trim */}
        <mesh position={[ANN_CX, 1.56, ANN_Z0 - WALL_T - 0.06]} material={materials.sunshadeNavyBlue}>
          <boxGeometry args={[20.35, 0.06, 0.18]} />
        </mesh>
        {/* Annexure Central Light Court Opening Curb */}
        <group position={[ANN_CX, 0.4, 19]}>
          <Wall pos={[0, 0.5, -6]} size={[3.4, 1.0, 0.2]} mat={materials.exteriorWall} />
          <Wall pos={[0, 0.5, 6]} size={[3.4, 1.0, 0.2]} mat={materials.exteriorWall} />
          <Wall pos={[-1.5, 0.5, 0]} size={[0.2, 1.0, 12]} mat={materials.exteriorWall} />
          <Wall pos={[1.5, 0.5, 0]} size={[0.2, 1.0, 12]} mat={materials.exteriorWall} />
        </group>
        {/* Strictly NO sign on Annexure roof — per master specification */}
      </group>
    </group>
  );
};
