# St. Paul's Digital Twin — 3D Campus Walkthrough

> An architectural digital twin of **St. Paul's Main Block** and **St. Paul's Annexure Block**, featuring physically valid indoor walkthroughs, verified room layouts from supplied floor-plan sketches, open-air bridge connections, standardized laboratories, and offline PWA capability.

---

## 🌟 Key Features

1. **One Coherent, Physically Walkable Campus World:**
   - Both St. Paul's Main Block (4 floors, Rooms 401–462) and St. Paul's Annexure Block (4 floors, Lecture Halls 1–3, Rooms 469–478, and advanced laboratories) exist in a continuous 3D world.
   - Sited proportionally: Main on the right, Annexure on the left when approaching the main entrance.
   - Prominent physical exterior signage reading **"ST. PAUL'S BLOCK"** on Main Block's roofline fascia.
2. **Physically Verified Open-Air Bridges:**
   - **First-Floor Bridge:** Connects Room 418 / FC(3) on Main to Room 469 / FC(14) on Annexure.
   - **Second-Floor Bridge:** Connects Room 434 / FC(6) on Main to Room 474 / FC(15) on Annexure.
   - Strictly open-air (no roof) with concrete walkway slabs and steel safety railings.
   - **Impassable Ground Gap:** No direct path across the ground level between blocks; visitors must use upper-floor bridges.
3. **Open-to-Sky Courtyards:**
   - 4 vertical light wells in Main Block and 1 in Annexure Block, open to the sky through all floors with 1.2m solid concrete parapet walls and collision boundaries.
4. **Standardized Laboratory Setup (180 Computers + 3 Projectors):**
   - High-performance instanced rendering (`InstancedMesh`) in all 6 named labs (CSS Lab, Design Thinking Lab, Machine Vision Lab, Web 3.0 Lab, Gen AI Lab, Quantum Computing Lab).
   - Exactly 3 columns $\times$ 12 rows $\times$ 5 computers = 180 workstations per lab, with 3 ceiling projectors.
5. **Classrooms & Lecture Halls:**
   - 60-capacity standard classrooms with 15 benches (3 cols $\times$ 5 rows $\times$ 4 seats), blackboard, ceiling projector & screen, faculty desk with computer, and ceiling fans.
   - 120-capacity tiered Lecture Halls 1, 2, and 3 in Annexure Block.
   - Project Hub: open collaborative studio without student desks.
   - Concealed Server Room with opaque locked door.
   - Distinct boys restrooms on Annexure 2nd and 3rd floors.
6. **Indoor Route Engine & 2D Architectural Floor Plans:**
   - Dijkstra shortest-path navigation along valid corridors, stairs, and bridges.
   - Interactive 2D architectural floor plans with courtyard hatching, current location marker, and route lines.
   - Command palette search (`Cmd+K` or `/`) and destination previews.
7. **Offline-First / PWA Asset Package:**
   - Client-side procedural textures and geometry.
   - Complete campus package download with storage estimation and offline verification.
8. **Cinematic Intro & Presentation Tour:**
   - Smooth exterior fly-by with skip option.
   - Curated presentation showcase tour with presenter controls.
9. **Accessibility & Quality Presets:**
   - High Contrast Mode, Reduced Motion Mode, Large Text, Navigation Subtitles, Simplified HUD.
   - Low, Medium, High, and Ultra rendering quality presets.

---

## 🚀 Quick Start & Development

### Prerequisites
- Node.js 18+ (tested on Node v24.13.0)
- npm 9+ (tested on npm 11.6.0)

### Installation
```bash
npm install
```

### Run Locally (Development Dev Server)
```bash
npm run dev
```
The application will launch on `http://localhost:5173`.

### Production Build
```bash
npm run build
```
Generates optimized static assets in the `dist/` directory.

### Preview Production Build
```bash
npm run preview
```

---

## 🎮 Visitor Walkthrough Controls

| Input | Action |
|:---|:---|
| `W / A / S / D` or Arrow Keys | Walk through corridors and spaces |
| `Shift` (Hold) | Sprint / fast walking speed |
| **Left Click Canvas** | Enter first-person pointer-lock mouse look |
| `Escape` | Release pointer lock and close modals |
| `1 / 2 / 3` | Switch view: 1=First-Person, 2=Third-Person, 3=Free Orbit |
| `Cmd + K` or `/` | Open Destination Search Command Palette |
| `M` | Open 2D Architectural Floor Plan Viewer |
| `X` | Toggle 3D Stacked / Exploded Floor Inspection Mode |
| `P` | Launch Curated Presentation Showcase Tour |
| `R` | Reset visitor position to St. Paul's Main Entrance |
| `?` | View on-screen controls help dialog |

---

## 📁 Repository Structure

```text
├── docs/
│   ├── source-review.md    # Source evidence extracted from supplied sketches and photos
│   ├── assumptions.md      # Parametric architectural dimensions & estimates
│   ├── architecture.md     # Technical system architecture and engine specifications
│   ├── controls.md         # Visitor controls and keyboard navigation manual
│   ├── offline.md          # PWA caching and offline package verification guide
│   └── testing.md          # Automated data integrity and route tests
├── public/
│   ├── sw.js               # Service Worker for offline asset caching
│   └── manifest.webmanifest# PWA web application manifest
├── src/
│   ├── components/         # UI & HUD Components (Search, Floor Plans, Modals)
│   ├── config/             # Floor-by-floor room data & validation checks
│   │   ├── floors/         # Main (G, 1, 2, 3) and Annexure (G, 1, 2, 3) configs
│   │   ├── campus-data.ts  # Master catalog, bridges, stairs, courtyards
│   │   └── validation.ts   # Automated integrity & constraint validation suite
│   ├── features/           # Navigation route engine & walk physics
│   ├── scene/              # 3D Scene components, procedural materials & instancing
│   ├── store/              # Zustand global application state
│   ├── styles/             # Design tokens & glassmorphism CSS
│   ├── App.tsx             # Main application container
│   └── main.tsx            # Application entry point
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🔍 Validation Suite

At runtime and build time, `src/config/validation.ts` automatically asserts all critical constraints:
- Zero duplicate room IDs or numbers
- Bridge endpoints, levels, and strictly roofless construction
- Impassable ground-level gap
- Standardized 180-computer setup in all 6 laboratories
- Separate boys restrooms on Annexure 2F and 3F
- Concealed Server Room interior with opaque secured door
- All vertical open-to-sky courtyards preserved through 4 levels
