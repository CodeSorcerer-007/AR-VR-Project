import React from 'react';
import { useCampusStore, QualityPreset, TimeOfDay } from '../../store/useCampusStore';
import {
  X,
  Sliders,
  Sun,
  Moon,
  Sunset,
  Eye,
  SlidersHorizontal,
  Volume2,
  Minimize2,
  RefreshCw,
  HelpCircle
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const qualityPreset = useCampusStore((s) => s.qualityPreset);
  const setQualityPreset = useCampusStore((s) => s.setQualityPreset);
  const timeOfDay = useCampusStore((s) => s.timeOfDay);
  const setTimeOfDay = useCampusStore((s) => s.setTimeOfDay);
  const interiorLightsOn = useCampusStore((s) => s.interiorLightsOn);
  const toggleInteriorLights = useCampusStore((s) => s.toggleInteriorLights);
  const hudOpacity = useCampusStore((s) => s.hudOpacity);
  const setHudOpacity = useCampusStore((s) => s.setHudOpacity);

  // Accessibility
  const highContrast = useCampusStore((s) => s.highContrast);
  const toggleHighContrast = useCampusStore((s) => s.toggleHighContrast);
  const reducedMotion = useCampusStore((s) => s.reducedMotion);
  const toggleReducedMotion = useCampusStore((s) => s.toggleReducedMotion);
  const largeText = useCampusStore((s) => s.largeText);
  const toggleLargeText = useCampusStore((s) => s.toggleLargeText);
  const audioGuidance = useCampusStore((s) => s.audioGuidance);
  const toggleAudioGuidance = useCampusStore((s) => s.toggleAudioGuidance);
  const simplifiedHUD = useCampusStore((s) => s.simplifiedHUD);
  const toggleSimplifiedHUD = useCampusStore((s) => s.toggleSimplifiedHUD);
  const resetToMainEntrance = useCampusStore((s) => s.resetToMainEntrance);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 95,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel-elevated"
        style={{
          width: '100%',
          maxWidth: '620px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 22px',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sliders size={20} className="text-cyan" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              System Preferences & Environment Controls
            </h2>
          </div>
          <button onClick={onClose} className="glass-btn" style={{ padding: '6px' }}>
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Settings Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* 1. Rendering Quality Preset */}
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
              Graphics & Rendering Preset
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
              {(['auto', 'low', 'medium', 'high', 'ultra'] as QualityPreset[]).map((q) => (
                <button
                  key={q}
                  onClick={() => setQualityPreset(q)}
                  className={`glass-btn ${qualityPreset === q ? 'active' : ''}`}
                  style={{ textTransform: 'capitalize', fontSize: '0.8rem', padding: '8px 4px' }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Atmosphere & Time of Day */}
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
              Atmosphere & Time of Day
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              <button
                onClick={() => setTimeOfDay('day')}
                className={`glass-btn ${timeOfDay === 'day' ? 'active' : ''}`}
              >
                <Sun size={16} /> Daytime
              </button>
              <button
                onClick={() => setTimeOfDay('golden')}
                className={`glass-btn ${timeOfDay === 'golden' ? 'active' : ''}`}
              >
                <Sunset size={16} /> Golden Hour
              </button>
              <button
                onClick={() => setTimeOfDay('night')}
                className={`glass-btn ${timeOfDay === 'night' ? 'active' : ''}`}
              >
                <Moon size={16} /> Night Sky
              </button>
            </div>
          </div>

          {/* 3. Interior Lighting Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Corridor & Laboratory Lighting</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Toggle internal ceiling luminaires and lab points</div>
            </div>
            <button
              onClick={toggleInteriorLights}
              className={`glass-btn ${interiorLightsOn ? 'active' : ''}`}
            >
              {interiorLightsOn ? 'Lights Enabled' : 'Lights Disabled'}
            </button>
          </div>

          {/* 4. HUD Opacity Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>HUD Panel Transparency</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--brand-cyan)' }}>{Math.round(hudOpacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.3"
              max="1.0"
              step="0.05"
              value={hudOpacity}
              onChange={(e) => setHudOpacity(parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          {/* 5. Accessibility Controls Section */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px', color: 'var(--brand-cyan)' }}>
              Accessibility & Inclusive Controls
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>High Contrast Mode</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Enhanced contrast borders and color-independent lines</div>
                </div>
                <button onClick={toggleHighContrast} className={`glass-btn ${highContrast ? 'active' : ''}`}>
                  {highContrast ? 'ON' : 'OFF'}
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>Reduced Motion Mode</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Disables fast camera sweeps, replaces with calm fades</div>
                </div>
                <button onClick={toggleReducedMotion} className={`glass-btn ${reducedMotion ? 'active' : ''}`}>
                  {reducedMotion ? 'ON' : 'OFF'}
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>Large UI Typography</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Enlarges text elements across all HUD panels</div>
                </div>
                <button onClick={toggleLargeText} className={`glass-btn ${largeText ? 'active' : ''}`}>
                  {largeText ? 'ON' : 'OFF'}
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>Turn Direction Subtitles</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Prominent text captions for navigation steps</div>
                </div>
                <button onClick={toggleAudioGuidance} className={`glass-btn ${audioGuidance ? 'active' : ''}`}>
                  {audioGuidance ? 'ON' : 'OFF'}
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>Simplified HUD Mode</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Minimal interface clutter for focused exploration</div>
                </div>
                <button onClick={toggleSimplifiedHUD} className={`glass-btn ${simplifiedHUD ? 'active' : ''}`}>
                  {simplifiedHUD ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          </div>

          {/* 6. About This Reconstruction Disclosure */}
          <div
            style={{
              padding: '14px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              lineHeight: '1.4'
            }}
          >
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
              About This Reconstruction
            </div>
            This 3D digital twin was authored directly from supplied architectural floor plan sketches and campus reference photographs. Room locations, numbers, sequence, courtyards, and bridge connections follow physical source evidence. Dimensions are proportional parametric estimates and should not be treated as surveyed CAD/BIM facts.
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 22px',
            borderTop: '1px solid var(--border-subtle)',
            background: 'rgba(0, 0, 0, 0.2)'
          }}
        >
          <button
            onClick={() => {
              resetToMainEntrance();
              onClose();
            }}
            className="glass-btn"
          >
            <RefreshCw size={14} /> Reset to Main Entrance
          </button>
          <button onClick={onClose} className="glass-btn glass-btn-primary">
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
