import React from 'react';
import * as THREE from 'three';
import { useCampusStore } from '../store/useCampusStore';
import { CampusMaterials } from './materials';

// ============================================================
// ARCHITECTURAL SPECIFICATIONS & COORDINATE SYSTEM
// Campus Horizontally Aligned:
//   Facing facade from road looking North (+Z):
//   - Main Block:      X: -21 → +21 m, Z: -8 → 40 m, Height: 4 floors x 4.0 m
//   - Main Entrance:   Centered at X = 0, Z = -8
//   - Alleyway/Bridge: X: 21 → 33 m, Z: 0 → 3 m (Open driveway underneath)
//   - Annexure Block:  X: 33 → 53 m, Z: -8 → 44 m, Height: 4 floors x 4.0 m (Left in front/screen view)
//
// Corridor System:
//   - Main Front Corridor: Z: -2 → 2.5 m (4.5 m wide, grand spine)
//   - Main West Corridor:  X: -15 → -11 m (4.0 m wide)
//   - Main East Corridor:  X: 11 → 15 m (4.0 m wide, bridge approach)
//   - Main North Corridor: Z: 29.5 → 34 m (4.5 m wide)
//   - Annexure Corridor:   X: 37 → 41 m (4.0 m wide)
//
// Door Openings: Width = 1.1 m, Height = 2.25 m (leaves opening in wall)
// ============================================================

const WT = 0.2;       // Interior wall thickness (200mm standard brick/blockwork)
const ROOM_H = 3.5;   // Clear room ceiling height
const DOOR_W = 1.1;   // Door opening width
const DOOR_H = 2.25;  // Door opening height
const LINTEL_H = ROOM_H - DOOR_H; // 1.25m height above door frame

// ────────────────────────────────────────────────────────────
// WALL HELPERS: Builds continuous walls with clean door cutouts
// ────────────────────────────────────────────────────────────

// Shared Unit Box Geometry singleton for all interior walls: eliminates ~2,000 dynamic BoxGeometry allocations
const SHARED_UNIT_BOX_GEOM = new THREE.BoxGeometry(1, 1, 1);

// Helper: Solid box mesh reusing shared unit geometry
const BoxWall: React.FC<{
  pos: [number, number, number];
  size: [number, number, number];
  mat: THREE.MeshStandardMaterial;
}> = ({ pos, size, mat }) => (
  <mesh position={pos} scale={size} geometry={SHARED_UNIT_BOX_GEOM} material={mat} receiveShadow />
);

// Shared geometry singletons for corridor linear tube lights
const SHARED_TUBE_BASE_GEOM = new THREE.BoxGeometry(1.2, 0.04, 0.12);
const SHARED_TUBE_CYL_GEOM = new THREE.CylinderGeometry(0.025, 0.025, 1.15, 8);

// Helper: Linear LED corridor tube light fixture (Photo 9.28.54 PM)
const LinearTubeLight: React.FC<{
  pos: [number, number, number];
  rotY?: number;
  mat: THREE.MeshStandardMaterial;
}> = ({ pos, rotY = 0, mat }) => (
  <group position={pos} rotation={[0, rotY, 0]}>
    <mesh position={[0, 0.02, 0]} geometry={SHARED_TUBE_BASE_GEOM}>
      <meshStandardMaterial color="#f1f5f9" roughness={0.4} />
    </mesh>
    <mesh position={[0, -0.01, 0]} rotation={[0, 0, Math.PI / 2]} geometry={SHARED_TUBE_CYL_GEOM} material={mat} />
  </group>
);

