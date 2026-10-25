# St. Paul's Digital Twin — Offline Architecture & PWA Package Guide

> **Requirement:** The core experience and complete campus walkthrough must function 100% offline once downloaded, requiring zero external server, API, or CDN round-trips.

---

## 1. Zero-Cloud / Offline-First Design

The entire St. Paul's Digital Twin application is engineered to eliminate external runtime dependencies:
- **No Hosted 3D Models:** All architecture, walls, slabs, windows, doors, stairs, and bridges are procedurally generated from parametric mathematical configurations.
- **No External CDN Textures:** Vitrified ceramic tiles, asphalt road textures, and security window grills are procedurally synthesized directly onto in-memory HTML5 Canvas buffers.
- **No Remote Font/Icon Dependencies:** Uses local fallbacks and self-contained SVG icon paths via `lucide-react`.
- **No Hosted AI / Backend APIs:** Spatial route planning (Dijkstra algorithm) and room searches execute purely in client-side TypeScript.

---

## 2. Complete Campus Package Download Manager

Accessed via the HardDrive icon in the top header:
1. **Download Trigger:** Users can click **"Download Campus Package (48.5 MB)"**.
2. **Progressive Caching:** Caches the complete manifest of JavaScript bundles, CSS stylesheets, HTML shell, and procedural geometry templates into browser CacheStorage.
3. **Storage Quota:** Uses `navigator.storage.estimate()` to inspect available device storage and ensure sufficient capacity.
4. **Verification Gate:** Offline readiness is set only after all required assets have been validated.
5. **Offline Indicator:** A badge in the header displays `"Ready for Offline Use"` once complete.
6. **Cache Deletion:** Users can delete the offline cache at any time to free device storage.

---

## 3. Testing Offline Resilience

To verify offline operation:
1. Open the application and click the **HardDrive icon** in the top navigation bar.
2. Click **"Download Campus Package"** and wait for verification (reaches 100%).
3. Open DevTools (`F12`), navigate to the **Network** tab, and set throttling to **"Offline"**.
4. Reload the page (`Ctrl + R` or `F5`).
5. Confirm that the application loads smoothly, the 3D scene renders, first-person navigation functions, and the destination route finder works without network errors.
