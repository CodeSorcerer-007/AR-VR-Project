# ST. PAUL'S DIGITAL TWIN — AUTONOMOUS MASTER BUILD PROMPT

> **Purpose:** Give this entire document to the Antigravity IDE agent (Gemini 3.8 Flash High) as the master implementation brief. Build the real application in the current workspace, not just a plan, mock-up, or list of recommendations.

---

## 0. Your role and non-negotiable execution rules

Act as a principal 3D web engineer, architectural digital-twin specialist, interaction designer, realtime graphics engineer, accessibility engineer, and QA lead. You are responsible for delivering a **working, polished, browser-based 3D walkthrough called “St. Paul's Digital Twin.”**

### Work autonomously

- Do **not** ask me a long series of clarifying questions. The decisions in this brief are already settled. If a detail is not specified, choose the most reasonable implementation, record the assumption in configuration/documentation, and continue.
- Do not stop after producing an architecture proposal, TODO list, UI mock-up, static screenshot, or partial prototype. Inspect the workspace, make a plan internally, implement the application, run it, test it, fix defects, and leave the repository in a usable state.
- First inspect the existing workspace and repository. Preserve working code and integrate with the current project where sensible. Do not overwrite useful work or reinitialize a functioning project just because you prefer a different setup.
- Use available terminal/IDE capabilities to install dependencies, run lint/type-check/build/test commands, launch the app where possible, inspect runtime errors, and fix them. Continue until the acceptance criteria near the end are met or a genuine environment blocker is documented.
- Never claim something is implemented or tested unless you actually implemented or tested it. If a browser, GPU, or command is unavailable, describe the specific limitation accurately and still complete all testing that is possible.
- Avoid adding paid services, API keys, account systems, cloud backends, or external runtime dependencies. Core experience must not depend on a hosted AI service or network API.
- No placeholder buttons, fake data presented as live facts, empty screens, dead links, console errors, or “coming soon” features for core requirements. If an advanced feature cannot be fully supported, deliver the best working implementation and explain the limitation in the README.
- Optimize for **visual quality, architectural fidelity, physical correctness, useful interactions, offline resilience, and robust performance**—not merely for the number of features.

### First action: inspect source material

Before creating or substantially changing geometry, search the entire workspace for supplied images, sketches, PDFs, floor plans, screenshots, logos, reference photos, existing 3D assets, and notes. Likely reference filenames may include forms such as:

- `image(10).png`
- `image(20261019-183646).png`
- `image(20261019-183701).png`
- `image(20261019-183714).png`
- `image(20261019-183748).png`
- `image(20261019-183756).png` and rotated variants
- `image(20261019-183803).png` and rotated variants
- `image(20261019-201613).png`
- `image(20261019-191014).png`
- `contact.png`
- `ARVR_Team6(DigitalTwinOfCollegeCampus) (1).pdf`

These names are clues, not a guarantee that those files will exist in this workspace. Treat a contact sheet as an index only; inspect the highest-quality original image for each plan or reference. Rotated copies may show the same source in different orientations, so avoid treating them as different floors. If the originals are not available, proceed using this brief and explicitly document that the full original sketches were not present in the IDE workspace; do not halt for clarification.

Create a small source-review document, for example `docs/source-review.md`, that identifies which supplied references were found, which plan each one appears to show, what evidence was extracted, and what remains uncertain. Keep this concise and useful.

---

## 1. Product vision

Create an immersive, premium, web-based digital twin of two physically connected academic buildings:

- **St. Paul's Main** — the larger Main Block, with rooms numbered 401–462 across ground, first, second, and third floors.
- **St. Paul's Annexure** — the adjacent Annexure Block, including Lecture Halls 1, 2, and 3, rooms 469–478 over the ground through second floors, and a third-floor area with the Gen AI Lab, Quantum Computing Lab, and a separate boys' restroom.

The experience must feel like a realistic architectural digital twin, not a generic game level, stylized cartoon, static floor-plan page, or dashboard with a 3D object behind it. Visitors must be able to walk through actual spaces, look around, discover rooms, explore floors, understand the buildings' relationship, and physically traverse the valid bridge connections.

The application should be impressive enough for a polished academic presentation, campus orientation, visitor guidance, and project evaluation, while remaining maintainable by a student team.

### Core principles

1. **Source fidelity before invention.** The annotated floor-plan sketches are the strongest evidence for room arrangement, room sequence, courtyards, staircases, entrance positions, bridge endpoints, and circulation. Reference photos inform exterior/interior appearance. Written decisions in this brief take precedence if an image seems ambiguous or contradictory.
2. **One coherent, physically walkable world.** Both buildings exist in one continuous 3D environment. The user cannot walk through walls, furniture, railings, voids, or the blocked ground-level gap.
3. **Offline-first once downloaded.** The application and complete campus asset package must be usable offline after a successful download and verification.
4. **Premium yet restrained.** Realistic architecture and cinematic light; refined translucent HUD panels; crisp technical typography; restrained accent colours and motion.
5. **Graceful uncertainty.** Do not invent survey-grade measurements, facilities, labels, furniture, signs, or connections. Keep estimates editable and disclose material uncertainties.
6. **Visitors are in control.** No forced completion screens, achievement checklist, progress tracking, interruptions, or automatic room information dialogs. Navigation is optional. A room label can appear subtly; details open only on request.
7. **Do not fake navigation.** Floor selectors and architectural inspection views are not teleporters. Every navigational journey follows physically valid corridors, doors, stairs, and permitted bridges.

---

## 2. Evidence hierarchy, geometry, and uncertainty

### Source precedence

When reconstructing any room or detail, apply this order:

1. Explicit requirements in this master brief.
2. Room labels, room order, doors, stairs, courtyards, and bridges shown in the highest-quality supplied floor-plan sketches.
3. Supplied architectural/exterior/interior reference photographs.
4. Reasonable proportional inference to connect the evidence into a coherent 3D model.
5. Visual polish only when it does not contradict the evidence.

Do not silently “correct” an unusual sketch-derived layout just to make the model more symmetrical. Preserve sketch-derived positions, room sequence, courtyard shapes, and connections. Regularize only geometry that must be regularized to make a physically coherent model, and document the assumption.

