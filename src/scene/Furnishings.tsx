import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useCampusStore } from '../store/useCampusStore';
import { allRooms } from '../config/campus-data';
import { CampusMaterials } from './materials';

// ============================================================================
// PRE-ALLOCATED SHARED GEOMETRY SINGLETONS
// Eliminates ~4,000 WebGL buffer allocations and garbage collection hitches
// ============================================================================
const SHARED_UNIT_BOX_GEOM = new THREE.BoxGeometry(1, 1, 1);
const SHARED_LAB_PROJ_BOX_GEOM = new THREE.BoxGeometry(0.35, 0.12, 0.3);
const SHARED_LAB_PROJ_LENS_GEOM = new THREE.CylinderGeometry(0.04, 0.04, 0.04, 8);
const SHARED_LAB_PROJ_SCREEN_GEOM = new THREE.PlaneGeometry(2.4, 1.4);
const SHARED_LAB_DESK_TOP_GEOM = new THREE.BoxGeometry(2.4, 0.04, 0.5);
const SHARED_LAB_DESK_FRAME_GEOM = new THREE.BoxGeometry(2.3, 0.72, 0.46);
const SHARED_LAB_COMMAND_DESK_GEOM = new THREE.BoxGeometry(1.8, 0.75, 0.8);

const SHARED_CLASSROOM_BB_FW_GEOM = new THREE.BoxGeometry(3.0, 1.4, 0.04);
const SHARED_CLASSROOM_PS_FW_GEOM = new THREE.PlaneGeometry(2.0, 1.1);
const SHARED_CLASSROOM_BB_NORM_GEOM = new THREE.BoxGeometry(3.2, 1.4, 0.04);
const SHARED_CLASSROOM_PS_NORM_GEOM = new THREE.PlaneGeometry(2.2, 1.2);
const SHARED_TEACHER_DESK_GEOM = new THREE.BoxGeometry(1.2, 0.74, 0.6);
const SHARED_TEACHER_MONITOR_GEOM = new THREE.BoxGeometry(0.4, 0.24, 0.05);
const SHARED_PROJECTOR_GEOM = new THREE.BoxGeometry(0.3, 0.1, 0.25);
const SHARED_BENCH_DESK_GEOM = new THREE.BoxGeometry(1.05, 0.04, 0.38);
const SHARED_BENCH_FRAME_GEOM = new THREE.BoxGeometry(1.02, 0.7, 0.34);
const SHARED_BENCH_SEAT_GEOM = new THREE.BoxGeometry(1.05, 0.04, 0.26);
const SHARED_FAN_MOTOR_GEOM = new THREE.CylinderGeometry(0.08, 0.08, 0.06, 8);
const SHARED_FAN_BLADE_GEOM = new THREE.BoxGeometry(0.65, 0.01, 0.08);

const SHARED_LH_BB_GEOM = new THREE.BoxGeometry(4.2, 1.6, 0.04);
const SHARED_LH_PS_GEOM = new THREE.PlaneGeometry(3.0, 1.6);
const SHARED_LH_DESK_GEOM = new THREE.BoxGeometry(2.0, 0.04, 0.4);
const SHARED_LH_SEAT_GEOM = new THREE.BoxGeometry(2.0, 0.04, 0.28);

const SHARED_CUBICLE_PART_GEOM = new THREE.BoxGeometry(1.3, 1.4, 0.05);
const SHARED_CUBICLE_DESK_GEOM = new THREE.BoxGeometry(1.2, 0.04, 0.5);
const SHARED_CUBICLE_PC_GEOM = new THREE.BoxGeometry(0.35, 0.22, 0.04);
const SHARED_CUBICLE_CHAIR_GEOM = new THREE.BoxGeometry(0.4, 0.06, 0.4);

const SHARED_HUB_DESK_GEOM = new THREE.BoxGeometry(1.2, 0.75, 0.6);

