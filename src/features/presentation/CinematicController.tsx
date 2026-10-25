import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useCampusStore } from '../../store/useCampusStore';
import { presentationWaypoints } from '../../config/presentation.config';

export const CinematicController: React.FC = () => {
  const { camera } = useThree();

  const cinematicActive = useCampusStore((s) => s.cinematicActive);
  const skipCinematic = useCampusStore((s) => s.skipCinematic);
  const presentationActive = useCampusStore((s) => s.presentationActive);
  const presentationIndex = useCampusStore((s) => s.presentationIndex);
  const reducedMotion = useCampusStore((s) => s.reducedMotion);

  const introTime = useRef(0);

  useFrame((_, delta) => {
    // 1. OPENING CINEMATIC SEQUENCE
    if (cinematicActive) {
      if (reducedMotion) {
        // Reduced motion: directly position outside Main entrance
        camera.position.set(0, 1.7, -18);
        camera.lookAt(0, 1.7, -5);
        return;
      }

      introTime.current += delta;
      const t = introTime.current;

      if (t < 4.0) {
        // Phase 1: High exterior fly-by of Main Block and rooftop sign
        const prog = t / 4.0;
        camera.position.set(
          THREE.MathUtils.lerp(35, 0, prog),
          THREE.MathUtils.lerp(18, 12, prog),
          THREE.MathUtils.lerp(-45, -30, prog)
        );
        camera.lookAt(0, 14, 16);
      } else if (t < 8.0) {
        // Phase 2: Sweep past the connecting bridges and Annexure
        const prog = (t - 4.0) / 4.0;
        camera.position.set(
          THREE.MathUtils.lerp(0, 27, prog),
          THREE.MathUtils.lerp(12, 7, prog),
          THREE.MathUtils.lerp(-30, -15, prog)
        );
        camera.lookAt(27, 5, 1.5);
      } else if (t < 11.0) {
        // Phase 3: Glide toward the Main entrance portico
        const prog = (t - 8.0) / 3.0;
        camera.position.set(
          THREE.MathUtils.lerp(27, 0, prog),
          THREE.MathUtils.lerp(7, 1.7, prog),
          THREE.MathUtils.lerp(-15, -18, prog)
        );
        camera.lookAt(0, 1.7, -5);
      } else {
        // Cinematic complete -> enter walkthrough at spawn
        skipCinematic();
      }
      return;
    }

    // 2. PRESENTATION MODE TOUR SEQUENCE
    if (presentationActive) {
      const currentStop = presentationWaypoints[presentationIndex] || presentationWaypoints[0];
      const targetPos = new THREE.Vector3(...currentStop.camPos);
      const targetLook = new THREE.Vector3(...currentStop.lookAt);

      const alpha = Math.min(1.0, reducedMotion ? 1.0 : delta * 3.5);
      camera.position.lerp(targetPos, alpha);
      camera.lookAt(targetLook);
    }
  });

  return null;
};
