import React from 'react';
import * as THREE from 'three';
import { useCampusStore } from '../store/useCampusStore';
import { staircases } from '../config/campus-data';
import { CampusMaterials } from './materials';
import { Text } from '@react-three/drei';

// Flight step specs
const STEPS_PER_FLIGHT = 16;
const TREAD = 0.25;
const RISER = 0.25;
const FLIGHT_SPAN = STEPS_PER_FLIGHT * TREAD; // 4.0m
const FLIGHT_HYPOT = Math.hypot(4.0, FLIGHT_SPAN);
const FLIGHT_ANGLE = Math.atan2(4.0, FLIGHT_SPAN);

// Shared static geometries: eliminates 300+ GPU buffer allocations
const SHARED_STAIR_TREAD_GEOM = new THREE.BoxGeometry(2.4, 0.04, TREAD + 0.015);
const SHARED_STAIR_RISER_GEOM = new THREE.BoxGeometry(2.38, RISER - 0.04, TREAD);
const SHARED_STAIR_LANDING_SLAB_GEOM = new THREE.BoxGeometry(2.4, 0.2, 1.5);
const SHARED_STAIR_LANDING_TILE_GEOM = new THREE.PlaneGeometry(2.36, 1.46);
const SHARED_STAIR_LANDING_SKIRT_GEOM = new THREE.BoxGeometry(0.02, 0.15, 1.48);
const SHARED_STAIR_DIR_PLATE_GEOM = new THREE.BoxGeometry(1.3, 0.75, 0.02);
const SHARED_STAIR_DIR_BANNER_GEOM = new THREE.BoxGeometry(1.26, 0.18, 0.01);
const SHARED_STAIR_DIR_STANDOFF_GEOM = new THREE.CylinderGeometry(0.015, 0.015, 0.02, 8);
const SHARED_STAIR_STRINGER_GEOM = new THREE.BoxGeometry(0.08, 0.35, FLIGHT_HYPOT);
const SHARED_STAIR_COLUMN_GEOM = new THREE.CylinderGeometry(0.08, 0.08, 2.0, 10);
const SHARED_STAIR_HANDRAIL_GEOM = new THREE.BoxGeometry(0.05, 0.06, FLIGHT_HYPOT);
const SHARED_STAIR_BALUSTER_GEOM = new THREE.CylinderGeometry(0.015, 0.015, 0.9, 6);

