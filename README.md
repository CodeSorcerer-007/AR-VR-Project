# St. Paul's Campus Digital Twin — Unity & C# VR Walkthrough

> An academic 3D/VR architectural digital twin of **St. Paul's Main Block** and **St. Paul's Annexure Block**, created in **Unity 2022.3 LTS and C#** according to course syllabus **S11BPB51 (Augmented and Virtual Reality)**.
> **Department of Computer Science & Engineering — Sathyabama Institute of Science and Technology**

---

## 🌟 Academic Syllabus Alignment (S11BPB51)

This project strictly implements and illustrates core curriculum topics across all 5 syllabus units:

| Syllabus Unit | Course Topic | Unity C# Implementation in This Project |
|:---|:---|:---|
| **Unit 1** | VR Fundamentals & Immersion vs. Presence | Continuous 3D world with metric spatial scale ($1\text{ unit} = 1\text{ meter}$), true FOV, and realistic depth perception. |
| **Unit 2** | Interaction Design & Human Locomotion | Locomotion speeds set to human perception guidelines ($2.0\text{ m/s}$ walking within the $1.4 - 3.0\text{ m/s}$ standard, $4.0\text{ m/s}$ sprint), affordances, and spatial navigation. |
| **Unit 3** | Unity Architecture & MonoBehaviours | Clean hierarchy (`--- ST PAULS CAMPUS ---`), color-coded materials, and lifecycle hooks (`Awake`, `Start`, `Update`, `FixedUpdate`). |
| **Unit 4** | Unity Physics & Component Scripting | Rigidbody physics, continuous collision detection, Capsule Collider, and ground-check raycasting for step climbing. |
| **Unit 5** | Trigger Events, Interactions & HUD UI | `RoomTriggerZone.cs` using `OnTriggerEnter` and `OnTriggerExit` on room boundaries; interactive `CampusHUD.cs` displaying room metadata and quick floor teleports. |

---

## 🏛️ Campus Architecture & Features

1. **Two Coherent Blocks in Single 3D Space:**
   - **Main Block (4 Floors: G, 1, 2, 3):** Rooms 401–462, administrative spaces, faculty cabins, grand entrance foyer, and four vertical light wells.
   - **Annexure Block (4 Floors: G, 1, 2, 3):** Tiered Lecture Halls 1–3, Dean's Executive Office, Rooms 469–478, and advanced laboratories.
2. **Two Open-Air Connecting Bridges:**
   - **1st Floor Bridge:** Connects Main Block Room 418 to Annexure Block Room 469 at height $Y=4.0\text{m}$.
   - **2nd Floor Bridge:** Connects Main Block Room 434 to Annexure Block Room 474 at height $Y=8.0\text{m}$.
   - Open to the sky with concrete walkway decks and $1.2\text{m}$ steel safety railings.
3. **Impassable Ground Separation:**
   - Physical ground-level barrier between Main and Annexure blocks; visitors must use upper-floor bridges to cross.
4. **Vertical Light-Well Courtyards:**
   - 4 open-to-sky courtyards in Main Block and 1 in Annexure Block, protected on each floor by $1.2\text{m}$ solid parapet colliders.
5. **Standardized Laboratories (180 Computers Each):**
   - 6 Named Labs: CSS Lab, Design Thinking Lab, Machine Vision Lab, Web 3.0 Lab, Gen AI Lab, and Quantum Computing Lab.
   - Layout: 3 columns $\times$ 12 rows $\times$ 5 computers = 180 workstations per lab, plus ceiling-mounted projectors.
6. **Classrooms & Lecture Halls:**
   - Student classrooms with front blackboards, teacher podiums/desks, and student bench rows.

---

## 🎮 Desktop Simulation Controls

