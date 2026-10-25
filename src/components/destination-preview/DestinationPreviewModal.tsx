import React from 'react';
import { useCampusStore } from '../../store/useCampusStore';
import {
  X,
  Navigation,
  Footprints,
  Clock,
  Layers,
  ArrowRight,
  Sparkles,
  Columns,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const DestinationPreviewModal: React.FC = () => {
  const selectedDestination = useCampusStore((s) => s.selectedDestination);
  const activeRoute = useCampusStore((s) => s.activeRoute);
  const selectDestination = useCampusStore((s) => s.selectDestination);
  const startNavigation = useCampusStore((s) => s.startNavigation);
  const isNavigating = useCampusStore((s) => s.isNavigating);
  const setComparisonModalOpen = useCampusStore((s) => s.setComparisonModalOpen);
  const setComparisonRoom = useCampusStore((s) => s.setComparisonRoom);

  if (!selectedDestination || isNavigating) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 90,
        background: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={() => selectDestination(null)}
    >
      <div
        className="glass-panel-elevated"
        style={{
          width: '100%',
          maxWidth: '580px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(56, 189, 248, 0.15)',
                  color: 'var(--brand-cyan)'
                }}
              >
                {selectedDestination.block} Block • {selectedDestination.floor} Floor
              </span>
              <span
                style={{
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: selectedDestination.verified ? 'var(--brand-emerald)' : 'var(--brand-amber)'
                }}
              >
                {selectedDestination.verified ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                {selectedDestination.verified ? 'Verified from Sketch' : 'Parametrically Estimated'}
              </span>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>
              {selectedDestination.number} — {selectedDestination.name}
            </h2>
          </div>
          <button onClick={() => selectDestination(null)} className="glass-btn" style={{ padding: '6px' }}>
            <X size={16} />
          </button>
        </div>

        {/* Description & Features */}
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
          {selectedDestination.description}
        </p>

        {/* Feature Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {selectedDestination.features.map((feat, idx) => (
            <span
              key={idx}
              style={{
                fontSize: '0.75rem',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid var(--border-subtle)',
                padding: '3px 8px',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)'
              }}
            >
              {feat}
            </span>
          ))}
        </div>

        {/* Physical Route Engine Preview */}
        {activeRoute && activeRoute.found ? (
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid var(--border-focus)',
              borderRadius: 'var(--radius-md)',
              padding: '16px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--brand-cyan)' }}>
                Calculated Physical Indoor Route
              </span>
              <div style={{ display: 'flex', gap: '14px', fontSize: '0.8rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Footprints size={14} className="text-cyan" /> {activeRoute.distanceMeters} m
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={14} className="text-amber" /> ~{activeRoute.estimatedWalkingSeconds} sec
                </span>
              </div>
            </div>

            {/* Traversal Summary */}
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Floors: <strong style={{ color: 'var(--text-primary)' }}>{activeRoute.floorsTraversed.join(' → ')}</strong>
              {activeRoute.bridgesUsed.length > 0 && (
                <> • Bridge: <strong style={{ color: 'var(--brand-amber)' }}>{activeRoute.bridgesUsed.join(', ')}</strong></>
              )}
            </div>

            {/* Key Step Guidance */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {activeRoute.steps.slice(0, 3).map((st, i) => (
                <div key={i} style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: 'var(--brand-cyan)' }}>•</span> {st}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div
            style={{
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              fontSize: '0.85rem',
              color: '#fca5a5'
            }}
          >
            No valid physical route exists directly. Ensure you take stairs to 1st or 2nd floor to use open-air bridge.
          </div>
        )}

        {/* Modal Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
          <button
            onClick={() => {
              setComparisonRoom(0, selectedDestination);
              setComparisonModalOpen(true);
            }}
            className="glass-btn"
          >
            <Columns size={16} /> Compare Room
          </button>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => selectDestination(null)} className="glass-btn">
              Cancel
            </button>
            <button
              onClick={() => startNavigation(selectedDestination)}
              className="glass-btn glass-btn-primary"
            >
              <Navigation size={16} /> Start Walking Route
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
