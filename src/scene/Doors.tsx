import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCampusStore } from '../store/useCampusStore';
import { allRooms } from '../config/campus-data';
import { CampusMaterials } from './materials';

interface SingleDoorProps {
  id: string;
  roomNumber: string;
  roomName: string;
  category: string;
  position: [number, number, number];
  swing: 'left' | 'right';
  isServerRoom?: boolean;
  featureLabName?: string;
}

// Pre-allocated shared geometry singletons for doors: zero GPU buffer reallocations
const SHARED_DOOR_JAMB_GEOM = new THREE.BoxGeometry(0.06, 2.2, 0.22);
const SHARED_DOOR_HEADER_GEOM = new THREE.BoxGeometry(1.1, 0.06, 0.22);
const SHARED_DOOR_PLACARD_PLATE_GEOM = new THREE.BoxGeometry(0.56, 0.18, 0.016);
const SHARED_DOOR_LEAF_GEOM = new THREE.BoxGeometry(0.92, 2.16, 0.06);
const SHARED_DOOR_HANDLE_PLATE_GEOM = new THREE.BoxGeometry(0.035, 0.16, 0.008);
const SHARED_DOOR_HANDLE_LEVER_GEOM = new THREE.BoxGeometry(0.11, 0.02, 0.02);
const SHARED_WEB3_FEATURE_WALL_GEOM = new THREE.BoxGeometry(2.6, 2.8, 0.08);
const SHARED_WEB3_CANOPY_GEOM = new THREE.PlaneGeometry(2.8, 0.9);
const SHARED_WEB3_SPOTLIGHT_GEOM = new THREE.CylinderGeometry(0.04, 0.04, 0.04, 12);

// ============================================================================
// ULTRA-PERFORMANCE DOOR PLACARD CANVAS TEXTURE CACHE
// Eliminates 238 Troika 3D Text web workers, font shaders, and WebGL crashes
// ============================================================================
const placardTextureCache = new Map<string, THREE.CanvasTexture>();

function getDoorPlacardTexture(roomNumber: string, roomName: string): THREE.CanvasTexture {
  const key = `${roomNumber}_${roomName}`;
  const existing = placardTextureCache.get(key);
  if (existing) return existing;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 160;
  const ctx = canvas.getContext('2d')!;

  // Crisp White Acrylic Plate Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 512, 160);

  // Deep Collegiate Navy Top Stripe
  ctx.fillStyle = '#1e3a8a';
  ctx.fillRect(0, 0, 512, 22);

  // Room Number
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 78px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(roomNumber, 256, 80);

  // Room Subtitle
  const cleanSubtitle = roomName.length > 24 ? roomName.slice(0, 22) + '...' : roomName;
  ctx.fillStyle = '#475569';
  ctx.font = 'bold 30px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(cleanSubtitle, 256, 134);

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 4;
  tex.colorSpace = THREE.SRGBColorSpace;
  placardTextureCache.set(key, tex);
  return tex;
}

// Flagship Lab Feature Sign Textures (CSS Lab, Design Thinking Lab, Machine Vision Lab, Web 3 Lab)
const labSignTextureCache = new Map<string, THREE.CanvasTexture>();

function getLabFeatureSignTexture(labName: string): THREE.CanvasTexture {
  const existing = labSignTextureCache.get(labName);
  if (existing) return existing;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = 'transparent';
  ctx.clearRect(0, 0, 512, 128);

  // Subtle dark frosted glass backing for contrast
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.roundRect ? ctx.roundRect(16, 16, 480, 96, 12) : ctx.fillRect(16, 16, 480, 96);
  ctx.fill();

  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 48px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(labName, 256, 64);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  labSignTextureCache.set(labName, tex);
  return tex;
}

