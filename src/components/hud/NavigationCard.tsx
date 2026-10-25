import React from 'react';
import { useCampusStore } from '../../store/useCampusStore';
import { Navigation, X, Footprints, Clock, ArrowRight, CornerDownRight } from 'lucide-react';

export const NavigationCard: React.FC = () => {
  const isNavigating = useCampusStore((s) => s.isNavigating);
  const selectedDestination = useCampusStore((s) => s.selectedDestination);
  const activeRoute = useCampusStore((s) => s.activeRoute);
  const cancelNavigation = useCampusStore((s) => s.cancelNavigation);
  const navStepIndex = useCampusStore((s) => s.navStepIndex);
  const audioGuidance = useCampusStore((s) => s.audioGuidance);

  if (!isNavigating || !selectedDestination || !activeRoute) return null;

  const currentStepText = activeRoute.steps[navStepIndex] || activeRoute.steps[0] || 'Follow the marked corridor route.';

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 50,
        width: '92%',
        maxWidth: '540px'
      }}
    >
      <div className="glass-panel" style={{ padding: '16px 20px', borderLeft: '4px solid var(--brand-cyan)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Navigation size={18} className="text-cyan" />
            <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>
              Active Route: {selectedDestination.number} — {selectedDestination.name}
            </span>
          </div>
          <button
            onClick={cancelNavigation}
            className="glass-btn glass-btn-danger"
            style={{ padding: '4px 10px', fontSize: '0.8rem' }}
            title="Cancel Navigation"
          >
            <X size={14} /> Stop
          </button>
        </div>

        {/* Step Direction */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            background: 'rgba(56, 189, 248, 0.08)',
            padding: '10px 12px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '12px'
          }}
        >
          <CornerDownRight size={18} className="text-cyan" style={{ marginTop: '2px', flexShrink: 0 }} />
          <div style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
            {currentStepText}
          </div>
        </div>

        {/* Route Stats */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Footprints size={14} className="text-cyan" />
            <span>Distance: <strong>{activeRoute.distanceMeters} m</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={14} className="text-amber" />
            <span>Est. Time: <strong>{activeRoute.estimatedWalkingSeconds}s</strong></span>
          </div>
          {activeRoute.bridgesUsed.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--brand-amber)' }}>
              <span>Bridge: <strong>{activeRoute.bridgesUsed[0]}</strong></span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
