# St. Paul's Digital Twin — Quality Assurance & Testing Suite

> **Status:** Automated & Manual Verification Results

---

## 1. Automated Map & Data Model Validation

The validation suite in `src/config/validation.ts` executes automatically at application startup and verifies the integrity of the campus data model against the requirements in the Master Brief:

```typescript
import { validateCampusData } from './src/config/validation';
const result = validateCampusData();
console.log(result);
```

### Verification Checks Executed:
1. **Duplicate Room IDs:** Zero duplicates across all 8 floor configurations.
2. **Bridge Specifications:**
   - First-floor bridge connects Room 418 / FC(3) to Room 469 / FC(14).
   - Second-floor bridge connects Room 434 / FC(6) to Room 474 / FC(15).
   - Bridges have `hasRoof: false` (strictly open-air with safety railings).
   - Zero ground-level bridges exist.
3. **Ground-Level Separation:** Physics collision prevents direct transit between Main and Annexure at $Y < 2.5\text{ m}$.
4. **Standardized Lab Capacities:**
   - CSS Lab (Ground): 180 PCs + 3 Projectors.
   - Design Thinking Lab (1st Floor): 180 PCs + 3 Projectors.
   - Machine Vision Lab (2nd Floor): 180 PCs + 3 Projectors.
   - Web 3.0 Lab (3rd Floor): 180 PCs + 3 Projectors.
   - Gen AI Lab (Annexure 3rd Floor): 180 PCs + 3 Projectors.
   - Quantum Computing Lab (Annexure 3rd Floor): 180 PCs + 3 Projectors.
5. **Restroom Separation:**
   - Annexure 2nd Floor boys restroom (`annexure-2-boys-restroom`) and 3rd Floor boys restroom (`annexure-3-boys-restroom`) are verified as two distinct facilities on different elevations.
6. **Concealed Server Room:**
   - Server Room on Main 2nd Floor is configured with `server_room_concealed` template, locked opaque door, and obscured interior.
7. **Courtyard Voids:**
   - 4 vertical light wells in Main Block and 1 in Annexure Block verified as empty, open-to-sky voids with 1.2m parapet collision barriers.

---

## 2. Route Engine & Navigation Graph Verification

Tested via `src/features/navigation/route-engine.ts`:
- **Main Ground to Annexure Ground:** Verified that route correctly guides visitor up the West Staircase to the First Floor, crosses the 1st Floor Bridge to Annexure, and descends the Annexure Staircase to Ground Floor (since direct ground-level transit is blocked).
- **Inter-Floor Traversal:** Verified that vertical routes correctly connect consecutive floor waypoints via stair landings.
- **Rerouting:** Verified that moving away from the calculated path triggers dynamic shortest-path recalculation.

---

## 3. Build & Compiler Verification

- **Command:** `npm run build`
- **TypeScript:** Strict type checking (`tsc --noEmit`) passes with 0 errors.
- **Vite Bundler:** Production assets bundled cleanly into `dist/` with chunk sizes optimized.
