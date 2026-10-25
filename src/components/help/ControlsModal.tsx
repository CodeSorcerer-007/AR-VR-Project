import React from 'react';
import { useCampusStore } from '../../store/useCampusStore';
import { X, Keyboard, MousePointer, HelpCircle } from 'lucide-react';

interface ControlsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ControlsModal: React.FC<ControlsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const controlRows = [
    { key: 'W / A / S / D', desc: 'Walk forward, backward, strafe left and right' },
    { key: 'Arrow Keys', desc: 'Alternative walking navigation controls' },
    { key: 'Shift (Hold)', desc: 'Sprint / accelerated walking pace' },
    { key: 'Mouse Look', desc: 'Click scene to lock pointer and look around freely' },
    { key: 'Escape', desc: 'Release mouse look pointer-lock and close dialogs' },
    { key: 'Cmd+K or /', desc: 'Open Destination Search command palette' },
    { key: 'M', desc: 'Open 2D Architectural Floor Plan Viewer' },
    { key: 'X', desc: 'Toggle 3D Exploded / Stacked-Floor architectural view' },
    { key: '1 / 2 / 3', desc: 'Switch camera: 1=First-Person, 2=Third-Person, 3=Orbit' },
    { key: 'P', desc: 'Toggle Curated Presentation Showcase Tour' },
    { key: 'R', desc: 'Reset visitor position to St. Paul’s Main Entrance' }
  ];

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
          maxWidth: '540px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Keyboard size={20} className="text-cyan" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              Visitor Controls & Keyboard Navigation
            </h2>
          </div>
          <button onClick={onClose} className="glass-btn" style={{ padding: '6px' }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '60vh', overflowY: 'auto' }}>
          {controlRows.map((row, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                background: 'rgba(255, 255, 255, 0.04)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.85rem'
              }}
            >
              <kbd
                style={{
                  padding: '3px 8px',
                  background: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid var(--border-focus)',
                  borderRadius: 'var(--radius-sm)',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--brand-cyan)',
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}
              >
                {row.key}
              </kbd>
              <span style={{ color: 'var(--text-secondary)' }}>{row.desc}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
          <button onClick={onClose} className="glass-btn glass-btn-primary">
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
