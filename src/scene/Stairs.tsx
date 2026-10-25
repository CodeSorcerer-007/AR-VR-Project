import React from 'react';
import * as THREE from 'three';
import { useCampusStore } from '../store/useCampusStore';
import { staircases } from '../config/campus-data';
import { CampusMaterials } from './materials';
import { Text } from '@react-three/drei';

// ============================================================
// STAIRCASE SPECIFICATIONS (True collegiate architecture)
//   Main Block: DOG-LEG / Scissor U-turn staircases
//     - Opening: 3.0m wide (X: 13.5..16.5 & -16.5..-13.5), 5.5m depth
//     - Flight 1: 1.35m wide, 11 steps climbing +Z (0 -> 2.0m height)
//     - Mid-Landing: 2.9m wide x 1.4m deep spanning both flights
//     - Flight 2: 1.35m wide, 11 steps climbing -Z (2.0 -> 4.0m height)
//     - Top Landing: connects Flight 2 cleanly onto upper corridor
//     - Dark grey granite treads with black nosing & vertical steel railings
//
//   Annexure Block: STRAIGHT single-flight staircase (Photos 9.28.54 PM & 9.28.55 PM)
//     - Opening: 3.0m wide at X = 39 (X: 37.5..40.5, Z: 0..5.5)
//     - Flight: 2.2m wide, 16 steps climbing +Z directly to upper corridor
//     - Navy blue entrance columns framing bottom, solid parapet along side
// ============================================================

const STEPS_PER_HALF = 11;
const TREAD = 0.28;
const RISER = 0.185;
const HALF_RUN = STEPS_PER_HALF * TREAD; // 3.08m

const STEPS_STR = 16;
const TREAD_STR = 0.30;
const RISER_STR = 0.25;
const STR_RUN = STEPS_STR * TREAD_STR; // 4.80m

// Geometries for Dogleg stairs
const TREAD_DOGLEG_GEOM = new THREE.BoxGeometry(1.35, 0.04, TREAD + 0.01);
const RISER_DOGLEG_GEOM = new THREE.BoxGeometry(1.33, RISER - 0.04, TREAD);
const LANDING_DOGLEG_GEOM = new THREE.BoxGeometry(2.9, 0.2, 1.4);
const LANDING_DOGLEG_TILE = new THREE.PlaneGeometry(2.86, 1.36);

// Geometries for Straight stairs
const TREAD_STR_GEOM = new THREE.BoxGeometry(2.2, 0.04, TREAD_STR + 0.01);
const RISER_STR_GEOM = new THREE.BoxGeometry(2.18, RISER_STR - 0.04, TREAD_STR);
const LANDING_STR_GEOM = new THREE.BoxGeometry(2.4, 0.2, 1.0);
const LANDING_STR_TILE = new THREE.PlaneGeometry(2.36, 0.96);

const BALUSTER_GEOM = new THREE.BoxGeometry(0.035, 0.85, 0.035);
const COL_GEOM = new THREE.BoxGeometry(0.35, 3.8, 0.35);
const DIR_PLATE_GEOM = new THREE.BoxGeometry(1.4, 0.8, 0.02);
const DIR_BANNER_G = new THREE.BoxGeometry(1.36, 0.2, 0.01);