// Helper: Wall along X-axis (constant Z) with door openings
const XWallWithDoors: React.FC<{
  x0: number;
  x1: number;
  z: number;
  yBase: number;
  doorXs?: number[];
  mat: THREE.MeshStandardMaterial;
}> = ({ x0, x1, z, yBase, doorXs = [], mat }) => {
  const hy = yBase + ROOM_H / 2;
  const lintelY = yBase + DOOR_H + LINTEL_H / 2;

  // Filter and sort doors within bounds
  const validDoors = [...doorXs]
    .filter((dx) => dx >= x0 + DOOR_W / 2 && dx <= x1 - DOOR_W / 2)
    .sort((a, b) => a - b);

  if (validDoors.length === 0) {
    // Solid wall
    const w = x1 - x0;
    if (w <= 0.05) return null;
    return <BoxWall pos={[(x0 + x1) / 2, hy, z]} size={[w, ROOM_H, WT]} mat={mat} />;
  }

  const segments: React.ReactNode[] = [];
  let curX = x0;

  validDoors.forEach((dx, i) => {
    const doorLeft = dx - DOOR_W / 2;
    const doorRight = dx + DOOR_W / 2;

    // Full-height wall segment before door
    if (doorLeft > curX + 0.05) {
      const segW = doorLeft - curX;
      segments.push(
        <BoxWall
          key={`xseg-${i}-${curX}`}
          pos={[(curX + doorLeft) / 2, hy, z]}
          size={[segW, ROOM_H, WT]}
          mat={mat}
        />
      );
    }

    // Lintel wall segment above door opening
    segments.push(
      <BoxWall
        key={`xlintel-${i}-${dx}`}
        pos={[dx, lintelY, z]}
        size={[DOOR_W, LINTEL_H, WT]}
        mat={mat}
      />
    );

    curX = doorRight;
  });

  // Final wall segment after last door
  if (x1 > curX + 0.05) {
    const segW = x1 - curX;
    segments.push(
      <BoxWall
        key={`xseg-end-${curX}`}
        pos={[(curX + x1) / 2, hy, z]}
        size={[segW, ROOM_H, WT]}
        mat={mat}
      />
    );
  }

  return <group>{segments}</group>;
};

// Helper: Wall along Z-axis (constant X) with door openings
const ZWallWithDoors: React.FC<{
  x: number;
  z0: number;
  z1: number;
  yBase: number;
  doorZs?: number[];
  mat: THREE.MeshStandardMaterial;
}> = ({ x, z0, z1, yBase, doorZs = [], mat }) => {
  const hy = yBase + ROOM_H / 2;
  const lintelY = yBase + DOOR_H + LINTEL_H / 2;

  const validDoors = [...doorZs]
    .filter((dz) => dz >= z0 + DOOR_W / 2 && dz <= z1 - DOOR_W / 2)
    .sort((a, b) => a - b);

  if (validDoors.length === 0) {
    const d = z1 - z0;
    if (d <= 0.05) return null;
    return <BoxWall pos={[x, hy, (z0 + z1) / 2]} size={[WT, ROOM_H, d]} mat={mat} />;
  }

  const segments: React.ReactNode[] = [];
  let curZ = z0;

  validDoors.forEach((dz, i) => {
    const doorNear = dz - DOOR_W / 2;
    const doorFar = dz + DOOR_W / 2;

    if (doorNear > curZ + 0.05) {
      const segD = doorNear - curZ;
      segments.push(
        <BoxWall
          key={`zseg-${i}-${curZ}`}
          pos={[x, hy, (curZ + doorNear) / 2]}
          size={[WT, ROOM_H, segD]}
          mat={mat}
        />
      );
    }

    segments.push(
      <BoxWall
        key={`zlintel-${i}-${dz}`}
        pos={[x, lintelY, dz]}
        size={[WT, LINTEL_H, DOOR_W]}
        mat={mat}
      />
    );

    curZ = doorFar;
  });

  if (z1 > curZ + 0.05) {
    const segD = z1 - curZ;
    segments.push(
      <BoxWall
        key={`zseg-end-${curZ}`}
        pos={[x, hy, (curZ + z1) / 2]}
        size={[WT, ROOM_H, segD]}
        mat={mat}
      />
    );
  }

  return <group>{segments}</group>;
};

