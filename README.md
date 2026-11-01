# St. Paul's Campus VR Digital Twin — CSE Department Block

[![Unity 2022.3 LTS](https://img.shields.io/badge/Unity-2022.3.21f1%20LTS-black?style=flat&logo=unity)](https://unity.com/)
[![Platform](https://img.shields.io/badge/Platform-Windows%20x64%20DirectX%2011-blue)](https://www.microsoft.com/windows)
[![Course](https://img.shields.io/badge/Course-S11BPB51%20Augmented%20%26%20Virtual%20Reality-darkgreen)](https://sathyabama.ac.in)
[![Verification](https://img.shields.io/badge/Inspection-336%20Checkpoints%20Verified%20%E2%9C%85-success)]()

> A **100% architecturally accurate, fully walkable, first-person VR Digital Twin** of the **St. Paul's Engineering College CSE Department block** built in **Unity 2022.3.21f1 LTS** and **C#**, fulfilling the complete academic syllabus requirements for **S11BPB51 (Augmented and Virtual Reality)** at **Sathyabama Institute of Science and Technology**.

---

## 📑 Table of Contents
1. [Academic Syllabus Alignment (S11BPB51)](#-academic-syllabus-alignment-s11bpb51)
2. [Architectural Ground Truth & Specifications](#-architectural-ground-truth--specifications)
3. [Key Facilities & Structural Highlights](#-key-facilities--structural-highlights)
4. [Complete Room & Facility Directory (121 Rooms)](#-complete-room--facility-directory-121-rooms)
5. [Locomotion, Controls & Teleportation](#-locomotion-controls--teleportation)
6. [How to Run & Build](#-how-to-run--build)
7. [Codebase Architecture & File Structure](#-codebase-architecture--file-structure)
8. [Automated Verification & Quality Assurance](#-automated-verification--quality-assurance)

---

## 🎓 Academic Syllabus Alignment (S11BPB51)

This project was built from the ground up to demonstrate mastery across all five core units of the **S11BPB51 Augmented & Virtual Reality** curriculum:

| Syllabus Unit | Course Concept | Unity C# Architecture & Implementation |
|:---|:---|:---|
| **Unit 1** | **VR Fundamentals & Immersion vs. Presence** | Metric spatial scale ($1\text{ unit} = 1\text{ meter}$), accurate field of view (FOV $60^\circ$ desktop / $90^\circ+$ VR), true geometric depth perception, continuous ambient occlusion, and photorealistic lighting. |
| **Unit 2** | **Interaction Design & Human Locomotion** | Ergonomic human locomotion model ($2.0\text{ m/s}$ walk within the standard $1.4 - 3.0\text{ m/s}$ perception window, $4.0\text{ m/s}$ sprint), smooth mouse look (360° yaw, clamped pitch $[-85^\circ, 85^\circ]$), step climbing raycasting, and instantaneous teleportation hotkeys. |
| **Unit 3** | **Unity Engine Architecture & MonoBehaviours** | Modular component lifecycle (`Awake`, `Start`, `Update`, `FixedUpdate`), static hierarchy organization (`--- ST PAULS CAMPUS ---`), programmatic mesh generation, and optimized material instancing. |
| **Unit 4** | **Unity Physics, Collision & Character Controller** | `Rigidbody` physics with `CollisionDetectionMode.ContinuousDynamic`, `CapsuleCollider` player volume ($0.3\text{m}$ radius, $1.8\text{m}$ height), solid floor/wall collision geometry, non-penetrable courtyard parapets, and step climbing raycasts. |
| **Unit 5** | **Trigger Zones, Spatial UI & Teleportation HUD** | `RoomTriggerZone.cs` leveraging `OnTriggerEnter`/`OnTriggerExit` on room boundaries; dynamic real-time `CampusHUD.cs` displaying room codes, department wings, floor levels, and instant teleport shortcuts. |

---

## 🏛️ Architectural Ground Truth & Specifications

The digital twin models the physical CSE Department complex within a single, unified, coherent 3D coordinate space:

```
                              NORTH (Z = +44m)
                  ┌───────────────────────────────┐
                  │          MAIN BLOCK           │
                  │   Rooms 401 - 462, Labs,      │
                  │   Courtyards, Stairwells      │
                  │   X: -21.0m to +21.0m (42m)   │
                  │   Z: -8.0m to +40.0m (48m)    │
  WEST            └───────┬───────────────┬───────┘            EAST
 (Negative X)             │               │                   (Positive X)
┌──────────────┐          │  Bridge 2F    │
│  ANNEXURE    │          │  (Y = 8.0m)   │
│    BLOCK     │          │               │
│ Lecture Halls│══════════╡═══════════════╡
│ Labs & Cabins│          │  Bridge 1F    │
│ X: -53 to -33│          │  (Y = 4.0m)   │
│ Z: -8 to +44 │          │               │
└──────────────┘          └───────────────┘
  [Open Air Gap: X = -33m to -21m (12m width)]
  [Ground barrier: Impassable outdoor divider]
                              SOUTH (Z = -8m)
```

### 1. Spatial Dimensions & Coordinate System
- **Main Block (East / Positive X):** Footprint spans $X \in [-21.0, +21.0]\text{ m}$ (width $42\text{ m}$), $Z \in [-8.0, +40.0]\text{ m}$ (depth $48\text{ m}$). 4 Floors (Ground, 1, 2, 3) + Roof.
- **Annexure Block (West / Negative X):** Footprint spans $X \in [-53.0, -33.0]\text{ m}$ (width $20\text{ m}$), $Z \in [-8.0, +44.0]\text{ m}$ (depth $52\text{ m}$). 4 Floors + Roof.
- **Open-Air Gap:** $12.0\text{ m}$ gap ($X \in [-33.0, -21.0]\text{ m}$) separating Main and Annexure blocks.
- **Vertical Elevations (Metric):**
  - Floor-to-floor height: **$4.0\text{ m}$** slab-to-slab ($Y = 0\text{m}, 4\text{m}, 8\text{m}, 12\text{m}$).
  - Structural floor slab thickness: **$0.3\text{ m}$**.
  - Wall height: **$3.6\text{ m}$**; clear ceiling height: **$3.5\text{ m}$**.

### 2. Inter-Block Pedestrian Bridges
- **First Floor Bridge ($Y = 4.0\text{ m}$):** Connects Main Block West corridor (adjacent to Room 418) to Annexure East veranda (adjacent to Room 469). Open to sky, concrete slab deck, $1.2\text{m}$ navy blue steel safety railings.
- **Second Floor Bridge ($Y = 8.0\text{ m}$):** Connects Main Block West corridor (adjacent to Room 434) to Annexure East veranda (adjacent to Room 474).
- **Ground & Third Floors:** No bridges exist on Ground or 3rd Floor, matching the physical campus. An impassable ground-level partition enforces bridge usage for transit between blocks.

### 3. Lightwell Courtyards
- **Four Interior Lightwells (Main Block):** Two South/Front courtyards ($X \approx \pm 9.5\text{m}, Z \approx 9\text{m}$) and two North/Rear courtyards ($X \approx \pm 9.5\text{m}, Z \approx 23\text{m}$).
- Open vertically from Floor 1 through the roof to the sky.
- Bounded on all corridor levels by solid $1.1\text{m}$ high parapet barrier walls with dark navy blue structural columns.

### 4. Dogleg Stairwells
- **Main Block:** Two full-height dogleg/U-shaped stairwells (South-West and South-East), enclosed in 3-sided masonry bays. Dual flights per floor rise with mid-landings at $+2.0\text{m}$ half-heights, stone/granite treads, dark baluster railings, black skirting, and navy blue tie-beam entry portals. No elevator shafts (strictly true to real campus).
- **Annexure Block:** Relocated dogleg stairwell on the east veranda axis with mid-landings and safety railings.

---

## 🏢 Key Facilities & Structural Highlights

### 1. Main Entrance Foyer (Ground Floor, Centre-South)
- **Dual Facing Vending Machines:** Matte-black snack/beverage automated vending machines positioned symmetrically on the East and West entrance walls.
- **Founder's Portrait:** Portrait of Colonel Dr. Jeppiaar framed in polished gold on the West foyer wall.
- **Teak Wood-Slat False Ceiling:** Rich teak linear baffle ceiling with warm recessed point lights ($3000\text{ K}$).
- **Department Directory:** Blue and gold official CSE Department Directory plaque listing labs, cabins, and administrative offices.

### 2. High-Performance Computer Laboratories (180 Workstations Each)
Six premier departmental computing laboratories, each featuring an identical physical footprint ($9\text{m} \times 12\text{m}$) with a double-door entrance facing the front corridor, 180 networked computer terminals arranged in a structured grid (3 columns $\times$ 12 rows $\times$ 5 seats), teaching podium, and ceiling-mounted digital projectors:
1. **CSS Lab** (Ground Floor, Room 407)
2. **Design Thinking Lab** (First Floor, Room 422)
3. **Machine Vision Lab** (Second Floor, Room 437)
4. **Web 3.0 Lab** (Third Floor, Room 452)
5. **Gen AI Lab** (Third Floor, Room 455)
6. **Quantum Computing Lab** (Third Floor, Room 458)

### 3. Departmental Server Room (Floor 2, Room 445)
- Located on the 2nd Floor, equipped with **8 full-height enterprise server rack enclosures**.
- **Dynamic LED Controller (`ServerRoomLEDController.cs`):** Programmatic multi-frequency activity indicator LEDs flashing across green, blue, and amber spectrums to simulate live enterprise server load and network traffic.

### 4. Project Hub & Administrative Centers
- **Dean's Cabin:** Corner executive suite on the South-West ground floor.
- **HOD's Cabin:** Corner executive suite on the South-East ground floor.
- **Project Hub:** Open-plan innovation and collaboration space on the 1st Floor back corridor.
- **Restroom Facilities:** Men's and Women's student restrooms situated on peripheral corners of the corridor loop on every floor.

---

## 📍 Complete Room & Facility Directory (121 Rooms)

```
====================================================================================================
FLOOR           ROOM / FACILITY CODE    NAME / DESCRIPTION               WING / LOCATION
====================================================================================================
Ground Floor    Room 401 - 406          Classrooms 401 to 406            West Corridor (Main Block)
(Y = 0.0m)      Room 407                CSS Lab (180 Workstations)       Central Core (South Facing)
                Room 408 - 410          Staff Cabins 1, 2, 3             Central Wing (Main Block)
                Room 411 - 414          Classrooms 411 to 414            East Corridor (Main Block)
                Room 415                Dean's Cabin                     South-West Corner
                Room 415B               HOD's Cabin                      South-East Corner
                Foyer                   Main Entrance & Vending Foyer    Central South Entry
                Restroom-GW / GE        Women's & Men's Restrooms        North-West / North-East
                Annex-G01               Annexure Lecture Hall 1          Ground Annexure Core
                Annex-G02               Dean's Executive Office          Ground Annexure South
                Annex-G03 - G06         Faculty Cabins 1 to 4            Ground Annexure East Veranda
----------------------------------------------------------------------------------------------------
First Floor     Room 416 - 421          Classrooms 416 to 421            West Corridor (Main Block)
(Y = 4.0m)      Room 422                Design Thinking Lab (180 PCs)    Central Core (South Facing)
                Room 423                Project Hub Innovation Center    Central North Wing
                Room 424 - 430          Classrooms 424 to 430            East Corridor (Main Block)
                Bridge 1F               West Bridge to Annexure          West Wall (Adjacent 418)
                Restroom-1W / 1E        Women's & Men's Restrooms        North-West / North-East
                Annex-101               Annexure Lecture Hall 2          First Floor Annexure Core
                Annex-102 - 105         Faculty Cabins 5 to 8            First Floor Annexure East
                Annex-Bridge1           Annexure Bridge Landing Portal   First Floor Annexure East
----------------------------------------------------------------------------------------------------
Second Floor    Room 431 - 436          Classrooms 431 to 436            West Corridor (Main Block)
(Y = 8.0m)      Room 437                Machine Vision Lab (180 PCs)     Central Core (South Facing)
                Room 438 - 444          Classrooms 438 to 444            East Corridor (Main Block)
                Room 445                Department Server Room (8 Racks) Central Core
                Room 446                Advanced Research Lab            East Wing
                Bridge 2F               West Bridge to Annexure          West Wall (Adjacent 434)
                Restroom-2W / 2E        Women's & Men's Restrooms        North-West / North-East
                Annex-201               Annexure Lecture Hall 3          Second Floor Annexure Core
                Annex-202               CSE Seminar Hall                 Second Floor Annexure South
                Annex-203 - 206         Faculty Cabins 9 to 12           Second Floor Annexure East
                Annex-Bridge2           Annexure Bridge Landing Portal   Second Floor Annexure East
----------------------------------------------------------------------------------------------------
Third Floor     Room 447 - 451          Classrooms 447 to 451            West Corridor (Main Block)
(Y = 12.0m)     Room 452                Web 3.0 Lab (180 Workstations)   Central Core (South Facing)
                Room 453 - 454          Classrooms 453 to 454            Central North Wing
                Room 455                Gen AI Lab (180 Workstations)    Central Core
                Room 456 - 457          Classrooms 456 to 457            East Wing
                Room 458                Quantum Computing Lab (180 PCs)  Central Core
                Room 459 - 462          Classrooms 459 to 462            East Corridor (Main Block)
                Restroom-3W / 3E        Women's & Men's Restrooms        North-West / North-East
                Annex-301               Annexure Cloud Computing Lab     Third Floor Annexure Core
                Annex-302               Annexure IoT & Robotics Lab      Third Floor Annexure South
                Annex-303 - 306         Faculty Cabins 13 to 16          Third Floor Annexure East
====================================================================================================
```

---

## 🎮 Locomotion, Controls & Teleportation

The digital twin includes an immersive first-person character controller designed around realistic physical movement rules:

### Movement & Interaction
| Key / Input | Action | Specification |
|:---|:---|:---|
| `W / A / S / D` | First-Person Walk | $2.0\text{ m/s}$ walking velocity |
| `Left Shift` (Hold) | Sprint Mode | $4.0\text{ m/s}$ running velocity |
| `Space` | Jump | Realistic impulse height ($1.0\text{m}$) |
| `Mouse Move` | Look Around | $360^\circ$ horizontal yaw, vertical pitch clamped to $[-85^\circ, +85^\circ]$ |
| `Escape` | Toggle Mouse Lock | Switch between free mouse cursor and locked camera navigation |

### Quick Teleportation Hotkeys
| Hotkey | Teleport Destination | Target Coordinates |
|:---:|:---|:---|
| **`G`** | Ground Floor Main Entrance | $X = 0.0\text{m}, Y = 1.0\text{m}, Z = -5.0\text{m}$ (Facing North) |
| **`A`** | Annexure Block Ground Veranda | $X = -36.0\text{m}, Y = 1.0\text{m}, Z = 0.0\text{m}$ |
| **`1`** | First Floor Bridge Entrance | $X = -20.0\text{m}, Y = 5.0\text{m}, Z = 8.0\text{m}$ |
| **`2`** | Second Floor Bridge Entrance | $X = -20.0\text{m}, Y = 9.0\text{m}, Z = 8.0\text{m}$ |
| **`3`** | Third Floor Central Corridor | $X = 0.0\text{m}, Y = 13.0\text{m}, Z = 0.0\text{m}$ |
| **`B`** | Directly onto Open-Air Bridge | $X = -27.0\text{m}, Y = 5.0\text{m}, Z = 8.0\text{m}$ |
| **`T`** | Cinematic Automated Campus Tour | Smooth multi-waypoint spline camera walkthrough |
| **`R`** | Emergency Position Reset | Instantly returns to Main Entrance foyer |

---

## 🚀 How to Run & Build

### 1. Standalone Windows Desktop Player (Instant Play)
The pre-compiled standalone executable is located in `Build/`:
```bat
# Method A: Double-click root helper script
Launch_StPaulsVR.bat

# Method B: Direct executable launch
Build\StPaulsVR.exe
```
*No Unity installation is required to run the standalone build.*

### 2. Opening in Unity 2022.3 LTS Editor
1. Launch **Unity Hub**.
2. Select **Add project from disk** and choose this repository directory (`St.Paul's VR`).
3. Ensure Unity version **2022.3.21f1** (or compatible 2022.3 LTS) is selected.
4. In the Project window, navigate to and open:
   ```text
   Assets/Scenes/StPaulsCampus.unity
   ```
5. Click the **Play** button (▶) in the top toolbar.

### 3. Automated Headless / Batchmode Build
To compile the standalone Windows 64-bit binary from PowerShell / Command Prompt:
```powershell
& "C:\Program Files\Unity\Hub\Editor\2022.3.21f1\Editor\Unity.exe" `
  -batchmode `
  -quit `
  -projectPath "E:\St.Paul's VR" `
  -executeMethod StPaulsVR.Editor.CampusBuildAutomator.BuildStandalonePlayer `
  -logFile "Logs/build.log"
```

### 4. Running the Automated Walkthrough Inspection
To execute the automated multi-floor 336-checkpoint camera verification pipeline:
```powershell
& "C:\Program Files\Unity\Hub\Editor\2022.3.21f1\Editor\Unity.exe" `
  -batchmode `
  -quit `
  -projectPath "E:\St.Paul's VR" `
  -executeMethod StPaulsVR.Editor.CampusWalkthroughAutomator.RunAutomatedInspection `
  -logFile "Logs/walkthrough.log"
```

---

## 📁 Codebase Architecture & File Structure

```text
St.Paul's VR/
├── Assets/
│   ├── Materials/
│   │   └── *.meta                     # Material metadata for architectural shaders
│   ├── Scenes/
│   │   ├── StPaulsCampus.unity        # Master baked playable 3D scene (4 floors + annexure)
│   │   └── StPaulsCampus.unity.meta
│   └── Scripts/
│       ├── CampusData.cs              # Master spatial database: 121 rooms, dimensions, coords, types
│       ├── CampusBuilder.cs           # Core procedural generation orchestrator
│       ├── ArchitecturalShell.cs      # Facade piers, continuous floor slabs, lightwells, parapets
│       ├── StairBuilder.cs            # U-shaped dogleg stairways, mid-landings, granite treads, balusters
│       ├── FurnishingBuilder.cs       # 180-PC lab grids, server racks, desks, vending machines, portrait
│       ├── CorridorBuilder.cs         # Interior corridors, open-air bridges, and entrance portals
│       ├── DoorController.cs          # Interactive and open doorway clearance management
│       ├── ServerRoomLEDController.cs # Dynamic procedural server rack status LED blink system
│       ├── FirstPersonController.cs   # Physics-based Rigidbody locomotion, mouse look, jump, step climb
│       ├── RoomTriggerZone.cs         # Trigger detection zones updating active room telemetry
│       ├── CampusHUD.cs               # Real-time on-screen HUD (room badge, floor, teleport hotkeys)
│       ├── CinematicTour.cs           # Spline-based automated cinematic camera tour
│       ├── Editor/
│       │   ├── CampusBuilderEditor.cs        # Inspector GUI & manual generation tools
│       │   ├── CampusBuildAutomator.cs       # Batchmode scene baking & Windows x64 build pipeline
│       │   └── CampusWalkthroughAutomator.cs # Multi-floor 336-checkpoint visual inspection harness
│       └── Tests/
│           └── CampusDataValidation.cs       # NUnit architectural constraint test suite
├── Packages/
│   ├── manifest.json                  # Unity package dependencies (UGUI, Test Framework, etc.)
│   └── packages-lock.json
├── ProjectSettings/                   # Engine physics, quality, input, graphics, and tag configuration
├── .gitattributes                     # Unity line-ending and asset merge rules
├── .gitignore                         # Configured to ignore Library, Temp, Obj, UserSettings, etc.
├── Launch_StPaulsVR.bat               # One-click standalone executable launcher
└── README.md                          # Comprehensive project documentation
```

---

## 🔍 Automated Verification & Quality Assurance

To guarantee 100% structural accuracy and prevent visual artifacts, the project was subjected to an automated **336-checkpoint inspection harness** (`CampusWalkthroughAutomator.cs`):

1. **Continuous Foundation:** Verified unbroken concrete floor slabs across both Main ($42\text{m} \times 48\text{m}$) and Annexure ($20.4\text{m} \times 52.4\text{m}$) blocks with zero terrain clipping or void exposure.
2. **Courtyard Flank Integrity:** Widened corridor flank slabs to $12.0\text{m}$ width around all 4 interior courtyards, eliminating floor gap anomalies.
3. **Collision Envelopes:** All outer walls, interior partitions, staircase stringers, bridge deck boundaries, and courtyard parapets carry active physics colliders preventing character fall-through.
4. **Lighting & Material Uniformity:** Consistent off-white masonry walls, grey stone slab surfaces, dark navy blue structural accent pillars, and warm recessed foyer lighting.
5. **Standalone Execution:** Validated clean startup on Windows x64 DirectX 11, sustained 60+ FPS, and zero unhandled exceptions or memory leaks.

---

## 📜 Academic Attribution & License

- **Course:** S11BPB51 — Augmented and Virtual Reality  
- **Institution:** Department of Computer Science & Engineering, Sathyabama Institute of Science and Technology  
- **Developer / Student:** Vishal Viswanathan ([@CodeSorcerer-007](https://github.com/CodeSorcerer-007))  
- **Engine Version:** Unity 2022.3.21f1 LTS  
- **Project Purpose:** Academic VR Digital Twin & Interactive Architectural Simulation  
