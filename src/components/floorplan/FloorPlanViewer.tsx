import React, { useState } from 'react';
import { useCampusStore } from '../../store/useCampusStore';
import { getRoomsByFloor, bridgeLinks, courtyards, staircases } from '../../config/campus-data';
import { BuildingBlock, FloorLevel, RoomMetadata } from '../../types/campus';
import { X, ZoomIn, ZoomOut, RotateCcw, MapPin, Navigation, Info } from 'lucide-react';

export const FloorPlanViewer: React.FC = () => {
  const floorPlanOpen = useCampusStore((s) => s.floorPlanOpen);
  const setFloorPlanOpen = useCampusStore((s) => s.setFloorPlanOpen);
  const viewBlock = useCampusStore((s) => s.floorPlanViewBlock);
  const viewFloor = useCampusStore((s) => s.floorPlanViewFloor);
  const setFloorPlanView = useCampusStore((s) => s.setFloorPlanView);
  const visitorPosition = useCampusStore((s) => s.visitorPosition);
  const visitorRotation = useCampusStore((s) => s.visitorRotation);
  const currentFloor = useCampusStore((s) => s.currentFloor);
  const currentBlock = useCampusStore((s) => s.currentBlock);
  const selectDestination = useCampusStore((s) => s.selectDestination);
  const activeRoute = useCampusStore((s) => s.activeRoute);

  const [zoom, setZoom] = useState(1.0);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && floorPlanOpen) {
        setFloorPlanOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [floorPlanOpen, setFloorPlanOpen]);

  if (!floorPlanOpen) return null;

  const rooms = getRoomsByFloor(viewBlock, viewFloor);

  // SVG coordinate transformation:
  // Main Block: X in [-21, +21], Z in [-8, 40]
  // Annexure Block: X in [-53, -33], Z in [-8, 44]
  // Bridge spans X: [-33, -21] at Z: [0, 3]
  const isMain = viewBlock === 'main';
  const viewBox = isMain ? '-36 -12 61 56' : '-56 -12 36 60';

  // Visitor marker position in SVG coordinates
  const isVisitorOnCurrentFloorPlan = currentBlock === viewBlock && currentFloor === viewFloor;
  const vx = visitorPosition[0];
  const vz = visitorPosition[2];
  const vAngle = (visitorRotation[1] * 180) / Math.PI + 180;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 95,
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}
      onClick={() => setFloorPlanOpen(false)}
    >
      <div
        className="glass-panel-elevated"
        style={{
          width: '100%',
          maxWidth: '900px',
          height: '85vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              Campus Architectural Floor Plans
            </h2>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Source-faithful architectural transcription • Inspection preview only (does not teleport visitor)
            </div>
          </div>
          <button onClick={() => setFloorPlanOpen(false)} className="glass-btn" style={{ padding: '6px' }}>
            <X size={18} />
          </button>
        </div>

        {/* Tab Controls: Block Selector & Floor Selector */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            padding: '12px 20px',
            background: 'rgba(0, 0, 0, 0.3)',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          {/* Block Selector */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setFloorPlanView('main', viewFloor)}
              className={`glass-btn ${viewBlock === 'main' ? 'active' : ''}`}
            >
              St. Paul's Main Block
            </button>
            <button
              onClick={() => setFloorPlanView('annexure', viewFloor)}
              className={`glass-btn ${viewBlock === 'annexure' ? 'active' : ''}`}
            >
              St. Paul's Annexure
            </button>
          </div>

          {/* Floor Level Selector */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {(['ground', 'first', 'second', 'third'] as FloorLevel[]).map((fl) => (
              <button
                key={fl}
                onClick={() => setFloorPlanView(viewBlock, fl)}
                className={`glass-btn ${viewFloor === fl ? 'active' : ''}`}
                style={{ textTransform: 'capitalize' }}
              >
                {fl}
              </button>
            ))}
          </div>

          {/* Zoom Controls */}
          <div style={{ display: 'flex', gap: '4px' }}>
            <button onClick={() => setZoom((z) => Math.min(z + 0.2, 2.5))} className="glass-btn" style={{ padding: '6px' }}>
              <ZoomIn size={16} />
            </button>
            <button onClick={() => setZoom((z) => Math.max(z - 0.2, 0.6))} className="glass-btn" style={{ padding: '6px' }}>
              <ZoomOut size={16} />
            </button>
            <button onClick={() => setZoom(1.0)} className="glass-btn" style={{ padding: '6px' }}>
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

        {/* 2D Architectural Vector Canvas */}
        <div
          style={{
            flex: 1,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#090d16',
            position: 'relative'
          }}
        >
          <svg
            viewBox={viewBox}
            style={{
              width: '100%',
              height: '100%',
              transform: `scale(${zoom})`,
              transformOrigin: 'center center',
              transition: 'transform 0.15s ease-out'
            }}
          >
            {/* SVG Hatching Pattern for Courtyard Voids */}
            <defs>
              <pattern id="hatch-courtyard" width="2" height="2" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="2" stroke="#475569" strokeWidth="0.4" />
              </pattern>
            </defs>

            {/* Background Floor Boundary */}
            {isMain ? (
              <rect x="-21" y="-8" width="42" height="48" fill="#131b2e" stroke="#334155" strokeWidth="0.6" rx="1" />
            ) : (
              <rect x="-53" y="-8" width="20" height="52" fill="#131b2e" stroke="#334155" strokeWidth="0.6" rx="1" />
            )}

            {/* Courtyard Voids (Open-to-sky hatched areas) */}
            {courtyards
              .filter((c) => c.block === viewBlock)
              .map((c) => {
                const cx = c.position[0];
                const cz = c.position[2];
                const [w, , d] = c.dimensions;
                return (
                  <g key={c.id}>
                    <rect
                      x={cx - w / 2}
                      y={cz - d / 2}
                      width={w}
                      height={d}
                      fill="url(#hatch-courtyard)"
                      stroke="#64748b"
                      strokeWidth="0.5"
                    />
                    <text
                      x={cx}
                      y={cz}
                      fontSize="1.2"
                      fill="#94a3b8"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontFamily="sans-serif"
                    >
                      OPEN COURTYARD
                    </text>
                  </g>
                );
              })}

            {/* Bridges indicator (1F & 2F) */}
            {(viewFloor === 'first' || viewFloor === 'second') && (
              <g>
                <rect
                  x="-33"
                  y="0"
                  width="12"
                  height="3"
                  fill="none"
                  stroke="var(--brand-amber)"
                  strokeWidth="0.8"
                  strokeDasharray="1 1"
                />
                <text
                  x="-27"
                  y="1.8"
                  fontSize="0.9"
                  fill="var(--brand-amber)"
                  textAnchor="middle"
                  fontFamily="sans-serif"
                  fontWeight="bold"
                >
                  BRIDGE ({viewFloor.toUpperCase()})
                </text>
              </g>
            )}

            {/* Rooms Outlines and Labels */}
            {rooms.map((room) => {
              const rx = room.position[0];
              const rz = room.position[2];
              const [rw, , rd] = room.dimensions;
              const x = rx - rw / 2;
              const y = rz - rd / 2;

              let fillColor = 'rgba(30, 41, 59, 0.7)';
              if (room.category === 'lab') fillColor = 'rgba(14, 165, 233, 0.15)';
              else if (room.category === 'lecture_hall') fillColor = 'rgba(245, 158, 11, 0.15)';
              else if (room.category === 'restroom') fillColor = 'rgba(100, 116, 139, 0.2)';

              return (
                <g
                  key={room.id}
                  onClick={() => selectDestination(room)}
                  style={{ cursor: 'pointer' }}
                >
                  <rect
                    x={x}
                    y={y}
                    width={rw}
                    height={rd}
                    fill={fillColor}
                    stroke="#475569"
                    strokeWidth="0.35"
                    rx="0.5"
                  />
                  <text
                    x={rx}
                    y={rz - 0.5}
                    fontSize={rw > 8 ? '1.4' : '1.1'}
                    fill="#ffffff"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontFamily="sans-serif"
                  >
                    {room.number}
                  </text>
                  <text
                    x={rx}
                    y={rz + 1.2}
                    fontSize={rw > 8 ? '0.9' : '0.7'}
                    fill="#94a3b8"
                    textAnchor="middle"
                    fontFamily="sans-serif"
                  >
                    {room.name.length > 16 ? room.name.substring(0, 14) + '...' : room.name}
                  </text>
                </g>
              );
            })}

            {/* Active Route Path in 2D SVG */}
            {activeRoute && activeRoute.found && (
              <polyline
                points={activeRoute.path
                  .filter(([, py]) => {
                    const fl = py >= 11 ? 'third' : py >= 7 ? 'second' : py >= 3 ? 'first' : 'ground';
                    return fl === viewFloor;
                  })
                  .map(([px, , pz]) => `${px},${pz}`)
                  .join(' ')}
                fill="none"
                stroke="var(--brand-cyan)"
                strokeWidth="0.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="1.2 0.8"
              />
            )}

            {/* Visitor Current Position Marker with Facing Arrow */}
            {isVisitorOnCurrentFloorPlan && (
              <g transform={`translate(${vx}, ${vz}) rotate(${vAngle})`}>
                <circle r="1.2" fill="var(--brand-cyan)" stroke="#ffffff" strokeWidth="0.3" />
                <polygon points="0,-2.2 -0.8,-0.8 0.8,-0.8" fill="#ffffff" />
              </g>
            )}
          </svg>

          {/* Map Legend Footer */}
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '16px',
              right: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              background: 'rgba(10, 15, 29, 0.75)',
              padding: '8px 14px',
              borderRadius: 'var(--radius-sm)',
              backdropFilter: 'blur(6px)'
            }}
          >
            <div style={{ display: 'flex', gap: '14px' }}>
              <span>Click any room to preview route</span>
              <span>•</span>
              <span style={{ color: 'var(--brand-cyan)' }}>Cyan dot: Your Current Location</span>
              <span>•</span>
              <span style={{ color: 'var(--brand-amber)' }}>Yellow: Bridge Connections</span>
            </div>
            <div>
              Viewing: <strong>{viewBlock.toUpperCase()} ({viewFloor.toUpperCase()} FLOOR)</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
