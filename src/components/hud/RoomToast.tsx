import React from 'react';
import { useCampusStore } from '../../store/useCampusStore';
import { MapPin, Info } from 'lucide-react';

export const RoomToast: React.FC = () => {
  const contextualRoomToast = useCampusStore((s) => s.contextualRoomToast);
  const selectDestination = useCampusStore((s) => s.selectDestination);

  if (!contextualRoomToast) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: '80px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 40,
        pointerEvents: 'auto',
        animation: 'fadeInDown 0.3s ease-out'
      }}
    >
      <div
        className="glass-panel"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '10px 18px',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--brand-cyan)'
        }}
      >
        <MapPin size={16} className="text-cyan" />
        <div style={{ fontSize: '0.875rem' }}>
          <span style={{ fontWeight: 600, color: '#ffffff' }}>
            {contextualRoomToast.number}
          </span>
          <span style={{ color: 'var(--text-secondary)', margin: '0 8px' }}>•</span>
          <span style={{ color: 'var(--text-primary)' }}>
            {contextualRoomToast.name}
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginLeft: '8px' }}>
            ({contextualRoomToast.block.toUpperCase()} • {contextualRoomToast.floor.toUpperCase()})
          </span>
        </div>
        <button
          onClick={() => selectDestination(contextualRoomToast)}
          className="glass-btn"
          style={{ padding: '2px 8px', fontSize: '0.75rem', borderRadius: 'var(--radius-full)' }}
          title="Inspect details"
        >
          <Info size={12} /> Details
        </button>
      </div>
    </div>
  );
};