// ────────────────────────────────────────────────────────────
// MAIN BLOCK INTERIOR WALLS (PER FLOOR)
// ────────────────────────────────────────────────────────────
const MainFloorInteriorWalls: React.FC<{
  yBase: number;
  flIdx: number;
  mat: THREE.MeshStandardMaterial;
}> = ({ yBase, flIdx, mat }) => {
  const materials = CampusMaterials.getInstance();
  const isGround = flIdx === 0;

  // Door coordinates per floor centered at X=0
  // Front corridor doors (Z = -2)
  const frontDoorXs = isGround
    ? [-18, -12, -6, 6, 12, 18] // Ground: skip central entrance passage at X=-3..3
    : [-18, -12, -6, 0, 6, 12, 18]; // Upper: all rooms have doors

  // West corridor doors (X = -15, Z in [5.5, 34])
  const westDoorZs = [13.5, 22.5, 30.5];

  // Rear corridor doors (Z = 34, X in [-21, 21])
  const rearDoorXs = [-18, -12, -6, 0, 6, 12, 18];

  // East corridor doors (X = 15, Z in [5.5, 34])
  const eastDoorZs = [13.5, 22.5, 30.5];

  return (
    <group>
      {/* ═══════════════════════════════════════════════════════
          1. CORRIDOR SPINE WALLS (Separating rooms from corridor)
          ═══════════════════════════════════════════════════════ */}

      {/* Front corridor wall (Z = -2, X: -21 → 21) */}
      {isGround ? (
        <>
          {/* Ground floor: Left wing corridor wall */}
          <XWallWithDoors x0={-21} x1={-3} z={-2} yBase={yBase} doorXs={[-18, -12, -6]} mat={mat} />
          {/* Ground floor: Entrance lintel over open passage X=-3..3 */}
          <BoxWall
            pos={[0, yBase + DOOR_H + LINTEL_H / 2, -2]}
            size={[6.0, LINTEL_H, WT]}
            mat={mat}
          />
          {/* Ground floor: Right wing corridor wall */}
          <XWallWithDoors x0={3} x1={21} z={-2} yBase={yBase} doorXs={[6, 12, 18]} mat={mat} />
        </>
      ) : (
        <XWallWithDoors x0={-21} x1={21} z={-2} yBase={yBase} doorXs={frontDoorXs} mat={mat} />
      )}

      {/* West corridor wall (starts at Z = 5.5 to leave stair opening clear) */}
      <ZWallWithDoors x={-15} z0={5.5} z1={34} yBase={yBase} doorZs={westDoorZs} mat={mat} />
      {/* West stairwell rear wall behind landing */}
      <BoxWall pos={[-15, yBase + ROOM_H / 2, 5.5]} size={[3.0, ROOM_H, WT]} mat={mat} />
      {/* West stairwell outer side wall (separating stair from adjacent classroom) */}
      <BoxWall pos={[-16.5, yBase + ROOM_H / 2, 2.75]} size={[WT, ROOM_H, 5.5]} mat={mat} />

      {/* Rear corridor wall (Z = 34, X: -21 → 21) */}
      <XWallWithDoors x0={-21} x1={21} z={34} yBase={yBase} doorXs={rearDoorXs} mat={mat} />

      {/* East corridor wall (starts at Z = 5.5 to leave stair opening clear) */}
      <ZWallWithDoors x={15} z0={5.5} z1={34} yBase={yBase} doorZs={eastDoorZs} mat={mat} />
      {/* East stairwell rear wall behind landing */}
      <BoxWall pos={[15, yBase + ROOM_H / 2, 5.5]} size={[3.0, ROOM_H, WT]} mat={mat} />
      {/* East stairwell outer side wall (separating stair from adjacent classroom) */}
      <BoxWall pos={[16.5, yBase + ROOM_H / 2, 2.75]} size={[WT, ROOM_H, 5.5]} mat={mat} />

      {/* ═══════════════════════════════════════════════════════
          2. ROOM PARTITION WALLS (Dividing adjacent rooms)
          ═══════════════════════════════════════════════════════ */}

      {/* Front wing dividers (along Z: -8 → -2) */}
      {/* Dividers at X = -15, -9, -3, 3, 9, 15 */}
      {[-15, -9, -3, 3, 9, 15].map((px) => (
        <BoxWall
          key={`f-div-${px}`}
          pos={[px, yBase + ROOM_H / 2, -5]}
          size={[WT, ROOM_H, 6]}
          mat={mat}
        />
      ))}

      {/* West wing dividers (along X: -21 → -15, Z in [0, 34]) */}
      {/* Dividers at Z = 0, 9, 18, 27 */}
      {[0, 9, 18, 27].map((pz) => (
        <BoxWall
          key={`w-div-${pz}`}
          pos={[-18, yBase + ROOM_H / 2, pz]}
          size={[6, ROOM_H, WT]}
          mat={mat}
        />
      ))}

      {/* Rear wing dividers (along Z: 34 → 40, X in [-21, 21]) */}
      {/* Dividers at X = -15, -9, -3, 3, 9, 15 */}
      {[-15, -9, -3, 3, 9, 15].map((px) => (
        <BoxWall
          key={`r-div-${px}`}
          pos={[px, yBase + ROOM_H / 2, 37]}
          size={[WT, ROOM_H, 6]}
          mat={mat}
        />
      ))}

      {/* East wing dividers (along X: 15 → 21, Z in [0, 34]) */}
      {/* Dividers at Z = 0, 9, 18, 27 */}
      {[0, 9, 18, 27].map((pz) => (
        <BoxWall
          key={`e-div-${pz}`}
          pos={[18, yBase + ROOM_H / 2, pz]}
          size={[6, ROOM_H, WT]}
          mat={mat}
        />
      ))}

      {/* ═══════════════════════════════════════════════════════
          3. CENTRAL CORE ENCLOSURE WALLS (Staff Cabins & Labs)
          ═══════════════════════════════════════════════════════ */}

      {/* Staff Cabin 1 (West: X: -11 → -5, Z: 10 → 22, center X=-8) */}
      <ZWallWithDoors x={-11} z0={10} z1={22} yBase={yBase} doorZs={[16]} mat={mat} />
      <BoxWall pos={[-8, yBase + ROOM_H / 2, 10]} size={[6, ROOM_H, WT]} mat={mat} />
      <BoxWall pos={[-8, yBase + ROOM_H / 2, 22]} size={[6, ROOM_H, WT]} mat={mat} />
      <BoxWall pos={[-5, yBase + ROOM_H / 2, 16]} size={[WT, ROOM_H, 12]} mat={mat} />

      {/* Central Flagship Lab (X: -5 → 5, Z: 10 → 22, center X=0) */}
      {/* CSS Lab (G), Design Thinking (1F), Machine Vision (2F), Web 3.0 (3F) */}
      {/* User answer 6: Two doors only (front entrance Z=10 and back entrance Z=22) */}
      <XWallWithDoors x0={-5} x1={5} z={10} yBase={yBase} doorXs={[0]} mat={mat} />
      <XWallWithDoors x0={-5} x1={5} z={22} yBase={yBase} doorXs={[0]} mat={mat} />

      {/* Staff Cabin 2 (East: X: 5 → 11, Z: 10 → 22, center X=8) */}
      <BoxWall pos={[5, yBase + ROOM_H / 2, 16]} size={[WT, ROOM_H, 12]} mat={mat} />
      <ZWallWithDoors x={11} z0={10} z1={22} yBase={yBase} doorZs={[16]} mat={mat} />
      <BoxWall pos={[8, yBase + ROOM_H / 2, 10]} size={[6, ROOM_H, WT]} mat={mat} />
      <BoxWall pos={[8, yBase + ROOM_H / 2, 22]} size={[6, ROOM_H, WT]} mat={mat} />

      {/* On 2nd Floor: Partition for Server Room inside central lab zone */}
      {/* User answer 8: server room is behind the lab attached to it with glass viewing panels */}
      {flIdx === 2 && (
        <group>
          <BoxWall pos={[0, yBase + ROOM_H / 2, 18]} size={[10, ROOM_H, WT]} mat={mat} />
          {/* Glass viewing panel aperture between Machine Vision Lab and Server Room */}
          <mesh position={[0, yBase + 1.8, 18]} material={materials.windowGlass}>
            <boxGeometry args={[4.0, 1.4, 0.04]} />
          </mesh>
          <mesh position={[0, yBase + 1.8, 18]} material={materials.windowWhiteFrame}>
            <boxGeometry args={[4.1, 1.48, 0.05]} />
          </mesh>
        </group>
      )}

      {/* ═══════════════════════════════════════════════════════
          4. STRUCTURAL PORTAL COLUMNS & BEAMS (Photos 9.28.54 PM)
          Painted deep navy blue (#1d2737), projecting along corridor walls
          ═══════════════════════════════════════════════════════ */}
      {/* Columns & Tie-Beams along Front Corridor (Z = -2.0) */}
      {[-18, -12, -6, 0, 6, 12, 18].map((cx) => (
        <group key={`m-col-f-${cx}`}>
          <BoxWall pos={[cx, yBase + ROOM_H / 2, -2.0]} size={[0.4, ROOM_H, 0.35]} mat={materials.columnNavyBlue} />
          <BoxWall pos={[cx, yBase + ROOM_H - 0.15, 0.25]} size={[0.3, 0.3, 4.5]} mat={materials.columnNavyBlue} />
        </group>
      ))}

      {/* Columns & Tie-Beams along Rear Corridor (Z = 34.0) */}
      {[-18, -12, -6, 0, 6, 12, 18].map((cx) => (
        <group key={`m-col-r-${cx}`}>
          <BoxWall pos={[cx, yBase + ROOM_H / 2, 34.0]} size={[0.4, ROOM_H, 0.35]} mat={materials.columnNavyBlue} />
          <BoxWall pos={[cx, yBase + ROOM_H - 0.15, 31.75]} size={[0.3, 0.3, 4.5]} mat={materials.columnNavyBlue} />
        </group>
      ))}

      {/* Columns & Tie-Beams along West Corridor (X = -15.0) */}
      {[0, 9, 18, 27].map((cz) => (
        <group key={`m-col-w-${cz}`}>
          <BoxWall pos={[-15.0, yBase + ROOM_H / 2, cz]} size={[0.35, ROOM_H, 0.4]} mat={materials.columnNavyBlue} />
          <BoxWall pos={[-13.0, yBase + ROOM_H - 0.15, cz]} size={[4.0, 0.3, 0.3]} mat={materials.columnNavyBlue} />
        </group>
      ))}

      {/* Columns & Tie-Beams along East Corridor (X = 15.0) */}
      {[0, 9, 18, 27].map((cz) => (
        <group key={`m-col-e-${cz}`}>
          <BoxWall pos={[15.0, yBase + ROOM_H / 2, cz]} size={[0.35, ROOM_H, 0.4]} mat={materials.columnNavyBlue} />
          <BoxWall pos={[13.0, yBase + ROOM_H - 0.15, cz]} size={[4.0, 0.3, 0.3]} mat={materials.columnNavyBlue} />
        </group>
      ))}

      {/* ═══════════════════════════════════════════════════════
          5. CORRIDOR LINEAR TUBE LIGHTS (Photo 9.28.54 PM)
          Surface/recessed warm-white LED luminaires centered between navy beams
          ═══════════════════════════════════════════════════════ */}
      {/* Front Corridor lights */}
      {[-15, -9, -3, 3, 9, 15].map((cx) => (
        <LinearTubeLight
          key={`m-lt-f-${cx}`}
          pos={[cx, yBase + ROOM_H - 0.04, 0.25]}
          rotY={0}
          mat={materials.ledTubeLight}
        />
      ))}
      {/* Rear Corridor lights */}
      {[-15, -9, -3, 3, 9, 15].map((cx) => (
        <LinearTubeLight
          key={`m-lt-r-${cx}`}
          pos={[cx, yBase + ROOM_H - 0.04, 31.75]}
          rotY={0}
          mat={materials.ledTubeLight}
        />
      ))}
      {/* West Corridor lights */}
      {[4.5, 13.5, 22.5, 30.5].map((cz) => (
        <LinearTubeLight
          key={`m-lt-w-${cz}`}
          pos={[-13.0, yBase + ROOM_H - 0.04, cz]}
          rotY={Math.PI / 2}
          mat={materials.ledTubeLight}
        />
      ))}
      {/* East Corridor lights */}
      {[4.5, 13.5, 22.5, 30.5].map((cz) => (
        <LinearTubeLight
          key={`m-lt-e-${cz}`}
          pos={[13.0, yBase + ROOM_H - 0.04, cz]}
          rotY={Math.PI / 2}
          mat={materials.ledTubeLight}
        />
      ))}

      {/* ═══════════════════════════════════════════════════════
          6. CONTINUOUS BLACK SKIRTING (15cm high along corridor walls)
          ═══════════════════════════════════════════════════════ */}
      {isGround ? (
        <>
          <BoxWall pos={[-12, yBase + 0.075, -1.89]} size={[18, 0.15, 0.02]} mat={materials.skirtingBlack} />
          <BoxWall pos={[12, yBase + 0.075, -1.89]} size={[18, 0.15, 0.02]} mat={materials.skirtingBlack} />
        </>
      ) : (
        <BoxWall pos={[0, yBase + 0.075, -1.89]} size={[42, 0.15, 0.02]} mat={materials.skirtingBlack} />
      )}
      <BoxWall pos={[0, yBase + 0.075, 33.89]} size={[42, 0.15, 0.02]} mat={materials.skirtingBlack} />
      <BoxWall pos={[-14.89, yBase + 0.075, 16]} size={[0.02, 0.15, 36]} mat={materials.skirtingBlack} />
      <BoxWall pos={[14.89, yBase + 0.075, 16]} size={[0.02, 0.15, 36]} mat={materials.skirtingBlack} />
    </group>
  );
};

