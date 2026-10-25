import React, { useEffect, useState } from 'react';
import { useCampusStore } from '../../store/useCampusStore';
import { Wifi, WifiOff, Download, CheckCircle2, HardDrive, Trash2, X } from 'lucide-react';

interface OfflineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OfflinePackageManager: React.FC<OfflineModalProps> = ({ isOpen, onClose }) => {
  const offlineReady = useCampusStore((s) => s.offlineReady);
  const downloadingPackage = useCampusStore((s) => s.downloadingPackage);
  const downloadProgress = useCampusStore((s) => s.downloadProgress);
  const downloadedBytes = useCampusStore((s) => s.downloadedBytes);
  const totalPackageBytes = useCampusStore((s) => s.totalPackageBytes);
  const downloadCompleteCampusPackage = useCampusStore((s) => s.downloadCompleteCampusPackage);
  const clearDownloadedPackage = useCampusStore((s) => s.clearDownloadedPackage);

  const [storageEstimate, setStorageEstimate] = useState<{ usage: number; quota: number } | null>(null);

  useEffect(() => {
    if (navigator.storage && navigator.storage.estimate) {
      navigator.storage.estimate().then((est) => {
        setStorageEstimate({
          usage: est.usage || 0,
          quota: est.quota || 0
        });
      });
    }
  }, [downloadProgress, offlineReady]);

  if (!isOpen) return null;

  const mbDownloaded = (downloadedBytes / (1024 * 1024)).toFixed(1);
  const mbTotal = (totalPackageBytes / (1024 * 1024)).toFixed(1);
  const storageUsageMB = storageEstimate ? (storageEstimate.usage / (1024 * 1024)).toFixed(1) : '48.5';
  const storageQuotaMB = storageEstimate ? (storageEstimate.quota / (1024 * 1024 * 1024)).toFixed(1) : '20.0';

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
            <HardDrive size={20} className="text-cyan" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              Campus Offline Asset Package
            </h2>
          </div>
          <button onClick={onClose} className="glass-btn" style={{ padding: '6px' }}>
            <X size={16} />
          </button>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
          Download all procedural textures, room data models, navigation graph nodes, and 3D architectural caches to explore the entire St. Paul's campus offline without internet connection.
        </p>

        {/* Status Card */}
        <div
          className="glass-panel"
          style={{
            padding: '16px',
            borderLeft: offlineReady ? '4px solid var(--brand-emerald)' : '4px solid var(--brand-amber)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
              {offlineReady ? 'Campus Package Cached & Verified' : 'Campus Package Not Cached'}
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: offlineReady ? 'var(--brand-emerald)' : 'var(--brand-amber)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              {offlineReady ? <WifiOff size={14} /> : <Wifi size={14} />}
              {offlineReady ? 'Ready for Offline Use' : 'Online Connection Active'}
            </span>
          </div>

          {/* Progress Bar */}
          <div
            style={{
              width: '100%',
              height: '8px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden',
              margin: '12px 0 8px 0'
            }}
          >
            <div
              style={{
                width: `${downloadProgress}%`,
                height: '100%',
                background: offlineReady
                  ? 'linear-gradient(90deg, #10b981, #059669)'
                  : 'linear-gradient(90deg, #38bdf8, #0ea5e9)',
                transition: 'width 0.3s ease-out'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>Progress: {downloadProgress}%</span>
            <span>{mbDownloaded} MB / {mbTotal} MB</span>
          </div>
        </div>

        {/* Device Storage Status */}
        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
          <span>Local Browser Storage Used: <strong>{storageUsageMB} MB</strong></span>
          <span>Device Quota: <strong>{storageQuotaMB} GB</strong></span>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
          {offlineReady ? (
            <button
              onClick={clearDownloadedPackage}
              className="glass-btn glass-btn-danger"
            >
              <Trash2 size={16} /> Delete Offline Cache
            </button>
          ) : (
            <button
              onClick={downloadCompleteCampusPackage}
              disabled={downloadingPackage}
              className="glass-btn glass-btn-primary"
            >
              <Download size={16} /> {downloadingPackage ? 'Caching Assets...' : 'Download Campus Package (48.5 MB)'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
