import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCampusStore } from '../../store/useCampusStore';

export const RouteVisualizer: React.FC = () => {
  const activeRoute = useCampusStore((s) => s.activeRoute);
  const isNavigating = useCampusStore((s) => s.isNavigating);
  const highContrast = useCampusStore((s) => s.highContrast);
  const explodedView = useCampusStore((s) => s.explodedView);

  const pulseRef = useRef<THREE.MeshBasicMaterial>(null);

  // Animate pulse glow
  useFrame(({ clock }) => {
    if (pulseRef.current) {
      pulseRef.current.opacity = 0.65 + Math.sin(clock.getElapsedTime() * 4.0) * 0.25;
    }
  });

  const pathPoints = useMemo(() => {
    if (!activeRoute || activeRoute.path.length < 2) return [];

    return activeRoute.path.map(([x, y, z]) => {
      const flIdx = y >= 11 ? 3 : y >= 7 ? 2 : y >= 3 ? 1 : 0;
      const yOffset = explodedView ? y * (1 + flIdx * 0.25) : y;
      return new THREE.Vector3(x, yOffset + 0.15, z);
    });
  }, [activeRoute, explodedView]);

  const curve = useMemo(() => {
    if (pathPoints.length < 2) return null;
    return new THREE.CatmullRomCurve3(pathPoints, false, 'catmullrom', 0.2);
  }, [pathPoints]);

  if (!isNavigating && !activeRoute) return null;
  if (!curve) return null;

  const tubeGeo = new THREE.TubeGeometry(curve, pathPoints.length * 8, 0.08, 8, false);
  const routeColor = highContrast ? '#00ffff' : '#38bdf8';

  return (
    <group>
      {/* 3D Glowing Corridor Navigation Tube */}
      <mesh geometry={tubeGeo}>
        <meshBasicMaterial
          ref={pulseRef}
          color={routeColor}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Target Destination Beacon Pin */}
      {pathPoints.length > 0 && (
        <group position={pathPoints[pathPoints.length - 1]}>
          <mesh position={[0, 1.2, 0]}>
            <coneGeometry args={[0.3, 0.8, 16]} />
            <meshBasicMaterial color={highContrast ? '#ffff00' : '#f59e0b'} />
          </mesh>
          <mesh position={[0, 1.8, 0]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshBasicMaterial color={highContrast ? '#ffff00' : '#f59e0b'} />
          </mesh>
        </group>
      )}
    </group>
  );
};