// ────────────────────────────────────────────────────────────
// ANNEXURE BLOCK INTERIOR WALLS (PER FLOOR)
// ────────────────────────────────────────────────────────────
const AnnexureFloorInteriorWalls: React.FC<{
  yBase: number;
  flIdx: number;
  mat: THREE.MeshStandardMaterial;
}> = ({ yBase, flIdx, mat }) => {
  const materials = CampusMaterials.getInstance();
  // Annexure dimensions: X = 33 → 53, Z = -8 → 44
  // Inner east wall / stairwell / light court: X = 33 → 37
  // Corridor: X = 37 → 41 (4m wide spacious corridor)
  // Outer rooms: X = 41 → 53 (12m wide)

  // Doors along X = 41 for each floor:
  let doorZs: number[] = [];
  let dividers: number[] = [];

  if (flIdx === 0) {
    // Ground: Dean cabin (Z: -8..0), LH1 (Z: 2..14), LH2 (Z: 14..26), LH3 (Z: 26..38), Girls (Z: 38..44)
    doorZs = [-4, 8, 20, 32, 41];
    dividers = [0, 2, 14, 26, 38];
  } else if (flIdx === 1) {
    // 1st Floor: FC(14) (Z: -8..0), 469 (0..8), 470 (8..16), 471 (16..24), 472 (24..32), 473 (32..40), Girls (40..44)
    doorZs = [-4, 4, 12, 20, 28, 36, 42];
    dividers = [0, 8, 16, 24, 32, 40];
  } else if (flIdx === 2) {
    // 2nd Floor: FC(15) (Z: -8..0), 474 (0..8), 475 (8..16), 476 (16..24), 477 (24..32), 478 (32..40), Boys (40..44)
    doorZs = [-4, 4, 12, 20, 28, 36, 42];
    dividers = [0, 8, 16, 24, 32, 40];
  } else {
    // 3rd Floor: Gen AI Lab (Z: 0..18), Quantum Computing Lab (18..36), Boys Restroom (36..44)
    doorZs = [9, 27, 40];
    dividers = [0, 18, 36];
  }

  return (
    <group>
      {/* ── Corridor Wall (X = 41, Z: -8 → 44, separating corridor from rooms) ─────────── */}
      {flIdx === 0 ? (
        <>
          {/* Ground floor: entrance opening between Dean and LH1 at Z = 0..2 */}
          <ZWallWithDoors x={41} z0={-8} z1={0} yBase={yBase} doorZs={[-4]} mat={mat} />
          {/* Ground entrance portal header */}
          <BoxWall pos={[41, yBase + DOOR_H + LINTEL_H / 2, 1]} size={[WT, LINTEL_H, 2]} mat={mat} />
          <ZWallWithDoors x={41} z0={2} z1={44} yBase={yBase} doorZs={[8, 20, 32, 41]} mat={mat} />
        </>
      ) : (
        <ZWallWithDoors x={41} z0={-8} z1={44} yBase={yBase} doorZs={doorZs} mat={mat} />
      )}

      {/* ── Room Partition Walls (along X: 41 → 53, center X=47) ────────── */}
      {dividers.map((pz) => (
        <BoxWall
          key={`ann-div-${pz}`}
          pos={[47, yBase + ROOM_H / 2, pz]}
          size={[12, ROOM_H, WT]}
          mat={mat}
        />
      ))}

      {/* Structural Navy Columns & Ceiling Beams across Annexure Open Corridor (Photos 9.28.54 PM & 9.28.50 PM) */}
      {[0, 8, 16, 24, 32, 40].map((cz) => (
        <group key={`ann-col-${cz}`}>
          <BoxWall pos={[41, yBase + ROOM_H / 2, cz]} size={[0.35, ROOM_H, 0.4]} mat={materials.columnNavyBlue} />
          <BoxWall pos={[33.2, yBase + ROOM_H / 2, cz]} size={[0.35, ROOM_H, 0.4]} mat={materials.columnNavyBlue} />
          <BoxWall pos={[37.1, yBase + ROOM_H - 0.15, cz]} size={[8.0, 0.3, 0.3]} mat={materials.columnNavyBlue} />
        </group>
      ))}

      {/* Annexure Corridor Linear LED Tube Lights (Photo 9.28.54 PM) */}
      {[-4, 4, 12, 20, 28, 36].map((cz) => (
        <LinearTubeLight
          key={`ann-lt-${cz}`}
          pos={[37.5, yBase + ROOM_H - 0.04, cz]}
          rotY={Math.PI / 2}
          mat={materials.ledTubeLight}
        />
      ))}

      {/* Black skirting along classroom corridor wall */}
      <BoxWall pos={[41.11, yBase + 0.075, 18]} size={[0.02, 0.15, 52]} mat={materials.skirtingBlack} />
    </group>
  );
};