### No fabricated precision

No surveyed building CAD/BIM, dimensioned architectural plan, or verified survey measurements have been supplied. Therefore:

- Reconstruct dimensions proportionally from the sketches and reference photos.
- The provisional clear ceiling height is approximately **3.5 m**, but make clear ceiling height and floor-to-floor height **separate configurable values**.
- Corridor width should begin at approximately **3.0 m or wider**, configurable per corridor.
- Courtyard parapets should begin at approximately **1.2 m**, configurable.
- Room widths, room depths, wall thickness, floor-to-floor heights, stair dimensions, window sizes, door sizes, bridge lengths, and exterior site distances must live in configuration and be clearly labelled as estimated unless source-verified.
- Do not present model dimensions as surveyed facts. The application must not include a visitor-facing measurement tool; this is an explicit product decision.

Use metadata such as `source: "sketch" | "photo" | "written_requirement" | "inferred"`, `confidence: "high" | "medium" | "low"`, `verified: boolean`, and `notes: string` for important layout fields. Keep these fields in structured local configuration and document major assumptions in `docs/source-review.md` or `docs/assumptions.md`.

Add an optional visitor-facing **“About this reconstruction”** panel explaining that the model is based on supplied sketches and reference photographs and that some geometry is estimated. Do not cover the normal walkthrough with warning badges. Display “Not verified” or “Not provided” only where missing information is important to a room-detail panel.

---

## 3. Building identity and world arrangement

### Relative orientation

From the perspective of a visitor **standing outside the St. Paul's Main entrance and facing into Main Block**:

- **St. Paul's Main is on the right.**
- **St. Paul's Annexure is on the left.**
- The blocks are physically separated by a gap at ground level and linked by bridges at first-floor and second-floor levels.
- There is **no walkable ground-level connection** between the blocks.

The exterior should make this relationship immediately understandable. Do not inadvertently mirror the entire campus when orienting the starting camera, floor plan, or overview.

### Main Block entrances and signs

- The visitor's initial position is **outside the St. Paul's Main entrance, between Rooms 401 and 415**, at the road/paved entrance approach.
- Main's ground-floor entrance is between Rooms 401 and 415, according to the provided requirements.
- The exterior sign on Main reads exactly **“ST. PAUL’S BLOCK”** (typographic apostrophe is acceptable; text and meaning must match).
- Only Main has this prominent exterior sign. **Do not add an equivalent exterior sign to Annexure.**
- The entrance is an open entrance passage, not a grand glass doorway or an unsupported decorative gateway. Exact steps/ramp/flush threshold are unverified; make them adjustable and avoid inventing an elaborate entrance.
- Include a road outside Main and a small paved forecourt/walkway between the road and entrance.

### Annexure entrance

- Annexure's ground-floor entrance is between the Dean's cabin and Lecture Hall 1, as stated in the provided requirements.
- Preserve the entrance position from the sketches if they are available. If the sketch labels appear inconsistent with the text, retain the written requirement and document the conflict instead of silently moving the entrance.

### Surroundings

Use a **focused campus environment**, not an invented full campus. Include the road, paved approaches, restrained landscaping, limited greenery, and a subtle distant backdrop. Do not add unsupported campus blocks, parking garages, fountains, statues, a sports ground, or other large structures.

---

## 4. Floor-plan and room-layout rules

Treat the supplied sketches as the master room map. Inspect them directly and transcribe all legible room labels, room numbers, floors, room order, stair locations, central open spaces, and corridor relationships into structured configuration. Do not rely solely on the room ranges below to infer every missing room position.

### St. Paul's Main

- Four levels: ground, first, second, and third floors.
- Room numbers **401–462** are distributed across those four levels.
- Ground-floor entry lies between Rooms **401 and 415**.
- Ground floor includes the **CSS Lab** and **Staff Cabin (1)** and **Staff Cabin (2)** as shown in the supplied sketch, along with the surrounding numbered rooms and facilities. Retain the sketch's relative arrangement.
- The lab sequence/details shown by the sketches include:
  - Ground floor: CSS Lab.
  - First floor: Design Thinking Lab and Project Hub.
  - Second floor: Machine Vision Lab and Server Room.
  - Third floor: Web 3.0 Lab.
- Preserve all other room numbers from 401–462 in their sketch-indicated locations. Do not invent room names for numbered rooms that have no known name.
- Main has two staircases/side stair positions per floor as shown in the sketches; reproduce the actual plan's stair relationships, not a generic centre stair.
- The Main Block has the specified restroom arrangement below.

### St. Paul's Annexure

- Lecture Halls **1, 2, and 3** and rooms **469–478** are distributed from ground through second floor according to the requirements and sketches.
- Ground-floor entrance lies between the Dean's cabin and Lecture Hall 1.
- Annexure has one staircase per floor, following the sketches.
- Third floor follows the general corridor/open-courtyard arrangement of the second floor. From the staircase toward the far end, the sequence is:
  1. Gen AI Lab.
  2. Quantum Computing Lab.
  3. Boys' restroom.
- Do not omit the Annexure third floor just because the 469–478 number range is described over the ground through second floors.
- Annexure has no equivalent “ST. PAUL’S BLOCK” exterior sign.

### Courtyards and empty voids

- The hatched/open areas in the sketches represent **empty open-to-sky courtyard/voids** where indicated. They are not rooms, roofs, floors, or opaque filled structures.
- Preserve courtyard footprints through all floors so the voids remain vertically open to the sky.
- Surround open edges with solid concrete parapet walls, approximately **1.2 m high** as a configurable estimate.
- Courtyards remain empty—no trees, planters, fountains, benches, sculptures, or decorative objects inside them.
- Add correct collision boundaries around parapets and openings. Visitors must not be able to walk into or fall through a courtyard void.

### Restrooms

Keep these locations as the working map, checking against supplied sketches whenever available. Make the configuration editable if a sketch is unclear.

**Main Block**

