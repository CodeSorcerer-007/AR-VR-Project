import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useCampusStore } from '../store/useCampusStore';
import { Lights } from './Lights';
import { Exterior } from './Exterior';
import { BuildingShell } from './BuildingShell';
import { FloorGeometry } from './FloorGeometry';
import { Courtyards } from './Courtyards';
import { Bridges } from './Bridges';
import { Stairs } from './Stairs';
import { Doors } from './Doors';
import { Furnishings } from './Furnishings';
import { WalkController } from '../features/movement/WalkController';
import { CinematicController } from '../features/presentation/CinematicController';
import { RouteVisualizer } from '../features/navigation/RouteVisualizer';
import { useThree } from '@react-three/fiber';

// Handles camera position transition when switching to Orbit / Overview mode
const OrbitCameraManager: React.FC<{ active: boolean }> = ({ active }) => {
  const { camera, controls } = useThree();
  const prevActive = React.useRef(false);

  React.useEffect(() => {
    if (active && !prevActive.current) {
      // Front aerial vantage: looking north (+Z) at the campus
      // Annexure Block is on the LEFT (-X), Main Block is centered (X=0)
      camera.position.set(-16, 40, -50);
      camera.lookAt(-16, 4, 16);
      if (controls && 'target' in controls) {
        (controls as any).target.set(-16, 4, 16);
        (controls as any).update?.();
      }
    }
    prevActive.current = active;
  }, [active, camera, controls]);

  return null;
};

// Background color based on time of day
const getSkyColor = (timeOfDay: string) =>
  timeOfDay === 'night' ? '#070b14' : timeOfDay === 'golden' ? '#fed7aa' : '#e0f2fe';

// Dynamic Performance Guardian: Monitors real-time FPS and automatically downgrades settings if stuttering occurs
const PerformanceGuardian: React.FC = () => {
  const qualityPreset = useCampusStore((s) => s.qualityPreset);
  const setQualityPreset = useCampusStore((s) => s.setQualityPreset);
  const frameTimes = React.useRef<number[]>([]);
  const lastTime = React.useRef(performance.now());
  const lowFpsCount = React.useRef(0);

  React.useEffect(() => {
    // Expose FPS globally for HUD if needed
    (window as any).__campusFps = 60;
  }, []);

  useThree(); // ensure inside canvas

  React.useEffect(() => {
    let animId: number;
    const loop = () => {
      const now = performance.now();
      const delta = now - lastTime.current;
      lastTime.current = now;

      if (delta > 0) {
        const fps = 1000 / delta;
        frameTimes.current.push(fps);
        if (frameTimes.current.length > 30) frameTimes.current.shift();

        const avgFps = frameTimes.current.reduce((a, b) => a + b, 0) / frameTimes.current.length;
        (window as any).__campusFps = Math.round(avgFps);

        // Auto-safeguard: if stuttering below 32 FPS on high/ultra for > 60 frames, auto-downgrade to medium/low
        if (avgFps < 32 && (qualityPreset === 'ultra' || qualityPreset === 'high')) {
          lowFpsCount.current++;
          if (lowFpsCount.current > 60) {
            console.warn('[PerformanceGuardian] Frame rate below 32 FPS. Auto-switching to high-performance mode.');
            setQualityPreset('medium');
            lowFpsCount.current = 0;
          }
        } else {
          lowFpsCount.current = Math.max(0, lowFpsCount.current - 1);
        }
      }
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [qualityPreset, setQualityPreset]);

  return null;
};

export const CampusScene: React.FC = () => {
  const cameraMode = useCampusStore((s) => s.cameraMode);
  const qualityPreset = useCampusStore((s) => s.qualityPreset);
  const timeOfDay = useCampusStore((s) => s.timeOfDay);
  const overviewMode = useCampusStore((s) => s.overviewMode);
  const presentationActive = useCampusStore((s) => s.presentationActive);

  const skyColor = getSkyColor(timeOfDay);

  // Performance-capped DPR:
  // low: 0.9 (buttery smooth on weak laptops/Intel UHD)
  // medium: 1.0 (crisp and 60fps on standard screens)
  // high: 1.2, ultra: 1.5
  const maxDpr =
    qualityPreset === 'ultra' ? 1.5 :
    qualityPreset === 'high' ? 1.2 :
    qualityPreset === 'medium' ? 1.0 : 0.9;

  const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, maxDpr) : 1.0;
  const antialias = qualityPreset !== 'low';
  const enableShadows = qualityPreset === 'ultra' ? 'soft' : qualityPreset === 'high' ? true : false;
  const enableOrbit = cameraMode === 'orbit' || overviewMode;

  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, zIndex: 0 }}>
      <Canvas
        shadows={enableShadows}
        dpr={dpr}
        gl={{
          antialias,
          preserveDrawingBuffer: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
          alpha: false // false bypasses browser compositor alpha-blending
        }}
        camera={{
          fov: 65,
          near: 0.1,
          far: 350,
          position: [0, 1.7, -18] // Outside Main Entrance portico facing entrance doors
        }}
        onCreated={({ gl }) => {
          // Graceful WebGL Context Lost and Recovery Handlers (Prevents browser crash / white screen)
          const canvas = gl.domElement;
          canvas.addEventListener('webglcontextlost', (e) => {
            e.preventDefault();
            console.warn('[WebGL] Context lost. Preventing crash...');
          });
          canvas.addEventListener('webglcontextrestored', () => {
            console.log('[WebGL] Context successfully restored.');
          });
        }}
      >
        <color attach="background" args={[skyColor]} />
        <fog attach="fog" args={[skyColor, 60, 280]} />

        <Suspense fallback={null}>
          <PerformanceGuardian />
          <Lights />
          <Exterior />
          <BuildingShell />
          <FloorGeometry />
          <Courtyards />
          <Bridges />
          <Stairs />
          <Doors />
          <Furnishings />
          <RouteVisualizer />

          {/* Controllers */}
          <WalkController />
          <CinematicController />
          <OrbitCameraManager active={enableOrbit} />

          {enableOrbit && !presentationActive && (
            <OrbitControls
              makeDefault
              target={[-16, 4, 16]}
              maxPolarAngle={Math.PI / 2.05}
              minDistance={5}
              maxDistance={120}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
};
