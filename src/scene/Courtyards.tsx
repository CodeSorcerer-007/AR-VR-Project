import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useCampusStore } from '../store/useCampusStore';
import { courtyards } from '../config/campus-data';
import { CampusMaterials } from './materials';

// ── ═══ DYNAMIC SUNLIGHT SHAFTS & DUST PARTICLES ═══ ──
const CourtyardSunlightMotes: React.FC<{
  position: [number, number, number];
  dimensions: [number, number, number];
}> = ({ position, dimensions }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const timeOfDay = useCampusStore((s) => s.timeOfDay);
  const qualityPreset = useCampusStore((s) => s.qualityPreset);

  const particleCount = qualityPreset === 'ultra' ? 80 : qualityPreset === 'high' ? 45 : 18;
  const [w, , d] = dimensions;
  const frameCount = useRef(0);

  const [positions, initialPositions] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const init = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * (w - 0.6);
      const y = Math.random() * 15 + 0.5;
      const z = (Math.random() - 0.5) * (d - 0.6);
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      init[i * 3] = x;
      init[i * 3 + 1] = y;
      init[i * 3 + 2] = z;
    }
    return [pos, init];
  }, [particleCount, w, d]);

  useFrame((state) => {
    if (!pointsRef.current || qualityPreset === 'low' || timeOfDay === 'night') return;
    const time = state.clock.getElapsedTime();
    pointsRef.current.rotation.y = time * 0.04;
    pointsRef.current.position.y = Math.sin(time * 0.5) * 0.15;
  });

  if (timeOfDay === 'night' || qualityPreset === 'low') return null;

  const moteColor = timeOfDay === 'golden' ? '#ffedd5' : '#fef08a';

  return (
    <group position={[position[0], 0, position[2]]}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          color={moteColor}
          transparent
          opacity={0.65}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
};

