import React, { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCampusStore } from '../../store/useCampusStore';
import { courtyards } from '../../config/campus-data';

export const WalkController: React.FC = () => {
  const { camera, gl } = useThree();

  const setVisitorPosition = useCampusStore((s) => s.setVisitorPosition);
  const setVisitorRotation = useCampusStore((s) => s.setVisitorRotation);
  const updateSpatialLocation = useCampusStore((s) => s.updateSpatialLocation);
  const cameraMode = useCampusStore((s) => s.cameraMode);
  const cinematicActive = useCampusStore((s) => s.cinematicActive);
  const presentationActive = useCampusStore((s) => s.presentationActive);

  // Key state tracker
  const keys = useRef<Record<string, boolean>>({});

  const initialPos = useCampusStore.getState().visitorPosition;
  const initialRot = useCampusStore.getState().visitorRotation;
  const pos = useRef(new THREE.Vector3(...initialPos));
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const euler = useRef(new THREE.Euler(initialRot[0], initialRot[1], initialRot[2], 'YXZ'));
  const isLocked = useRef(false);
  const lastStoreUpdate = useRef(0);

  // Sync external position changes (e.g. reset button, floor teleport, route start) without triggering React re-renders
  useEffect(() => {
    return useCampusStore.subscribe((state) => {
      const current = pos.current;
      const target = state.visitorPosition;
      const dx = current.x - target[0];
      const dy = current.y - target[1];
      const dz = current.z - target[2];
      const distSq = dx * dx + dy * dy + dz * dz;
      // Only teleport if external jump occurred (> 1.5m delta)
      if (distSq > 2.25) {
        pos.current.set(target[0], target[1], target[2]);
      }
      const rot = state.visitorRotation;
      if (Math.abs(euler.current.y - rot[1]) > 0.4) {
        euler.current.set(rot[0], rot[1], rot[2], 'YXZ');
      }
    });
  }, []);

  useEffect(() => {
    (window as any).__teleportVisitor = (x: number, y: number, z: number, ry?: number) => {
      pos.current.set(x, y, z);
      if (ry !== undefined) euler.current.y = ry;
      useCampusStore.getState().setVisitorPosition([x, y, z]);
      if (ry !== undefined) useCampusStore.getState().setVisitorRotation([euler.current.x, ry, euler.current.z]);
      useCampusStore.getState().updateSpatialLocation([x, y, z]);
    };
    return () => {
      delete (window as any).__teleportVisitor;
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      keys.current[e.code] = true;
      if (e.code === 'KeyR' && e.ctrlKey) return;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  // Pointer lock handling for desktop mouse look
  useEffect(() => {
    const canvas = gl.domElement;

    const handlePointerLockChange = () => {
      isLocked.current = document.pointerLockElement === canvas;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isLocked.current || cameraMode === 'orbit' || cinematicActive) return;

      const sensitivity = 0.0022;
      euler.current.y -= e.movementX * sensitivity;
      euler.current.x -= e.movementY * sensitivity;

      // Clamp vertical pitch between -80 deg and +80 deg
      euler.current.x = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, euler.current.x));
    };

    const handleClick = () => {
      if (cameraMode === 'first-person' && !cinematicActive && !presentationActive) {
        if (document.pointerLockElement !== canvas) {
          canvas.requestPointerLock?.();
        }
      }
    };

    document.addEventListener('pointerlockchange', handlePointerLockChange);
    document.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      document.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
    };
  }, [gl, cameraMode, cinematicActive, presentationActive]);

  // Main Walk & Collision Loop
  useFrame((_, delta) => {
    if (cinematicActive || presentationActive || cameraMode === 'orbit') return;

    // Movement speed
    const isSprint = keys.current['ShiftLeft'] || keys.current['ShiftRight'];
    const speed = isSprint ? 7.5 : 4.0;

    const forward = (keys.current['KeyW'] || keys.current['ArrowUp'] ? 1 : 0) -
                    (keys.current['KeyS'] || keys.current['ArrowDown'] ? 1 : 0);
    const side = (keys.current['KeyD'] || keys.current['ArrowRight'] ? 1 : 0) -
                 (keys.current['KeyA'] || keys.current['ArrowLeft'] ? 1 : 0);

    const moveVector = new THREE.Vector3(side, 0, -forward).normalize();
    moveVector.applyAxisAngle(new THREE.Vector3(0, 1, 0), euler.current.y);

    velocity.current.x = THREE.MathUtils.damp(velocity.current.x, moveVector.x * speed, 12, delta);
    velocity.current.z = THREE.MathUtils.damp(velocity.current.z, moveVector.z * speed, 12, delta);

    // Tentative new position
    const nextX = pos.current.x + velocity.current.x * delta;
    const nextZ = pos.current.z + velocity.current.z * delta;
    let nextY = pos.current.y;

    // --- CONTINUOUS BIDIRECTIONAL STAIRCASE PHYSICS ---
    // West Staircase (Main Block): X in [-16.5, -13.5], Z in [0.2, 5.0]
    // East Staircase (Main Block): X in [13.5, 16.5], Z in [0.2, 5.0]
    // Annexure Staircase: X in [37.5, 40.5], Z in [0.2, 5.6]
    const inWestStair = Math.abs(nextX - (-15.0)) <= 1.5 && nextZ >= 0.2 && nextZ <= 5.0;
    const inEastStair = Math.abs(nextX - 15.0) <= 1.5 && nextZ >= 0.2 && nextZ <= 5.0;
    const inAnnexStair = Math.abs(nextX - 39.0) <= 1.5 && nextZ >= 0.2 && nextZ <= 5.6;

    if (inEastStair || inWestStair) {
      // Base floor level for current stair flight (0, 4.0, 8.0)
      const curFlIdx = Math.min(2, Math.max(0, Math.floor((pos.current.y - 0.7) / 4.0)));
      const flBaseY = curFlIdx * 4.0;
      let targetStairY = flBaseY + 1.7;

      if (inEastStair) {
        // Flight 1 (+Z): inner side (nextX < 15.0)
        // Mid-Landing: Z in [3.5, 5.0]
        // Flight 2 (-Z): outer side (nextX >= 15.0)
        if (nextX < 15.0) {
          if (nextZ >= 3.5) {
            targetStairY = flBaseY + 3.7;
          } else {
            const prog = Math.max(0, Math.min(1, (nextZ - 0.5) / 3.0));
            targetStairY = flBaseY + 1.7 + prog * 2.0;
          }
        } else {
          if (nextZ >= 3.5) {
            targetStairY = flBaseY + 3.7;
          } else {
            const prog2 = Math.max(0, Math.min(1, (3.5 - nextZ) / 3.0));
            targetStairY = flBaseY + 3.7 + prog2 * 2.0;
          }
        }
      } else {
        // West Stair: Flight 1 (+Z) is inner (nextX > -15.0), Flight 2 (-Z) is outer (nextX <= -15.0)
        if (nextX > -15.0) {
          if (nextZ >= 3.5) {
            targetStairY = flBaseY + 3.7;
          } else {
            const prog = Math.max(0, Math.min(1, (nextZ - 0.5) / 3.0));
            targetStairY = flBaseY + 1.7 + prog * 2.0;
          }
        } else {
          if (nextZ >= 3.5) {
            targetStairY = flBaseY + 3.7;
          } else {
            const prog2 = Math.max(0, Math.min(1, (3.5 - nextZ) / 3.0));
            targetStairY = flBaseY + 3.7 + prog2 * 2.0;
          }
        }
      }

      nextY = THREE.MathUtils.damp(pos.current.y, targetStairY, 20, delta);
    } else if (inAnnexStair) {
      // Annexure Single Straight Flight (Z: 0.5 -> 5.3, rises 4.0m)
      const curFlIdx = Math.min(2, Math.max(0, Math.floor((pos.current.y - 0.7) / 4.0)));
      const flBaseY = curFlIdx * 4.0;
      const prog = Math.max(0, Math.min(1, (nextZ - 0.5) / 4.8));
      const targetStairY = flBaseY + 1.7 + prog * 4.0;
      nextY = THREE.MathUtils.damp(pos.current.y, targetStairY, 20, delta);
    } else {
      // Not on stairs: clamp firmly to visitor's floor plane
      const nearestFlIdx = Math.min(3, Math.max(0, Math.round((pos.current.y - 1.7) / 4.0)));
      const floorTargetY = nearestFlIdx * 4.0 + 1.7;
      nextY = THREE.MathUtils.damp(pos.current.y, floorTargetY, 14, delta);
    }

    // --- GAP BETWEEN MAIN BLOCK & ANNEXURE BLOCK (X in [21.05, 32.95]) ---
    const inBlockGap = nextX > 21.05 && nextX < 32.95;
    if (inBlockGap) {
      if (pos.current.y < 3.0) {
        // Ground level: open landscaped passage / driveway outdoors between blocks — fully permitted!
      } else {
        // Upper Floors (1F at Y~5.7, 2F at Y~9.7, 3F at Y~13.7): Must remain inside bridge corridor
        if (nextZ < 0.2 || nextZ > 2.8) {
          velocity.current.z = 0;
          return;
        }
        // Lock vertical height firmly to bridge deck eye-level
        nextY = pos.current.y < 7.5 ? 5.7 : pos.current.y < 11.5 ? 9.7 : 13.7;
      }
    }

    // --- RIGID BUILDING EXTERIOR BOUNDARY COLLISION ---
    if (pos.current.y >= 3.0) {
      // Upper floor perimeter walls of Main Block
      if (nextX >= -21.2 && nextX <= 21.2 && nextZ >= -8.2 && nextZ <= 40.2) {
        if (nextX <= -20.8) { velocity.current.x = 0; return; }
        if (nextZ <= -7.8)  { velocity.current.z = 0; return; }
        if (nextZ >= 39.8)  { velocity.current.z = 0; return; }
        // East wall has bridge opening at Z in [0.2, 2.8]
        if (nextX >= 20.8 && (nextZ < 0.2 || nextZ > 2.8)) { velocity.current.x = 0; return; }
      }
      // Upper floor perimeter walls of Annexure Block
      if (nextX >= 32.8 && nextX <= 53.2 && nextZ >= -8.2 && nextZ <= 44.2) {
        if (nextX >= 52.8)  { velocity.current.x = 0; return; }
        if (nextZ <= -7.8)  { velocity.current.z = 0; return; }
        if (nextZ >= 43.8)  { velocity.current.z = 0; return; }
        // West wall has bridge opening at Z in [0.2, 2.8]
        if (nextX <= 33.2 && (nextZ < 0.2 || nextZ > 2.8)) { velocity.current.x = 0; return; }
      }
    }

    // --- COURTYARD VOIDS & LIGHT WELLS ---
    // Only restrict entry on upper floors (Y > 3.0) where courtyards are open-to-sky vertical drop shafts
    // Ground floor courtyards are accessible landscaped gardens paved in terracotta
    if (nextY > 3.0) {
      for (const c of courtyards) {
        const [cx, , cz] = c.position;
        const [cw, , cd] = c.dimensions;
        if (
          nextX >= cx - cw / 2 - 0.1 &&
          nextX <= cx + cw / 2 + 0.1 &&
          nextZ >= cz - cd / 2 - 0.1 &&
          nextZ <= cz + cd / 2 + 0.1
        ) {
          velocity.current.x = 0;
          velocity.current.z = 0;
          return;
        }
      }
    }

    // Apply allowed motion
    pos.current.x = nextX;
    pos.current.y = nextY;
    pos.current.z = nextZ;

    // Apply camera transformations
    if (cameraMode === 'first-person') {
      camera.position.copy(pos.current);
      camera.quaternion.setFromEuler(euler.current);
    } else if (cameraMode === 'third-person') {
      // Third person: camera positioned 3.5m behind avatar
      const offset = new THREE.Vector3(0, 1.2, 3.5).applyAxisAngle(new THREE.Vector3(0, 1, 0), euler.current.y);
      camera.position.copy(pos.current).add(offset);
      camera.lookAt(pos.current.x, pos.current.y + 0.5, pos.current.z);
    }

    // Throttle global store state updates to 10Hz to prevent React thrashing
    const now = performance.now();
    if (now - lastStoreUpdate.current > 100) {
      lastStoreUpdate.current = now;
      setVisitorPosition([pos.current.x, pos.current.y, pos.current.z]);
      setVisitorRotation([euler.current.x, euler.current.y, euler.current.z]);
      updateSpatialLocation([pos.current.x, pos.current.y, pos.current.z]);
    }
  });

  return null;
};
