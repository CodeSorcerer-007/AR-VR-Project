import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useCampusStore } from '../../store/useCampusStore';

export const presentationWaypoints = [
  {
    title: "1. Campus Approach & St. Paul's Block Facade",
    subtitle: "Main entrance portico showing 5-story exterior architecture, maroon department pediment, and 'ST. PAUL'S BLOCK' rooftop signage.",
    camPos: [0, 5.5, -30] as [number, number, number],
    lookAt: [0, 8.0, -8] as [number, number, number]
  },
  {
    title: '2. First-Floor Open Pedestrian Bridge',
    subtitle: 'Uncovered pedestrian link spanning between Faculty Cabin 3 on Main and Room 471 on Annexure.',
    camPos: [-27, 6.5, -6] as [number, number, number],
    lookAt: [-27, 4.0, 1.5] as [number, number, number]
  },
  {
    title: '3. Annexure Lecture Hall 1 (LH1)',
    subtitle: 'Flat-floor 60-seat academic lecture hall with student benches and audiovisual projection.',
    camPos: [-43, 2.8, 14] as [number, number, number],
    lookAt: [-47, 1.8, 8] as [number, number, number]
  },
  {
    title: '4. Second-Floor Pedestrian Bridge',
    subtitle: 'Upper open-air bridge link between Faculty Cabin 6 on Main and Room 474 on Annexure.',
    camPos: [-27, 10.5, -6] as [number, number, number],
    lookAt: [-27, 8.0, 1.5] as [number, number, number]
  },
  {
    title: '5. Flagship Gen AI Laboratory',
    subtitle: 'Standardized 180-computer engineering lab setup with 3 ceiling-mounted projectors and feature glass entrance.',
    camPos: [-43, 14.5, 14] as [number, number, number],
    lookAt: [-43, 13.5, 8] as [number, number, number]
  },
  {
    title: '6. Server Room Infrastructure',
    subtitle: 'Concealed data room behind Machine Vision Lab with glass viewing panels and blinking rack LEDs.',
    camPos: [0, 9.7, 16] as [number, number, number],
    lookAt: [0, 9.7, 20] as [number, number, number]
  },
  {
    title: '7. Campus Bird’s-Eye Overview',
    subtitle: 'Unified architectural perspective matching 3D isometric overview showing both 5-story blocks, rooftop solar arrays, cruciform tile walkway, and arched blue connecting corridor.',
    camPos: [-18, 48.0, -54] as [number, number, number],
    lookAt: [-16, 10.0, 16] as [number, number, number]
  }
];

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
          THREE.MathUtils.lerp(-35, 0, prog),
          THREE.MathUtils.lerp(18, 12, prog),
          THREE.MathUtils.lerp(-45, -30, prog)
        );
        camera.lookAt(0, 14, 16);
      } else if (t < 8.0) {
        // Phase 2: Sweep past the connecting bridges and Annexure
        const prog = (t - 4.0) / 4.0;
        camera.position.set(
          THREE.MathUtils.lerp(0, -27, prog),
          THREE.MathUtils.lerp(12, 7, prog),
          THREE.MathUtils.lerp(-30, -15, prog)
        );
        camera.lookAt(-27, 5, 1.5);
      } else if (t < 11.0) {
        // Phase 3: Glide toward the Main entrance portico
        const prog = (t - 8.0) / 3.0;
        camera.position.set(
          THREE.MathUtils.lerp(-27, 0, prog),
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