export const Courtyards: React.FC = () => {
  const materials = CampusMaterials.getInstance();
  const explodedView = useCampusStore((s) => s.explodedView);
  const currentFloor = useCampusStore((s) => s.currentFloor);
  const cameraMode = useCampusStore((s) => s.cameraMode);
  const isWalking = cameraMode === 'first-person' || cameraMode === 'third-person';

  const floorElevations = [0, 4.0, 8.0, 12.0];
  const activeIdx =
    currentFloor === 'ground' ? 0 :
    currentFloor === 'first' ? 1 :
    currentFloor === 'second' ? 2 : 3;

  return (
    <group>
      {courtyards.map((c) => {
        const [cx, , cz] = c.position;
        const [w, , d] = c.dimensions;
        const pHeight = c.parapetHeight; // 1.2m
        const roofY = explodedView ? 16.0 * 1.75 : 16.0;

        return (
          <group key={c.id}>
            {/* Atmospheric sunlit dust motes inside courtyard shaft */}
            <CourtyardSunlightMotes position={c.position} dimensions={c.dimensions} />

            {/* ── Ground Floor Terracotta Paved Courtyard Ground (Y = 0) ── */}
            {(!isWalking || activeIdx <= 1) && (
              <group position={[cx, 0.02, cz]}>
                <mesh rotation={[-Math.PI / 2, 0, 0]} material={materials.courtyardTile} receiveShadow>
                  <planeGeometry args={[w, d]} />
                </mesh>
                {/* Central concrete utility pit / drain hatch */}
                <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <planeGeometry args={[0.8, 0.8]} />
                  <meshStandardMaterial color="#64748b" roughness={0.7} metalness={0.4} />
                </mesh>
              </group>
            )}

            {/* ── Multi-Floor Parapets & Structural Navy Blue Frames ── */}
            {floorElevations.map((baseY, flIdx) => {
              if (isWalking && !explodedView && Math.abs(flIdx - activeIdx) > 1) {
                return null;
              }
              const y = explodedView ? baseY * (1 + flIdx * 0.25) : baseY;

              return (
                <group key={flIdx} position={[cx, y, cz]}>
                  {/* North Parapet Wall (1.15m high, 0.2m thick) */}
                  <mesh position={[0, pHeight / 2, d / 2]} material={materials.exteriorWall} receiveShadow>
                    <boxGeometry args={[w, pHeight, 0.2]} />
                  </mesh>
                  {/* South Parapet Wall */}
                  <mesh position={[0, pHeight / 2, -d / 2]} material={materials.exteriorWall} receiveShadow>
                    <boxGeometry args={[w, pHeight, 0.2]} />
                  </mesh>
                  {/* West Parapet Wall */}
                  <mesh position={[-w / 2, pHeight / 2, 0]} material={materials.exteriorWall} receiveShadow>
                    <boxGeometry args={[0.2, pHeight, d]} />
                  </mesh>
                  {/* East Parapet Wall */}
                  <mesh position={[w / 2, pHeight / 2, 0]} material={materials.exteriorWall} receiveShadow>
                    <boxGeometry args={[0.2, pHeight, d]} />
                  </mesh>

                  {/* Parapet Coping Top Accent */}
                  <mesh position={[0, pHeight + 0.02, d / 2]} material={materials.windowWhiteFrame}>
                    <boxGeometry args={[w + 0.06, 0.05, 0.24]} />
                  </mesh>
                  <mesh position={[0, pHeight + 0.02, -d / 2]} material={materials.windowWhiteFrame}>
                    <boxGeometry args={[w + 0.06, 0.05, 0.24]} />
                  </mesh>
                  <mesh position={[-w / 2, pHeight + 0.02, 0]} material={materials.windowWhiteFrame}>
                    <boxGeometry args={[0.24, 0.05, d + 0.06]} />
                  </mesh>
                  <mesh position={[w / 2, pHeight + 0.02, 0]} material={materials.windowWhiteFrame}>
                    <boxGeometry args={[0.24, 0.05, d + 0.06]} />
                  </mesh>

                  {/* 15cm Black Skirting on Corridor side of Parapets */}
                  <mesh position={[0, 0.075, d / 2 + 0.11]} material={materials.skirtingBlack}>
                    <boxGeometry args={[w, 0.15, 0.02]} />
                  </mesh>
                  <mesh position={[0, 0.075, -d / 2 - 0.11]} material={materials.skirtingBlack}>
                    <boxGeometry args={[w, 0.15, 0.02]} />
                  </mesh>
                  <mesh position={[-w / 2 - 0.11, 0.075, 0]} material={materials.skirtingBlack}>
                    <boxGeometry args={[0.02, 0.15, d]} />
                  </mesh>
                  <mesh position={[w / 2 + 0.11, 0.075, 0]} material={materials.skirtingBlack}>
                    <boxGeometry args={[0.02, 0.15, d]} />
                  </mesh>

                  {/* Structural Columns painted Deep Navy Blue (Photos 9.28.54 PM) */}
                  <mesh position={[-w / 2, 1.8, -d / 2]} material={materials.columnNavyBlue} castShadow>
                    <boxGeometry args={[0.4, 3.6, 0.4]} />
                  </mesh>
                  <mesh position={[w / 2, 1.8, -d / 2]} material={materials.columnNavyBlue} castShadow>
                    <boxGeometry args={[0.4, 3.6, 0.4]} />
                  </mesh>
                  <mesh position={[-w / 2, 1.8, d / 2]} material={materials.columnNavyBlue} castShadow>
                    <boxGeometry args={[0.4, 3.6, 0.4]} />
                  </mesh>
                  <mesh position={[w / 2, 1.8, d / 2]} material={materials.columnNavyBlue} castShadow>
                    <boxGeometry args={[0.4, 3.6, 0.4]} />
                  </mesh>
                </group>
              );
            })}

            {/* ── ═══ OVERHEAD CURVED STEEL PERGOLA TRELLIS (Photos 9.29.13 PM & 9.29.16 PM) ═══ ── */}
            {/* Spans across the open sky at roof level Y = 16.0 */}
            <group position={[cx, roofY + 0.4, cz]}>
              {/* Longitudinal curved arch bars along Z */}
              {[-w / 2 + 0.5, -w / 4, 0, w / 4, w / 2 - 0.5].map((tx, idx) => (
                <mesh key={`trell-x-${idx}`} position={[tx, 0.15, 0]} material={materials.metalTrussGray}>
                  <boxGeometry args={[0.06, 0.08, d + 0.4]} />
                </mesh>
              ))}
              {/* Transverse cross bars along X */}
              {Array.from({ length: 9 }).map((_, rIdx) => {
                const tz = -d / 2 + 0.5 + (rIdx * (d - 1)) / 8;
                return (
                  <mesh key={`trell-z-${rIdx}`} position={[0, 0.18, tz]} material={materials.metalTrussGray}>
                    <boxGeometry args={[w + 0.4, 0.06, 0.06]} />
                  </mesh>
                );
              })}
            </group>
          </group>
        );
      })}
    </group>
  );
};