// ────────────────────────────────────────────────────────────
// MAIN COMPONENT: FloorGeometry
// ────────────────────────────────────────────────────────────
export const FloorGeometry: React.FC = () => {
  const materials = CampusMaterials.getInstance();
  const explodedView = useCampusStore((s) => s.explodedView);
  const currentFloor = useCampusStore((s) => s.currentFloor);
  const cameraMode = useCampusStore((s) => s.cameraMode);
  const isWalking = cameraMode === 'first-person' || cameraMode === 'third-person';

  // Performance Optimization: In overview / orbit mode without exploded view,
  // interior partition walls and corridor lights are 100% occluded by the solid exterior building shell & roof
  if (!isWalking && !explodedView) {
    return null;
  }

  const floorElevations = [0, 4.0, 8.0, 12.0];
  const activeIdx =
    currentFloor === 'ground' ? 0 :
    currentFloor === 'first' ? 1 :
    currentFloor === 'second' ? 2 : 3;

  return (
    <group>
      {floorElevations.map((baseY, flIdx) => {
        const y = explodedView ? baseY * (1 + flIdx * 0.25) : baseY;

        return (
          <React.Fragment key={`fl-geom-${flIdx}`}>
            <MainFloorInteriorWalls yBase={y} flIdx={flIdx} mat={materials.interiorWall} />
            <AnnexureFloorInteriorWalls yBase={y} flIdx={flIdx} mat={materials.interiorWall} />
          </React.Fragment>
        );
      })}
    </group>
  );
};
