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
    // West Staircase (Main Block southwest corner): X ~ -15, Z in [0.4, 5.3]
    // East Staircase (Main Block southeast corner): X ~ +15, Z in [0.4, 5.3]
    // Annexure Staircase (Annexure Block west corridor): X ~ +45, Z in [0.4, 5.3]
    const inWestStair = Math.abs(nextX - (-15)) < 1.35 && nextZ >= 0.4 && nextZ <= 5.3;
    const inEastStair = Math.abs(nextX - 15) < 1.35 && nextZ >= 0.4 && nextZ <= 5.3;
    const inAnnexStair = Math.abs(nextX - 45) < 1.35 && nextZ >= 0.4 && nextZ <= 5.3;
    const onAnyStair = inWestStair || inEastStair || inAnnexStair;

    if (onAnyStair) {
      // Determine base floor of the flight being climbed or descended
      let flBaseY = 0.0;
      if (pos.current.y < 3.7) {
        // Ground to 1F flight
        flBaseY = 0.0;
      } else if (pos.current.y >= 3.7 && pos.current.y < 7.7) {
        // Between 1F and 2F: If entering near top landing (Z > 2.5), descending to Ground; otherwise climbing to 2F
        flBaseY = pos.current.z >= 2.5 && pos.current.y < 6.0 ? 0.0 : 4.0;
      } else if (pos.current.y >= 7.7 && pos.current.y < 11.7) {
        // Between 2F and 3F: If entering near top landing (Z > 2.5), descending to 1F; otherwise climbing to 3F
        flBaseY = pos.current.z >= 2.5 && pos.current.y < 10.0 ? 4.0 : 8.0;
      } else {
        // 3F: Descending to 2F
        flBaseY = 8.0;
      }

      // Calculate smooth target eye level along stair incline (Z: 0.5 to 4.5), with landings at ends
      let targetStairY = flBaseY + 1.7;
      if (nextZ <= 0.5) {
        targetStairY = flBaseY + 1.7;
      } else if (nextZ >= 4.5) {
        targetStairY = flBaseY + 4.0 + 1.7;
      } else {
        const prog = (nextZ - 0.5) / 4.0; // 0 to 1
        targetStairY = flBaseY + prog * 4.0 + 1.7;
      }
      nextY = THREE.MathUtils.damp(pos.current.y, targetStairY, 18, delta);
    } else {
      // Not on stairs: damp elevation to visitor's current floor level
      const nearestFlIdx = Math.min(3, Math.max(0, Math.round((pos.current.y - 1.7) / 4.0)));
      const floorTargetY = nearestFlIdx * 4.0 + 1.7;
      nextY = THREE.MathUtils.damp(pos.current.y, floorTargetY, 14, delta);
    }

    // --- GAP BETWEEN MAIN BLOCK & ANNEXURE BLOCK (X in [21.05, 32.95]) ---
    const inBlockGap = nextX > 21.05 && nextX < 32.95;
    if (inBlockGap) {
      if (pos.current.y < 3.0) {
        // Ground level: open landscaped passage / driveway outdoors between blocks — fully permitted!
      } else if (pos.current.y >= 3.0 && pos.current.y < 11.5) {
        // 1st Floor (Y ~ 5.7) or 2nd Floor (Y ~ 9.7): Must remain inside the bridge safety envelope (Z in [0.2, 2.8])
        if (nextZ < 0.2 || nextZ > 2.8) {
          velocity.current.z = 0;
          return;
        }
        // Lock vertical height firmly to bridge deck eye-level
        nextY = pos.current.y < 7.5 ? 5.7 : 9.7;
      } else {
        // 3rd Floor (Y > 11.5): No bridge exists on 3F — cannot walk off building edge into gap
        velocity.current.x = 0;
        return;
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
