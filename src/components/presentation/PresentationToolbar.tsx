import React from 'react';
import { useCampusStore } from '../../store/useCampusStore';
import { presentationWaypoints } from '../../config/presentation.config';
import { Play, Pause, ChevronLeft, ChevronRight, X, Sparkles } from 'lucide-react';

export const PresentationToolbar: React.FC = () => {
  const presentationActive = useCampusStore((s) => s.presentationActive);
  const presentationIndex = useCampusStore((s) => s.presentationIndex);
  const presentationPlaying = useCampusStore((s) => s.presentationPlaying);
  const togglePresentation = useCampusStore((s) => s.togglePresentation);
  const nextPresentationStep = useCampusStore((s) => s.nextPresentationStep);
  const prevPresentationStep = useCampusStore((s) => s.prevPresentationStep);

  // Keyboard navigation for presentation stops (unconditional hook)
  React.useEffect(() => {
    if (!presentationActive) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        e.preventDefault();
        nextPresentationStep();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevPresentationStep();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [presentationActive, nextPresentationStep, prevPresentationStep]);

  if (!presentationActive) return null;

  const currentStop = presentationWaypoints[presentationIndex];

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 'clamp(8px, 2vh, 16px)',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        width: 'min(94%, 620px)',
        pointerEvents: 'auto',
        maxHeight: 'calc(100vh - 80px)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div
        className="glass-panel-elevated"
        style={{
          padding: '12px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          border: '1px solid var(--brand-cyan)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          background: 'rgba(15, 23, 42, 0.90)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
            <Sparkles size={15} className="text-cyan" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--brand-cyan)', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Architectural Presentation Showcase (Stop {presentationIndex + 1} of {presentationWaypoints.length})
            </span>
          </div>

          <button
            id="presentation-exit-btn"
            onClick={togglePresentation}
            className="glass-btn glass-btn-danger"
            style={{ padding: '3px 9px', fontSize: '0.72rem', flexShrink: 0 }}
          >
            <X size={13} /> Exit Presentation
          </button>
        </div>

        <div>
          <h3 style={{ fontSize: '1.0rem', fontWeight: 700, marginBottom: '2px', color: '#f8fafc' }}>
            {currentStop.title}
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.35', margin: 0 }}>
            {currentStop.subtitle}
          </p>
        </div>

        {/* Presenter Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px', marginTop: '2px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button id="presentation-prev-btn" onClick={prevPresentationStep} className="glass-btn" style={{ padding: '5px 12px', fontSize: '0.8rem' }}>
              <ChevronLeft size={15} /> Prev Stop
            </button>
            <button id="presentation-next-btn" onClick={nextPresentationStep} className="glass-btn glass-btn-primary" style={{ padding: '5px 12px', fontSize: '0.8rem' }}>
              Next Stop <ChevronRight size={15} />
            </button>
          </div>

          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Use Left / Right arrows to fly
          </div>
        </div>
      </div>
    </div>
  );
};

