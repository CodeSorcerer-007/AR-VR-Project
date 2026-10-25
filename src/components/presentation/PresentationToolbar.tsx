import React from 'react';
import { useCampusStore } from '../../store/useCampusStore';
import { presentationWaypoints } from '../../features/presentation/CinematicController';
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
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 80,
        width: '92%',
        maxWidth: '680px'
      }}
    >
      <div
        className="glass-panel-elevated"
        style={{
          padding: '16px 22px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          border: '1px solid var(--brand-cyan)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} className="text-cyan" />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--brand-cyan)', textTransform: 'uppercase' }}>
              Architectural Presentation Showcase (Stop {presentationIndex + 1} of {presentationWaypoints.length})
            </span>
          </div>

          <button
            id="presentation-exit-btn"
            onClick={togglePresentation}
            className="glass-btn glass-btn-danger"
            style={{ padding: '4px 10px', fontSize: '0.75rem' }}
          >
            <X size={14} /> Exit Presentation
          </button>
        </div>

        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>
            {currentStop.title}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
            {currentStop.subtitle}
          </p>
        </div>

        {/* Presenter Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button id="presentation-prev-btn" onClick={prevPresentationStep} className="glass-btn" style={{ padding: '6px 12px' }}>
              <ChevronLeft size={16} /> Prev Stop
            </button>
            <button id="presentation-next-btn" onClick={nextPresentationStep} className="glass-btn" style={{ padding: '6px 12px' }}>
              Next Stop <ChevronRight size={16} />
            </button>
          </div>

          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Use Left/Right arrows • Camera flies smoothly
          </div>
        </div>
      </div>
    </div>
  );
};