const SHARED_DEAN_DESK_GEOM = new THREE.BoxGeometry(2.0, 0.76, 0.9);
const SHARED_DEAN_PC_GEOM = new THREE.BoxGeometry(0.45, 0.28, 0.05);
const SHARED_DEAN_CHAIR_GEOM = new THREE.BoxGeometry(0.55, 1.1, 0.55);
const SHARED_DEAN_TABLE_GEOM = new THREE.BoxGeometry(2.2, 0.74, 1.0);
const SHARED_DEAN_VCHAIR_GEOM = new THREE.BoxGeometry(0.45, 0.8, 0.45);
const SHARED_DEAN_CABINET_GEOM = new THREE.BoxGeometry(2.2, 2.0, 0.4);

const SHARED_COOLER_STAND_M_GEOM = new THREE.BoxGeometry(0.65, 0.5, 0.45);
const SHARED_COOLER_BODY_M_GEOM = new THREE.BoxGeometry(0.55, 0.75, 0.4);
const SHARED_COOLER_TOP_M_GEOM = new THREE.BoxGeometry(0.5, 0.1, 0.35);
const SHARED_COOLER_SIGN_M_GEOM = new THREE.BoxGeometry(0.65, 0.18, 0.02);
const SHARED_COOLER_STAND_A_GEOM = new THREE.BoxGeometry(0.45, 0.5, 0.65);
const SHARED_COOLER_BODY_A_GEOM = new THREE.BoxGeometry(0.4, 0.75, 0.55);
const SHARED_COOLER_SIGN_A_GEOM = new THREE.BoxGeometry(0.18, 0.65, 0.02);

const SHARED_FE_TANK_GEOM = new THREE.CylinderGeometry(0.08, 0.08, 0.45, 8);
const SHARED_FE_NOZZLE_GEOM = new THREE.CylinderGeometry(0.025, 0.025, 0.08, 6);
const SHARED_FE_MOUNT_GEOM = new THREE.BoxGeometry(0.04, 0.25, 0.04);

const SHARED_CORR_LIGHT_BASE_X_GEOM = new THREE.BoxGeometry(1.4, 0.04, 0.12);
const SHARED_CORR_LIGHT_DIFF_X_GEOM = new THREE.BoxGeometry(1.35, 0.02, 0.09);
const SHARED_CORR_LIGHT_BASE_Z_GEOM = new THREE.BoxGeometry(0.12, 0.04, 1.4);
const SHARED_CORR_LIGHT_DIFF_Z_GEOM = new THREE.BoxGeometry(0.09, 0.02, 1.35);

const SHARED_TRASH_BIN_BODY_GEOM = new THREE.CylinderGeometry(0.2, 0.16, 0.7, 8);
const SHARED_TRASH_BIN_RIM_GEOM = new THREE.CylinderGeometry(0.21, 0.21, 0.04, 8);