- Ground floor: girls' restroom near the left end of the upper corridor, near Room 406; boys' restroom near the right end, near Room 410.
- First floor: girls' restroom near Room 421; boys' restroom near Room 425.
- Second floor: girls' restroom near Room 437; boys' restroom near Room 441.
- Third floor: girls' restroom near Room 453; boys' restroom near Room 457.

**Annexure Block**

- Ground floor: girls' restroom at the end beyond Lecture Hall 3.
- First floor: girls' restroom at the far end beyond Room 473.
- Second floor: boys' restroom at the far end beyond the row containing Rooms 474–477.
- Third floor: a **separate additional boys' restroom** at the far end, beyond the Gen AI Lab and Quantum Computing Lab sequence.

Do not merge the Annexure second-floor and third-floor boys' restrooms. They are two separate restrooms on different floors.

### Bridge connections — critical geometry

There are **two open-sided, uncovered pedestrian bridges** between Main and Annexure:

1. **First-floor bridge:** connects the Main side at **Room 418 / FC(3) gap** to the Annexure side at **Room 469 / FC(14) gap**, preserving the precise adjacency and endpoints visible in the sketches.
2. **Second-floor bridge:** connects the Main side at **Room 434 / FC(6) gap** to the Annexure side at **Room 474 / FC(15) gap**, preserving the precise adjacency and endpoints visible in the sketches.

Keep the FC labels as recorded in the sketches. Do not reinterpret them into new named rooms without evidence.

Bridge construction:

- **Absolutely no roof, canopy, or overhead cover.** This is an explicit requirement.
- Open-sided concrete floor/walkway with metal railings.
- Walkway width approximately equal to the adjoining corridor width; configurable.
- Correct guardrail collision, bridge edges, ends, floor heights, and connections to both blocks.
- Bridges are walkable only from their correct floor levels. No ground-floor bridge, hidden ramp, invisible teleport, or shortcut may connect the buildings.
- Navigation routing must model these links as valid only at the first and second floors.
- Test that a visitor can walk from Main to Annexure and back across each bridge, but cannot reach the other building directly at ground level.

---

## 5. Architectural appearance and materials

### Exterior

Use the supplied exterior images as the visual reference. The target appearance is:

- Light grey exterior walls.
- Reddish-brown horizontal bands and vertical accent elements.
- Repeated rectangular window groups.
- Flat concrete rooftops; any low roof-boundary wall is uncertain and should be configurable.
- Shared architectural style and colour scheme across Main and Annexure.
- The Main Block's “ST. PAUL’S BLOCK” sign is physical exterior signage; do not use floating digital signage as a substitute.
- Avoid cartoon outlines, exaggerated bevels, futuristic neon building materials, or an unsupported glass-tower aesthetic.

### Windows

- Large rectangular sliding glass window groups, based on the reference photos.
- Detailed but performance-aware metal frames, visible glass, and metal security grills consistent with the classroom reference image.
- Use convincing interior/exterior visibility and controlled reflections. Avoid opaque blue mirror glass or unrealistically shiny surfaces.
- Window placement must relate to the actual room walls and external elevations, not randomly repeat across every wall.

### Interior architecture

- White/off-white walls.
- Ceramic/vitrified-style tile floors with subtle, believable reflectivity and grout detail.
- Plain white-painted concrete ceilings.
- No false ceiling and no recessed-light grid.
- Fans and flat square/rectangular surface-mounted LED lights attached directly to the concrete ceiling.
- Typical room clear-height estimate begins at 3.5 m, with clear ceiling height and floor-to-floor height separately configurable.
- Wooden or wood-finish single-leaf doors. Start closed; open smoothly and automatically when a visitor approaches, without a cutscene or loading screen.
- Door hinge side and swing should be configurable per room. Do not let doors block the corridor, swing through walls, or trap the visitor. Door animation and collision state must remain consistent.
- Walls, columns, slabs, railings, room openings, lintels, and thresholds should read as real architecture; avoid paper-thin walls and floating geometry.

### Lighting and materials

Use advanced physically based material tuning with reference-matched base colours, realistic roughness, restrained reflections, subtle surface variation, and normal detail only where useful. Use efficient baked/ambient lighting approximations or supported real-time techniques rather than expensive effects that destroy frame rate.

- Default scene: realistic daytime with cinematic but plausible daylight.
- Include optional time-of-day and interior-light controls.
- Avoid overexposure, crushed blacks, strong bloom, aggressive chromatic aberration, excessive lens flare, or game-like colour grading.
- Low/Medium/High/Ultra presets and automatic quality adjustment must work.
- The low preset must remain visually coherent, not become a wireframe or completely unlit model.

---

## 6. Interior furnishings and room templates

Build reusable parametric room and furnishing components so room contents can be edited centrally. Instancing/batching must be used for repeated objects where practical.

### Regular classrooms — both blocks

Typical classroom setup:

- Capacity: **60 students**.
- Straight bench rows facing one large blackboard.
- A projection screen and projector.
- One staff computer on/near a teacher's table in a corner close to the board.
- Approx. **8 ceiling fans** and **8 flat surface-mounted LED light fixtures**, represented as configurable estimates.
- Plain desks/benches and plastic chairs, not luxury auditorium seats.
- Default seating model: **3 columns × 5 rows = 15 benches**, with 4 seats per bench to reach 60 seats. Make the arrangement and count configurable; ensure a legible aisle/circulation path and avoid furniture collisions.
- Place teaching equipment with sensible sightlines and do not block doors, windows, or corridors.

### Lecture Halls 1, 2, and 3 — Annexure

- Each hall accommodates **120 students**.
- Same architectural/material language and core teaching equipment as classrooms: blackboard, screen, projector, teaching computer, fans, and ceiling lights.
- Use a larger double-row/expanded bench arrangement that plausibly accommodates 120 seats. A default of 30 benches × 4 seats (for example 3 columns × 10 rows where it fits) is an editable modelling estimate, not a surveyed fact.
- Keep aisles and entry movement clear, with screen/board at the front and seating oriented correctly.

### Laboratories — same setup requirement

The user explicitly requested that all labs look the same and use the same setup. Apply a common detailed lab template to each of these spaces:

- CSS Lab.
- Design Thinking Lab.
- Machine Vision Lab.
- Web 3.0 Lab.
- Gen AI Lab.
- Quantum Computing Lab.

Standard lab setup per lab:

- **3 columns × 12 rows × 5 computers per row = 180 computers.**
- **3 projectors**, one per column.
- Consistent workstation and monitor layout, with believable desk rows and aisles.
- Reuse the same model/material components through instancing so this high object count remains performant.
- Make the number, spacing, desk arrangement, chair arrangement, computer model and projector placement configurable.
- Never let the repeated objects visually merge into unreadable clutter. Use appropriate scale, row alignment, shadows, and clear access aisles.
- If a room's configured footprint cannot contain 180 computers without violating the room shape or leaving any circulation, flag a layout validation warning and make spacing/furniture placement configurable rather than silently changing the required count.

### Staff/faculty cabins

Each staff cabin uses **10 mini-cabins/cubicles**, with **five on each side** of a central passage. Each mini-cabin has one computer. Use partitions and believable desks/chairs, with a clear central passage. Avoid a single open office that merely places ten computers on tables.

### Server Room — Main

- Preserve the room boundary and location.
- The server-room interior must not be visible from outside. Use an opaque closed door and suitable wall/door treatment.
- Do not invent visible racks, labels, network topologies, glowing server walls, or equipment details beyond the supplied evidence. Its interior can remain concealed.

### Project Hub — Main

- Architecturally resembles a classroom, but **without student benches or student chairs**.
- Keep blackboard, projection screen, projector, approximately 8 ceiling fans, flat LED surface lights, and a staff computer near the board.
- Arrange the room as a usable project/teaching space, not as a furnished classroom.

### Dean's cabin — Annexure ground floor

- One large office desk.
- Computer on the desk.
- Executive chair and visitor chairs.
- Cupboards/storage.
- Meeting table.
- No unsupported luxury decor or people.

### People

- **No human models or animated people anywhere in the default experience.**
- The building should feel clean, quiet, and ready to explore. Avoid mannequin students, crowds, avatars, or moving silhouettes.

---

## 7. Visitor journey and interface design

### Opening cinematic

Build an interactive, elegant opening sequence:

1. Cinematic exterior reveal of Main, its exterior details and the building context.
2. Subtle parallax/controlled camera movement.
3. Premium title: **“St. Paul's Digital Twin”**.
4. Optional highlights introducing St. Paul's Main, St. Paul's Annexure, and the connecting bridges.
5. Clear **Enter Walkthrough** action and a visible **Skip** option at all times.
6. Reduce-motion setting must avoid sweeping camera animation and use calmer fades.
7. The sequence ends at the visitor's start point **outside the Main entrance between Rooms 401 and 415**.
8. Intro selection/highlight is an explanation or overview, not a teleporter. Do not place the visitor inside a selected room.

The intro must not block access for a long time. Use a premium loading state and begin once enough essential assets are ready.

### Premium HUD visual identity

Use a premium architectural digital-twin design:

- Realistic architecture remains the visual focus.
- Elegant translucent dark-glass HUD panels with restrained blur and fine borders.
- Warm off-white readable text, sophisticated technical typography, and a restrained accent palette (for example muted cyan/teal and warm amber/copper; choose a coherent set and define design tokens).
- Consistent spacing, deliberate hierarchy, aligned icons, clear focus states, subtle shadows, and smooth transitions.
- Keep panel sizes modest. Avoid large dashboard cards covering the building view.
- Use Framer Motion or equivalent for intentional interface animation, with reduced-motion alternatives.
- Use a proper icon library such as Lucide rather than emoji icons as primary interface controls.
- Maintain legibility on laptop screens and adapt to smaller browser viewports.

### Default HUD content

Persist a small set of useful controls, avoid clutter, and allow HUD opacity adjustment:

- Current block, floor, and room when known.
- Search/destination command palette.
- Mini-map toggle.
- Floor-plan / building overview access.
- View-mode toggle: first-person, third-person, orbit/inspection.
- Navigation status and Cancel/Stop Navigation control when active.
- Environment and quality controls in a settings panel.
- Accessibility controls.
- Screenshot capture.
- Offline/download readiness and asset progress, shown unobtrusively.
- Help/controls overlay on demand.

### Contextual room label

When the visitor enters a room, show a short, subtle room label with room number, name if known, floor, and block. It should fade away after a short time and never interrupt movement. Detailed information opens only when the visitor clicks/interacts with the room sign or uses a room details action. If information is not known, show “Not verified” or “Not provided” only where appropriate; never invent purpose or equipment.

### Object inspection

Support contextual inspection for room signs and known notable objects such as lab equipment, computers, projectors, blackboards, and the physical bridge. Use a floating short label for quick identification and an optional detail panel on activation. Object interaction must remain unobtrusive and must not create fake claims about unverified equipment.

---

## 8. Physical navigation, search, and destination previews

### Movement modes and controls

Primary interaction is keyboard and mouse on desktop browsers:

- WASD and arrow keys for walking.
- Mouse look with a clear pointer-lock enter/exit flow.
- Adjustable mouse sensitivity and field of view.
- Adjustable walking/sprint speeds.
- Camera smoothing, gentle acceleration/deceleration, and natural eye height.
- First-person/third-person toggle.
- A separate orbit/free camera for architectural inspection.
- Escape releases pointer lock and opens or focuses controls as appropriate.
- Show controls/help on first entry, then keep them available in the HUD.
- Support keyboard-only UI navigation; mouse look remains optional and has accessible alternatives.

### Collision and movement

Implement robust collision/physics or an equally reliable custom solution. The user must not pass through:

- Walls, pillars, closed doors, furniture, desks, computers, room equipment, parapets, railing posts, or bridge edges.
- Courtyard voids, floor edges, the blocked ground-level gap, or inaccessible geometry.

Requirements:

- Correct collision transitions when room doors automatically open/close.
- Walkable stair surfaces and landings with configurable tuning.
- Walkable open bridges with edge protection.
- No abrupt movement through floors, snagging at door thresholds, getting stuck in corners, falling through the world, or bouncing from small geometry.
- Add stuck-state recovery and a sensible “return to nearest safe walkable point” option when necessary. This must **not** teleport to a destination or bypass physical paths; recovery should be rare and explicitly indicated.
- Sprinting must not permit clipping through collision volumes.
- Third-person camera must not clip severely through walls; use camera collision/obstruction handling where practical.

### Automatic doors

Room doors start closed. As the visitor approaches a valid doorway, the door opens smoothly based on configurable approach distance/speed, remains open long enough for passage, then closes when clear. No loading screen, forced camera cut, or teleport. Ensure doors do not oscillate rapidly, trap the visitor, or conflict with navigation.

### Full destination finder

Create a polished, local searchable directory that supports:

- Exact room number.
- Partial room number/name.
- Category (classroom, lab, lecture hall, staff cabin, office, restroom, bridge, other verified facility).
- Block.
- Floor.
- Keyboard shortcuts and a command-palette style quick search.
- Recent searches and saved places, stored locally only.
- Nearby destinations based on the visitor's real current position in the model.

Do not add cloud accounts or online search. Search the structured building configuration.

### Destination selection and preview

Selecting a room from the search, directory, floor plan, minimap, or building overview opens a destination preview that displays:

- Destination room number/name, block and floor.
- The proposed valid physical route.
- Floors traversed.
- Any block transition and the bridge used.
- Key turns/waypoints and step-by-step text.
- A clear “Navigate here” action and a cancel/close action.

Do not show a route if the destination is currently unreachable from the visitor's position. Explain the blocker (for example, ground-level gap is impassable) and indicate the closest valid route or correct floor connection when useful. Do not silently route across a ground gap or through a wall.

### Route engine

- Use a configurable waypoint/portal navigation graph, navmesh, or similarly robust indoor path model.
- Edges must represent actual corridors, open doors/passages, stairs, and the two permitted bridges.
- Stair and bridge links must connect the correct floors and blocks only.
- A route highlight should follow actual corridors and valid passage centre-lines, not a straight line across room geometry.
- Provide live directional indicators, turns, step-by-step text, arrival notifications, and optional spoken directions with mute and subtitles/caption support.
- Route lines and directional indicators must be colour-independent: use contrast, shapes, patterns, and text in addition to colour.
- Automatic rerouting when the visitor deviates from the route. If stuck, guide to a nearby valid corridor or safe location, and offer free exploration. Never teleport the visitor to the destination.
- Navigation can be stopped or resumed at any time. Free exploration always remains possible.

---

## 9. Floor plans, overview and architectural inspection suite

### Interactive 2D floor plans

Create polished architectural floor plans based on the sketches, not generic rectangles. They should include:

- Room outlines, room numbers, known names and labels.
- Corridors, courtyards/voids, entrances, stairs, restrooms, and bridge connections.
- Separate floor selection and block selection.
- Selected destination, visitor's current location and facing direction.
- Valid highlighted route, with transitions to stairs or bridges shown clearly.
- Pan/zoom controls, reasonable label sizing and touch-friendly controls where applicable.
- Searchable/selectable room geometry.

The floor-plan selector is for **inspection and planning only**. Switching the previewed floor must not change the visitor's actual location in the 3D world.

Selecting a room should open a destination preview before navigation begins. Selecting an inaccessible floor or destination must not teleport the visitor.

### Campus/building overview

Offer a unified overview of both blocks that clearly shows their position, floor count, major destinations, stair positions, courtyards, and allowed bridge links. This overview can highlight destinations and initiate a route preview, but it must not grant a teleport.

### Stacked-floor and exploded views

Create a stacked-floor overview that visually separates the levels enough to understand the architecture while preserving alignment. Users can inspect/isolate a floor, inspect the whole stack, and return to the walkthrough. Highlight the current floor/position if meaningful. Show stairs, courtyards and bridge alignments clearly.

- Isolated/exploded floors are inspection views, not navigational states.
- Preserve the visitor's real position, orientation, and active route when returning to walkthrough if possible.
- Never confuse an inspection view with a physically walkable route.

### Free/orbit architectural camera

Allow controlled orbiting around exterior and architectural views with sensible camera boundaries. Offer return-to-current-walkthrough-camera. Keep orbit controls separate from physical walking. Do not allow the orbit camera to imply that walls/voids are navigable.

### Room comparison

Allow two rooms to be compared in a split panel, using verified room details and available reference images. Include floor-plan highlighting and, where practical, side-by-side 3D previews. For missing data, clearly label it. Comparison must not invent differences or verified dimensions.

---

## 10. Presentation mode

Add an optional **Presentation Mode** for faculty, administrators, visitors, and project evaluators. This is separate from normal free exploration.

- A curated route/showcase covers the exterior, both blocks, representative classrooms and labs, courtyards, stairs, and first-/second-floor bridges.
- A discreet presenter toolbar can change architectural viewing mode, highlight a destination, control time-of-day/interior lights, open the overview, switch floor isolation/exploded view, and start/pause/skip a showcase segment.
- Every camera movement is skippable, and the user can immediately return to free exploration.
- Respect reduced-motion settings; do not use abrupt camera cuts as the normal interaction pattern.
- Every shown route must be physically correct. If a cinematic camera flies over a bridge or through a space, clearly treat it as a non-navigational overview camera; do not represent it as a route that the visitor can walk.
- Do not make presentation mode the default every time. Keep ordinary exploration one click away.

---

## 11. Screenshots and local session persistence

### Built-in screenshot capture

Provide a screenshot capture control:

- Capture the current architectural camera view and download a standard image format such as PNG.
- Support a clean HUD-free architectural capture and a HUD-visible/presentational capture if technically supported.
- Hide overlays cleanly before a HUD-free capture; do not move the camera or visitor position.
- Ensure actual WebGL scene content is captured. Do not export a black/blank image from an emptied render buffer.
- Do not degrade normal rendering performance permanently just to simplify screenshots. Test the result in the target browser and give a graceful fallback if a browser restriction prevents a mode.

### Local session restore and saved places

Implement privacy-preserving local persistence:

- Optionally remember last safe visitor position, block/floor/room, viewing mode, accessibility settings, and interface preferences.
- On next launch, offer a clear **Resume** or **Start fresh at Main entrance** choice. Never force resume.
- Support local bookmarks for rooms and viewpoints. Returning to a room bookmark should offer a physical route preview; it must not teleport.
- Provide “Clear saved data/reset preferences.”
- Use localStorage/IndexedDB as appropriate. No accounts, tracking analytics, remote profiles, or cloud sync.
- If the saved location is no longer valid due to a configuration change, safely restart at the main entrance and explain briefly.

### No completion tracking

Do not add completion screens, room-discovery achievements, checklists, or forced progress tracking. The experience remains seamless free exploration even after navigation ends.

---

## 12. Accessibility and inclusive controls

Accessibility is a core product requirement, not a final decoration pass. Implement:

- Full keyboard navigation for menus, search, floor plans, settings, and panels.
- Visible focus indicators.
- Accessible labels and roles for controls and important room information.
- Adjustable text size.
- High-contrast mode.
- HUD opacity adjustment.
- Reduced-motion mode.
- Route guidance that does not rely on colour alone.
- Subtitles/captions for optional spoken directions.
- Simplified navigation mode with less HUD complexity.
- A guided overview alternative that does not rely on fast camera movement.
- Avoid flashing effects, prolonged motion, tiny labels, and low-contrast text.
- Pause/resume for guided motion and presentation sequences.
- Provide a clear control to release pointer lock and regain conventional browser interaction.

Do not claim full WCAG conformity without testing; document the accessibility work performed and remaining limitations.

---

## 13. Offline capability and asset download manager

Offline behaviour is a product requirement. **After the initial site load and successful campus-package download, the core experience must work without internet.**

### Architecture

- Use a reliable service worker/PWA strategy (for example Vite PWA plugin or equivalent) to cache the application shell, code, styles, fonts, icons, and required runtime files.
- Build a manifest for all campus assets: geometry/configuration, locally stored textures, images, environment resources, and any generated or authored asset bundle required for the walkthrough.
- Avoid external runtime CDNs for critical code, fonts, models, HDRIs, or textures. Vendor or locally provide required assets with compatible licenses. Prefer procedural/reusable geometry when it improves reliability.
- Do not depend on remote GLTF models or remote APIs for the essential experience.
- Build an explicit **Download complete campus package** action.
- Provide progress percentage/bytes where available, a sensible storage estimate, success/error/cancel states, and a visible offline-readiness indicator.
- Use `navigator.storage.estimate()` where supported. Explain the limits of estimates and request persistent storage only where the browser supports it and with appropriate user context.
- Verify the complete required asset manifest is present before displaying “Ready offline.” A successful service-worker registration alone is not proof that all 3D assets are cached.
- Resume or safely restart interrupted downloads when practical. Prevent concurrent duplicate downloads. Do not claim completion if one or more required assets failed.
- Allow a visitor to delete the downloaded campus package and see the storage state.
- A core walkable scene must remain available even if optional high-detail assets could not be downloaded. Make this distinction explicit.
- Ensure the app can be served locally or from a static host with no backend.

### Progressive/adaptive loading

Combine offline downloads with device-aware progressive loading:

1. Load the application shell and enough exterior/start-zone assets to begin safely.
2. Prioritize the Main entrance/start area and current/nearby navigation spaces.
3. Prepare nearby rooms/floors and assets in the background.
4. Display elegant loading feedback when a destination is not ready rather than abruptly showing missing geometry.
5. Reuse cached assets and avoid redundant reloads.
6. Provide automatic quality adjustment plus manual Low / Medium / High / Ultra presets.
7. Automatically adjust pixel ratio/resolution scale, shadow quality, antialiasing, optional reflections, and high-cost effects based on device performance.
8. Keep UI interactions responsive even when the 3D scene is loading.

---

## 14. Performance and 3D-engine requirements

### Default technical stack

First inspect the existing repository. If there is no suitable existing implementation, use a dependable web stack based on:

- React + TypeScript + Vite.
- Three.js through React Three Fiber and Drei for scene/controls where beneficial.
- A physics/collision solution such as Rapier for robust walkable collisions, or a carefully implemented alternative with equally reliable tests.
- Framer Motion for HUD transitions and cinematic interface animation.
- A lightweight state store such as Zustand or an equivalent modular state solution.
- Vite PWA/service-worker tooling for offline caching.
- Lucide or an equivalent real icon library.
- CSS variables/design tokens and well-organized CSS; use Tailwind only if the current repo already uses it or it can be configured cleanly.

Use versions compatible with the existing project and the installed runtime. Do not upgrade unrelated dependencies blindly. Avoid adding a complex state, backend, or asset pipeline without a clear need.

### Geometry and rendering strategy

- Use parametric procedural architecture for walls, slabs, floors, ceilings, corridors, stairs, bridge slabs/railings, parapets, door frames, and windows wherever this produces editable, repeatable geometry.
- Use reusable detailed components for desks, chairs, computers, monitors, fans, lights, boards, projectors, cubicle partitions, and office furnishings.
- Instance repeated objects; merge static geometry where helpful; avoid creating thousands of separate heavy draw calls where instancing is suitable.
- Use simple collision proxies separate from detailed visual geometry.
- Use level-of-detail or distance-aware detail for repeated assets where helpful.
- Avoid allocating new materials/geometries every frame. Dispose of resources correctly when scenes/assets unload.
- Load textures lazily and keep compressed/resized texture sizes sensible.
- Avoid giant uncompressed textures, unnecessary post-processing, and continuous expensive animation when objects are static.
- Make quality adaptation measurable and predictable. Respect manual preset choice unless “Auto” is selected.

### Performance states and errors

- Show friendly error/retry UI if a required asset fails to load.
- No silent empty 3D canvas on failure.
- Handle WebGL unavailable/lost context, storage limits, asset download failure, resize, visibility changes, and offline transitions gracefully.
- If the user's device cannot sustain Ultra, automatically adapt only in Auto mode, explain the active setting unobtrusively, and keep geometry/nav functionality available.
- Provide a graceful fallback message if a browser/device cannot support the complete 3D experience; do not pretend a static mock-up is the same as the digital twin.