const SingleDoor: React.FC<SingleDoorProps> = ({ roomNumber, roomName, position, swing, isServerRoom, featureLabName }) => {
  const materials = CampusMaterials.getInstance();
  const explodedView = useCampusStore((s) => s.explodedView);

  const pivotRef = useRef<THREE.Group>(null);
  const targetAngle = useRef(0);
  const currentAngle = useRef(0);

  // Apply exploded view vertical offset if active
  const yBase = position[1];
  const flIdx = yBase >= 11 ? 3 : yBase >= 7 ? 2 : yBase >= 3 ? 1 : 0;
  const yActual = explodedView ? yBase * (1 + flIdx * 0.25) : yBase;

  const placardTexture = useMemo(
    () => getDoorPlacardTexture(roomNumber, roomName),
    [roomNumber, roomName]
  );

  const labSignTexture = useMemo(() => (featureLabName ? getLabFeatureSignTexture(featureLabName) : null), [featureLabName]);

  useFrame((_, delta) => {
    const store = useCampusStore.getState();
    const isWalking = store.cameraMode === 'first-person' || store.cameraMode === 'third-person';

    // If not in walk mode and not animating, skip calculations
    if (!isWalking && currentAngle.current === 0) return;

    // Fast distance calculation from visitor to door
    const [vx, vy, vz] = store.visitorPosition;
    const [dx, , dz] = position;
    const dxDist = vx - dx;
    const dzDist = vz - dz;
    const distSq = dxDist * dxDist + dzDist * dzDist;
    const verticalDist = Math.abs(vy - (yActual + 1.1));

    // High-performance early return: if visitor is on another floor or far away (> 3m) and door is closed
    if (verticalDist > 2.0 || distSq > 9.0) {
      if (currentAngle.current === 0) return;
      targetAngle.current = 0;
    } else {
      if (isServerRoom) {
        targetAngle.current = 0;
      } else {
        // Proximity swing trigger: within 2.4m
        targetAngle.current = swing === 'left' ? -Math.PI / 2 : Math.PI / 2;
      }
    }

    if (!pivotRef.current) return;

    // Smooth rotational transition
    currentAngle.current = THREE.MathUtils.damp(
      currentAngle.current,
      targetAngle.current,
      5.0,
      delta
    );

    // Snap to 0 when near rest
    if (Math.abs(currentAngle.current) < 0.005 && targetAngle.current === 0) {
      currentAngle.current = 0;
    }

    pivotRef.current.rotation.y = currentAngle.current;
  });

  // Orientation: ensure door leaf and wall plaque face directly into respective corridors
  let rotY = 0;
  if (Math.abs(position[0] - -15) < 0.8) {
    rotY = Math.PI / 2; // West corridor rooms face East into corridor
  } else if (Math.abs(position[0] - 15) < 0.8) {
    rotY = -Math.PI / 2; // East corridor rooms face West into corridor
  } else if (Math.abs(position[0] - 41) < 0.8) {
    rotY = -Math.PI / 2; // Annexure corridor rooms face West into corridor
  } else if (Math.abs(position[2] - 34) < 0.8) {
    rotY = Math.PI; // Rear corridor rooms face South into corridor
  } else if (Math.abs(position[2] - 22) < 0.8) {
    rotY = Math.PI; // Flagship lab rear door
  } else if (Math.abs(position[2] - 10) < 0.8) {
    rotY = 0; // Flagship lab front feature entrance facing front corridor (South)
  } else {
    rotY = 0; // Front corridor rooms
  }

  return (
    <group position={[position[0], yActual, position[2]]} rotation={[0, rotY, 0]}>
      {/* ── FLAGSHIP LAB FEATURE ENTRANCE ENCLOSURE (User Answer 9: Same for labs on all floors in main) ── */}
      {featureLabName && (
        <group position={[0, 0, 0]}>
          <mesh position={[0, 1.4, 0.05]} material={materials.marbleCladding} geometry={SHARED_WEB3_FEATURE_WALL_GEOM} />
          <mesh position={[0, 2.7, 0.45]} rotation={[Math.PI / 2, 0, 0]} material={materials.woodSlatCeiling} geometry={SHARED_WEB3_CANOPY_GEOM} />
          {[-0.8, 0, 0.8].map((lx) => (
            <mesh key={lx} position={[lx, 2.68, 0.45]} geometry={SHARED_WEB3_SPOTLIGHT_GEOM}>
              <meshStandardMaterial color="#0f172a" roughness={0.3} />
            </mesh>
          ))}
          {labSignTexture && (
            <mesh position={[0, 2.45, 0.11]}>
              <planeGeometry args={[1.8, 0.45]} />
              <meshBasicMaterial map={labSignTexture} transparent />
            </mesh>
          )}
        </group>
      )}

      {/* ── Outer Door Frame ── */}
      <group position={[0, 0, 0]}>
        <mesh position={[-0.52, 1.1, 0]} material={materials.doorMetalFrame} geometry={SHARED_DOOR_JAMB_GEOM} />
        <mesh position={[0.52, 1.1, 0]} material={materials.doorMetalFrame} geometry={SHARED_DOOR_JAMB_GEOM} />
        <mesh position={[0, 2.21, 0]} material={materials.doorMetalFrame} geometry={SHARED_DOOR_HEADER_GEOM} />
      </group>

      {/* ── AUTHENTIC OVERHEAD ROOM PLACARD (CANVAS TEXTURE - 0 GC, 60FPS) ── */}
      <group position={[0, 2.36, 0.115]}>
        <mesh geometry={SHARED_DOOR_PLACARD_PLATE_GEOM}>
          <meshBasicMaterial map={placardTexture} />
        </mesh>
      </group>

      {/* ── SWINGING TEAK WOOD DOOR LEAF ── */}
      <group
        ref={pivotRef}
        position={[swing === 'left' ? -0.48 : 0.48, 0, 0]}
      >
        <mesh
          position={[swing === 'left' ? 0.45 : -0.45, 1.1, 0]}
          material={isServerRoom ? materials.exteriorWall : materials.doorWood}
          geometry={SHARED_DOOR_LEAF_GEOM}
        />

        {/* Stainless Steel Lever Handle */}
        <group position={[swing === 'left' ? 0.8 : -0.8, 1.0, 0.04]}>
          <mesh material={materials.waterCoolerSteel} geometry={SHARED_DOOR_HANDLE_PLATE_GEOM} />
          <mesh position={[swing === 'left' ? -0.04 : 0.04, 0.02, 0.03]} material={materials.waterCoolerSteel} geometry={SHARED_DOOR_HANDLE_LEVER_GEOM} />
        </group>
      </group>
    </group>
  );
};

