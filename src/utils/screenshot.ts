export async function captureScreenshot(hudFree: boolean = true) {
  const canvas = document.querySelector('canvas') as HTMLCanvasElement | null;
  if (!canvas) {
    alert('Canvas element not found for screenshot capture.');
    return;
  }

  // If HUD-free capture requested, temporarily hide HUD overlays
  const hudElement = document.getElementById('campus-hud-overlay');
  if (hudFree && hudElement) {
    hudElement.style.opacity = '0';
    hudElement.style.pointerEvents = 'none';
  }

  // Wait 1 frame for WebGL render buffer to stabilize
  await new Promise((resolve) => requestAnimationFrame(resolve));

  try {
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    link.download = `st-pauls-digital-twin-${timestamp}.png`;
    link.href = dataUrl;
    link.click();
  } catch (err) {
    console.error('Screenshot capture failed:', err);
  } finally {
    if (hudFree && hudElement) {
      hudElement.style.opacity = '1';
      hudElement.style.pointerEvents = 'auto';
    }
  }
}