| Key / Input | Action |
|:---|:---|
| `W / A / S / D` | Walk through corridors and rooms ($2.0\text{ m/s}$) |
| `Left Shift` (Hold) | Sprint ($4.0\text{ m/s}$) |
| `Space` | Jump |
| `Mouse Move` | Look around (360° Yaw, clamped Vertical Pitch) |
| `Escape` | Toggle mouse lock (Lock for camera look / Unlock for cursor) |
| `G` | Quick Teleport: Ground Floor Main Entrance |
| `A` | Quick Teleport: Annexure Veranda & Relocated Dogleg Stairs |
| `1` | Quick Teleport: First Floor Bridge (Room 418) |
| `2` | Quick Teleport: Second Floor Bridge (Room 434) |
| `3` | Quick Teleport: Third Floor |
| `B` | Quick Teleport: Directly onto the Open-Air Connecting Bridge |
| `T` | Launch Automated Cinematic Campus Tour |
| `R` | Reset position to Main Entrance |

---

## 🚀 How to Run & Build

### Option 1: Run the Standalone Windows Executable (Immediate)
Simply double-click `Launch_StPaulsVR.bat` in the root folder, or navigate to:
```text
Build/StPaulsVR.exe
```
This runs the simulation immediately without needing Unity installed.

### Option 2: Open in Unity Editor
1. Open **Unity Hub**.
2. Click **Add project from disk** and select this project directory.
3. Open with **Unity 2022.3 LTS** (e.g. `2022.3.21f1`).
4. In the Project window, open `Assets/Scenes/StPaulsCampus.unity`.
5. Press the **Play** button (▶) at the top of the Unity Editor.

### Option 3: Regenerate or Rebuild the Scene
To regenerate the campus procedural geometry in the Editor:
- In the Unity menu bar, select:  
  **`StPauls > Generate Complete Campus`** or **`StPauls > Bake Master Scene`**
- To recompile the standalone player:  
  **`StPauls > Build Standalone Windows x64`**

---

## 📁 Repository Structure

```text
├── Assets/
│   ├── Materials/               # Off-white walls, grey slabs, cyan lab accents, blue railings
│   ├── Scenes/
│   │   └── StPaulsCampus.unity  # Baked master playable campus scene
│   └── Scripts/
│       ├── CampusData.cs            # Master architectural catalog (119 rooms, 2 bridges, 5 courtyards)
│       ├── CampusBuilder.cs         # Procedural 3D architectural generator
│       ├── ArchitecturalShell.cs    # Facade piers, windows, slabs, light wells, and portals
│       ├── StairBuilder.cs          # Multi-story dogleg staircases with landings and railings
│       ├── FurnishingBuilder.cs     # Lab benches, PCs, blackboards, teacher desks
│       ├── CorridorBuilder.cs       # Verandas, corridor spines, and open-air bridges
│       ├── FirstPersonController.cs # Rigidbody locomotion & camera rig (Syllabus Units 2-4)
│       ├── RoomTriggerZone.cs       # OnTriggerEnter/Exit room boundary sensor (Syllabus Unit 5)
│       ├── CampusHUD.cs             # Real-time room info badge & quick teleports
│       ├── CinematicTour.cs         # Automated smooth walkthrough camera spline
│       ├── Editor/
│       │   ├── CampusBuilderEditor.cs  # Custom Inspector & menu items
│       │   └── CampusBuildAutomator.cs # Scene baking and batch build automator
│       └── Tests/
│           └── CampusDataValidation.cs # NUnit architectural constraint test suite
├── Build/
│   └── StPaulsVR.exe            # Standalone Windows 64-bit desktop build
├── Real St.Paul's Pictures/     # Field reference photographs of the physical block
├── Reference Maps and Images/   # Blueprint schematics and room floorplans
├── Screenshots/                 # Rendered visual inspection views of the digital twin
├── syllabus/                    # S11BPB51 course syllabus unit PDFs
├── Launch_StPaulsVR.bat         # Portable one-click double-click launcher
└── README.md                    # Project documentation & syllabus mapping
```