export const Doors: React.FC = () => {
  const currentFloor = useCampusStore((s) => s.currentFloor);
  const cameraMode = useCampusStore((s) => s.cameraMode);
  const explodedView = useCampusStore((s) => s.explodedView);
  const isWalking = cameraMode === 'first-person' || cameraMode === 'third-person';

  return (
    <group>
      {allRooms.map((room) => {
        // Skip entrance open foyers
        if (room.id.includes('entrance') || room.id.includes('bridge-portal')) return null;

        // In overview/orbit mode without exploded view, interior doors are occluded by exterior walls
        if (!isWalking && !explodedView && !room.id.includes('lab')) return null;

        // Flagship labs with feature entrance (CSS Lab, Design Thinking, Machine Vision, Web 3)
        // User Answer 9: Feature entrance faces the front corridor (Z = 10)
        let featureLabName: string | undefined = undefined;
        if (Math.abs(room.doorPosition[2] - 10) < 0.5) {
          if (room.id.includes('css-lab')) featureLabName = 'CSS LAB';
          else if (room.id.includes('design-thinking')) featureLabName = 'DESIGN THINKING LAB';
          else if (room.id.includes('machine-vision')) featureLabName = 'MACHINE VISION LAB';
          else if (room.id.includes('web3')) featureLabName = 'WEB 3 LAB';
        }

        return (
          <SingleDoor
            key={room.id}
            id={room.id}
            roomNumber={room.number}
            roomName={room.name}
            category={room.category}
            position={room.doorPosition}
            swing={room.doorSwing}
            isServerRoom={room.category === 'server_room'}
            featureLabName={featureLabName}
          />
        );
      })}
    </group>
  );
};

