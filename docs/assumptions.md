# St. Paul's Digital Twin — Modeling Assumptions & Proportions

> **Status:** Active Reference Configuration  
> **Rule:** Dimensions are editable parametric estimates based on supplied sketches and photos.

---

## 1. Dimensional Defaults (Configurable)

| Parameter | Default Value | Source / Justification |
|:---|:---|:---|
| **Floor-to-Floor Height** | `4.0 m` | Standard institutional multistory academic block. |
| **Clear Ceiling Height** | `3.5 m` | Specified in Master Brief §2. |
| **Corridor Width** | `3.0 m` | Specified in Master Brief §2 (circulation allowance). |
| **Courtyard Parapet Height**| `1.2 m` | Specified in Master Brief §2 & §4 (fall prevention around voids). |
| **Exterior Wall Thickness**| `0.30 m` | Double brick/concrete masonry structure. |
| **Interior Wall Thickness**| `0.20 m` | Single partition/structural masonry wall. |
| **Classroom Width x Depth** | `8.0 m x 9.0 m` | Accommodates 15 benches (60 seats) + teaching zone. |
| **Lab Width x Depth** | `14.0 m x 18.0 m`| Accommodates 3 columns x 12 rows x 5 PCs (180 PCs) with aisles. |
| **Lecture Hall W x D** | `10.0 m x 14.0 m`| Accommodates 120 student seating + front lecture area. |
| **Staff Cabin W x D** | `8.0 m x 10.0 m` | Accommodates 10 cubicles (5 per side) with 2m central aisle. |
| **Bridge Width** | `3.0 m` | Matches connecting corridor width. |
| **Bridge Gap (Main-Annexure)**| `12.0 m`| Plausible physical separation between campus blocks. |
| **Door Dimensions** | `1.0 m W x 2.2 m H`| Standard single-leaf institutional solid wooden door. |
| **Window Module Size** | `2.4 m W x 1.6 m H`| 3-panel sliding window unit with security grills. |

---

## 2. Structural & Architectural Inferences

1. **Courtyard Parapets:**
   - Concrete parapet wall (1.2m) around all four central light wells in Main Block and the light well in Annexure Block.
   - Floor slab is omitted in these zones, creating true open-to-sky vertical shafts.
2. **Door Automation:**
   - Doors start closed; open smoothly via pivot rotation (90 degrees away from user) when player is within 2.5 meters.
3. **Bridge Parapets:**
   - Steel handrails/balustrades (1.1m high) along both exterior edges of both 1st and 2nd floor bridges.
   - Strictly open-air (no roof).
4. **Lighting Systems:**
   - Classrooms: 8 ceiling fans + 8 surface-mounted LED panels (40W equivalents).
   - Labs: 18 ceiling fans + 18 surface-mounted LED panels.
   - Corridors: Linear flush ceiling luminaires.
5. **Exterior Facade:**
   - Primary: Off-white/light-grey stucco concrete.
   - Secondary: Terracotta reddish-brown painted architectural spandrels and vertical column accents.
   - Signage: White 3D lettering "ST. PAUL'S BLOCK" mounted on top roof parapet fascia of Main Block.
