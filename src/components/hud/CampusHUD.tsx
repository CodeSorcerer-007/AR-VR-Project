import React, { useState, useEffect } from 'react';
import { useCampusStore, CameraViewMode } from '../../store/useCampusStore';
import { NavigationCard } from './NavigationCard';
import { RoomToast } from './RoomToast';
import { SearchPalette } from '../search/SearchPalette';
import { DestinationPreviewModal } from '../destination-preview/DestinationPreviewModal';
import { FloorPlanViewer } from '../floorplan/FloorPlanViewer';
import { PresentationToolbar } from '../presentation/PresentationToolbar';
import { ComparisonModal } from '../comparison/ComparisonModal';
import { SettingsModal } from '../settings/SettingsModal';
import { OfflinePackageManager } from '../offline/OfflinePackageManager';
import { ControlsModal } from '../help/ControlsModal';
import { captureScreenshot } from '../../utils/screenshot';
import {
  Search,
  Map,
  Layers,
  Sparkles,
  Camera,
  HardDrive,
  Sliders,
  HelpCircle,
  Eye,
  User,
  Compass,
  Building2,
  ChevronRight,
  Maximize2,
  Zap
} from 'lucide-react';

export const CampusHUD: React.FC = () => {
  const currentBlock = useCampusStore((s) => s.currentBlock);
  const currentFloor = useCampusStore((s) => s.currentFloor);
  const currentRoom = useCampusStore((s) => s.currentRoom);
  const cameraMode = useCampusStore((s) => s.cameraMode);
  const setCameraMode = useCampusStore((s) => s.setCameraMode);
  const explodedView = useCampusStore((s) => s.explodedView);
  const setExplodedView = useCampusStore((s) => s.setExplodedView);
  const setSearchOpen = useCampusStore((s) => s.setSearchOpen);
  const setFloorPlanOpen = useCampusStore((s) => s.setFloorPlanOpen);
  const togglePresentation = useCampusStore((s) => s.togglePresentation);
  const presentationActive = useCampusStore((s) => s.presentationActive);
  const cinematicActive = useCampusStore((s) => s.cinematicActive);
  const skipCinematic = useCampusStore((s) => s.skipCinematic);
  const hudOpacity = useCampusStore((s) => s.hudOpacity);
  const simplifiedHUD = useCampusStore((s) => s.simplifiedHUD);
  const offlineReady = useCampusStore((s) => s.offlineReady);
  const resetToMainEntrance = useCampusStore((s) => s.resetToMainEntrance);
  const qualityPreset = useCampusStore((s) => s.qualityPreset);
  const setQualityPreset = useCampusStore((s) => s.setQualityPreset);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [offlineModalOpen, setOfflineModalOpen] = useState(false);
  const [controlsOpen, setControlsOpen] = useState(false);
  const [displayFps, setDisplayFps] = useState(60);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentFps = (window as any).__campusFps;
      if (typeof currentFps === 'number' && currentFps > 0) {
        setDisplayFps(currentFps);
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'm' || e.key === 'M') {
        useCampusStore.getState().setFloorPlanOpen(!useCampusStore.getState().floorPlanOpen);
      } else if (e.key === 'x' || e.key === 'X') {
        const next = !useCampusStore.getState().explodedView;
        useCampusStore.getState().setExplodedView(next);
        if (next && useCampusStore.getState().cameraMode !== 'orbit') {
          useCampusStore.getState().setCameraMode('orbit');
        }
      } else if (e.key === 'p' || e.key === 'P') {
        useCampusStore.getState().togglePresentation();
      } else if (e.key === '1') {
        setCameraMode('first-person');
      } else if (e.key === '2') {
        setCameraMode('third-person');
      } else if (e.key === '3') {
        setCameraMode('orbit');
      } else if (e.key === 'r' || e.key === 'R') {
        resetToMainEntrance();
      } else if (e.key === '?') {
        setControlsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setCameraMode, resetToMainEntrance]);

  return (
    <div
      id="campus-hud-overlay"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 20,
        fontFamily: 'var(--font-sans)',
        opacity: hudOpacity,
        transition: 'opacity var(--transition-normal)'
      }}
    >
      {/* =========================================================================
          OPENING CINEMATIC BANNER
          ========================================================================= */}
      {cinematicActive && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'auto',
            background: 'linear-gradient(to bottom, rgba(7, 9, 14, 0.4), transparent 40%, rgba(7, 9, 14, 0.7))',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '36px 48px'
          }}
        >
          <div>
            <div style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 'var(--radius-sm)', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid var(--border-focus)', color: 'var(--brand-cyan)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>
              Architectural Digital Twin
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em', textShadow: '0 4px 16px rgba(0,0,0,0.8)' }}>
              St. Paul's Digital Twin
            </h1>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '540px', fontSize: '1rem', marginTop: '6px' }}>
              Photorealistic 3D academic campus walkthrough of St. Paul's Main Block and Annexure Block with verified architectural floor plans, physical bridge links, and standardized laboratories.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '14px', alignSelf: 'flex-start' }}>
            <button
              onClick={skipCinematic}
              className="glass-btn glass-btn-primary"
              style={{ padding: '12px 24px', fontSize: '1rem' }}
            >
              Enter Walkthrough <ChevronRight size={18} />
            </button>
            <button
              onClick={skipCinematic}
              className="glass-btn"
              style={{ padding: '12px 20px', fontSize: '1rem' }}
            >
              Skip Intro
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          TOP NAVIGATION BAR (when cinematic is inactive)
          ========================================================================= */}
      {!cinematicActive && (
        <header
          style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            right: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pointerEvents: 'auto'
          }}
        >
          {/* Left: Brand Identity & Location Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              className="glass-panel"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 14px'
              }}
            >
              <Building2 size={20} className="text-cyan" />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', lineHeight: '1.2' }}>
                  St. Paul's Twin
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {currentBlock === 'exterior' ? (
                    'Campus Forecourt (Main Entrance Approach)'
                  ) : (
                    <span>
                      {currentBlock.toUpperCase()} BLOCK • {currentFloor.toUpperCase()} FLOOR
                      {currentRoom && ` • ${currentRoom.number}`}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Camera View Switcher */}
            {!simplifiedHUD && (
              <div className="glass-panel" style={{ display: 'flex', padding: '3px' }}>
                <button
                  onClick={() => setCameraMode('first-person')}
                  className={`glass-btn ${cameraMode === 'first-person' ? 'active' : ''}`}
                  style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                  title="First-Person Walk (1)"
                >
                  <Eye size={14} /> 1P
                </button>
                <button
                  onClick={() => setCameraMode('third-person')}
                  className={`glass-btn ${cameraMode === 'third-person' ? 'active' : ''}`}
                  style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                  title="Third-Person View (2)"
                >
                  <User size={14} /> 3P
                </button>
                <button
                  onClick={() => setCameraMode('orbit')}
                  className={`glass-btn ${cameraMode === 'orbit' ? 'active' : ''}`}
                  style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                  title="Free Orbit Camera (3)"
                >
                  <Compass size={14} /> Orbit
                </button>
              </div>
            )}
          </div>

          {/* Right: Primary Tools & Modals Triggers */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Search Command Palette Trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="glass-btn glass-btn-primary"
              title="Search Destinations (Cmd+K or /)"
            >
              <Search size={16} /> Search <kbd style={{ fontSize: '0.7rem', opacity: 0.7, padding: '1px 4px', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '3px' }}>/ </kbd>
            </button>

            {/* 2D Architectural Floor Plans */}
            <button
              onClick={() => setFloorPlanOpen(true)}
              className="glass-btn"
              title="2D Floor Plans (M)"
            >
              <Map size={16} /> Plans <kbd style={{ fontSize: '0.7rem', opacity: 0.7 }}>M</kbd>
            </button>

            {/* 3D Exploded / Stacked View */}
            {!simplifiedHUD && (
              <button
                onClick={() => {
                  const next = !explodedView;
                  setExplodedView(next);
                  if (next && cameraMode !== 'orbit') {
                    setCameraMode('orbit');
                  }
                }}
                className={`glass-btn ${explodedView ? 'active' : ''}`}
                title="3D Stacked / Exploded Floors (X)"
              >
                <Layers size={16} /> Stacked
              </button>
            )}

            {/* Presentation Showcase Tour */}
            <button
              id="present-btn"
              onClick={togglePresentation}
              className={`glass-btn ${presentationActive ? 'active' : ''}`}
              title="Presentation Mode (P)"
            >
              <Sparkles size={16} /> Present
            </button>

            {/* PNG Screenshot Capture */}
            <button
              onClick={() => captureScreenshot(true)}
              className="glass-btn"
              title="Capture PNG Architectural Screenshot"
            >
              <Camera size={16} />
            </button>

            {/* Offline Package Manager */}
            <button
              onClick={() => setOfflineModalOpen(true)}
              className="glass-btn"
              style={{ color: offlineReady ? 'var(--brand-emerald)' : 'var(--text-primary)' }}
              title="Campus Offline Package"
            >
              <HardDrive size={16} />
            </button>

            {/* Quick 60FPS Performance Mode Button */}
            <button
              onClick={() => setQualityPreset(qualityPreset === 'low' ? 'medium' : 'low')}
              className={`glass-btn ${qualityPreset === 'low' ? 'active' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                color: qualityPreset === 'low' ? '#10b981' : '#38bdf8'
              }}
              title={`Current Preset: ${qualityPreset.toUpperCase()} • Click to toggle 60FPS Eco Mode`}
            >
              <Zap size={14} />
              <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{displayFps} FPS</span>
            </button>

            {/* System Preferences */}
            <button
              onClick={() => setSettingsOpen(true)}
              className="glass-btn"
              title="Settings & Accessibility"
            >
              <Sliders size={16} />
            </button>

            {/* Controls Help */}
            <button
              onClick={() => setControlsOpen(true)}
              className="glass-btn"
              title="Controls & Shortcuts (?)"
            >
              <HelpCircle size={16} />
            </button>
          </div>
        </header>
      )}

      {/* Center Reticle for First-Person Walk Mode */}
      {!cinematicActive && !presentationActive && cameraMode === 'first-person' && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.65)',
            border: '1px solid rgba(0, 0, 0, 0.4)',
            pointerEvents: 'none'
          }}
        />
      )}

      {/* Floating Components */}
      <NavigationCard />
      <RoomToast />
      <PresentationToolbar />

      {/* Interactive Modals */}
      <SearchPalette />
      <DestinationPreviewModal />
      <FloorPlanViewer />
      <ComparisonModal />
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <OfflinePackageManager isOpen={offlineModalOpen} onClose={() => setOfflineModalOpen(false)} />
      <ControlsModal isOpen={controlsOpen} onClose={() => setControlsOpen(false)} />
    </div>
  );
};
