import React, { useEffect, useState } from 'react';
import { CampusScene } from './scene/CampusScene';
import { CampusHUD } from './components/hud/CampusHUD';
import { validateCampusData } from './config/validation';

export const App: React.FC = () => {
  const [webGLSupported, setWebGLSupported] = useState(true);

  useEffect(() => {
    // Run automated data model & integrity checks
    const validation = validateCampusData();
    console.log(
      `[St. Paul's Twin Validation] Model Status: ${validation.isValid ? 'PASSED' : 'ISSUES DETECTED'}`
    );
    if (validation.issues.length > 0) {
      console.warn('[Validation Findings]:', validation.issues);
    }

    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGLSupported(false);
      }
    } catch (e) {
      setWebGLSupported(false);
    }
  }, []);

  if (!webGLSupported) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          textAlign: 'center',
          background: '#07090e',
          color: '#f8fafc'
        }}
      >
        <h1 style={{ fontSize: '1.8rem', color: '#ef4444', marginBottom: '12px' }}>
          WebGL Acceleration Not Detected
        </h1>
        <p style={{ maxWidth: '480px', color: '#94a3b8', lineHeight: '1.5' }}>
          St. Paul's Digital Twin requires WebGL hardware acceleration to render the 3D campus environment.
          Please ensure hardware acceleration is enabled in your browser settings.
        </p>
      </div>
    );
  }

  return (
    <main style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <CampusScene />
      <CampusHUD />
    </main>
  );
};

export default App;
