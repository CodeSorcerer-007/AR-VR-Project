import React, { useState, useMemo, useEffect } from 'react';
import { useCampusStore } from '../../store/useCampusStore';
import { allRooms } from '../../config/campus-data';
import { RoomCategory, RoomMetadata } from '../../types/campus';
import { Search, X, MapPin, Navigation, BookOpen, Laptop, Users, Building, ShieldAlert } from 'lucide-react';

export const SearchPalette: React.FC = () => {
  const searchOpen = useCampusStore((s) => s.searchOpen);
  const setSearchOpen = useCampusStore((s) => s.setSearchOpen);
  const selectDestination = useCampusStore((s) => s.selectDestination);
  const startNavigation = useCampusStore((s) => s.startNavigation);

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBlock, setSelectedBlock] = useState<string>('all');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(!searchOpen);
      } else if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen, setSearchOpen]);

  const filteredRooms = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allRooms.filter((room) => {
      // Category filter
      if (selectedCategory !== 'all' && room.category !== selectedCategory) return false;
      // Block filter
      if (selectedBlock !== 'all' && room.block !== selectedBlock) return false;
      // Query filter
      if (!q) return true;
      return (
        room.number.toLowerCase().includes(q) ||
        room.name.toLowerCase().includes(q) ||
        room.description.toLowerCase().includes(q) ||
        room.floor.toLowerCase().includes(q) ||
        room.features.some((f) => f.toLowerCase().includes(q))
      );
    });
  }, [query, selectedCategory, selectedBlock]);

  if (!searchOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={() => setSearchOpen(false)}
    >
      <div
        className="glass-panel-elevated"
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Search Input */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          <Search size={20} className="text-cyan" />
          <input
            type="text"
            placeholder="Search room number (e.g. 401, 469), lab name, faculty cabin, floor..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '1rem',
              color: 'var(--text-primary)'
            }}
          />
          <button
            onClick={() => setSearchOpen(false)}
            className="glass-btn"
            style={{ padding: '6px' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Filter Pills */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            padding: '10px 20px',
            background: 'rgba(0, 0, 0, 0.2)',
            overflowX: 'auto',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          {[
            { id: 'all', label: 'All Destinations' },
            { id: 'classroom', label: 'Classrooms' },
            { id: 'lab', label: 'Laboratories' },
            { id: 'lecture_hall', label: 'Lecture Halls' },
            { id: 'staff_cabin', label: 'Staff Cabins' },
            { id: 'office', label: 'Offices' },
            { id: 'restroom', label: 'Restrooms' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`glass-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              style={{ fontSize: '0.75rem', padding: '4px 10px', whiteSpace: 'nowrap' }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px', paddingLeft: '8px' }}>
            Found {filteredRooms.length} destinations
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredRooms.map((room) => (
              <div
                key={room.id}
                className="glass-panel"
                style={{
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  selectDestination(room);
                  setSearchOpen(false);
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(56, 189, 248, 0.1)',
                      border: '1px solid var(--border-focus)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      color: 'var(--brand-cyan)'
                    }}
                  >
                    {room.category === 'lab' ? <Laptop size={20} /> :
                     room.category === 'lecture_hall' ? <Users size={20} /> :
                     room.category === 'office' ? <Building size={20} /> :
                     room.number.substring(0, 4)}
                  </div>

                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                      {room.number} — {room.name}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      Block: <span style={{ textTransform: 'capitalize', color: 'var(--text-primary)' }}>{room.block}</span> • Floor: <span style={{ textTransform: 'capitalize', color: 'var(--text-primary)' }}>{room.floor}</span> • Capacity: <strong>{room.capacity}</strong>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startNavigation(room);
                    }}
                    className="glass-btn glass-btn-primary"
                    style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                  >
                    <Navigation size={14} /> Navigate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