---

## 15. Suggested maintainable project structure

Adapt to the existing repo if it already has good separation. Otherwise use a clear structure similar to:

```text
src/
  app/
    App.tsx
    routes-or-modes.ts
    store.ts
  config/
    campus.config.ts
    blocks/
      main.config.ts
      annexure.config.ts
    floors/
      main-ground.ts
      main-first.ts
      main-second.ts
      main-third.ts
      annexure-ground.ts
      annexure-first.ts
      annexure-second.ts
      annexure-third.ts
    rooms/
      room-metadata.ts
      room-templates.ts
    navigation/
      navigation-graph.ts
      routes.ts
  scene/
    CampusScene.tsx
    Exterior.tsx
    BuildingShell.tsx
    FloorGeometry.tsx
    Courtyard.tsx
    Stairs.tsx
    Bridge.tsx
    Doors.tsx
    Windows.tsx
    materials.ts
    lights.ts
    collision/
  assets/
    textures/
    references/
    icons/
  components/
    hud/
    search/
    floorplan/
    overview/
    destination-preview/
    settings/
    loading/
    screenshot/
    presentation/
    accessibility/
  features/
    movement/
    navigation/
    inspection/
    comparison/
    session/
    offline/
  styles/
    tokens.css
    global.css
  utils/
  tests/
public/
  manifest.webmanifest
  service-worker-resources-or-pwa-assets/
docs/
  source-review.md
  assumptions.md
  architecture.md
  controls.md
  offline.md
  testing.md
README.md
```

This is a guide, not a rigid file-name requirement. Keep configuration typed and validated. Prefer named, testable modules to one giant component. Keep all room, floor, stair, bridge, entrance, door, and navigation graph data separate from the rendering code.

---

## 16. Data model and map validation

Define typed entities for:

- Campus/block.
- Floor and elevation.
- Room/space (room ID, number, name, category, block, floor, footprint/shape, entry points, metadata, source/confidence).
- Open courtyard/void.
- Stair and landing.
- Door and swing.
- Window group.
- Bridge and explicit endpoint/valid floors.
- Furnishing template/instance.
- Navigation waypoint/edge/portal.
- Asset manifest entry and required/optional status.
- Local bookmark/session data.

Include validation at build/startup for:

- Duplicate room IDs/numbers where prohibited.
- Missing floor/block references.
- Room polygons or footprints outside the building shell.
- Unconnected walkable floor regions.
- A bridge connected to incorrect floors or blocks.
- Any ground-level bridge or path between the blocks.
- Missing stairs/portals for intended floor connections.
- Doorway blocked by fixed geometry.
- Lab furniture count/clearance failures.
- Missing asset IDs and invalid references.
- Room labels that have no underlying configured destination.

Warnings about estimated or sketch-ambiguous data should not crash the app; distinguish soft warnings from fatal geometry/navigation errors. Write validation output to logs/tests and document unresolved findings.

---

## 17. Implementation phases — keep the project runnable at each stage

### Phase 1 — Repository audit and build foundation

- Inspect files, package scripts, dependencies, source assets, and existing app behaviour.
- Document source material and implementation plan.
- Establish/repair a working application build and responsive base layout.
- Create the visual design tokens and core HUD components.
- Confirm a successful baseline build before implementing advanced scene logic.

### Phase 2 — Floor-plan transcription and data model

- Identify each sketch and floor, transcribe room labels/numbers, courtyards, stairs, entrances, restrooms, labs, and connections.
- Build typed, modular configuration files.
- Record source/confidence/notes for uncertain details.
- Create automated consistency checks for room/floor/block and bridge/stair relationships.
- Re-check transcription against the original images, not just a thumbnail or contact sheet.

### Phase 3 — Procedural architectural shell

- Build exterior site approach, both blocks, slabs, walls, corridors, rooms, courtyards, roofline, windows, doors, stairs, and the two bridges.
- Test orientation from the Main entrance.
- Use physically plausible proportions and adjustable estimates.
- Ensure bridges have no roofs and the ground-level gap is blocked.
- Keep the scene visually complete before adding detailed furnishing.

### Phase 4 — Interior room templates and assets

- Implement classroom, lecture hall, lab, staff cabin, Project Hub, Dean's cabin, restroom, and concealed Server Room templates.
- Apply the required furnishings and counts.
- Use instancing/batching for 180-computer lab layouts and repeated light/fan/furniture components.
- Check scales, collision, aisle width, and camera visibility.

### Phase 5 — Walk controller and physical route graph

- Implement first-person/third-person movement, mouse look/pointer lock, orbit view, settings, collision, stair traversal, automatic doors, bridge traversal, and safe recovery.
- Build the configured physical navigation graph.
- Test routes that cross floors and both bridges.
- Prove the ground-level gap cannot be crossed.

### Phase 6 — Navigation, search, floor plans, overview

- Implement destination finder and room directory.
- Implement interactive architectural floor plans, current-position/facing marker, route highlighting, and destination previews.
- Implement room details/contextual labels, object inspection, campus overview, floor isolation, stacked-floor and exploded views.
- Implement room comparison using available evidence.
- Ensure inspection actions never teleport the physical visitor.

### Phase 7 — Opening cinematic and presentation mode

- Build the cinematic exterior reveal with skip/Enter Walkthrough.
- Add optional highlights for Main, Annexure and bridge connections.
- Add presenter toolbar and skippable guided showcase.
- Respect reduced motion and return to normal exploration seamlessly.

### Phase 8 — Offline and progressive loading

- Bundle required runtime files and assets locally.
- Add PWA/service worker, explicit complete campus package download, asset manifest, progress, storage estimate, error/cancel/retry states, verification and offline status.
- Test a genuine offline reload after package download.
- Add progressive loading, nearby-destination priority and quality presets.

### Phase 9 — Persistence, screenshots, accessibility

