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
        shadow-camera-far={180}
        shadow-camera-left={-55}
        shadow-camera-right={55}
        shadow-camera-top={55}
        shadow-camera-bottom={-55}
        shadow-bias={-0.0003}
        shadow-normalBias={0.02}
        shadow-radius={qualityPreset === 'ultra' ? 2.5 : 1.5}
      />

      {/* Secondary Soft Fill Sun Bounce */}
      <directionalLight
        color="#93c5fd"
        intensity={0.28}
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
                {/* Main Block - Central Core Light */}
                <pointLight position={[-21, flY + 3.2, 16]} intensity={0.75} distance={24} color="#f8fafc" decay={2} />

                {/* Annexure Block - Central Corridor Light */}
                <pointLight position={[18, flY + 3.2, 18]} intensity={0.65} distance={22} color="#f8fafc" decay={2} />

                {/* Additional wing fill lights on high and ultra presets */}
                {(qualityPreset === 'ultra' || qualityPreset === 'high') && (
                  <>
                    <pointLight position={[-35, flY + 3.2, 16]} intensity={0.5} distance={16} color="#f8fafc" decay={2} />
                    <pointLight position={[-6, flY + 3.2, 16]} intensity={0.5} distance={16} color="#f8fafc" decay={2} />
                  </>
                )}
              </group>
            );
          })}
        </group>
      )}
    </group>
  );
};