export const Furnishings: React.FC = () => {
  const materials = CampusMaterials.getInstance();
  const explodedView = useCampusStore((s) => s.explodedView);
  const currentFloor = useCampusStore((s) => s.currentFloor);
  const currentBlock = useCampusStore((s) => s.currentBlock);
  const cameraMode = useCampusStore((s) => s.cameraMode);
  const qualityPreset = useCampusStore((s) => s.qualityPreset);

  const isWalking = cameraMode === 'first-person' || cameraMode === 'third-person';

  // High-performance culling:
  // 1. In orbit/overview mode without exploded view, interior furnishings are completely hidden behind solid exterior concrete facades and roof slabs.
  // 2. In walk mode without exploded view, only render furnishings on the active floor.
  // 3. Cull opposite wing when deep in Main or Annexure blocks.
  const shouldRenderRoom = (roomFloor: string, roomBlock?: string) => {
    if (!isWalking && !explodedView) return false;

    if (isWalking && !explodedView) {
      if (roomFloor !== currentFloor) return false;
      if (currentBlock === 'main' && roomBlock === 'annexure') return false;
      if (currentBlock === 'annexure' && roomBlock === 'main') return false;
    }

    return true;
  };

  // Group rooms by furnishing template
  const classrooms = useMemo(() => allRooms.filter((r) => r.furnishingTemplate === 'classroom_60'), []);
  const lectureHalls = useMemo(() => allRooms.filter((r) => r.furnishingTemplate === 'lecture_120'), []);
  const labs = useMemo(() => allRooms.filter((r) => r.furnishingTemplate === 'lab_180'), []);
  const staffCabins = useMemo(() => allRooms.filter((r) => r.furnishingTemplate === 'staff_cubicles_10'), []);
  const projectHubs = useMemo(() => allRooms.filter((r) => r.furnishingTemplate === 'project_hub'), []);
  const deanCabins = useMemo(() => allRooms.filter((r) => r.furnishingTemplate === 'dean_office'), []);
  const serverRooms = useMemo(() => allRooms.filter((r) => r.category === 'server_room' || r.furnishingTemplate === 'server_room_concealed'), []);

  // Total computers in labs: 6 labs * 180 computers = 1080 computers!
  const labComputerCount = labs.length * 180;
  const labPcMeshRef = useRef<THREE.InstancedMesh>(null);
  const labScreenMeshRef = useRef<THREE.InstancedMesh>(null);

  // Calculate Lab Computer Transformations
  useEffect(() => {
    if (!labPcMeshRef.current || !labScreenMeshRef.current) return;

    const dummy = new THREE.Object3D();
    let instanceIdx = 0;

    labs.forEach((lab) => {
      const [lx, lyBase, lz] = lab.position;
      const flIdx = lyBase >= 11 ? 3 : lyBase >= 7 ? 2 : lyBase >= 3 ? 1 : 0;
      const ly = explodedView ? lyBase * (1 + flIdx * 0.25) : lyBase;

      // 3 columns, 12 rows, 5 computers per row
      const colOffsets = [-3.0, 0, 3.0];
      const rowSpacing = 0.9;
      const compSpacing = 0.5;

      for (let c = 0; c < 3; c++) {
        const cx = lx + colOffsets[c];
        for (let r = 0; r < 12; r++) {
          const rz = lz - 4.5 + r * rowSpacing;
          for (let k = 0; k < 5; k++) {
            const compX = cx - 1.0 + k * compSpacing;
            // Set PC Tower
            dummy.position.set(compX + 0.16, ly + 0.75 + 0.18, rz);
            dummy.rotation.set(0, 0, 0);
            dummy.scale.set(0.12, 0.35, 0.35);
            dummy.updateMatrix();
            labPcMeshRef.current?.setMatrixAt(instanceIdx, dummy.matrix);

            // Set Monitor Screen
            dummy.position.set(compX, ly + 0.75 + 0.22, rz);
            dummy.rotation.set(0, 0, 0);
            dummy.scale.set(0.38, 0.25, 0.04);
            dummy.updateMatrix();
            labScreenMeshRef.current?.setMatrixAt(instanceIdx, dummy.matrix);

            instanceIdx++;
          }
        }
      }
    });

    labPcMeshRef.current.instanceMatrix.needsUpdate = true;
    labScreenMeshRef.current.instanceMatrix.needsUpdate = true;
  }, [labs, explodedView]);

  return (
    <group>
      {/* =========================================================================
          1. STANDARDIZED LABS (180 Computers + 3 Projectors + Desk Benches)
          ========================================================================= */}
      {/* Instanced PC Towers */}
      <instancedMesh
        ref={labPcMeshRef}
        args={[SHARED_UNIT_BOX_GEOM, materials.computerChassis, labComputerCount]}
        visible={isWalking || explodedView}
      />
      {/* Instanced Glowing Screens */}
      <instancedMesh
        ref={labScreenMeshRef}
        args={[SHARED_UNIT_BOX_GEOM, materials.computerScreenGlow, labComputerCount]}
        visible={isWalking || explodedView}
      />

      {labs.filter((lab) => shouldRenderRoom(lab.floor, lab.block)).map((lab) => {
        const [lx, lyBase, lz] = lab.position;
        const flIdx = lyBase >= 11 ? 3 : lyBase >= 7 ? 2 : lyBase >= 3 ? 1 : 0;
        const ly = explodedView ? lyBase * (1 + flIdx * 0.25) : lyBase;

        return (
          <group key={lab.id} position={[lx, ly, lz]}>
            {/* 3 Projectors Mounted to Ceiling (One per column as required) */}
            {[-3.0, 0, 3.0].map((px, pIdx) => (
              <group key={pIdx} position={[px, 3.3, 0]}>
                <mesh material={materials.computerChassis} geometry={SHARED_LAB_PROJ_BOX_GEOM} />
                <mesh position={[0, -0.02, 0.16]} material={materials.computerScreenGlow} geometry={SHARED_LAB_PROJ_LENS_GEOM} />
              </group>
            ))}

            {/* Front Presentation Projection Screens */}
            {[-3.0, 0, 3.0].map((px, pIdx) => (
              <mesh key={`scr-${pIdx}`} position={[px, 2.2, -5.6]} material={materials.projectorScreen} geometry={SHARED_LAB_PROJ_SCREEN_GEOM} />
            ))}

            {/* 12 Desk Rows across the 3 Columns */}
            {[-3.0, 0, 3.0].map((cx, cIdx) => (
              <group key={`col-${cIdx}`}>
                {Array.from({ length: 12 }).map((_, rIdx) => {
                  const rz = -4.5 + rIdx * 0.9;
                  return (
                    <group key={`row-${rIdx}`} position={[cx, 0, rz]}>
                      {/* Desk Top Slab */}
                      <mesh position={[0, 0.73, 0]} material={materials.deskWood} receiveShadow geometry={SHARED_LAB_DESK_TOP_GEOM} />
                      {/* Desk Steel Frame */}
                      <mesh position={[0, 0.36, 0]} material={materials.railingSteel} geometry={SHARED_LAB_DESK_FRAME_GEOM} />
                    </group>
                  );
                })}
              </group>
            ))}

            {/* Faculty Command Desk at front */}
            <mesh position={[0, 0.38, -4.8]} material={materials.deskWood} geometry={SHARED_LAB_COMMAND_DESK_GEOM} />
          </group>
        );
      })}

      {/* =========================================================================
          2. REGULAR CLASSROOMS (60 Seats: 15 Benches, Blackboard, Screen, Projector, Fans)
          ========================================================================= */}
      {classrooms.filter((room) => shouldRenderRoom(room.floor, room.block)).map((room) => {
        const [rx, ryBase, rz] = room.position;
        const flIdx = ryBase >= 11 ? 3 : ryBase >= 7 ? 2 : ryBase >= 3 ? 1 : 0;
        const ry = explodedView ? ryBase * (1 + flIdx * 0.25) : ryBase;
        const isFrontWing = rz < 0;

        return (
          <group key={room.id} position={[rx, ry, rz]}>
            {/* Front Blackboard & Screen */}
            {isFrontWing ? (
              <>
                <mesh position={[-2.75, 1.8, 0]} rotation={[0, Math.PI / 2, 0]} material={materials.blackboard} geometry={SHARED_CLASSROOM_BB_FW_GEOM} />
                <mesh position={[-2.72, 2.65, 0]} rotation={[0, Math.PI / 2, 0]} material={materials.projectorScreen} geometry={SHARED_CLASSROOM_PS_FW_GEOM} />
                {/* Teacher's Desk */}
                <group position={[-1.8, 0, 1.2]}>
                  <mesh position={[0, 0.37, 0]} material={materials.deskWood} castShadow geometry={SHARED_TEACHER_DESK_GEOM} />
                  <mesh position={[0, 0.86, 0]} material={materials.computerScreenGlow} geometry={SHARED_TEACHER_MONITOR_GEOM} />
                </group>
              </>
            ) : (
              <>
                <mesh position={[0, 1.8, -2.2]} material={materials.blackboard} geometry={SHARED_CLASSROOM_BB_NORM_GEOM} />
                <mesh position={[0, 2.7, -2.18]} material={materials.projectorScreen} geometry={SHARED_CLASSROOM_PS_NORM_GEOM} />
                {/* Teacher's Corner Desk */}
                <group position={[1.8, 0, -1.8]}>
                  <mesh position={[0, 0.37, 0]} material={materials.deskWood} castShadow geometry={SHARED_TEACHER_DESK_GEOM} />
                  <mesh position={[0, 0.86, 0]} material={materials.computerScreenGlow} geometry={SHARED_TEACHER_MONITOR_GEOM} />
                </group>
              </>
            )}

            {/* Ceiling Projector */}
            <mesh position={[0, 3.2, 0]} material={materials.computerChassis} geometry={SHARED_PROJECTOR_GEOM} />

            {/* 3 Columns x 5 Rows = 15 Student Benches */}
            {[-1.2, 0, 1.2].map((bx, colIdx) => (
              <group key={`c-col-${colIdx}`}>
                {Array.from({ length: 5 }).map((_, rowIdx) => {
                  const bz = -1.2 + rowIdx * 0.75;
                  return (
                    <group key={`b-row-${rowIdx}`} position={[bx, 0, bz]}>
                      <mesh position={[0, 0.72, 0]} material={materials.deskWood} geometry={SHARED_BENCH_DESK_GEOM} />
                      <mesh position={[0, 0.35, 0]} material={materials.railingSteel} geometry={SHARED_BENCH_FRAME_GEOM} />
                      <mesh position={[0, 0.44, 0.28]} material={materials.chairBlack} geometry={SHARED_BENCH_SEAT_GEOM} />
                    </group>
                  );
                })}
              </group>
            ))}

            {/* Ceiling Fans */}
            {[-1.2, 1.2].map((fx, fCol) => (
              <group key={`fans-${fCol}`}>
                {[-1.4, -0.4, 0.4, 1.4].map((fz, fRow) => (
                  <group key={`fan-${fRow}`} position={[fx, 3.4, fz]}>
                    <mesh material={materials.ceilingConcrete} geometry={SHARED_FAN_MOTOR_GEOM} />
                    <mesh position={[0, -0.03, 0]} material={materials.ceilingConcrete} geometry={SHARED_FAN_BLADE_GEOM} />
                  </group>
                ))}
              </group>
            ))}
          </group>
        );
      })}

      {/* =========================================================================
          3. LECTURE HALLS 1, 2, 3 (Flat Floor 60 Seats - User Answer 10)
          ========================================================================= */}
      {lectureHalls.filter((lh) => shouldRenderRoom(lh.floor, lh.block)).map((lh) => {
        const [lx, lyBase, lz] = lh.position;
        const flIdx = lyBase >= 11 ? 3 : lyBase >= 7 ? 2 : lyBase >= 3 ? 1 : 0;
        const ly = explodedView ? lyBase * (1 + flIdx * 0.25) : lyBase;

        return (
          <group key={lh.id} position={[lx, ly, lz]}>
            {/* Front Presentation Area */}
            <mesh position={[0, 1.8, -4.2]} material={materials.blackboard} geometry={SHARED_LH_BB_GEOM} />
            <mesh position={[0, 2.8, -4.18]} material={materials.projectorScreen} geometry={SHARED_LH_PS_GEOM} />

            {/* Flat-floor 15 Benches x 4 Seats = 60 Seats */}
            {[-2.8, 0, 2.8].map((colX, cIdx) => (
              <group key={`lh-col-${cIdx}`}>
                {Array.from({ length: 5 }).map((_, rIdx) => {
                  const rz = -2.5 + rIdx * 1.1;

                  return (
                    <group key={`lh-row-${rIdx}`} position={[colX, 0, rz]}>
                      <mesh position={[0, 0.72, 0]} material={materials.deskWood} geometry={SHARED_LH_DESK_GEOM} />
                      <mesh position={[0, 0.44, 0.3]} material={materials.chairBlack} geometry={SHARED_LH_SEAT_GEOM} />
                    </group>
                  );
                })}
              </group>
            ))}
          </group>
        );
      })}

      {/* =========================================================================
          4. STAFF / FACULTY CABINS (10 Mini-Cubicles, 5 per side with central passage)
          ========================================================================= */}
      {staffCabins.filter((cabin) => shouldRenderRoom(cabin.floor, cabin.block)).map((cabin) => {
        const [cx, cyBase, cz] = cabin.position;
        const flIdx = cyBase >= 11 ? 3 : cyBase >= 7 ? 2 : cyBase >= 3 ? 1 : 0;
        const cy = explodedView ? cyBase * (1 + flIdx * 0.25) : cyBase;

        return (
          <group key={cabin.id} position={[cx, cy, cz]}>
            {[-1.6, 1.6].map((sideX, sideIdx) => (
              <group key={`side-${sideIdx}`}>
                {Array.from({ length: 5 }).map((_, cIdx) => {
                  const zPos = -2.0 + cIdx * 1.0;
                  return (
                    <group key={`cubicle-${cIdx}`} position={[sideX, 0, zPos]}>
                      <mesh position={[0, 0.7, 0]} material={materials.doorMetalFrame} geometry={SHARED_CUBICLE_PART_GEOM} />
                      <mesh position={[0, 0.72, 0.3]} material={materials.deskWood} castShadow geometry={SHARED_CUBICLE_DESK_GEOM} />
                      <mesh position={[0, 0.95, 0.3]} material={materials.computerScreenGlow} geometry={SHARED_CUBICLE_PC_GEOM} />
                      <mesh position={[0, 0.45, 0.65]} material={materials.chairBlack} castShadow geometry={SHARED_CUBICLE_CHAIR_GEOM} />
                    </group>
                  );
                })}
              </group>
            ))}
          </group>
        );
      })}

      {/* =========================================================================
          5. PROJECT HUB (User Answer 7: Open space for student project displays and presentations)
          ========================================================================= */}
      {projectHubs.filter((hub) => shouldRenderRoom(hub.floor, hub.block)).map((hub) => {
        const [hx, hyBase, hz] = hub.position;
        const flIdx = hyBase >= 11 ? 3 : hyBase >= 7 ? 2 : hyBase >= 3 ? 1 : 0;
        const hy = explodedView ? hyBase * (1 + flIdx * 0.25) : hyBase;

        return (
          <group key={hub.id} position={[hx, hy, hz]}>
            {/* Presentation Stage & Screen */}
            <mesh position={[0, 1.8, -2.5]} material={materials.blackboard} geometry={SHARED_CLASSROOM_BB_NORM_GEOM} />
            <mesh position={[0, 2.7, -2.48]} material={materials.projectorScreen} geometry={SHARED_CLASSROOM_PS_NORM_GEOM} />
            {/* Presentation Podium */}
            <mesh position={[1.8, 0.55, -1.8]} material={materials.doorWood} castShadow>
              <boxGeometry args={[0.7, 1.1, 0.5]} />
            </mesh>

            {/* 4 Project Display Demonstration Tables */}
            {[-1.8, 1.8].map((dx, colIdx) =>
              [-0.8, 1.2].map((dz, rowIdx) => (
                <group key={`display-${colIdx}-${rowIdx}`} position={[dx, 0, dz]}>
                  {/* Table */}
                  <mesh position={[0, 0.38, 0]} material={materials.deskWood} castShadow>
                    <boxGeometry args={[1.5, 0.76, 0.8]} />
                  </mesh>
                  {/* Project Prototype Box */}
                  <mesh position={[0, 0.82, 0]} material={materials.computerChassis}>
                    <boxGeometry args={[0.4, 0.12, 0.3]} />
                  </mesh>
                  {/* Poster Display Board */}
                  <mesh position={[0, 1.4, 0.38]} material={materials.pvcPipeWhite}>
                    <boxGeometry args={[1.2, 0.8, 0.04]} />
                  </mesh>
                </group>
              ))
            )}
            <mesh position={[0, 3.2, 0]} material={materials.computerChassis} geometry={SHARED_PROJECTOR_GEOM} />
          </group>
        );
      })}

      {/* =========================================================================
          6. DEAN'S CABIN (Executive Desk, Chairs, Meeting Table, Cabinets)
          ========================================================================= */}
      {deanCabins.filter((dean) => shouldRenderRoom(dean.floor, dean.block)).map((dean) => {
        const [dx, dyBase, dz] = dean.position;
        const flIdx = dyBase >= 11 ? 3 : dyBase >= 7 ? 2 : dyBase >= 3 ? 1 : 0;
        const dy = explodedView ? dyBase * (1 + flIdx * 0.25) : dyBase;

        return (
          <group key={dean.id} position={[dx, dy, dz]}>
            <mesh position={[0, 0.38, -0.2]} material={materials.doorWood} castShadow geometry={SHARED_DEAN_DESK_GEOM} />
            <mesh position={[0, 0.88, -0.2]} material={materials.computerScreenGlow} geometry={SHARED_DEAN_PC_GEOM} />
            <mesh position={[0, 0.6, -0.9]} material={materials.chairBlack} castShadow geometry={SHARED_DEAN_CHAIR_GEOM} />
            <mesh position={[0, 0.37, 1.3]} material={materials.doorWood} castShadow geometry={SHARED_DEAN_TABLE_GEOM} />
            {[-0.7, 0.7].map((vx, vIdx) => (
              <mesh key={vIdx} position={[vx, 0.45, 1.3]} material={materials.chairBlack} geometry={SHARED_DEAN_VCHAIR_GEOM} />
            ))}
            <mesh position={[-2.65, 1.0, 0]} rotation={[0, Math.PI / 2, 0]} material={materials.doorMetalFrame} geometry={SHARED_DEAN_CABINET_GEOM} />
          </group>
        );
      })}

      {/* =========================================================================
          7. RESTRICTED SERVER ROOM (User Answer 8: server racks with blinking LEDs)
          Attached behind Machine Vision Lab on 2nd Floor
          ========================================================================= */}
      {serverRooms.filter((sr) => shouldRenderRoom(sr.floor, sr.block)).map((sr) => {
        const [sx, syBase, sz] = sr.position;
        const flIdx = syBase >= 11 ? 3 : syBase >= 7 ? 2 : syBase >= 3 ? 1 : 0;
        const sy = explodedView ? syBase * (1 + flIdx * 0.25) : syBase;

        return (
          <group key={sr.id} position={[sx, sy, sz]}>
            {/* 4 Server Rack Cabinets (42U) in a row */}
            {[-2.4, -0.8, 0.8, 2.4].map((rx, rIdx) => (
              <group key={`rack-${rIdx}`} position={[rx, 0, 0]}>
                {/* Black Steel Server Cabinet */}
                <mesh position={[0, 1.1, 0]} material={materials.computerChassis} castShadow>
                  <boxGeometry args={[0.8, 2.2, 1.0]} />
                </mesh>
                {/* Front Perforated Glass/Mesh Door */}
                <mesh position={[0, 1.1, 0.51]}>
                  <planeGeometry args={[0.74, 2.1]} />
                  <meshStandardMaterial color="#0284c7" roughness={0.2} metalness={0.8} transparent opacity={0.35} />
                </mesh>
                {/* Blinking/Glowing Status LEDs Array */}
                {[-0.25, 0, 0.25].map((lx, lIdx) =>
                  [-0.6, -0.2, 0.2, 0.6].map((ly, yIdx) => {
                    const ledColor = (rIdx + lIdx + yIdx) % 3 === 0 ? '#22c55e' : (rIdx + lIdx + yIdx) % 3 === 1 ? '#0ea5e9' : '#f59e0b';
                    return (
                      <mesh key={`led-${lIdx}-${yIdx}`} position={[lx, 1.1 + ly, 0.48]}>
                        <boxGeometry args={[0.04, 0.02, 0.02]} />
                        <meshBasicMaterial color={ledColor} />
                      </mesh>
                    );
                  })
                )}
              </group>
            ))}
            {/* Server room overhead cable tray */}
            <mesh position={[0, 2.8, 0]} material={materials.railingSteel}>
              <boxGeometry args={[6.5, 0.08, 0.4]} />
            </mesh>
            {/* Server room cool blue ambient point light */}
            <pointLight position={[0, 2.4, 0]} color="#38bdf8" intensity={1.8} distance={6} decay={2} />
          </group>
        );
      })}

      {/* =========================================================================
          8. CORRIDOR AMENITIES (Drinking Water Stations, Fire Extinguishers, LED Battens)
          ========================================================================= */}
      {[0, 4.0, 8.0, 12.0].map((flY, flIdx) => {
        const floorName = flIdx === 0 ? 'ground' : flIdx === 1 ? 'first' : flIdx === 2 ? 'second' : 'third';
        if (!shouldRenderRoom(floorName)) return null;
        const ly = explodedView ? flY * (1 + flIdx * 0.25) : flY;

        return (
          <group key={`corr-amen-${flIdx}`} position={[0, ly, 0]}>
            {/* Main Block Front Corridor water station (near west corridor junction) */}
            <group position={[-14.5, 0, -1.6]}>
              <mesh position={[0, 0.25, 0]} material={materials.chairBlack} geometry={SHARED_COOLER_STAND_M_GEOM} />
              <mesh position={[0, 0.85, 0]} material={materials.waterCoolerSteel} castShadow geometry={SHARED_COOLER_BODY_M_GEOM} />
              <mesh position={[0, 1.25, 0.05]} material={materials.waterCoolerSteel} geometry={SHARED_COOLER_TOP_M_GEOM} />
              <mesh position={[0, 1.7, 0.02]} geometry={SHARED_COOLER_SIGN_M_GEOM}>
                <meshStandardMaterial color="#0284c7" roughness={0.3} />
              </mesh>
            </group>

            {/* Annexure Block Corridor water station (mounted near classroom 470/471 wall) */}
            <group position={[40.8, 0, 14]}>
              <mesh position={[0, 0.25, 0]} material={materials.chairBlack} geometry={SHARED_COOLER_STAND_A_GEOM} />
              <mesh position={[0, 0.85, 0]} material={materials.waterCoolerSteel} geometry={SHARED_COOLER_BODY_A_GEOM} />
              <mesh position={[0, 1.7, 0.02]} geometry={SHARED_COOLER_SIGN_A_GEOM}>
                <meshStandardMaterial color="#0284c7" roughness={0.3} />
              </mesh>
            </group>

            {/* Fire Extinguishers */}
            {[-14.8, 14.8].map((fx) => (
              <group key={`fe-f-${fx}`} position={[fx, 1.2, -1.8]}>
                <mesh material={materials.fireExtinguisherRed} geometry={SHARED_FE_TANK_GEOM} />
                <mesh position={[0, 0.25, 0]} geometry={SHARED_FE_NOZZLE_GEOM}>
                  <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
                </mesh>
                <mesh position={[0, 0, -0.06]} material={materials.chairBlack} geometry={SHARED_FE_MOUNT_GEOM} />
              </group>
            ))}

            {/* Waste Bins */}
            <group position={[-14.5, 0.35, 1.8]}>
              <mesh castShadow geometry={SHARED_TRASH_BIN_BODY_GEOM}>
                <meshStandardMaterial color="#0284c7" roughness={0.4} />
              </mesh>
              <mesh position={[0, 0.36, 0]} geometry={SHARED_TRASH_BIN_RIM_GEOM}>
                <meshStandardMaterial color="#0369a1" roughness={0.3} />
              </mesh>
            </group>
          </group>
        );
      })}
    </group>
  );
};