- Add local resume/start-fresh, saved places, reset controls, PNG screenshot capture and HUD-free mode.
- Add keyboard navigation, contrast, text size, HUD opacity, reduced motion, subtitles, focus indicators, and simplified navigation mode.
- Do not add any room completion or achievement tracking.

### Phase 10 — QA, visual polish, optimization

- Run type checking, lint/build/tests, route validation and offline tests.
- Run the app in the browser if available and inspect the actual rendered scene.
- Fix visual clipping, incorrect orientation, missing room labels, floating furniture, impossible routes, console warnings, failed asset loads, and responsive layout issues.
- Tune lighting/materials/camera and remove unnecessary effects if performance is poor.
- Verify all user-facing actions actually work.

Do not wait for my approval between phases. Keep the repository in a buildable state throughout.

---

## 18. Acceptance criteria — the work is not complete until checked

### Architectural fidelity

- [ ] Both Main and Annexure appear in one coherent 3D world.
- [ ] From outside Main's entrance, Main is on the right and Annexure on the left.
- [ ] Main exterior sign reads “ST. PAUL’S BLOCK”; Annexure has no equivalent sign.
- [ ] Main entrance is between Rooms 401 and 415 and begins the visitor journey.
- [ ] Annexure entrance follows the Dean's cabin / Lecture Hall 1 requirement.
- [ ] Main rooms 401–462 and the Annexure's Lecture Halls 1–3/rooms 469–478/third-floor labs are represented using the source-derived layout.
- [ ] Courtyard voids are empty, open to sky, and remain voids through the floors.
- [ ] Main has two stair positions per floor as drawn; Annexure has one staircase per floor as drawn.
- [ ] Exterior colours, window style/grills, surface materials, classroom interiors, ceilings, tiles, lights, and fans follow the visual reference.
- [ ] No human models are present.

### Bridges and physical navigation

- [ ] First-floor bridge correctly connects the Room 418 / FC(3) side to Room 469 / FC(14) side as shown in the plan.
- [ ] Second-floor bridge correctly connects the Room 434 / FC(6) side to Room 474 / FC(15) side as shown in the plan.
- [ ] Both bridges are open-sided, have a concrete floor and metal railings, and have **no roof**.
- [ ] There is no ground-level bridge or walkable ground route between blocks.
- [ ] Users can walk between blocks on the first and second floors through actual bridges.
- [ ] Users cannot walk through walls, doors when closed, furniture, railings, courtyard voids, floor edges or the gap.
- [ ] Stair traversal and automatically opening doors work continuously without teleportation or loading cuts.
- [ ] Route highlights follow valid passages; any floor-plan selector is preview-only.

### Furnishings and room data

- [ ] Typical classrooms support the configurable 60-seat/15-bench arrangement, blackboard, screen, projector, staff computer, and configured fans/lights.
- [ ] Each lecture hall uses a configurable 120-seat layout and teaching equipment.
- [ ] Every named lab uses the requested shared layout of 180 computers and 3 projectors, with instance/batch optimization.
- [ ] Staff cabins use ten mini-cubicles, five per side, with one computer per cubicle.
- [ ] Project Hub has no student benches/chairs but retains its stated teaching equipment.
- [ ] Main Server Room interior is concealed.
- [ ] Dean's cabin has the stated office furniture.
- [ ] The Annexure second-floor and third-floor boys' restrooms are separate.

### Visitor experience

- [ ] Opening cinematic is skippable and ends outside Main entrance.
- [ ] First-person/third-person/orbit inspection work.
- [ ] Search works by room number/name/category/block/floor.
- [ ] Destination preview shows valid route, floors traversed, block transitions and key turns.
- [ ] Indoor route guidance, live indicators, rerouting, arrival notices and optional spoken directions work.
- [ ] Contextual room labels are subtle; detailed info is optional.
- [ ] Floor plans and stacked-floor/exploded views are interactive and never teleport the visitor.
- [ ] Presentation mode can pause/skip/return to free exploration.
- [ ] Room comparison and object inspection use known data and flag important unknowns.
- [ ] Built-in screenshot downloads an actual scene image; HUD-free capture is available.
- [ ] Local session restore and saved places work without accounts, and saved destinations use physical route previews.
- [ ] No completion screen/checklist/progress achievement system exists.

### Offline, quality and maintainability

- [ ] Application shell works as a PWA-capable/static-hosted app with no backend requirement.
- [ ] Complete campus package download displays progress and a reasonable storage estimate.
- [ ] Offline readiness is only shown after required assets have been verified.
- [ ] After downloading the package, the page can reload and core walkthrough/navigation work without internet.
- [ ] Loading is progressive and device-aware; Low/Medium/High/Ultra presets work.
- [ ] Accessibility controls are implemented and usable.
- [ ] No fatal console errors, broken imports, failed build, dead core controls, missing room configurations, or fabricated route connections remain.
- [ ] README and technical docs describe setup, controls, source limits, offline behaviour, architecture, and known limitations.

---

## 19. Final deliverables

Leave the workspace with:

1. **A fully working source project** that installs and runs using documented commands.
2. **The implemented 3D web application**, not a static mock-up.
3. **Local building/floor/room configuration** separated from rendering and navigation code.
4. **Offline/PWA support** with complete campus-package download and verification.
5. **Automated validation/tests** for route graph, bridge/floor rules, data consistency, and key logic where practical.
6. **README.md** with setup, run/build/test commands, controls, offline download instructions, quality settings, and troubleshooting.
7. `docs/source-review.md` with the supplied source files found and evidence summarized.
8. `docs/assumptions.md` with unverified details and editable estimates.
9. `docs/architecture.md`, `docs/controls.md`, `docs/offline.md`, and `docs/testing.md` or equivalent documentation.
10. A concise list of actual commands run, validation results, known limitations, and the exact command to launch the finished application.

## 20. Final instruction

Start by auditing the current workspace and locating every available source reference. Then implement the project in the phases above without asking more questions. Make sensible autonomous choices for unspecified details, document them, and keep them editable. Prioritize architectural truth, physically valid routes, realistic materials, a refined interface, real offline capability, and a working end-to-end build.

**Do the work. Run the checks. Fix what fails. Do not stop at a plan.**
