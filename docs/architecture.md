# St. Paul's Digital Twin — Technical Architecture & Engine Design

> **Document Version:** 1.0.0  
> **Target Audience:** Engineering evaluators, faculty reviewers, and technical maintainers.

---

## 1. Architectural Philosophy & Engine Stack

The **St. Paul's Digital Twin** is engineered as a zero-cloud, client-side, browser-based architectural digital twin built with:
- **Framework:** React 18 + TypeScript + Vite
- **3D Graphics Engine:** Three.js via React Three Fiber (R3F) and Drei
- **State Architecture:** Zustand (modular, decoupled global state for visitor position, physical location, active route, offline status, and accessibility)
- **Offline / PWA Engine:** Vite PWA + Workbox Service Worker caching all procedural shaders, canvas-generated PBR textures, route graph nodes, and geometry manifests
- **Styling & HUD Design System:** Vanilla CSS with custom property tokens (`Outfit`, `JetBrains Mono`, glassmorphism, cyan/amber accent palette)

---

## 2. Spatial Coordinate System & Alignment

```text
                                  +Z (Rear of Campus / North)
                                               ▲
                                               │
               ST. PAUL'S ANNEXURE             │            ST. PAUL'S MAIN BLOCK
            ┌───────────────────────┐          │          ┌───────────────────────┐
            │ LH3 / Restroom (End)  │          │          │ 406 - 410 / Restrooms │
            │                       │          │          │                       │
            │ Lecture Hall 2 (120)  │          │          │ Central Labs / Core   │
            │                       │   GAP    │          │ (CSS/Web3/Vision)     │
            │ Lecture Hall 1 (120)  │ (12m W)  │          │                       │
            │                       │          │          │ Courtyards (4 Voids)  │
            │ 1F/2F Bridges ────────┼──────────┼──────────┼── 1F/2F Bridge Portal │
            │                       │          │          │                       │
            │ Dean's Cabin / Foyer  │ (Blocked)│          │ 401 - 415 / Entrance  │
            └───────────────────────┘          │          └───────────┬───────────┘
               [X: -32 to -12]                 │                      │ "ST. PAUL'S BLOCK"
                                               │                      ▼ [Main Entrance]
   -X (West / Left) ◄──────────────────────────┼──────────────────────────► +X (East / Right)
                                               │
                                 VISITOR SPAWN POINT: [17.5, 1.7, -18]
                                 (Facing into Main Block towards +Z)
                                               │
                                               ▼
                                  -Z (Exterior Road & Forecourt)
```

### Proportional Coordinate Anchors
- **Ground Elevation:** $Y = 0.0\text{ m}$ (Walk height $Y = 1.7\text{ m}$)
- **First Floor:** $Y = 4.0\text{ m}$ (Clear ceiling $3.5\text{ m}$, slab $0.3\text{ m}$)
- **Second Floor:** $Y = 8.0\text{ m}$
- **Third Floor:** $Y = 12.0\text{ m}$
- **Roof Parapet:** $Y = 16.0\text{ m}$
- **Main Block:** Origin $X = 0, Z = -8$. Width = 42 m, Depth = 48 m.
- **Annexure Block:** Origin $X = -32, Z = -8$. Width = 20 m, Depth = 52 m.
- **Separation Gap:** 12 m width ($X \in [-12, 0]$).

---

## 3. Physical Walk & Collision System

The visitor navigation controller enforces physical indoor constraints:
1. **Ground-Level Gap:** Impassable. At ground level ($Y < 2.5\text{ m}$), $X \in [-12, 0]$ is blocked with a continuous physical barrier.
2. **Bridge Traversals:** Permitted solely at $Y = 4.0\text{ m}$ (1st Floor) and $Y = 8.0\text{ m}$ (2nd Floor). Width is constrained to the 3.0 m walkway ($Z \in [0.2, 2.8]$). Bridges are uncovered with metal safety railings.
3. **Courtyard Voids:** All 4 light wells in Main and 1 in Annexure are true open-to-sky vertical shafts. Floor slabs are omitted, and 1.2 m concrete parapets surround the perimeter with collision barriers.
4. **Staircases:** Multi-flight stairs smoothly adjust the visitor's vertical eye position as they traverse stair landings.
5. **Automated Doors:** Smooth pivot rotation triggered by a 2.5 m proximity radius, with auto-close when the player moves away.

---

## 4. Route Calculation Engine

Indoor route planning is executed by `route-engine.ts`:
- **Graph Topology:** Configured corridor centerlines, stair junctions, bridge portals, and room thresholds.
- **Algorithm:** Dijkstra shortest-path with vertical floor transition penalties.
- **Real-Time Guidance:** Yields exact distance in meters, walking time (at 1.4 m/s average pace), floors traversed, and natural-language turn-by-turn steps.
- **Rerouting:** Continuous deviation monitoring and dynamic recalibration.

---

## 5. Rendering & Instancing Performance

- **Standardized Labs:** 6 laboratories $\times$ 180 computers = 1,080 computers and 3,240 chassis/monitor objects. Rendered using `THREE.InstancedMesh` to execute in a single draw call.
- **Procedural PBR Textures:** Vitrified ceramic tiles, asphalt road, and striped curbs are generated via HTML5 2D Canvas buffers, avoiding external network round-trips and ensuring 100% offline availability.
- **Quality Scaling:** Automatic device pixel ratio throttling ($0.8\times$ on Low, $1.0\times$ on Medium/High, $2.0\times$ on Ultra) and dynamic shadow map resolutions (512 to 2048).