// Single Flight Component
const FlightMesh: React.FC<{
  pos: [number, number, number];
  steps: number;
  tread: number;
  riser: number;
  width: number;
  treadGeom: THREE.BoxGeometry;
  riserGeom: THREE.BoxGeometry;
  materials: CampusMaterials;
  facingNeg?: boolean;
}> = ({ pos, steps, tread, riser, width, treadGeom, riserGeom, materials, facingNeg = false }) => {
  const dir = facingNeg ? -1 : 1;
  return (
    <group position={pos}>
      {Array.from({ length: steps }).map((_, i) => {
        const stepY = i * riser;
        const stepZ = i * tread * dir;
        return (
          <group key={i} position={[0, stepY, stepZ]}>
            {/* Polished Granite Tread */}
            <mesh
              position={[0, riser - 0.02, (tread / 2) * dir]}
              material={materials.stairTreadGranite}
              geometry={treadGeom}
              receiveShadow
            />
            {/* Concrete Step Riser Block */}
            <mesh
              position={[0, (riser - 0.04) / 2, (tread / 2) * dir]}
              material={materials.exteriorWall}
              geometry={riserGeom}
              receiveShadow
            />
            {/* Black Nosing Strip */}
            <mesh position={[0, riser, 0]} material={materials.skirtingBlack}>
              <boxGeometry args={[width + 0.02, 0.035, 0.05]} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

// Handrail with Balusters along Flight
const FlightRail: React.FC<{
  pos: [number, number, number];
  steps: number;
  tread: number;
  riser: number;
  side: 'left' | 'right';
  width: number;
  materials: CampusMaterials;
  facingNeg?: boolean;
}> = ({ pos, steps, tread, riser, side, width, materials, facingNeg = false }) => {
  const dir = facingNeg ? -1 : 1;
  const xOff = side === 'left' ? -width / 2 + 0.04 : width / 2 - 0.04;
  const totalRun = steps * tread;
  const totalRise = steps * riser;
  const angle = Math.atan2(totalRise, totalRun) * dir;
  const hypot = Math.hypot(totalRun, totalRise);

  return (
    <group position={pos}>
      {/* Sloped Top Handrail */}
      <mesh
        position={[xOff, totalRise / 2 + 0.88, (totalRun / 2) * dir]}
        rotation={[angle, 0, 0]}
        material={materials.railingSteel}
      >
        <boxGeometry args={[0.04, 0.05, hypot]} />
      </mesh>
      {/* Balusters spaced along the steps */}
      {Array.from({ length: Math.ceil(steps / 2) }).map((_, i) => {
        const si = i * 2;
        const by = si * riser + 0.42;
        const bz = si * tread * dir;
        return (
          <mesh key={i} position={[xOff, by, bz]} material={materials.railingSteel} geometry={BALUSTER_GEOM} />
        );
      })}
    </group>
  );
};

// ============================================================
// MAIN BLOCK: DOG-LEG STAIRCASE
// Fits exactly inside 3.0m x 5.5m opening at bx (+15 or -15)
// ============================================================
const DogLegStair: React.FC<{
  bx: number;
  by: number;
  bz: number;
  materials: CampusMaterials;
  toFloorName: string;
  isWalking: boolean;
  qualityPreset: string;
}> = ({ bx, by, bz, materials, toFloorName, isWalking, qualityPreset }) => {
  const isEast = bx > 0;
  // Flight 1 is inner (closer to center of building):
  const f1x = isEast ? bx - 0.725 : bx + 0.725;
  // Flight 2 is outer (closer to exterior wall):
  const f2x = isEast ? bx + 0.725 : bx - 0.725;

  const landingY = by + 2.0 - 0.1;
  const landingZ = bz + HALF_RUN + 0.7; // ~4.28m

  return (
    <group>
      {/* ── Navy Blue Structural Frame Columns ── */}
      {[-1.4, 1.4].map((xo) => (
        <group key={`col-${xo}`}>
          <mesh position={[bx + xo, by + 1.9, bz - 0.1]} material={materials.columnNavyBlue} geometry={COL_GEOM} />
          <mesh position={[bx + xo, by + 1.9, bz + HALF_RUN + 1.4]} material={materials.columnNavyBlue} geometry={COL_GEOM} />
        </group>
      ))}

      {/* ── Flight 1: Ascends in +Z from by to by + 2.0m ── */}
      <FlightMesh
        pos={[f1x, by, bz]}
        steps={STEPS_PER_HALF}
        tread={TREAD}
        riser={RISER}
        width={1.35}
        treadGeom={TREAD_DOGLEG_GEOM}
        riserGeom={RISER_DOGLEG_GEOM}
        materials={materials}
        facingNeg={false}
      />
      <FlightRail
        pos={[f1x, by, bz]}
        steps={STEPS_PER_HALF}
        tread={TREAD}
        riser={RISER}
        side="left"
        width={1.35}
        materials={materials}
        facingNeg={false}
      />
      <FlightRail
        pos={[f1x, by, bz]}
        steps={STEPS_PER_HALF}
        tread={TREAD}
        riser={RISER}
        side="right"
        width={1.35}
        materials={materials}
        facingNeg={false}
      />

      {/* ── Mid-Floor Intermediate Landing (Spans across both flights) ── */}
      <group position={[bx, landingY, landingZ]}>
        {/* Concrete Landing Slab */}
        <mesh material={materials.roofSlab} geometry={LANDING_DOGLEG_GEOM} receiveShadow />
        {/* Polished Granite Surface */}
        <mesh
          position={[0, 0.105, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          material={materials.stairTreadGranite}
          geometry={LANDING_DOGLEG_TILE}
          receiveShadow
        />
        {/* Back and side safety railing along rear wall */}
        <mesh position={[0, 0.88, 0.65]} material={materials.railingSteel}>
          <boxGeometry args={[2.85, 0.05, 0.04]} />
        </mesh>
        {/* Black skirting along landing edge */}
        <mesh position={[0, 0.16, 0.68]} material={materials.skirtingBlack}>
          <boxGeometry args={[2.9, 0.12, 0.02]} />
        </mesh>

        {/* Floor Directory Signboard on Landing Rear Wall (Photo 9.29.07 PM (1)) */}
        <group position={[0, 1.45, 0.68]} rotation={[0, Math.PI, 0]}>
          <mesh material={materials.pvcPipeWhite} geometry={DIR_PLATE_GEOM} />
          <mesh position={[0, 0.28, 0.012]} material={materials.columnNavyBlue} geometry={DIR_BANNER_G} />
          <Text
            position={[0, 0.28, 0.02]}
            fontSize={0.06}
            letterSpacing={0.04}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            DEPARTMENT OF COMPUTER SCIENCE & ENGG
          </Text>
          <Text
            position={[0, 0.08, 0.02]}
            fontSize={0.075}
            color="#1e3a8a"
            anchorX="center"
            anchorY="middle"
          >
            {toFloorName.toUpperCase()} FLOOR
          </Text>
          <Text
            position={[0, -0.16, 0.02]}
            fontSize={0.045}
            lineHeight={1.3}
            color="#334155"
            maxWidth={1.3}
            anchorX="center"
            anchorY="middle"
          >
            {toFloorName === 'first'
              ? 'CLASSROOMS 469 - 473\nDESIGN THINKING LAB | FACULTY CABINS'
              : toFloorName === 'second'
              ? 'CLASSROOMS 474 - 478\nMACHINE VISION LAB | SERVER ROOM'
              : 'WEB 3.0 LAB | QUANTUM COMPUTING\nGEN AI RESEARCH HUB | ANNEXURE BRIDGE'}
          </Text>
        </group>
      </group>

      {/* ── Flight 2: Ascends in -Z from landing (Y=2.0m) to upper floor (Y=4.0m) ── */}
      <FlightMesh
        pos={[f2x, landingY + 0.1, bz + HALF_RUN]}
        steps={STEPS_PER_HALF}
        tread={TREAD}
        riser={RISER}
        width={1.35}
        treadGeom={TREAD_DOGLEG_GEOM}
        riserGeom={RISER_DOGLEG_GEOM}
        materials={materials}
        facingNeg={true}
      />
      <FlightRail
        pos={[f2x, landingY + 0.1, bz + HALF_RUN]}
        steps={STEPS_PER_HALF}
        tread={TREAD}
        riser={RISER}
        side="left"
        width={1.35}
        materials={materials}
        facingNeg={true}
      />
      <FlightRail
        pos={[f2x, landingY + 0.1, bz + HALF_RUN]}
        steps={STEPS_PER_HALF}
        tread={TREAD}
        riser={RISER}
        side="right"
        width={1.35}
        materials={materials}
        facingNeg={true}
      />

      {/* ── Top Floor Arrival Landing (Connects Flight 2 to corridor floor) ── */}
      <group position={[f2x, by + 4.0 - 0.1, bz - 0.35]}>
        <mesh material={materials.roofSlab} receiveShadow>
          <boxGeometry args={[1.35, 0.2, 0.7]} />
        </mesh>
        <mesh position={[0, 0.105, 0]} rotation={[-Math.PI / 2, 0, 0]} material={materials.stairTreadGranite} receiveShadow>
          <planeGeometry args={[1.33, 0.68]} />
        </mesh>
      </group>
    </group>
  );
};

// ============================================================
// ANNEXURE BLOCK: STRAIGHT SINGLE-FLIGHT STAIRCASE
// (Photos 9.28.54 PM & 9.28.55 PM (3))
// Fits inside X: 37.5..40.5, Z: 0..5.5 (centered at bx = 39)
// ============================================================
const StraightStair: React.FC<{
  bx: number;
  by: number;
  bz: number;
  materials: CampusMaterials;
  toFloorName: string;
  isWalking: boolean;
  qualityPreset: string;
}> = ({ bx, by, bz, materials, toFloorName }) => {
  return (
    <group>
      {/* Navy structural entrance columns framing bottom entrance (Photo 9.28.55 PM) */}
      {[-1.2, 1.2].map((xo) => (
        <group key={`ann-scol-${xo}`}>
          <mesh position={[bx + xo, by + 1.9, bz - 0.1]} material={materials.columnNavyBlue} geometry={COL_GEOM} />
          <mesh position={[bx + xo, by + 1.9, bz + STR_RUN + 0.5]} material={materials.columnNavyBlue} geometry={COL_GEOM} />
        </group>
      ))}

      {/* Solid right side parapet barrier wall (Photo 9.28.55 PM (3)) */}
      <group position={[bx + 1.15, by, bz + STR_RUN / 2]}>
        <mesh position={[0, 2.0 + 0.45, 0]} rotation={[Math.atan2(4.0, STR_RUN), 0, 0]} material={materials.exteriorWall}>
          <boxGeometry args={[0.15, 0.9, Math.hypot(STR_RUN, 4.0)]} />
        </mesh>
        <mesh position={[0, 2.0 + 0.92, 0]} rotation={[Math.atan2(4.0, STR_RUN), 0, 0]} material={materials.columnNavyBlue}>
          <boxGeometry args={[0.18, 0.06, Math.hypot(STR_RUN, 4.0)]} />
        </mesh>
      </group>

      {/* The Single Straight Flight */}
      <FlightMesh
        pos={[bx, by, bz]}
        steps={STEPS_STR}
        tread={TREAD_STR}
        riser={RISER_STR}
        width={2.2}
        treadGeom={TREAD_STR_GEOM}
        riserGeom={RISER_STR_GEOM}
        materials={materials}
        facingNeg={false}
      />
      {/* Left steel handrail */}
      <FlightRail
        pos={[bx, by, bz]}
        steps={STEPS_STR}
        tread={TREAD_STR}
        riser={RISER_STR}
        side="left"
        width={2.2}
        materials={materials}
        facingNeg={false}
      />

      {/* Top Landing Platform connecting directly into upper corridor floor slab */}
      <group position={[bx, by + 4.0 - 0.1, bz + STR_RUN + 0.5]}>
        <mesh material={materials.roofSlab} geometry={LANDING_STR_GEOM} receiveShadow />
        <mesh
          position={[0, 0.105, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          material={materials.darkGraniteFoyer}
          geometry={LANDING_STR_TILE}
          receiveShadow
        />
        {/* Navy lintel beam overhead */}
        <mesh position={[0, 1.8, 0]} material={materials.columnNavyBlue}>
          <boxGeometry args={[2.5, 0.3, 0.3]} />
        </mesh>
        <Text
          position={[0, 1.35, 0.48]}
          fontSize={0.07}
          letterSpacing={0.06}
          color="#1e3a8a"
          anchorX="center"
          anchorY="middle"
        >
          {toFloorName.toUpperCase()} FLOOR CORRIDOR
        </Text>
      </group>
    </group>
  );
};

// ============================================================
// MAIN EXPORT: Stairs
// ============================================================
export const Stairs: React.FC = () => {
  const materials = CampusMaterials.getInstance();
  const explodedView = useCampusStore((s) => s.explodedView);
  const cameraMode = useCampusStore((s) => s.cameraMode);
  const qualityPreset = useCampusStore((s) => s.qualityPreset);
  const currentFloor = useCampusStore((s) => s.currentFloor);
  const currentBlock = useCampusStore((s) => s.currentBlock);

  const isWalking = cameraMode === 'first-person' || cameraMode === 'third-person';

  // In overview / orbit / presentation mode without exploded view, interior staircases are occluded by exterior walls & roofs
  if (!isWalking && !explodedView) {
    return null;
  }

  return (
    <group>
      {staircases.map((stair) => {
        // In walk mode, cull stairs that do not connect to current floor or are in the opposite wing
        if (isWalking && !explodedView) {
          const connectsToCurrentFloor = stair.fromFloor === currentFloor || stair.toFloor === currentFloor;
          if (!connectsToCurrentFloor) return null;
          if (currentBlock === 'main' && stair.block === 'annexure') return null;
          if (currentBlock === 'annexure' && stair.block === 'main') return null;
        }

        const [bx, by, bz] = stair.bottomPosition;
        const flIdx = stair.fromFloor === 'ground' ? 0 : stair.fromFloor === 'first' ? 1 : 2;
        const yBase = explodedView ? by * (1 + flIdx * 0.25) : by;

        const isAnnexure = stair.block === 'annexure';

        if (isAnnexure) {
          return (
            <StraightStair
              key={stair.id}
              bx={bx}
              by={yBase}
              bz={bz}
              materials={materials}
              toFloorName={stair.toFloor}
              isWalking={isWalking}
              qualityPreset={qualityPreset}
            />
          );
        }

        return (
          <DogLegStair
            key={stair.id}
            bx={bx}
            by={yBase}
            bz={bz}
            materials={materials}
            toFloorName={stair.toFloor}
            isWalking={isWalking}
            qualityPreset={qualityPreset}
          />
        );
      })}
    </group>
  );
};
