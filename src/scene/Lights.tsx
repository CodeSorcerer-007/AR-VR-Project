import React from 'react';
import { useCampusStore } from '../store/useCampusStore';

export const Lights: React.FC = () => {
  const timeOfDay = useCampusStore((s) => s.timeOfDay);
  const interiorLightsOn = useCampusStore((s) => s.interiorLightsOn);
  const qualityPreset = useCampusStore((s) => s.qualityPreset);
  const cameraMode = useCampusStore((s) => s.cameraMode);
  const currentFloor = useCampusStore((s) => s.currentFloor);

  // Performance-scaled shadow map resolution and shadow toggle
  const shadowMapSize = qualityPreset === 'ultra' ? 2048 : qualityPreset === 'high' ? 1024 : 512;
  const enableShadows = qualityPreset === 'ultra' || qualityPreset === 'high';

  // Sunlight parameters based on timeOfDay
  let sunColor = '#ffffff';
  let sunIntensity = 1.35;
  let sunPosition: [number, number, number] = [45, 60, -35];
  let ambientColor = '#e2e8f0';
  let ambientIntensity = 0.52;

  if (timeOfDay === 'golden') {
    sunColor = '#ffaa5e';
    sunIntensity = 1.7;
    sunPosition = [65, 25, -50];
    ambientColor = '#fed7aa';
    ambientIntensity = 0.44;
  } else if (timeOfDay === 'night') {
    sunColor = '#38bdf8';
    sunIntensity = 0.15;
    sunPosition = [20, 50, -20];
    ambientColor = '#0f172a';
    ambientIntensity = 0.20;
  }

  // Active visitor floor elevation for culling distant interior point lights
  const activeFloorY =
    currentFloor === 'ground' ? 0 :
    currentFloor === 'first' ? 4.0 :
    currentFloor === 'second' ? 8.0 : 12.0;

  const isWalking = cameraMode === 'first-person' || cameraMode === 'third-person';

  return (
    <group>
      {/* Ambient Fill Light */}
      <ambientLight color={ambientColor} intensity={ambientIntensity} />

      {/* Realistic Sky-Ground Ambient Bounce (Zero per-pixel light loops, runs at maximum FPS) */}
      <hemisphereLight
        args={['#f8fafc', '#334155', timeOfDay === 'night' ? 0.18 : 0.55]}
      />

      {/* Main Directional Sun Light with Performance-Gated Shadows */}
      <directionalLight
        color={sunColor}
        intensity={sunIntensity}
        position={sunPosition}
        castShadow={enableShadows}
        shadow-mapSize-width={shadowMapSize}
        shadow-mapSize-height={shadowMapSize}
        shadow-camera-near={10}
        shadow-camera-far={220}
        shadow-camera-left={-70}
        shadow-camera-right={70}
        shadow-camera-top={70}
        shadow-camera-bottom={-70}
        shadow-bias={-0.0003}
        shadow-normalBias={0.02}
        shadow-radius={qualityPreset === 'ultra' ? 2.5 : 1.5}
      />

      {/* Secondary Soft Fill Sun Bounce */}
      <directionalLight
        color="#93c5fd"
        intensity={0.32}
        position={[-30, 40, 40]}
      />

      {/* Interior Corridor & Lab Illuminators with High-Performance Quality & Floor Culling */}
      {interiorLightsOn && qualityPreset !== 'low' && (
        <group>
          {[0, 4.0, 8.0, 12.0].map((flY, idx) => {
            // When walking, only activate point lights on the current floor to maximize GPU fill-rate
            if (isWalking && Math.abs(flY - activeFloorY) > 2.0) return null;

            // When in overview/orbit mode, only render interior lights on ultra preset
            if (!isWalking && qualityPreset !== 'ultra') return null;

            return (
              <group key={`int-fl-${idx}`}>
                {/* Main Block - Central Flagship Lab Core Light (X: 0, Z: 16) */}
                <pointLight position={[0, flY + 3.2, 16]} intensity={0.9} distance={28} color="#f8fafc" decay={2} />

                {/* Main Block - West Corridor (X: -13, Z: 16) */}
                <pointLight position={[-13, flY + 3.2, 16]} intensity={0.75} distance={22} color="#f8fafc" decay={2} />

                {/* Main Block - East Corridor / Bridge Approach (X: 13, Z: 16) */}
                <pointLight position={[13, flY + 3.2, 16]} intensity={0.75} distance={22} color="#f8fafc" decay={2} />

                {/* Main Block - North Rear Corridor (X: 0, Z: 32) */}
                <pointLight position={[0, flY + 3.2, 32]} intensity={0.7} distance={22} color="#f8fafc" decay={2} />

                {/* Annexure Block - Central Corridor (X: 37, Z: 18) */}
                <pointLight position={[37, flY + 3.2, 18]} intensity={0.85} distance={26} color="#f8fafc" decay={2} />

                {/* Annexure Block - South Corridor / Bridge Approach (X: 37, Z: 2) */}
                <pointLight position={[37, flY + 3.2, 2]} intensity={0.75} distance={22} color="#f8fafc" decay={2} />

                {/* Annexure Block - North Corridor (X: 37, Z: 34) */}
                <pointLight position={[37, flY + 3.2, 34]} intensity={0.7} distance={22} color="#f8fafc" decay={2} />
              </group>
            );
          })}
        </group>
      )}
    </group>
  );
};