export const Stairs: React.FC = () => {
  const materials = CampusMaterials.getInstance();
  const explodedView = useCampusStore((s) => s.explodedView);
  const currentFloor = useCampusStore((s) => s.currentFloor);
  const cameraMode = useCampusStore((s) => s.cameraMode);
  const qualityPreset = useCampusStore((s) => s.qualityPreset);

  const isWalking = cameraMode === 'first-person' || cameraMode === 'third-person';

  return (
    <group>
      {staircases.map((stair) => {
        // Floor occlusion culling: in walking mode, only render staircases connecting to visitor's current floor
        if (isWalking && !explodedView && stair.fromFloor !== currentFloor && stair.toFloor !== currentFloor) {
          return null;
        }

        const [bx, by, bz] = stair.bottomPosition;
        const width = stair.width;

        // Apply exploded view vertical offset if active
        const flIdx = stair.fromFloor === 'ground' ? 0 : stair.fromFloor === 'first' ? 1 : 2;
        const yBase = explodedView ? by * (1 + flIdx * 0.25) : by;

        return (
          <group key={stair.id} position={[bx, yBase, bz]}>
            {/* Steps array with Granite Treads & Black Nosing */}
            {Array.from({ length: STEPS_PER_FLIGHT }).map((_, stepIdx) => {
              const stepY = stepIdx * RISER;
              const stepZ = stepIdx * TREAD;

              return (
                <group key={stepIdx} position={[0, stepY, stepZ]}>
                  {/* Granite Tread Slab with Integrated Nosing */}
                  <mesh
                    position={[0, RISER - 0.02, TREAD / 2 - 0.005]}
                    material={materials.stairTreadGranite}
                    geometry={SHARED_STAIR_TREAD_GEOM}
                    receiveShadow
                  />

                  {/* Concrete Step Base & Riser Block */}
                  <mesh
                    position={[0, (RISER - 0.04) / 2, TREAD / 2]}
                    material={materials.exteriorWall}
                    geometry={SHARED_STAIR_RISER_GEOM}
                    receiveShadow
                  />
                </group>
              );
            })}

            {/* Stair Landing at top with Polished Granite Flooring */}
            <group position={[0, 4.0 - 0.1, FLIGHT_SPAN + 0.75]}>
              <mesh material={materials.roofSlab} geometry={SHARED_STAIR_LANDING_SLAB_GEOM} receiveShadow />
              <mesh position={[0, 0.105, 0]} rotation={[-Math.PI / 2, 0, 0]} material={materials.interiorFloorTile} geometry={SHARED_STAIR_LANDING_TILE_GEOM} />
              {/* Black skirting along landing side walls */}
              <mesh position={[-width / 2 + 0.01, 0.18, 0]} material={materials.skirtingBlack} geometry={SHARED_STAIR_LANDING_SKIRT_GEOM} />
              <mesh position={[width / 2 - 0.01, 0.18, 0]} material={materials.skirtingBlack} geometry={SHARED_STAIR_LANDING_SKIRT_GEOM} />

              {/* Department Floor Directory Signboard (Only render text when walking and not in low preset) */}
              <group position={[0, 1.5, 0.73]} rotation={[0, Math.PI, 0]}>
                <mesh material={materials.pvcPipeWhite} geometry={SHARED_STAIR_DIR_PLATE_GEOM} />
                <mesh position={[0, 0.26, 0.012]} material={materials.columnNavyBlue} geometry={SHARED_STAIR_DIR_BANNER_GEOM} />
                {/* 4 Corner Standoff Mounts */}
                {[-0.6, 0.6].map((sx) =>
                  [-0.32, 0.32].map((sy) => (
                    <mesh key={`${sx}-${sy}`} position={[sx, sy, 0.02]} rotation={[Math.PI / 2, 0, 0]} material={materials.railingSteel} geometry={SHARED_STAIR_DIR_STANDOFF_GEOM} />
                  ))
                )}
                {isWalking && qualityPreset !== 'low' && (
                  <>
                    <Text
                      position={[0, 0.26, 0.02]}
                      fontSize={0.055}
                      letterSpacing={0.04}
                      color="#ffffff"
                      anchorX="center"
                      anchorY="middle"
                    >
                      DEPARTMENT OF COMPUTER SCIENCE & ENGG
                    </Text>
                    <Text
                      position={[0, 0.08, 0.02]}
                      fontSize={0.065}
                      color="#1e3a8a"
                      anchorX="center"
                      anchorY="middle"
                    >
                      {stair.toFloor.toUpperCase()} FLOOR
                    </Text>
                    <Text
                      position={[0, -0.15, 0.02]}
                      fontSize={0.04}
                      lineHeight={1.3}
                      color="#334155"
                      maxWidth={1.2}
                      anchorX="center"
                      anchorY="middle"
                    >
                      {stair.toFloor === 'first'
                        ? 'CLASSROOMS 469 - 473\nDESIGN THINKING LAB | FACULTY CABINS'
                        : stair.toFloor === 'second'
                        ? 'CLASSROOMS 474 - 478\nMACHINE VISION LAB | SERVER ROOM'
                        : 'WEB 3.0 LAB | QUANTUM COMPUTING\nGEN AI RESEARCH HUB | ANNEXURE BRIDGE'}
                    </Text>
                  </>
                )}
              </group>
            </group>

            {/* Structural Deep Navy Blue Stringer Beams under stair flight */}
            <mesh
              position={[-width / 2 + 0.05, 2.0 - 0.2, FLIGHT_SPAN / 2]}
              rotation={[FLIGHT_ANGLE, 0, 0]}
              material={materials.columnNavyBlue}
              geometry={SHARED_STAIR_STRINGER_GEOM}
            />
            <mesh
              position={[width / 2 - 0.05, 2.0 - 0.2, FLIGHT_SPAN / 2]}
              rotation={[FLIGHT_ANGLE, 0, 0]}
              material={materials.columnNavyBlue}
              geometry={SHARED_STAIR_STRINGER_GEOM}
            />

            {/* Navy Blue Structural Mid-flight Support Columns */}
            <mesh position={[-width / 2 + 0.05, 1.0, FLIGHT_SPAN / 2]} material={materials.columnNavyBlue} geometry={SHARED_STAIR_COLUMN_GEOM} />
            <mesh position={[width / 2 - 0.05, 1.0, FLIGHT_SPAN / 2]} material={materials.columnNavyBlue} geometry={SHARED_STAIR_COLUMN_GEOM} />

            {/* Left and Right Steel Safety Handrails with Vertical Square Balusters */}
            <mesh
              position={[-width / 2 + 0.05, 2.0 + 0.9, FLIGHT_SPAN / 2]}
              rotation={[FLIGHT_ANGLE, 0, 0]}
              material={materials.railingSteel}
              geometry={SHARED_STAIR_HANDRAIL_GEOM}
            />
            <mesh
              position={[width / 2 - 0.05, 2.0 + 0.9, FLIGHT_SPAN / 2]}
              rotation={[FLIGHT_ANGLE, 0, 0]}
              material={materials.railingSteel}
              geometry={SHARED_STAIR_HANDRAIL_GEOM}
            />

            {/* Vertical Balusters along flight */}
            {[2, 5, 8, 11, 14].map((sIdx) => {
              const sy = sIdx * RISER;
              const sz = sIdx * TREAD;
              return (
                <group key={`bal-${sIdx}`}>
                  <mesh position={[-width / 2 + 0.05, sy + 0.45, sz]} material={materials.railingSteel} geometry={SHARED_STAIR_BALUSTER_GEOM} />
                  <mesh position={[width / 2 - 0.05, sy + 0.45, sz]} material={materials.railingSteel} geometry={SHARED_STAIR_BALUSTER_GEOM} />
                </group>
              );
            })}
          </group>
        );
      })}
    </group>
  );
};
