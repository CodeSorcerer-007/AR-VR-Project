import React, { useState } from 'react';
import { useCampusStore } from '../../store/useCampusStore';
import { allRooms } from '../../config/campus-data';
import { RoomMetadata } from '../../types/campus';
import { X, Columns, CheckCircle2, AlertCircle, Laptop, Users, Building } from 'lucide-react';

export const ComparisonModal: React.FC = () => {
  const comparisonModalOpen = useCampusStore((s) => s.comparisonModalOpen);
  const setComparisonModalOpen = useCampusStore((s) => s.setComparisonModalOpen);
  const comparisonRooms = useCampusStore((s) => s.comparisonRooms);
  const setComparisonRoom = useCampusStore((s) => s.setComparisonRoom);
  const selectDestination = useCampusStore((s) => s.selectDestination);

  const roomA = comparisonRooms[0] || allRooms[0];
  const roomB = comparisonRooms[1] || allRooms[1];

  if (!comparisonModalOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 95,
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}
      onClick={() => setComparisonModalOpen(false)}
    >
      <div
        className="glass-panel-elevated"
        style={{
          width: '100%',
          maxWidth: '850px',
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
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Columns size={18} className="text-cyan" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              Side-by-Side Room Specification Comparison
            </h2>
          </div>
          <button onClick={() => setComparisonModalOpen(false)} className="glass-btn" style={{ padding: '6px' }}>
            <X size={18} />
          </button>
        </div>

        {/* Room Selectors */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            padding: '12px 20px',
            background: 'rgba(0, 0, 0, 0.25)',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              Select Room A:
            </label>
            <select
              value={roomA.id}
              onChange={(e) => {
                const r = allRooms.find((x) => x.id === e.target.value) || null;
                setComparisonRoom(0, r);
              }}
              style={{
                width: '100%',
                padding: '8px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: '#ffffff'
              }}
            >
              {allRooms.map((r) => (
                <option key={r.id} value={r.id} style={{ background: '#0f172a' }}>
                  {r.number} — {r.name} ({r.block.toUpperCase()} {r.floor})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              Select Room B:
            </label>
            <select
              value={roomB.id}
              onChange={(e) => {
                const r = allRooms.find((x) => x.id === e.target.value) || null;
                setComparisonRoom(1, r);
              }}
              style={{
                width: '100%',
                padding: '8px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: '#ffffff'
              }}
            >
              {allRooms.map((r) => (
                <option key={r.id} value={r.id} style={{ background: '#0f172a' }}>
                  {r.number} — {r.name} ({r.block.toUpperCase()} {r.floor})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Side-by-Side Comparison Content */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px'
          }}
        >
          {/* Card A */}
          <div className="glass-panel" style={{ padding: '16px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--brand-cyan)', marginBottom: '4px' }}>
              {roomA.number}
            </h3>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '8px' }}>
              {roomA.name}
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: '1.4' }}>
              {roomA.description}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
              <div><strong>Block:</strong> {roomA.block.toUpperCase()}</div>
              <div><strong>Floor:</strong> {roomA.floor.toUpperCase()}</div>
              <div><strong>Category:</strong> {roomA.category.replace('_', ' ').toUpperCase()}</div>
              <div><strong>Seating Capacity:</strong> {roomA.capacity} persons</div>
              <div><strong>Verification:</strong> {roomA.verified ? 'Verified from Source Sketch' : 'Parametrically Inferred'}</div>
              <div><strong>Notes:</strong> {roomA.notes}</div>
            </div>

            <div style={{ marginTop: '14px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>Features & Fixtures:</div>
              <ul style={{ paddingLeft: '18px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {roomA.features.map((f, i) => <li key={i}>{f}</li>)}
              </ul>
            </div>
          </div>

          {/* Card B */}
          <div className="glass-panel" style={{ padding: '16px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--brand-amber)', marginBottom: '4px' }}>
              {roomB.number}
            </h3>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '8px' }}>
              {roomB.name}
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: '1.4' }}>
              {roomB.description}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
              <div><strong>Block:</strong> {roomB.block.toUpperCase()}</div>
              <div><strong>Floor:</strong> {roomB.floor.toUpperCase()}</div>
              <div><strong>Category:</strong> {roomB.category.replace('_', ' ').toUpperCase()}</div>
              <div><strong>Seating Capacity:</strong> {roomB.capacity} persons</div>
              <div><strong>Verification:</strong> {roomB.verified ? 'Verified from Source Sketch' : 'Parametrically Inferred'}</div>
              <div><strong>Notes:</strong> {roomB.notes}</div>
            </div>

            <div style={{ marginTop: '14px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>Features & Fixtures:</div>
              <ul style={{ paddingLeft: '18px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {roomB.features.map((f, i) => <li key={i}>{f}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
