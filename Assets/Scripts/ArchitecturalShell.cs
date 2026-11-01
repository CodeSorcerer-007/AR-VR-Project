using UnityEngine;

namespace StPaulsVR
{
    public static class ArchitecturalShell
    {
        public static void BuildCampusShell(Transform parent,
            Material wallMat, Material wallGreyMat, Material terracottaMat, Material floorMat,
            Material windowGlassMat, Material windowFrameMat, Material windowSillMat, Material sunshadeNavyMat,
            Material acCompressorMat, Material acGrillMat, Material pvcPipeMat,
            Material columnWhiteMat, Material porticoMaroonMat, Material signGoldMat, Material signBlueMat,
            Material asphaltMat, Material grassMat, Material curbMat, Material railingMat,
            Material solarPanelMat, Material solarFrameMat, Material barricadeYellowMat,
            Material treeTrunkMat, Material treeFoliageMat,
            Material woodSlatMat, Material curbBlueMat, Material curbWhiteMat, Material terracottaAccentMat)
        {
            var shellRoot = new GameObject("Architectural_Shell");
            shellRoot.transform.SetParent(parent);
            shellRoot.transform.localPosition = Vector3.zero;

            // 1. Site Grounds, Driveways, Landscaped Lawn Islands with Blue/White Striped Curbs, Trees & Barricades
            BuildGroundSite(shellRoot.transform, asphaltMat, grassMat, curbMat, curbBlueMat, curbWhiteMat, barricadeYellowMat, treeTrunkMat, treeFoliageMat);

            // 2. Main Block Shell, Facades, Windows, Signature Corner Towers, Modern Entrance Portal & Rooftop Signage (X: -21 to +21)
            BuildMainBlockShell(shellRoot.transform, wallMat, terracottaMat, floorMat,
                windowGlassMat, windowFrameMat, windowSillMat, sunshadeNavyMat,
                acCompressorMat, acGrillMat, pvcPipeMat,
                columnWhiteMat, porticoMaroonMat, signGoldMat, signBlueMat, railingMat,
                solarPanelMat, solarFrameMat, woodSlatMat, terracottaAccentMat);

            // 3. Annexure Block Shell on the LEFT (X: -53 to -33) with Verandas, Grey Facade & Pergola
            BuildAnnexureBlockShell(shellRoot.transform, wallMat, wallGreyMat, terracottaMat, floorMat,
                windowGlassMat, windowFrameMat, windowSillMat, sunshadeNavyMat,
                acCompressorMat, acGrillMat, pvcPipeMat, columnWhiteMat, railingMat);
        }

        private static void BuildGroundSite(Transform parent, Material asphaltMat, Material grassMat, Material curbMat,
            Material curbBlueMat, Material curbWhiteMat, Material barricadeYellowMat, Material treeTrunkMat, Material treeFoliageMat)
        {
            var siteObj = new GameObject("Site_Terrain");
            siteObj.transform.SetParent(parent);

            // 1. Base Ground Terrain (240m x 220m)
            var basePlane = GameObject.CreatePrimitive(PrimitiveType.Plane);
            basePlane.name = "BaseGroundPlane";
            basePlane.transform.SetParent(siteObj.transform);
            basePlane.transform.position = new Vector3(-16, -0.05f, 16);
            basePlane.transform.localScale = new Vector3(24, 1, 22);
            basePlane.GetComponent<Renderer>().sharedMaterial = grassMat;

            // 2. Main Approach Road (Z: -20 to -30, X: -75 to 35) with white dashed centerlines
            var mainRoad = GameObject.CreatePrimitive(PrimitiveType.Cube);
            mainRoad.name = "MainApproachRoad";
            mainRoad.transform.SetParent(siteObj.transform);
            mainRoad.transform.position = new Vector3(-20, 0.01f, -25);
            mainRoad.transform.localScale = new Vector3(120, 0.04f, 10);
            mainRoad.GetComponent<Renderer>().sharedMaterial = asphaltMat;

            // Road center dashed white lines
            for (float rx = -70f; rx <= 30f; rx += 10f)
            {
                var dash = GameObject.CreatePrimitive(PrimitiveType.Cube);
                dash.name = "RoadDash";
                dash.transform.SetParent(mainRoad.transform);
                dash.transform.position = new Vector3(rx, 0.04f, -25);
                dash.transform.localScale = new Vector3(5.0f, 0.01f, 0.25f);
                dash.GetComponent<Renderer>().sharedMaterial = curbWhiteMat;
                Object.DestroyImmediate(dash.GetComponent<Collider>());
            }

            // 3. Paved Forecourt / Campus Driveway (Z: -8 to -20, X: -75 to 35)
            var forecourt = GameObject.CreatePrimitive(PrimitiveType.Cube);
            forecourt.name = "ForecourtDriveway";
            forecourt.transform.SetParent(siteObj.transform);
            forecourt.transform.position = new Vector3(-20, 0.02f, -14);
            forecourt.transform.localScale = new Vector3(120, 0.04f, 12);
            forecourt.GetComponent<Renderer>().sharedMaterial = asphaltMat;

            // Alternating Blue and White Striped Curb along Driveway Front Boundary (Z = -20)
            CreateStripedCurb(siteObj.transform, "ForecourtCurb_South_Left", new Vector3(-70f, 0.08f, -20f), new Vector3(-4.5f, 0.08f, -20f), 0.28f, 0.24f, curbBlueMat, curbWhiteMat);
            CreateStripedCurb(siteObj.transform, "ForecourtCurb_South_Right", new Vector3(4.5f, 0.08f, -20f), new Vector3(30f, 0.08f, -20f), 0.28f, 0.24f, curbBlueMat, curbWhiteMat);

            // 4. Open 12m Wide Connecting Driveway Between Main & Annexure (X: -33 to -21, Z: -20 to 46)
            var connectDriveway = GameObject.CreatePrimitive(PrimitiveType.Cube);
            connectDriveway.name = "ConnectingAlleyDriveway";
            connectDriveway.transform.SetParent(siteObj.transform);
            connectDriveway.transform.position = new Vector3(-27, 0.025f, 13);
            connectDriveway.transform.localScale = new Vector3(11.8f, 0.04f, 66);
            connectDriveway.GetComponent<Renderer>().sharedMaterial = asphaltMat;

            // Driveway alternating blue-and-white striped curbs flanking alleyway
            CreateStripedCurb(siteObj.transform, "AlleyCurb_West", new Vector3(-32.9f, 0.08f, -20f), new Vector3(-32.9f, 0.08f, 46f), 0.28f, 0.24f, curbBlueMat, curbWhiteMat);
            CreateStripedCurb(siteObj.transform, "AlleyCurb_East", new Vector3(-21.1f, 0.08f, -20f), new Vector3(-21.1f, 0.08f, 46f), 0.28f, 0.24f, curbBlueMat, curbWhiteMat);

            // 5. Landscaped Lawn Islands with Blue/White Striped Curbs (Matching Real Campus Photos & Satellite)
            // Annexure Lawn Island (In front of Annexure solid wall at X = -45, Z = -13.5)
            BuildLawnIsland(siteObj.transform, "LawnIsland_Annexure", new Vector3(-45, 0.08f, -13.5f), new Vector3(15, 0.22f, 6.5f), grassMat, curbBlueMat, curbWhiteMat);
            CreateCampusTree(siteObj.transform, new Vector3(-50.5f, 0, -13.5f), 0.85f, treeTrunkMat, treeFoliageMat);
            CreateCampusTree(siteObj.transform, new Vector3(-47.0f, 0, -13.2f), 0.90f, treeTrunkMat, treeFoliageMat);
            CreateCampusTree(siteObj.transform, new Vector3(-43.0f, 0, -13.8f), 0.80f, treeTrunkMat, treeFoliageMat);
            CreateCampusTree(siteObj.transform, new Vector3(-39.5f, 0, -13.5f), 0.85f, treeTrunkMat, treeFoliageMat);

            // Main West Lawn Island (In front of Main Block West Wing at X = -12, Z = -14)
            BuildLawnIsland(siteObj.transform, "LawnIsland_MainWest", new Vector3(-12, 0.08f, -14), new Vector3(15, 0.22f, 6), grassMat, curbBlueMat, curbWhiteMat);
            CreateCampusTree(siteObj.transform, new Vector3(-16.0f, 0, -14.2f), 1.05f, treeTrunkMat, treeFoliageMat);
            CreateCampusTree(siteObj.transform, new Vector3(-8.0f, 0, -13.8f), 0.95f, treeTrunkMat, treeFoliageMat);

            // Main East Lawn Island (In front of Main Block East Wing at X = +12, Z = -14)
            BuildLawnIsland(siteObj.transform, "LawnIsland_MainEast", new Vector3(12, 0.08f, -14), new Vector3(15, 0.22f, 6), grassMat, curbBlueMat, curbWhiteMat);
            CreateCampusTree(siteObj.transform, new Vector3(8.0f, 0, -14.2f), 0.95f, treeTrunkMat, treeFoliageMat);
            CreateCampusTree(siteObj.transform, new Vector3(16.0f, 0, -13.8f), 1.05f, treeTrunkMat, treeFoliageMat);

            // 6. Paved Walkway Path to Grand Entrance Portico (X: -3.5 to +3.5, Z: -16 to -11)
            var walkPath = GameObject.CreatePrimitive(PrimitiveType.Cube);
            walkPath.name = "EntrancePavedWalkway";
            walkPath.transform.SetParent(siteObj.transform);
            walkPath.transform.position = new Vector3(0, 0.035f, -13.5f);
            walkPath.transform.localScale = new Vector3(7.0f, 0.03f, 5.0f);
            walkPath.GetComponent<Renderer>().sharedMaterial = curbWhiteMat;

            // 7. Sathyabama Yellow Safety Barricades flanking entrance driveway (Photo 9.29.07 PM (1))
            CreateSathyabamaBarricade(siteObj.transform, new Vector3(-3.2f, 0, -16.5f), 5.0f, barricadeYellowMat);
            CreateSathyabamaBarricade(siteObj.transform, new Vector3(3.2f, 0, -16.5f), -5.0f, barricadeYellowMat);

            // ─── ENTRANCE FLOOR BLOCKER: Solid concrete slab covering building footprint at ground ───
            // This prevents the grass BaseGroundPlane (Y=-0.05) from bleeding through the
            // entrance portal opening and interior stairwell zone.
            // Main Block footprint: X -21 to +21, Z -8 to +40. Asphalt/concrete at Y=0.03
            var entranceSlab = GameObject.CreatePrimitive(PrimitiveType.Cube);
            entranceSlab.name = "MainBlock_GroundBlocker";
            entranceSlab.transform.SetParent(siteObj.transform);
            entranceSlab.transform.position = new Vector3(0f, -0.03f, 16.0f);
            entranceSlab.transform.localScale = new Vector3(42.0f, 0.04f, 48.0f);
            entranceSlab.GetComponent<Renderer>().sharedMaterial = asphaltMat;
            Object.DestroyImmediate(entranceSlab.GetComponent<Collider>()); // no physics - ArchShell slabs handle collision

            // Annexure Block footprint: X -53 to -33, Z -8 to +44
            var annexSlab = GameObject.CreatePrimitive(PrimitiveType.Cube);
            annexSlab.name = "AnnexBlock_GroundBlocker";
            annexSlab.transform.SetParent(siteObj.transform);
            annexSlab.transform.position = new Vector3(-43.0f, -0.03f, 18.0f);
            annexSlab.transform.localScale = new Vector3(20.0f, 0.04f, 52.0f);
            annexSlab.GetComponent<Renderer>().sharedMaterial = asphaltMat;
            Object.DestroyImmediate(annexSlab.GetComponent<Collider>());
        }

        private static void BuildLawnIsland(Transform parent, string name, Vector3 pos, Vector3 size, Material grassMat, Material blueMat, Material whiteMat)
        {
            var island = new GameObject(name);
            island.transform.SetParent(parent);
            island.transform.position = pos;

            var grass = GameObject.CreatePrimitive(PrimitiveType.Cube);
            grass.name = "Grass";
            grass.transform.SetParent(island.transform);
            grass.transform.localPosition = Vector3.zero;
            grass.transform.localScale = size;
            grass.GetComponent<Renderer>().sharedMaterial = grassMat;

            float curbH = 0.28f;
            float curbT = 0.24f;
            float halfX = size.x * 0.5f;
            float halfZ = size.z * 0.5f;

            // Striped blue-and-white curbs around all 4 perimeter edges (Photos 9.29.07 PM)
            CreateStripedCurb(island.transform, "Curb_Front", new Vector3(-halfX, 0.05f, -halfZ), new Vector3(halfX, 0.05f, -halfZ), curbH, curbT, blueMat, whiteMat);
            CreateStripedCurb(island.transform, "Curb_Back", new Vector3(halfX, 0.05f, halfZ), new Vector3(-halfX, 0.05f, halfZ), curbH, curbT, blueMat, whiteMat);
            CreateStripedCurb(island.transform, "Curb_Left", new Vector3(-halfX, 0.05f, halfZ), new Vector3(-halfX, 0.05f, -halfZ), curbH, curbT, blueMat, whiteMat);
            CreateStripedCurb(island.transform, "Curb_Right", new Vector3(halfX, 0.05f, -halfZ), new Vector3(halfX, 0.05f, halfZ), curbH, curbT, blueMat, whiteMat);
        }

        private static void CreateStripedCurb(Transform parent, string name, Vector3 startPos, Vector3 endPos, float curbH, float curbT, Material blueMat, Material whiteMat, float segmentLen = 1.0f)
        {
            var curbGroup = new GameObject(name);
            curbGroup.transform.SetParent(parent, false);
            curbGroup.transform.localPosition = Vector3.zero;
            curbGroup.transform.localRotation = Quaternion.identity;

            Vector3 diff = endPos - startPos;
            float totalLen = diff.magnitude;
            if (totalLen < 0.05f) return;
            Vector3 dir = diff.normalized;
            int count = Mathf.Max(1, Mathf.RoundToInt(totalLen / segmentLen));
            float actualLen = totalLen / count;

            for (int i = 0; i < count; i++)
            {
                var block = GameObject.CreatePrimitive(PrimitiveType.Cube);
                block.name = $"CurbSegment_{i}";
                block.transform.SetParent(curbGroup.transform, false);
                Vector3 center = startPos + dir * ((i + 0.5f) * actualLen);
                block.transform.localPosition = center;
                if (dir != Vector3.zero)
                {
                    block.transform.localRotation = Quaternion.LookRotation(dir, Vector3.up);
                }
                block.transform.localScale = new Vector3(curbT, curbH, actualLen * 0.98f);
                block.GetComponent<Renderer>().sharedMaterial = (i % 2 == 0) ? blueMat : whiteMat;
            }
        }

        private static void CreateCurbSegment(Transform parent, string name, Vector3 localPos, Vector3 scale, Material mat)
        {
            var curb = GameObject.CreatePrimitive(PrimitiveType.Cube);
            curb.name = name;
            curb.transform.SetParent(parent, false);
            curb.transform.localPosition = localPos;
            curb.transform.localScale = scale;
            curb.GetComponent<Renderer>().sharedMaterial = mat;
        }

        private static void CreateCampusTree(Transform parent, Vector3 pos, float scale, Material trunkMat, Material foliageMat)
        {
            var tree = new GameObject("CampusTree");
            tree.transform.SetParent(parent);
            tree.transform.position = pos;
            tree.transform.localScale = Vector3.one * scale;

            // Trunk
            var trunk = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
            trunk.name = "Trunk";
            trunk.transform.SetParent(tree.transform);
            trunk.transform.localPosition = new Vector3(0, 1.1f, 0);
            trunk.transform.localScale = new Vector3(0.28f, 1.1f, 0.28f);
            trunk.GetComponent<Renderer>().sharedMaterial = trunkMat;

            // Foliage Base
            var folBase = GameObject.CreatePrimitive(PrimitiveType.Sphere);
            folBase.name = "FoliageBase";
            folBase.transform.SetParent(tree.transform);
            folBase.transform.localPosition = new Vector3(0, 2.4f, 0);
            folBase.transform.localScale = new Vector3(2.3f, 1.8f, 2.3f);
            folBase.GetComponent<Renderer>().sharedMaterial = foliageMat;

            // Foliage Crown
            var folCrown = GameObject.CreatePrimitive(PrimitiveType.Sphere);
            folCrown.name = "FoliageCrown";
            folCrown.transform.SetParent(tree.transform);
            folCrown.transform.localPosition = new Vector3(0, 3.2f, 0);
            folCrown.transform.localScale = new Vector3(1.7f, 1.4f, 1.7f);
            folCrown.GetComponent<Renderer>().sharedMaterial = foliageMat;
        }

        private static void CreateSathyabamaBarricade(Transform parent, Vector3 pos, float rotY, Material yellowMat)
        {
            var bar = new GameObject("SathyabamaBarricade");
            bar.transform.SetParent(parent);
            bar.transform.position = pos;
            bar.transform.localRotation = Quaternion.Euler(0, rotY, 0);

            // Yellow tubular top rail
            var topRail = GameObject.CreatePrimitive(PrimitiveType.Cube);
            topRail.name = "TopRail";
            topRail.transform.SetParent(bar.transform);
            topRail.transform.localPosition = new Vector3(0, 0.55f, 0);
            topRail.transform.localScale = new Vector3(2.0f, 0.08f, 0.08f);
            topRail.GetComponent<Renderer>().sharedMaterial = yellowMat;

            // Left & Right upright posts
            var postL = GameObject.CreatePrimitive(PrimitiveType.Cube);
            postL.name = "PostL";
            postL.transform.SetParent(bar.transform);
            postL.transform.localPosition = new Vector3(-0.96f, 0.3f, 0);
            postL.transform.localScale = new Vector3(0.08f, 0.6f, 0.08f);
            postL.GetComponent<Renderer>().sharedMaterial = yellowMat;

            var postR = GameObject.CreatePrimitive(PrimitiveType.Cube);
            postR.name = "PostR";
            postR.transform.SetParent(bar.transform);
            postR.transform.localPosition = new Vector3(0.96f, 0.3f, 0);
            postR.transform.localScale = new Vector3(0.08f, 0.6f, 0.08f);
            postR.GetComponent<Renderer>().sharedMaterial = yellowMat;

            // Black Outrigger Feet
            var footL = GameObject.CreatePrimitive(PrimitiveType.Cube);
            footL.name = "FootL";
            footL.transform.SetParent(bar.transform);
            footL.transform.localPosition = new Vector3(-0.96f, 0.04f, 0);
            footL.transform.localScale = new Vector3(0.08f, 0.08f, 0.6f);
            footL.GetComponent<Renderer>().sharedMaterial = yellowMat;

            var footR = GameObject.CreatePrimitive(PrimitiveType.Cube);
            footR.name = "FootR";
            footR.transform.SetParent(bar.transform);
            footR.transform.localPosition = new Vector3(0.96f, 0.04f, 0);
            footR.transform.localScale = new Vector3(0.08f, 0.08f, 0.6f);
            footR.GetComponent<Renderer>().sharedMaterial = yellowMat;

            // Yellow Center Board with SATHYABAMA text
            var panel = GameObject.CreatePrimitive(PrimitiveType.Cube);
            panel.name = "CenterPanel";
            panel.transform.SetParent(bar.transform);
            panel.transform.localPosition = new Vector3(0, 0.32f, 0);
            panel.transform.localScale = new Vector3(1.8f, 0.36f, 0.02f);
            panel.GetComponent<Renderer>().sharedMaterial = yellowMat;

            var textObj = new GameObject("BarricadeText");
            textObj.transform.SetParent(panel.transform);
            textObj.transform.localPosition = new Vector3(0, 0, -0.6f);
            textObj.transform.localRotation = Quaternion.identity;
            var textMesh = textObj.AddComponent<TextMesh>();
            textMesh.text = "SATHYABAMA";
            textMesh.fontSize = 26;
            textMesh.characterSize = 0.025f;
            textMesh.alignment = TextAlignment.Center;
            textMesh.anchor = TextAnchor.MiddleCenter;
            textMesh.color = new Color(0.1f, 0.12f, 0.16f);
        }

        private static void BuildMainBlockShell(Transform parent,
            Material wallMat, Material terracottaMat, Material floorMat,
            Material windowGlassMat, Material windowFrameMat, Material windowSillMat, Material sunshadeNavyMat,
            Material acCompressorMat, Material acGrillMat, Material pvcPipeMat,
            Material columnWhiteMat, Material porticoMaroonMat, Material signGoldMat, Material signBlueMat,
            Material railingMat, Material solarPanelMat, Material solarFrameMat,
            Material woodSlatMat, Material terracottaAccentMat)
        {
            var mainObj = new GameObject("MainBlock_ArchitecturalShell");
            mainObj.transform.SetParent(parent);

            float x0 = -21.0f, x1 = 21.0f;
            float z0 = -8.0f, z1 = 40.0f;
            float width = x1 - x0;     // 42m
            float depth = z1 - z0;     // 48m
            float totalHeight = 16.0f; // 4 floors x 4m
            float wallT = 0.35f;

            // 1. Floor Slabs (Ground, 1st, 2nd, 3rd, Roof) with Stairwell Cutouts & Courtyard Openings
            for (int f = 0; f <= 4; f++)
            {
                float y = f * 4.0f;
                BuildMainFloorSlabWithOpenings(mainObj.transform, $"MainSlab_Floor_{f}", y, f, floorMat, railingMat);
            }

            // 2. Terracotta/Dark Bronze Cornice Horizontal Facade Bands at each Storey Line
            for (int f = 1; f <= 4; f++)
            {
                float y = f * 4.0f;
                CreateCorniceBand(mainObj.transform, $"Band_South_F{f}", new Vector3(0, y - 0.15f, z0 - wallT * 0.5f), new Vector3(width + 0.6f, 0.35f, 0.45f), terracottaMat);
                CreateCorniceBand(mainObj.transform, $"Band_North_F{f}", new Vector3(0, y - 0.15f, z1 + wallT * 0.5f), new Vector3(width + 0.6f, 0.35f, 0.45f), terracottaMat);
                CreateCorniceBand(mainObj.transform, $"Band_West_F{f}", new Vector3(x0 - wallT * 0.5f, y - 0.15f, 16.0f), new Vector3(0.45f, 0.35f, depth + 0.6f), terracottaMat);
                CreateCorniceBand(mainObj.transform, $"Band_East_F{f}", new Vector3(x1 + wallT * 0.5f, y - 0.15f, 16.0f), new Vector3(0.45f, 0.35f, depth + 0.6f), terracottaMat);
            }

            // 3. Facade Walls with REAL Window Openings, Sills, Chajjas & AC Compressor Units
            for (int f = 0; f < 4; f++)
            {
                float baseY = f * 4.0f;
                bool isGround = f == 0;

                // ── SOUTH FACADE (Front Approach, Z = -8) ──
                float[] southWinX = isGround ? new float[] { -18f, -12f, -6f, 6f, 12f, 18f } : new float[] { -18f, -12f, -6f, 0f, 6f, 12f, 18f };
                float[] southAcX = !isGround ? new float[] { -18f, -12f, -6f, 6f, 12f, 18f } : new float[0];
                float[] southDownspoutsX = new float[] { -15f, -9f, 9f, 15f };

                // Build South Wall with Openings for Windows (and open Entrance Portal on ground floor)
                BuildWallWithWindowOpeningsX(mainObj.transform, $"Main_SouthWall_F{f}",
                    x0, x1, z0, baseY, 3.8f, wallT, southWinX,
                    wallMat, windowGlassMat, windowFrameMat, windowSillMat, sunshadeNavyMat, true,
                    isGround, 3.6f);

                // Split-AC Compressors under South window bays
                foreach (var ax in southAcX)
                {
                    CreateACOutdoorUnit(mainObj.transform, new Vector3(ax, baseY + 0.55f, z0 - 0.18f), Vector3.back, acCompressorMat, acGrillMat);
                }

                // Downspout drain pipes
                if (isGround)
                {
                    foreach (var dx in southDownspoutsX)
                    {
                        CreateDownspoutPipe(mainObj.transform, new Vector3(dx, 8.0f, z0 - 0.22f), 16.0f, pvcPipeMat);
                    }
                }

                // ── NORTH FACADE (Rear, Z = 40) ──
                float[] northWinX = new float[] { -18f, -12f, -6f, 0f, 6f, 12f, 18f };
                float[] northAcX = !isGround ? new float[] { -18f, -12f, -6f, 6f, 12f, 18f } : new float[0];
                float[] northDownspoutsX = new float[] { -15f, -9f, 9f, 15f };

                BuildWallWithWindowOpeningsX(mainObj.transform, $"Main_NorthWall_F{f}",
                    x0, x1, z1, baseY, 3.8f, wallT, northWinX,
                    wallMat, windowGlassMat, windowFrameMat, windowSillMat, sunshadeNavyMat, false);

                foreach (var ax in northAcX)
                {
                    CreateACOutdoorUnit(mainObj.transform, new Vector3(ax, baseY + 0.55f, z1 + 0.18f), Vector3.forward, acCompressorMat, acGrillMat);
                }

                if (isGround)
                {
                    foreach (var dx in northDownspoutsX)
                    {
                        CreateDownspoutPipe(mainObj.transform, new Vector3(dx, 8.0f, z1 + 0.22f), 16.0f, pvcPipeMat);
                    }
                }

                // ── WEST FACADE (Facing Alleyway/Annexure, X = -21) ──
                float[] westWinZ = (f == 1 || f == 2) ? new float[] { 8f, 16f, 24f, 32f } : new float[] { 0f, 8f, 16f, 24f, 32f };
                float[] westAcZ = !isGround ? new float[] { 12f, 20f, 28f } : new float[0];
                bool hasBridgeAperture = (f == 1 || f == 2);

                BuildWallWithWindowOpeningsZ(mainObj.transform, $"Main_WestWall_F{f}",
                    z0, z1, x0, baseY, 3.8f, wallT, westWinZ,
                    wallMat, windowGlassMat, windowFrameMat, windowSillMat, sunshadeNavyMat, true,
                    hasBridgeAperture, 1.5f, 1.5f);

                foreach (var az in westAcZ)
                {
                    CreateACOutdoorUnit(mainObj.transform, new Vector3(x0 - 0.18f, baseY + 0.55f, az), Vector3.left, acCompressorMat, acGrillMat);
                }

                // ── EAST FACADE (Outer Lawn Side, X = +21) ──
                float[] eastWinZ = new float[] { 0f, 8f, 16f, 24f, 32f };
                float[] eastAcZ = !isGround ? new float[] { 4f, 12f, 20f, 28f } : new float[0];

                BuildWallWithWindowOpeningsZ(mainObj.transform, $"Main_EastWall_F{f}",
                    z0, z1, x1, baseY, 3.8f, wallT, eastWinZ,
                    wallMat, windowGlassMat, windowFrameMat, windowSillMat, sunshadeNavyMat, false);

                foreach (var az in eastAcZ)
                {
                    CreateACOutdoorUnit(mainObj.transform, new Vector3(x1 + 0.18f, baseY + 0.55f, az), Vector3.right, acCompressorMat, acGrillMat);
                }
            }

            // 4. Authentic Modern Flush Coffee-Bronze Entrance Portal with Gold Lettering & Teak Wood-Slat Ceiling (Photo 9.29.08 PM)
            BuildModernEntrancePortal(mainObj.transform, z0, windowFrameMat, porticoMaroonMat, woodSlatMat, signGoldMat, floorMat, acGrillMat);

            // 5. Signature 4-Storey Corner Feature Wings with Multi-Storey Glass Curtain Walls (Photos 9.29.07 PM)
            BuildSignatureCornerTowers(mainObj.transform, z0, wallMat, windowGlassMat, windowFrameMat, terracottaAccentMat);

            // 6. Rooftop Parapet, Gold "ST. PAUL'S BLOCK" Signage & Solar Array (Photo 9.29.08 PM)
            BuildMainRooftopSignage(mainObj.transform, totalHeight, width, depth, z0, porticoMaroonMat, windowFrameMat, signGoldMat);
            CreateSolarArray(mainObj.transform, new Vector3(0, totalHeight + 0.35f, 16f), solarPanelMat, solarFrameMat, terracottaMat);
        }

        private static void BuildMainFloorSlabWithOpenings(Transform parent, string slabName, float y, int floorIndex, Material floorMat, Material railingMat)
        {
            var slabGroup = new GameObject(slabName);
            slabGroup.transform.SetParent(parent);

            if (floorIndex == 0)
            {
                // Ground Floor: 100% Solid Floor Slab across entire footprint (X: -21 to +21, Z: -8 to +40)
                CreateSlabPatch(slabGroup.transform, "Slab_Ground_Complete", new Vector3(0f, y - 0.15f, 16.0f), new Vector3(42.2f, 0.35f, 48.2f), floorMat);
            }
            else if (floorIndex == 4)
            {
                // Roof Level: Solid roof over all rooms and corridors
                CreateSlabPatch(slabGroup.transform, "Roof_SouthWing", new Vector3(0f, y - 0.15f, -3.0f), new Vector3(42.2f, 0.35f, 10.2f), floorMat);
                CreateSlabPatch(slabGroup.transform, "Roof_NorthWing", new Vector3(0f, y - 0.15f, 35.0f), new Vector3(42.2f, 0.35f, 10.2f), floorMat);
                CreateSlabPatch(slabGroup.transform, "Roof_WestRooms", new Vector3(-18.0f, y - 0.15f, 16.0f), new Vector3(6.4f, 0.35f, 28.2f), floorMat);
                CreateSlabPatch(slabGroup.transform, "Roof_EastRooms", new Vector3(18.0f, y - 0.15f, 16.0f), new Vector3(6.4f, 0.35f, 28.2f), floorMat);
                CreateSlabPatch(slabGroup.transform, "Roof_CentralCore", new Vector3(0f, y - 0.15f, 16.0f), new Vector3(22.4f, 0.35f, 12.4f), floorMat);
                CreateSlabPatch(slabGroup.transform, "Roof_Corridor_W", new Vector3(-13.0f, y - 0.15f, 16.0f), new Vector3(4.4f, 0.35f, 28.2f), floorMat);
                CreateSlabPatch(slabGroup.transform, "Roof_Corridor_E", new Vector3(13.0f, y - 0.15f, 16.0f), new Vector3(4.4f, 0.35f, 28.2f), floorMat);
                CreateSlabPatch(slabGroup.transform, "Roof_Transverse_S", new Vector3(0f, y - 0.15f, 6.0f), new Vector3(6.4f, 0.35f, 8.4f), floorMat);
                CreateSlabPatch(slabGroup.transform, "Roof_Transverse_N", new Vector3(0f, y - 0.15f, 26.0f), new Vector3(6.4f, 0.35f, 8.4f), floorMat);

                // Arched Pergola / Trellis Framework spanning over the 4 open-to-sky courtyards (Photo 9.29.16 PM (2))
                var frameMat = floorMat;
                BuildRooftopPergola(slabGroup.transform, new Vector3(-7.0f, y, 6.0f), new Vector3(7.2f, 1.8f, 7.8f), frameMat);
                BuildRooftopPergola(slabGroup.transform, new Vector3(7.0f, y, 6.0f), new Vector3(7.2f, 1.8f, 7.8f), frameMat);
                BuildRooftopPergola(slabGroup.transform, new Vector3(-7.0f, y, 26.0f), new Vector3(7.2f, 1.8f, 7.8f), frameMat);
                BuildRooftopPergola(slabGroup.transform, new Vector3(7.0f, y, 26.0f), new Vector3(7.2f, 1.8f, 7.8f), frameMat);
            }
            else
            {
                // Upper Floors 1, 2, 3: Architectural Slabs with Open-to-Sky Courtyard Wells and Walkable Stair Shafts
                // 1. South Wing (Rooms + South Corridor, Z: -8 to +2.1)
                CreateSlabPatch(slabGroup.transform, "Slab_SouthWing", new Vector3(0f, y - 0.15f, -3.0f), new Vector3(42.2f, 0.32f, 10.2f), floorMat);

                // 2. North Wing (Rooms + North Corridor, Z: 29.9 to 40)
                CreateSlabPatch(slabGroup.transform, "Slab_NorthWing", new Vector3(0f, y - 0.15f, 35.0f), new Vector3(42.2f, 0.32f, 10.2f), floorMat);

                // 3. West Wing Rooms (Z: 1.9 to 30.1, X: -21.1 to -14.9)
                CreateSlabPatch(slabGroup.transform, "Slab_WestRooms", new Vector3(-18.0f, y - 0.15f, 16.0f), new Vector3(6.4f, 0.32f, 28.4f), floorMat);

                // 4. East Wing Rooms (Z: 1.9 to 30.1, X: 14.9 to 21.1)
                CreateSlabPatch(slabGroup.transform, "Slab_EastRooms", new Vector3(18.0f, y - 0.15f, 16.0f), new Vector3(6.4f, 0.32f, 28.4f), floorMat);

                // 5. Central Core (Flagship Labs & Faculty Cabins, Z: 9.9 to 22.1, X: -11.1 to 11.1)
                CreateSlabPatch(slabGroup.transform, "Slab_CentralCore", new Vector3(0f, y - 0.15f, 16.0f), new Vector3(22.4f, 0.32f, 12.4f), floorMat);

                // 6. Transverse Corridors (connecting South Corridor <-> Central Labs <-> North Corridor)
                CreateSlabPatch(slabGroup.transform, "Slab_Transverse_S", new Vector3(0f, y - 0.15f, 6.0f), new Vector3(6.4f, 0.32f, 8.4f), floorMat);
                CreateSlabPatch(slabGroup.transform, "Slab_Transverse_N", new Vector3(0f, y - 0.15f, 26.0f), new Vector3(6.4f, 0.32f, 8.4f), floorMat);

                // 7. West Corridor (Z: 8.5 to 30.1, X: -15 to -11)
                CreateSlabPatch(slabGroup.transform, "Slab_WestCorridor", new Vector3(-13.0f, y - 0.15f, 19.5f), new Vector3(4.4f, 0.32f, 21.4f), floorMat);

                // 8. East Corridor (Z: 8.5 to 30.1, X: 11 to 15)
                CreateSlabPatch(slabGroup.transform, "Slab_EastCorridor", new Vector3(13.0f, y - 0.15f, 19.5f), new Vector3(4.4f, 0.32f, 21.4f), floorMat);

                // 9. West Stair Landing Connectors (smooth transition into stair entry/exit)
                CreateSlabPatch(slabGroup.transform, "Slab_WestStairEntry", new Vector3(-13.0f, y - 0.15f, 1.5f), new Vector3(4.4f, 0.32f, 3.4f), floorMat);
                CreateSlabPatch(slabGroup.transform, "Slab_WestStairExit", new Vector3(-13.0f, y - 0.15f, 9.2f), new Vector3(4.4f, 0.32f, 2.4f), floorMat);

                // 10. East Stair Landing Connectors
                CreateSlabPatch(slabGroup.transform, "Slab_EastStairEntry", new Vector3(13.0f, y - 0.15f, 1.5f), new Vector3(4.4f, 0.32f, 3.4f), floorMat);
                CreateSlabPatch(slabGroup.transform, "Slab_EastStairExit", new Vector3(13.0f, y - 0.15f, 9.2f), new Vector3(4.4f, 0.32f, 2.4f), floorMat);
            }
        }
        private static void BuildAnnexureBlockShell(Transform parent,
            Material wallMat, Material wallGreyMat, Material terracottaMat, Material floorMat,
            Material windowGlassMat, Material windowFrameMat, Material windowSillMat, Material sunshadeNavyMat,
            Material acCompressorMat, Material acGrillMat, Material pvcPipeMat,
            Material columnWhiteMat, Material railingMat)
        {
            var annexureObj = new GameObject("AnnexureBlock_ArchitecturalShell");
            annexureObj.transform.SetParent(parent);

            // Annexure Block is on the LEFT: X from -53 to -33, Z from -8 to 44
            float x0 = -53.0f, x1 = -33.0f;
            float z0 = -8.0f, z1 = 44.0f;
            float width = x1 - x0;      // 20m
            float depth = z1 - z0;      // 52m
            float wallT = 0.35f;

            // 1. Floor Slabs with Courtyard & South Dogleg Staircase Openings
            for (int f = 0; f <= 4; f++)
            {
                float y = f * 4.0f;

                if (f == 0)
                {
                    // Ground Floor: 100% Solid Continuous Foundation Slab across entire Annexure footprint (X: -53 to -33, Z: -8 to 44)
                    CreateSlabPatch(annexureObj.transform, "Annex_Slab_Ground_Complete",
                        new Vector3(-43.0f, y - 0.15f, 18.0f), new Vector3(20.4f, 0.35f, 52.4f), floorMat);
                }
                else if (f == 4)
                {
                    // Roof Level: Solid slab over all rooms and corridors
                    CreateSlabPatch(annexureObj.transform, "Annex_Slab_Roof_Complete",
                        new Vector3(-43.0f, y - 0.15f, 18.0f), new Vector3(20.4f, 0.35f, 52.4f), floorMat);
                }
                else
                {
                    // Upper Floors 1, 2, 3:
                    // Continuous 4m-wide East Veranda Corridor Slab (facing Main Block, X: -37 to -33, Z: -8 to 44)
                    CreateSlabPatch(annexureObj.transform, $"Annex_Slab_Corridor_F{f}",
                        new Vector3(-35.0f, y - 0.15f, 18.0f), new Vector3(4.0f, 0.3f, 52.0f), floorMat);

                    // South Wing Rooms (Dean / FC cabins, Z: -8 to 0, X: -53 to -37)
                    CreateSlabPatch(annexureObj.transform, $"Annex_Slab_SouthRooms_F{f}",
                        new Vector3(-45.0f, y - 0.15f, -4.0f), new Vector3(16.0f, 0.3f, 8.0f), floorMat);

                    // North Wing Rear Slab (Z: 25 to 44, X: -53 to -37)
                    CreateSlabPatch(annexureObj.transform, $"Annex_Slab_Rear_F{f}",
                        new Vector3(-45.0f, y - 0.15f, 34.5f), new Vector3(16.0f, 0.3f, 19.0f), floorMat);

                    // West Wing Rooms across from Courtyard (Z: 13 to 25, X: -53 to -41, width 12m)
                    CreateSlabPatch(annexureObj.transform, $"Annex_Slab_CourtyardFlank_F{f}",
                        new Vector3(-47.0f, y - 0.15f, 19.0f), new Vector3(12.0f, 0.3f, 12.0f), floorMat);

                    // Mid Wing Rooms (LH1, Z: 5 to 13, X: -53 to -37)
                    CreateSlabPatch(annexureObj.transform, $"Annex_Slab_LH1_F{f}",
                        new Vector3(-45.0f, y - 0.15f, 9.0f), new Vector3(16.0f, 0.3f, 8.0f), floorMat);

                    // South Staircase Bay (Z: 0 to 5):
                    // West outer rooms patch (X: -53 to -43, width 10m)
                    CreateSlabPatch(annexureObj.transform, $"Annex_Slab_StairWest_F{f}",
                        new Vector3(-48.0f, y - 0.15f, 2.5f), new Vector3(10.0f, 0.3f, 5.0f), floorMat);
                    // East walkway connector into corridor (X: -39 to -37, width 2m, Z: 0.0 to 1.8)
                    CreateSlabPatch(annexureObj.transform, $"Annex_Slab_StairLandingConn_F{f}",
                        new Vector3(-38.0f, y - 0.15f, 0.9f), new Vector3(2.0f, 0.3f, 1.8f), floorMat);
                    // Protective safety railings around the open stairwell void
                    CreateSafetyRailing(annexureObj.transform, $"Annex_Stair_Railing_East_F{f}",
                        new Vector3(-39.0f, y + 0.55f, 3.4f), new Vector3(0.06f, 1.1f, 3.2f), railingMat);
                    CreateSafetyRailing(annexureObj.transform, $"Annex_Stair_Railing_North_F{f}",
                        new Vector3(-41.0f, y + 0.55f, 5.0f), new Vector3(4.0f, 1.1f, 0.06f), railingMat);
                }
            }

            // 2. Terracotta and Navy Cornice Bands along Annexure
            for (int f = 1; f <= 4; f++)
            {
                float y = f * 4.0f;
                CreateCorniceBand(annexureObj.transform, $"Annex_Band_South_F{f}", new Vector3(-43.0f, y - 0.15f, z0 - wallT * 0.5f), new Vector3(width + 0.4f, 0.3f, 0.35f), sunshadeNavyMat);
                CreateCorniceBand(annexureObj.transform, $"Annex_Band_West_F{f}", new Vector3(x0 - wallT * 0.5f, y - 0.15f, 18.0f), new Vector3(0.35f, 0.3f, depth + 0.4f), terracottaMat);
                CreateCorniceBand(annexureObj.transform, $"Annex_Band_East_F{f}", new Vector3(x1 + wallT * 0.5f, y - 0.15f, 18.0f), new Vector3(0.35f, 0.3f, depth + 0.4f), sunshadeNavyMat);
            }

            // 3. Annexure Facade Walls & Real Window Openings
            for (int f = 0; f < 4; f++)
            {
                float baseY = f * 4.0f;
                bool isGround = f == 0;

                // ── ANNEXURE FRONT FACADE (Z = -8, Photos 9.28.50 PM (1) & (2)) ──
                // Outer half (X: -53 to -39.5) is SOLID ARCHITECTURAL GREY CONCRETE WALL
                float greyWallW = 13.5f;
                var greyWall = GameObject.CreatePrimitive(PrimitiveType.Cube);
                greyWall.name = $"Annex_Front_SolidGrey_F{f}";
                greyWall.transform.SetParent(annexureObj.transform);
                greyWall.transform.position = new Vector3(-46.25f, baseY + 1.9f, z0);
                greyWall.transform.localScale = new Vector3(greyWallW, 3.8f, wallT);
                greyWall.GetComponent<Renderer>().sharedMaterial = wallGreyMat;

                // Split AC units on Annexure solid grey front wall
                if (!isGround)
                {
                    CreateACOutdoorUnit(annexureObj.transform, new Vector3(-48.0f, baseY + 0.55f, z0 - 0.18f), Vector3.back, acCompressorMat, acGrillMat);
                    CreateACOutdoorUnit(annexureObj.transform, new Vector3(-42.0f, baseY + 0.55f, z0 - 0.18f), Vector3.back, acCompressorMat, acGrillMat);
                }

                // Inner half (X: -39.5 to -33) is VERANDA CORNER BAY
                // Structural Corner Column at X = -33.25
                var colCorner = GameObject.CreatePrimitive(PrimitiveType.Cube);
                colCorner.name = $"Annex_CornerCol_F{f}";
                colCorner.transform.SetParent(annexureObj.transform);
                colCorner.transform.position = new Vector3(-33.25f, baseY + 1.9f, z0);
                colCorner.transform.localScale = new Vector3(0.5f, 3.8f, wallT + 0.1f);
                colCorner.GetComponent<Renderer>().sharedMaterial = wallGreyMat;

                // Structural Pier at X = -39.3
                var pier = GameObject.CreatePrimitive(PrimitiveType.Cube);
                pier.name = $"Annex_Pier_F{f}";
                pier.transform.SetParent(annexureObj.transform);
                pier.transform.position = new Vector3(-39.3f, baseY + 1.9f, z0);
                pier.transform.localScale = new Vector3(0.4f, 3.8f, wallT);
                pier.GetComponent<Renderer>().sharedMaterial = wallGreyMat;

                if (isGround)
                {
                    // Ground Floor: Covered Entrance Porch & Plinth (Photo 2)
                    var porchWall = GameObject.CreatePrimitive(PrimitiveType.Cube);
                    porchWall.name = "Annex_PorchWall";
                    porchWall.transform.SetParent(annexureObj.transform);
                    porchWall.transform.position = new Vector3(-37.6f, baseY + 1.9f, z0);
                    porchWall.transform.localScale = new Vector3(3.0f, 3.8f, wallT);
                    porchWall.GetComponent<Renderer>().sharedMaterial = wallGreyMat;

                    CreateWindowFixture(annexureObj.transform, new Vector3(-37.6f, baseY + 1.7f, z0),
                        Vector3.back, windowGlassMat, windowFrameMat, windowSillMat, sunshadeNavyMat);

                    // Raised entrance plinth steps in front
                    var plinth = GameObject.CreatePrimitive(PrimitiveType.Cube);
                    plinth.name = "Annex_EntrancePlinth";
                    plinth.transform.SetParent(annexureObj.transform);
                    plinth.transform.position = new Vector3(-34.8f, 0.08f, z0 - 0.5f);
                    plinth.transform.localScale = new Vector3(2.8f, 0.16f, 1.0f);
                    plinth.GetComponent<Renderer>().sharedMaterial = floorMat;
                }
                else
                {
                    // Upper Floors 1, 2, 3: Open Corner Verandas with Blue Steel Safety Railings (Photos 9.28.50 PM)
                    CreateSafetyRailing(annexureObj.transform, $"Annex_VerandaRail_Front_F{f}",
                        new Vector3(-36.25f, baseY + 0.6f, z0), new Vector3(5.7f, 1.2f, 0.06f), railingMat);
                    CreateSafetyRailing(annexureObj.transform, $"Annex_VerandaRail_Side_F{f}",
                        new Vector3(-33.0f, baseY + 0.6f, z0 + 1.5f), new Vector3(0.06f, 1.2f, 3.0f), railingMat);
                }

                // ── OUTER WEST FACADE (X = -53, campus outer perimeter) ──
                float[] annWinZ = new float[] { -4f, 4f, 12f, 20f, 28f, 36f };
                BuildWallWithWindowOpeningsZ(annexureObj.transform, $"Annex_WestWall_F{f}",
                    z0, z1, x0, baseY, 3.8f, wallT, annWinZ,
                    wallMat, windowGlassMat, windowFrameMat, windowSillMat, sunshadeNavyMat, true);

                // ── REAR NORTH FACADE (Z = 44) ──
                float[] annRearX = new float[] { -51f, -47f, -43f, -39f, -35f };
                BuildWallWithWindowOpeningsX(annexureObj.transform, $"Annex_NorthWall_F{f}",
                    x0, x1, z1, baseY, 3.8f, wallT, annRearX,
                    wallMat, windowGlassMat, windowFrameMat, windowSillMat, sunshadeNavyMat, false);

                // ── INNER EAST FACADE (Facing Alleyway & Main Block, X = -33) ──
                // Corridors on inner East side open to air with safety railings
                if (f == 1 || f == 2)
                {
                    // Bridge portal at Z = 0 to 3m
                    CreateSafetyRailing(annexureObj.transform, $"Annex_EastRail_South_F{f}",
                        new Vector3(x1, baseY + 0.6f, -4.0f), new Vector3(0.06f, 1.2f, 8.0f), railingMat);
                    CreateSafetyRailing(annexureObj.transform, $"Annex_EastRail_North_F{f}",
                        new Vector3(x1, baseY + 0.6f, 23.5f), new Vector3(0.06f, 1.2f, 41.0f), railingMat);
                }
                else
                {
                    CreateSafetyRailing(annexureObj.transform, $"Annex_EastRail_Full_F{f}",
                        new Vector3(x1, baseY + 0.6f, 18.0f), new Vector3(0.06f, 1.2f, depth), railingMat);
                }
            }

            // 4. Projecting Roof Canopy Slab Overhang with Navy Blue Fascia (Photo 1)
            var roofCanopy = GameObject.CreatePrimitive(PrimitiveType.Cube);
            roofCanopy.name = "Annex_RoofCanopyOverhang";
            roofCanopy.transform.SetParent(annexureObj.transform);
            roofCanopy.transform.position = new Vector3(-43.0f, 16.2f, z0 - 0.4f);
            roofCanopy.transform.localScale = new Vector3(width + 0.6f, 0.25f, 0.8f);
            roofCanopy.GetComponent<Renderer>().sharedMaterial = sunshadeNavyMat;

            // 5. Arched Rooftop Pergola Trellis over Central Courtyard (at X = -43, Z = 19)
            BuildRooftopPergola(annexureObj.transform, new Vector3(-43.0f, 16.0f, 19.0f), new Vector3(10.0f, 2.5f, 12.0f), columnWhiteMat);
        }

        private static void BuildWallWithWindowOpeningsX(Transform parent, string wallName,
            float xStart, float xEnd, float zPos, float baseY, float wallH, float wallT, float[] winXArray,
            Material wallMat, Material glassMat, Material frameMat, Material sillMat, Material shadeMat, bool faceSouth,
            bool hasPortalOpening = false, float portalHalfW = 3.6f)
        {
            var wallGroup = new GameObject(wallName);
            wallGroup.transform.SetParent(parent);

            float winW = 2.6f;
            float winH = 1.6f;
            float sillH = 0.9f;
            float lintelH = wallH - (sillH + winH); // 1.3m

            Vector3 outwardDir = faceSouth ? Vector3.back : Vector3.forward;

            // Sort windows along X
            System.Array.Sort(winXArray);

            float curX = xStart;
            for (int i = 0; i < winXArray.Length; i++)
            {
                float wx = winXArray[i];
                float winLeft = wx - winW * 0.5f;
                float winRight = wx + winW * 0.5f;

                // Solid pier between previous curX and winLeft
                if (winLeft > curX)
                {
                    if (hasPortalOpening && curX < portalHalfW && winLeft > -portalHalfW)
                    {
                        float pLeft = -portalHalfW;
                        float pRight = portalHalfW;

                        // 1. Left pier (curX to pLeft)
                        if (pLeft > curX)
                        {
                            float lpW = pLeft - curX;
                            var leftPier = GameObject.CreatePrimitive(PrimitiveType.Cube);
                            leftPier.name = $"Pier_{i}_PortalLeft";
                            leftPier.transform.SetParent(wallGroup.transform);
                            leftPier.transform.position = new Vector3(curX + lpW * 0.5f, baseY + wallH * 0.5f, zPos);
                            leftPier.transform.localScale = new Vector3(lpW, wallH, wallT);
                            leftPier.GetComponent<Renderer>().sharedMaterial = wallMat;
                        }

                        // 2. Open entrance portal aperture: Y: 0 to 3.4m is COMPLETELY EMPTY!
                        // Lintel header beam above the portal: Y: 3.4 to wallH (height 0.4m)
                        float portalOpeningW = pRight - pLeft;
                        float portalOpenH = 3.4f;
                        float portalLintelH = wallH - portalOpenH;
                        var portalLintel = GameObject.CreatePrimitive(PrimitiveType.Cube);
                        portalLintel.name = "Portal_OverheadLintel";
                        portalLintel.transform.SetParent(wallGroup.transform);
                        portalLintel.transform.position = new Vector3(0, baseY + portalOpenH + portalLintelH * 0.5f, zPos);
                        portalLintel.transform.localScale = new Vector3(portalOpeningW, portalLintelH, wallT);
                        portalLintel.GetComponent<Renderer>().sharedMaterial = wallMat;

                        // 3. Right pier (pRight to winLeft)
                        if (winLeft > pRight)
                        {
                            float rpW = winLeft - pRight;
                            var rightPier = GameObject.CreatePrimitive(PrimitiveType.Cube);
                            rightPier.name = $"Pier_{i}_PortalRight";
                            rightPier.transform.SetParent(wallGroup.transform);
                            rightPier.transform.position = new Vector3(pRight + rpW * 0.5f, baseY + wallH * 0.5f, zPos);
                            rightPier.transform.localScale = new Vector3(rpW, wallH, wallT);
                            rightPier.GetComponent<Renderer>().sharedMaterial = wallMat;
                        }
                    }
                    else
                    {
                        float pierW = winLeft - curX;
                        var pier = GameObject.CreatePrimitive(PrimitiveType.Cube);
                        pier.name = $"Pier_{i}";
                        pier.transform.SetParent(wallGroup.transform);
                        pier.transform.position = new Vector3(curX + pierW * 0.5f, baseY + wallH * 0.5f, zPos);
                        pier.transform.localScale = new Vector3(pierW, wallH, wallT);
                        pier.GetComponent<Renderer>().sharedMaterial = wallMat;
                    }
                }

                // Window Sill Wall Segment below window (Y: 0 to sillH)
                var sillWall = GameObject.CreatePrimitive(PrimitiveType.Cube);
                sillWall.name = $"SillWall_{i}";
                sillWall.transform.SetParent(wallGroup.transform);
                sillWall.transform.position = new Vector3(wx, baseY + sillH * 0.5f, zPos);
                sillWall.transform.localScale = new Vector3(winW, sillH, wallT);
                sillWall.GetComponent<Renderer>().sharedMaterial = wallMat;

                // Overhead Lintel Wall Segment above window (Y: sillH + winH to wallH)
                var lintelWall = GameObject.CreatePrimitive(PrimitiveType.Cube);
                lintelWall.name = $"LintelWall_{i}";
                lintelWall.transform.SetParent(wallGroup.transform);
                lintelWall.transform.position = new Vector3(wx, baseY + sillH + winH + lintelH * 0.5f, zPos);
                lintelWall.transform.localScale = new Vector3(winW, lintelH, wallT);
                lintelWall.GetComponent<Renderer>().sharedMaterial = wallMat;

                // The 3D Window Fixture inside the opening
                CreateWindowFixture(wallGroup.transform, new Vector3(wx, baseY + sillH + winH * 0.5f, zPos),
                    outwardDir, glassMat, frameMat, sillMat, shadeMat);

                curX = winRight;
            }

            // Final pier to xEnd
            if (curX < xEnd)
            {
                float pierW = xEnd - curX;
                var endPier = GameObject.CreatePrimitive(PrimitiveType.Cube);
                endPier.name = "EndPier";
                endPier.transform.SetParent(wallGroup.transform);
                endPier.transform.position = new Vector3(curX + pierW * 0.5f, baseY + wallH * 0.5f, zPos);
                endPier.transform.localScale = new Vector3(pierW, wallH, wallT);
                endPier.GetComponent<Renderer>().sharedMaterial = wallMat;
            }
        }

        private static void BuildWallWithWindowOpeningsZ(Transform parent, string wallName,
            float zStart, float zEnd, float xPos, float baseY, float wallH, float wallT, float[] winZArray,
            Material wallMat, Material glassMat, Material frameMat, Material sillMat, Material shadeMat, bool faceWest,
            bool hasBridgeOpening = false, float bridgeCenterZ = 1.5f, float bridgeHalfW = 1.5f)
        {
            var wallGroup = new GameObject(wallName);
            wallGroup.transform.SetParent(parent);

            float winW = 2.6f;
            float winH = 1.6f;
            float sillH = 0.9f;
            float lintelH = wallH - (sillH + winH);

            Vector3 outwardDir = faceWest ? Vector3.left : Vector3.right;

            System.Array.Sort(winZArray);

            float curZ = zStart;
            for (int i = 0; i < winZArray.Length; i++)
            {
                float wz = winZArray[i];
                float winStart = wz - winW * 0.5f;
                float winEnd = wz + winW * 0.5f;

                if (winStart > curZ)
                {
                    if (hasBridgeOpening && curZ < bridgeCenterZ + bridgeHalfW && winStart > bridgeCenterZ - bridgeHalfW)
                    {
                        float bStart = bridgeCenterZ - bridgeHalfW;
                        float bEnd = bridgeCenterZ + bridgeHalfW;

                        // 1. Pier before bridge opening
                        if (bStart > curZ)
                        {
                            float pD = bStart - curZ;
                            var pierBefore = GameObject.CreatePrimitive(PrimitiveType.Cube);
                            pierBefore.name = $"Pier_{i}_BridgeBefore";
                            pierBefore.transform.SetParent(wallGroup.transform);
                            pierBefore.transform.position = new Vector3(xPos, baseY + wallH * 0.5f, curZ + pD * 0.5f);
                            pierBefore.transform.localScale = new Vector3(wallT, wallH, pD);
                            pierBefore.GetComponent<Renderer>().sharedMaterial = wallMat;
                        }

                        // 2. Overhead Lintel above bridge doorway (Y: 3.2 to wallH)
                        float bridgeDoorH = 3.2f;
                        float bridgeLintelH = wallH - bridgeDoorH;
                        var bridgeLintel = GameObject.CreatePrimitive(PrimitiveType.Cube);
                        bridgeLintel.name = $"Bridge_OverheadLintel_{i}";
                        bridgeLintel.transform.SetParent(wallGroup.transform);
                        bridgeLintel.transform.position = new Vector3(xPos, baseY + bridgeDoorH + bridgeLintelH * 0.5f, bridgeCenterZ);
                        bridgeLintel.transform.localScale = new Vector3(wallT, bridgeLintelH, bridgeHalfW * 2f);
                        bridgeLintel.GetComponent<Renderer>().sharedMaterial = wallMat;

                        // 3. Pier after bridge opening
                        if (winStart > bEnd)
                        {
                            float pD = winStart - bEnd;
                            var pierAfter = GameObject.CreatePrimitive(PrimitiveType.Cube);
                            pierAfter.name = $"Pier_{i}_BridgeAfter";
                            pierAfter.transform.SetParent(wallGroup.transform);
                            pierAfter.transform.position = new Vector3(xPos, baseY + wallH * 0.5f, bEnd + pD * 0.5f);
                            pierAfter.transform.localScale = new Vector3(wallT, wallH, pD);
                            pierAfter.GetComponent<Renderer>().sharedMaterial = wallMat;
                        }
                    }
                    else
                    {
                        float pierD = winStart - curZ;
                        var pier = GameObject.CreatePrimitive(PrimitiveType.Cube);
                        pier.name = $"Pier_{i}";
                        pier.transform.SetParent(wallGroup.transform);
                        pier.transform.position = new Vector3(xPos, baseY + wallH * 0.5f, curZ + pierD * 0.5f);
                        pier.transform.localScale = new Vector3(wallT, wallH, pierD);
                        pier.GetComponent<Renderer>().sharedMaterial = wallMat;
                    }
                }

                var sillWall = GameObject.CreatePrimitive(PrimitiveType.Cube);
                sillWall.name = $"SillWall_{i}";
                sillWall.transform.SetParent(wallGroup.transform);
                sillWall.transform.position = new Vector3(xPos, baseY + sillH * 0.5f, wz);
                sillWall.transform.localScale = new Vector3(wallT, sillH, winW);
                sillWall.GetComponent<Renderer>().sharedMaterial = wallMat;

                var lintelWall = GameObject.CreatePrimitive(PrimitiveType.Cube);
                lintelWall.name = $"LintelWall_{i}";
                lintelWall.transform.SetParent(wallGroup.transform);
                lintelWall.transform.position = new Vector3(xPos, baseY + sillH + winH + lintelH * 0.5f, wz);
                lintelWall.transform.localScale = new Vector3(wallT, lintelH, winW);
                lintelWall.GetComponent<Renderer>().sharedMaterial = wallMat;

                CreateWindowFixture(wallGroup.transform, new Vector3(xPos, baseY + sillH + winH * 0.5f, wz),
                    outwardDir, glassMat, frameMat, sillMat, shadeMat);

                curZ = winEnd;
            }

            if (curZ < zEnd)
            {
                float pierD = zEnd - curZ;
                var endPier = GameObject.CreatePrimitive(PrimitiveType.Cube);
                endPier.name = "EndPier";
                endPier.transform.SetParent(wallGroup.transform);
                endPier.transform.position = new Vector3(xPos, baseY + wallH * 0.5f, curZ + pierD * 0.5f);
                endPier.transform.localScale = new Vector3(wallT, wallH, pierD);
                endPier.GetComponent<Renderer>().sharedMaterial = wallMat;
            }
        }

        private static void CreateWindowFixture(Transform parent, Vector3 pos, Vector3 outwardDir,
            Material glassMat, Material frameMat, Material sillMat, Material sunshadeMat)
        {
            var win = new GameObject("CollegiateWindowFixture");
            win.transform.SetParent(parent);
            win.transform.position = pos;
            win.transform.forward = outwardDir;

            float winW = 2.6f;
            float winH = 1.6f;

            // 1. Hollow White Outer Frame (4 Border Bars)
            float barThick = 0.08f;
            var frameTop = GameObject.CreatePrimitive(PrimitiveType.Cube);
            frameTop.name = "Frame_Top";
            frameTop.transform.SetParent(win.transform);
            frameTop.transform.localPosition = new Vector3(0, winH * 0.5f + barThick * 0.5f, 0);
            frameTop.transform.localRotation = Quaternion.identity;
            frameTop.transform.localScale = new Vector3(winW + barThick * 2, barThick, 0.08f);
            frameTop.GetComponent<Renderer>().sharedMaterial = frameMat;
            Object.DestroyImmediate(frameTop.GetComponent<Collider>());

            var frameBottom = GameObject.CreatePrimitive(PrimitiveType.Cube);
            frameBottom.name = "Frame_Bottom";
            frameBottom.transform.SetParent(win.transform);
            frameBottom.transform.localPosition = new Vector3(0, -winH * 0.5f - barThick * 0.5f, 0);
            frameBottom.transform.localRotation = Quaternion.identity;
            frameBottom.transform.localScale = new Vector3(winW + barThick * 2, barThick, 0.08f);
            frameBottom.GetComponent<Renderer>().sharedMaterial = frameMat;
            Object.DestroyImmediate(frameBottom.GetComponent<Collider>());

            var frameLeft = GameObject.CreatePrimitive(PrimitiveType.Cube);
            frameLeft.name = "Frame_Left";
            frameLeft.transform.SetParent(win.transform);
            frameLeft.transform.localPosition = new Vector3(-winW * 0.5f - barThick * 0.5f, 0, 0);
            frameLeft.transform.localRotation = Quaternion.identity;
            frameLeft.transform.localScale = new Vector3(barThick, winH, 0.08f);
            frameLeft.GetComponent<Renderer>().sharedMaterial = frameMat;
            Object.DestroyImmediate(frameLeft.GetComponent<Collider>());

            var frameRight = GameObject.CreatePrimitive(PrimitiveType.Cube);
            frameRight.name = "Frame_Right";
            frameRight.transform.SetParent(win.transform);
            frameRight.transform.localPosition = new Vector3(winW * 0.5f + barThick * 0.5f, 0, 0);
            frameRight.transform.localRotation = Quaternion.identity;
            frameRight.transform.localScale = new Vector3(barThick, winH, 0.08f);
            frameRight.GetComponent<Renderer>().sharedMaterial = frameMat;
            Object.DestroyImmediate(frameRight.GetComponent<Collider>());

            // 2. Horizontal Transom & Center Mullion
            var transom = GameObject.CreatePrimitive(PrimitiveType.Cube);
            transom.name = "Frame_Transom";
            transom.transform.SetParent(win.transform);
            transom.transform.localPosition = new Vector3(0, winH * 0.22f, 0.005f);
            transom.transform.localRotation = Quaternion.identity;
            transom.transform.localScale = new Vector3(winW, 0.05f, 0.06f);
            transom.GetComponent<Renderer>().sharedMaterial = frameMat;
            Object.DestroyImmediate(transom.GetComponent<Collider>());

            var mullion = GameObject.CreatePrimitive(PrimitiveType.Cube);
            mullion.name = "CenterMullion";
            mullion.transform.SetParent(win.transform);
            mullion.transform.localPosition = new Vector3(0, 0, 0.005f);
            mullion.transform.localRotation = Quaternion.identity;
            mullion.transform.localScale = new Vector3(0.06f, winH, 0.06f);
            mullion.GetComponent<Renderer>().sharedMaterial = frameMat;
            Object.DestroyImmediate(mullion.GetComponent<Collider>());

            // 3. Clear Tinted Glass Pane
            var glass = GameObject.CreatePrimitive(PrimitiveType.Cube);
            glass.name = "GlassPane";
            glass.transform.SetParent(win.transform);
            glass.transform.localPosition = Vector3.zero;
            glass.transform.localRotation = Quaternion.identity;
            glass.transform.localScale = new Vector3(winW, winH, 0.015f);
            glass.GetComponent<Renderer>().sharedMaterial = glassMat;

            // 4. Projecting Exterior White Concrete Window Sill
            var sill = GameObject.CreatePrimitive(PrimitiveType.Cube);
            sill.name = "ExteriorSill";
            sill.transform.SetParent(win.transform);
            sill.transform.localPosition = new Vector3(0, -winH * 0.5f - 0.05f, 0.12f);
            sill.transform.localRotation = Quaternion.identity;
            sill.transform.localScale = new Vector3(winW + 0.28f, 0.10f, 0.24f);
            sill.GetComponent<Renderer>().sharedMaterial = sillMat;

            // 5. Interior White Window Sill
            var intSill = GameObject.CreatePrimitive(PrimitiveType.Cube);
            intSill.name = "InteriorSill";
            intSill.transform.SetParent(win.transform);
            intSill.transform.localPosition = new Vector3(0, -winH * 0.5f - 0.05f, -0.12f);
            intSill.transform.localRotation = Quaternion.identity;
            intSill.transform.localScale = new Vector3(winW + 0.28f, 0.08f, 0.20f);
            intSill.GetComponent<Renderer>().sharedMaterial = sillMat;

            // 6. Cantilevered Concrete Sunshade (Chajja) with Royal Navy Blue Top
            var shadeBase = GameObject.CreatePrimitive(PrimitiveType.Cube);
            shadeBase.name = "Sunshade_ConcreteBase";
            shadeBase.transform.SetParent(win.transform);
            shadeBase.transform.localPosition = new Vector3(0, winH * 0.5f + 0.14f, 0.28f);
            shadeBase.transform.localRotation = Quaternion.identity;
            shadeBase.transform.localScale = new Vector3(winW + 0.36f, 0.08f, 0.56f);
            shadeBase.GetComponent<Renderer>().sharedMaterial = sillMat;

            var shadeTop = GameObject.CreatePrimitive(PrimitiveType.Cube);
            shadeTop.name = "Sunshade_NavyTop";
            shadeTop.transform.SetParent(shadeBase.transform);
            shadeTop.transform.localPosition = new Vector3(0, 0.52f, 0);
            shadeTop.transform.localRotation = Quaternion.identity;
            shadeTop.transform.localScale = new Vector3(1.02f, 0.2f, 1.02f);
            shadeTop.GetComponent<Renderer>().sharedMaterial = sunshadeMat;
            Object.DestroyImmediate(shadeTop.GetComponent<Collider>());
        }

        private static void CreateACOutdoorUnit(Transform parent, Vector3 pos, Vector3 forwardDir, Material bodyMat, Material grillMat)
        {
            var ac = new GameObject("SplitAC_CompressorUnit");
            ac.transform.SetParent(parent);
            ac.transform.position = pos;
            ac.transform.forward = forwardDir;

            // Metal Compressor Box
            var body = GameObject.CreatePrimitive(PrimitiveType.Cube);
            body.name = "Body";
            body.transform.SetParent(ac.transform);
            body.transform.localPosition = Vector3.zero;
            body.transform.localScale = new Vector3(0.84f, 0.58f, 0.34f);
            body.GetComponent<Renderer>().sharedMaterial = bodyMat;

            // Front circular exhaust fan grill
            var fan = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
            fan.name = "FanGrill";
            fan.transform.SetParent(body.transform);
            fan.transform.localPosition = new Vector3(0.14f, 0, 0.51f);
            fan.transform.localRotation = Quaternion.Euler(90, 0, 0);
            fan.transform.localScale = new Vector3(0.48f, 0.02f, 0.48f);
            fan.GetComponent<Renderer>().sharedMaterial = grillMat;
            Object.DestroyImmediate(fan.GetComponent<Collider>());

            // Steel mounting brackets
            var bL = GameObject.CreatePrimitive(PrimitiveType.Cube);
            bL.name = "BracketL";
            bL.transform.SetParent(body.transform);
            bL.transform.localPosition = new Vector3(-0.35f, -0.55f, 0);
            bL.transform.localScale = new Vector3(0.06f, 0.25f, 0.95f);
            bL.GetComponent<Renderer>().sharedMaterial = grillMat;

            var bR = GameObject.CreatePrimitive(PrimitiveType.Cube);
            bR.name = "BracketR";
            bR.transform.SetParent(body.transform);
            bR.transform.localPosition = new Vector3(0.35f, -0.55f, 0);
            bR.transform.localScale = new Vector3(0.06f, 0.25f, 0.95f);
            bR.GetComponent<Renderer>().sharedMaterial = grillMat;
        }

        private static void CreateDownspoutPipe(Transform parent, Vector3 pos, float height, Material pipeMat)
        {
            var pipe = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
            pipe.name = "RainwaterDownspout";
            pipe.transform.SetParent(parent);
            pipe.transform.position = pos;
            pipe.transform.localScale = new Vector3(0.09f, height * 0.5f, 0.09f);
            pipe.GetComponent<Renderer>().sharedMaterial = pipeMat;
            Object.DestroyImmediate(pipe.GetComponent<Collider>());
        }

        private static void CreateSolarArray(Transform parent, Vector3 center, Material panelMat, Material frameMat, Material walkwayMat)
        {
            var solarGroup = new GameObject("Rooftop_Photovoltaic_Solar_Array");
            solarGroup.transform.SetParent(parent);
            solarGroup.transform.position = center;

            // Terracotta inspection walkway cross tiles
            var walkZ = GameObject.CreatePrimitive(PrimitiveType.Cube);
            walkZ.name = "WalkwayZ";
            walkZ.transform.SetParent(solarGroup.transform);
            walkZ.transform.localPosition = Vector3.zero;
            walkZ.transform.localScale = new Vector3(1.6f, 0.04f, 44.0f);
            walkZ.GetComponent<Renderer>().sharedMaterial = walkwayMat;

            var walkX = GameObject.CreatePrimitive(PrimitiveType.Cube);
            walkX.name = "WalkwayX";
            walkX.transform.SetParent(solarGroup.transform);
            walkX.transform.localPosition = Vector3.zero;
            walkX.transform.localScale = new Vector3(38.0f, 0.04f, 1.6f);
            walkX.GetComponent<Renderer>().sharedMaterial = walkwayMat;

            // Rows of tilted solar panels (West and East quadrants)
            float[] quadX = new float[] { -11f, 11f };
            for (int q = 0; q < quadX.Length; q++)
            {
                for (float pz = -16f; pz <= 16f; pz += 4.5f)
                {
                    if (Mathf.Abs(pz) < 2.0f) continue;

                    var rack = new GameObject($"SolarRack_Q{q}_Z{pz}");
                    rack.transform.SetParent(solarGroup.transform);
                    rack.transform.localPosition = new Vector3(quadX[q], 0.65f, pz);
                    rack.transform.localRotation = Quaternion.Euler(-15f, 0, 0); // Tilted 15 deg South

                    // Solar Panel
                    var panel = GameObject.CreatePrimitive(PrimitiveType.Cube);
                    panel.name = "PV_Panel";
                    panel.transform.SetParent(rack.transform);
                    panel.transform.localPosition = Vector3.zero;
                    panel.transform.localScale = new Vector3(12.0f, 0.04f, 1.9f);
                    panel.GetComponent<Renderer>().sharedMaterial = panelMat;

                    // Support frame legs
                    var leg1 = GameObject.CreatePrimitive(PrimitiveType.Cube);
                    leg1.name = "Leg1";
                    leg1.transform.SetParent(solarGroup.transform);
                    leg1.transform.position = rack.transform.position + new Vector3(-5.5f, -0.3f, 0.8f);
                    leg1.transform.localScale = new Vector3(0.08f, 0.7f, 0.08f);
                    leg1.GetComponent<Renderer>().sharedMaterial = frameMat;
                    Object.DestroyImmediate(leg1.GetComponent<Collider>());

                    var leg2 = GameObject.CreatePrimitive(PrimitiveType.Cube);
                    leg2.name = "Leg2";
                    leg2.transform.SetParent(solarGroup.transform);
                    leg2.transform.position = rack.transform.position + new Vector3(5.5f, -0.3f, 0.8f);
                    leg2.transform.localScale = new Vector3(0.08f, 0.7f, 0.08f);
                    leg2.GetComponent<Renderer>().sharedMaterial = frameMat;
                    Object.DestroyImmediate(leg2.GetComponent<Collider>());
                }
            }
        }

        private static void CreateSlabPatch(Transform parent, string name, Vector3 pos, Vector3 size, Material mat)
        {
            var slab = GameObject.CreatePrimitive(PrimitiveType.Cube);
            slab.name = name;
            slab.transform.SetParent(parent);
            slab.transform.position = pos;
            slab.transform.localScale = size;
            slab.GetComponent<Renderer>().sharedMaterial = mat;
        }

        private static void CreateSafetyRailing(Transform parent, string name, Vector3 pos, Vector3 size, Material mat)
        {
            var railGroup = new GameObject(name);
            railGroup.transform.SetParent(parent);
            railGroup.transform.position = pos;

            bool isXAligned = size.x >= size.z;
            float length = isXAligned ? size.x : size.z;
            float height = size.y;
            float botY = -height * 0.5f;

            // 1. Top Handrail Bar (horizontal)
            var topBar = GameObject.CreatePrimitive(PrimitiveType.Cube);
            topBar.name = "TopHandrailBar";
            topBar.transform.SetParent(railGroup.transform);
            topBar.transform.localPosition = new Vector3(0, height * 0.5f - 0.02f, 0);
            topBar.transform.localScale = isXAligned 
                ? new Vector3(length, 0.05f, 0.06f)
                : new Vector3(0.06f, 0.05f, length);
            topBar.GetComponent<Renderer>().sharedMaterial = mat;

            // 2. Bottom Runner Bar (horizontal)
            var botBar = GameObject.CreatePrimitive(PrimitiveType.Cube);
            botBar.name = "BottomRunnerBar";
            botBar.transform.SetParent(railGroup.transform);
            botBar.transform.localPosition = new Vector3(0, botY + 0.04f, 0);
            botBar.transform.localScale = isXAligned 
                ? new Vector3(length, 0.04f, 0.04f)
                : new Vector3(0.04f, 0.04f, length);
            botBar.GetComponent<Renderer>().sharedMaterial = mat;

            // 3. Thin Vertical Balusters spaced every ~0.35m
            int balusterCount = Mathf.Max(3, (int)(length / 0.35f));
            float balusterH = Mathf.Max(0.1f, height - 0.09f);
            for (int i = 0; i <= balusterCount; i++)
            {
                float t = balusterCount > 0 ? (float)i / balusterCount : 0.5f;
                float offset = -length * 0.5f + t * length;

                var post = GameObject.CreatePrimitive(PrimitiveType.Cube);
                post.name = $"Baluster_{i}";
                post.transform.SetParent(railGroup.transform);
                post.transform.localPosition = isXAligned
                    ? new Vector3(offset, 0, 0)
                    : new Vector3(0, 0, offset);
                post.transform.localScale = new Vector3(0.035f, balusterH, 0.035f);
                post.GetComponent<Renderer>().sharedMaterial = mat;
                Object.DestroyImmediate(post.GetComponent<Collider>());
            }

            // 4. Invisible Safety Collider for player collision
            var colObj = new GameObject("SafetyCollider");
            colObj.transform.SetParent(railGroup.transform);
            colObj.transform.localPosition = Vector3.zero;
            var col = colObj.AddComponent<BoxCollider>();
            col.size = size;
        }

        private static void CreateCorniceBand(Transform parent, string name, Vector3 pos, Vector3 size, Material mat)
        {
            var band = GameObject.CreatePrimitive(PrimitiveType.Cube);
            band.name = name;
            band.transform.SetParent(parent);
            band.transform.position = pos;
            band.transform.localScale = size;
            band.GetComponent<Renderer>().sharedMaterial = mat;
        }

        private static void BuildModernEntrancePortal(Transform parent, float facadeZ,
            Material frameMat, Material bronzeMat, Material woodSlatMat, Material goldMat, Material floorMat, Material grillMat)
        {
            var portal = new GameObject("Modern_Entrance_Portal");
            portal.transform.SetParent(parent);
            // Center of portal: facade is at Z = facadeZ (-8.0). Portal extends from -8.0 to -9.8 (depth 1.8m, center at -8.9)
            portal.transform.position = new Vector3(0, 0, facadeZ - 0.9f);

            float portalW = 7.4f;
            float portalD = 1.8f;
            float portalH = 4.0f;

            // 1. Cantilevered Dark Coffee-Bronze Portal Box Roof Slab
            var roof = GameObject.CreatePrimitive(PrimitiveType.Cube);
            roof.name = "PortalRoofBox";
            roof.transform.SetParent(portal.transform);
            roof.transform.localPosition = new Vector3(0, portalH + 0.2f, 0);
            roof.transform.localScale = new Vector3(portalW, 0.45f, portalD);
            roof.GetComponent<Renderer>().sharedMaterial = bronzeMat;

            // 2. Crisp White Coping Border Moulding Cap
            var coping = GameObject.CreatePrimitive(PrimitiveType.Cube);
            coping.name = "PortalRoofCoping";
            coping.transform.SetParent(portal.transform);
            coping.transform.localPosition = new Vector3(0, portalH + 0.45f, 0);
            coping.transform.localScale = new Vector3(portalW + 0.15f, 0.08f, portalD + 0.15f);
            coping.GetComponent<Renderer>().sharedMaterial = frameMat;

            // 3. Linear Teak Wood-Slat False Ceiling Underneath (Photos 9.29.08 PM (1) & (2))
            var woodCeiling = GameObject.CreatePrimitive(PrimitiveType.Cube);
            woodCeiling.name = "Portal_WoodSlatCeiling";
            woodCeiling.transform.SetParent(portal.transform);
            woodCeiling.transform.localPosition = new Vector3(0, portalH - 0.02f, 0);
            woodCeiling.transform.localScale = new Vector3(portalW - 1.3f, 0.04f, portalD - 0.1f);
            woodCeiling.GetComponent<Renderer>().sharedMaterial = woodSlatMat;

            // 4. Recessed Warm Downlight Canisters + Point Light
            float[] lightX = new float[] { -1.8f, 0f, 1.8f };
            for (int lx = 0; lx < lightX.Length; lx++)
            {
                var can = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
                can.name = $"DownlightCanister_{lx}";
                can.transform.SetParent(portal.transform);
                can.transform.localPosition = new Vector3(lightX[lx], portalH - 0.04f, 0);
                can.transform.localScale = new Vector3(0.25f, 0.04f, 0.25f);
                can.GetComponent<Renderer>().sharedMaterial = grillMat;
                Object.DestroyImmediate(can.GetComponent<Collider>());
            }

            var portalLight = new GameObject("PortalWarmDownlight");
            portalLight.transform.SetParent(portal.transform);
            portalLight.transform.localPosition = new Vector3(0, portalH - 0.25f, 0);
            var pLt = portalLight.AddComponent<Light>();
            pLt.type = LightType.Point;
            pLt.range = 8f;
            pLt.color = new Color(1.0f, 0.90f, 0.78f);
            pLt.intensity = 2.0f;

            // 5. Left and Right Massive Modern Structural Pillars (Photos 9.29.08 PM)
            float colX = portalW * 0.5f - 0.35f;
            for (int side = -1; side <= 1; side += 2)
            {
                var col = GameObject.CreatePrimitive(PrimitiveType.Cube);
                col.name = side < 0 ? "Pillar_Left" : "Pillar_Right";
                col.transform.SetParent(portal.transform);
                col.transform.localPosition = new Vector3(side * colX, portalH * 0.5f, 0);
                col.transform.localScale = new Vector3(0.65f, portalH, 0.65f);
                col.GetComponent<Renderer>().sharedMaterial = bronzeMat;

                // Black Plinth Base
                var plinth = GameObject.CreatePrimitive(PrimitiveType.Cube);
                plinth.name = "PlinthBase";
                plinth.transform.SetParent(col.transform);
                plinth.transform.localPosition = new Vector3(0, -0.42f, 0);
                plinth.transform.localScale = new Vector3(1.15f, 0.16f, 1.15f);
                plinth.GetComponent<Renderer>().sharedMaterial = grillMat;

                // Metal security folding gate on outer sides
                var gate = GameObject.CreatePrimitive(PrimitiveType.Cube);
                gate.name = "FoldingSecurityGate";
                gate.transform.SetParent(portal.transform);
                gate.transform.localPosition = new Vector3(side * (colX - 0.4f), 1.4f, 0);
                gate.transform.localScale = new Vector3(0.12f, 2.6f, portalD * 0.75f);
                gate.GetComponent<Renderer>().sharedMaterial = grillMat;
            }

            // 6. 3D GOLD Departmental Title across the Front Portal Lintel Fascia (Photo 9.29.08 PM)
            var lintelBanner = GameObject.CreatePrimitive(PrimitiveType.Cube);
            lintelBanner.name = "DepartmentLintelFascia";
            lintelBanner.transform.SetParent(portal.transform);
            lintelBanner.transform.localPosition = new Vector3(0, portalH + 0.18f, -portalD * 0.5f - 0.04f);
            lintelBanner.transform.localScale = new Vector3(portalW, 0.52f, 0.08f);
            lintelBanner.GetComponent<Renderer>().sharedMaterial = bronzeMat;

            var titleObj = new GameObject("DepartmentGoldTitle");
            titleObj.transform.SetParent(lintelBanner.transform);
            titleObj.transform.localPosition = new Vector3(0, 0, -0.62f);
            titleObj.transform.localRotation = Quaternion.identity;
            var textMesh = titleObj.AddComponent<TextMesh>();
            textMesh.text = "DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING";
            textMesh.fontSize = 32;
            textMesh.characterSize = 0.026f;
            textMesh.alignment = TextAlignment.Center;
            textMesh.anchor = TextAnchor.MiddleCenter;
            textMesh.color = new Color(1.0f, 0.85f, 0.20f); // Bright Gold

            // 7. Polished Granite Entrance Threshold Steps (3 tiers)
            for (int s = 0; s < 3; s++)
            {
                var step = GameObject.CreatePrimitive(PrimitiveType.Cube);
                step.name = $"EntranceStep_{s}";
                step.transform.SetParent(portal.transform);
                step.transform.localPosition = new Vector3(0, (s + 0.5f) * 0.15f, -portalD * 0.5f - s * 0.4f);
                step.transform.localScale = new Vector3(portalW - s * 0.4f, 0.15f, 0.45f);
                step.GetComponent<Renderer>().sharedMaterial = floorMat;

                // Black bullnose nosing trim on front edge
                var nosing = GameObject.CreatePrimitive(PrimitiveType.Cube);
                nosing.name = "Nosing";
                nosing.transform.SetParent(step.transform);
                nosing.transform.localPosition = new Vector3(0, 0.45f, -0.45f);
                nosing.transform.localScale = new Vector3(1.0f, 0.15f, 0.1f);
                nosing.GetComponent<Renderer>().sharedMaterial = grillMat;
                Object.DestroyImmediate(nosing.GetComponent<Collider>());
            }
        }

        private static void BuildSignatureCornerTowers(Transform parent, float facadeZ,
            Material bronzeMat, Material glassMat, Material frameMat, Material woodAccentMat)
        {
            var towersGroup = new GameObject("Signature_Architectural_Corner_Towers");
            towersGroup.transform.SetParent(parent);

            float totalH = 17.6f; // Rises above 16m roof level
            float[] towerX = new float[] { -21.0f, 21.0f };

            for (int t = 0; t < towerX.Length; t++)
            {
                float cx = towerX[t];
                bool isEast = cx > 0;
                float sign = isEast ? 1f : -1f;

                var tower = new GameObject(isEast ? "SignatureCornerTower_East" : "SignatureCornerTower_West");
                tower.transform.SetParent(towersGroup.transform);
                tower.transform.position = new Vector3(cx + sign * 0.5f, 0, facadeZ + 1.8f);

                // 1. Main Tower Vertical Body in Architectural Dark Bronze Cladding
                var body = GameObject.CreatePrimitive(PrimitiveType.Cube);
                body.name = "Tower_VerticalBody";
                body.transform.SetParent(tower.transform);
                body.transform.localPosition = new Vector3(0, totalH * 0.5f, 0);
                body.transform.localScale = new Vector3(1.5f, totalH, 4.0f);
                body.GetComponent<Renderer>().sharedMaterial = bronzeMat;

                // 1b. Crisp White Parapet Crown Coping Cap on Tower Top
                var crownCoping = GameObject.CreatePrimitive(PrimitiveType.Cube);
                crownCoping.name = "Tower_CrownCoping";
                crownCoping.transform.SetParent(tower.transform);
                crownCoping.transform.localPosition = new Vector3(0, totalH + 0.08f, 0);
                crownCoping.transform.localScale = new Vector3(1.7f, 0.16f, 4.3f);
                crownCoping.GetComponent<Renderer>().sharedMaterial = frameMat;

                // 1c. Front Face Architectural White Trim and Woodgrain Reveal Accent (Photo 9.29.07 PM)
                var frontTrim = GameObject.CreatePrimitive(PrimitiveType.Cube);
                frontTrim.name = "Tower_FrontWhiteTrim";
                frontTrim.transform.SetParent(tower.transform);
                frontTrim.transform.localPosition = new Vector3(0, totalH * 0.5f, -2.05f);
                frontTrim.transform.localScale = new Vector3(1.3f, totalH - 0.6f, 0.12f);
                frontTrim.GetComponent<Renderer>().sharedMaterial = frameMat;

                var frontWood = GameObject.CreatePrimitive(PrimitiveType.Cube);
                frontWood.name = "Tower_FrontWoodAccent";
                frontWood.transform.SetParent(frontTrim.transform);
                frontWood.transform.localPosition = new Vector3(0, 0, -0.6f);
                frontWood.transform.localScale = new Vector3(0.85f, 0.96f, 0.8f);
                frontWood.GetComponent<Renderer>().sharedMaterial = woodAccentMat;

                // 2. Thick White Architrave Casing Surround Frame (Photo 9.29.07 PM)
                var casingFrame = GameObject.CreatePrimitive(PrimitiveType.Cube);
                casingFrame.name = "CurtainWall_CasingFrame";
                casingFrame.transform.SetParent(tower.transform);
                casingFrame.transform.localPosition = new Vector3(sign * 0.72f, totalH * 0.5f, -0.3f);
                casingFrame.transform.localScale = new Vector3(0.24f, totalH - 0.6f, 2.8f);
                casingFrame.GetComponent<Renderer>().sharedMaterial = frameMat;

                // 3. Continuous Multi-Storey Tinted Glass Curtain Wall Window (Photo 9.29.07 PM)
                var curtainGlass = GameObject.CreatePrimitive(PrimitiveType.Cube);
                curtainGlass.name = "CurtainWall_Glass";
                curtainGlass.transform.SetParent(tower.transform);
                curtainGlass.transform.localPosition = new Vector3(sign * 0.82f, totalH * 0.5f, -0.3f);
                curtainGlass.transform.localScale = new Vector3(0.08f, totalH - 1.0f, 2.3f);
                curtainGlass.GetComponent<Renderer>().sharedMaterial = glassMat;

                // 4. Horizontal White Transom Mullion Bars at each storey line
                for (float ty = 4.0f; ty <= 16.0f; ty += 4.0f)
                {
                    var transom = GameObject.CreatePrimitive(PrimitiveType.Cube);
                    transom.name = $"Transom_Y{ty}";
                    transom.transform.SetParent(tower.transform);
                    transom.transform.localPosition = new Vector3(sign * 0.84f, ty, -0.3f);
                    transom.transform.localScale = new Vector3(0.12f, 0.12f, 2.34f);
                    transom.GetComponent<Renderer>().sharedMaterial = frameMat;
                    Object.DestroyImmediate(transom.GetComponent<Collider>());
                }

                // 5. Adjacent Warm Terracotta / Cedar Woodgrain HPL Accent Panel (Photo 9.29.07 PM)
                var woodPanel = GameObject.CreatePrimitive(PrimitiveType.Cube);
                woodPanel.name = "Terracotta_Woodgrain_AccentPanel";
                woodPanel.transform.SetParent(tower.transform);
                woodPanel.transform.localPosition = new Vector3(sign * 0.70f, totalH * 0.5f, 1.4f);
                woodPanel.transform.localScale = new Vector3(0.22f, totalH - 0.6f, 0.95f);
                woodPanel.GetComponent<Renderer>().sharedMaterial = woodAccentMat;

                // Horizontal crisp white reveal joint lines on woodgrain panel
                for (float ry = 2.0f; ry <= 16.0f; ry += 2.0f)
                {
                    var reveal = GameObject.CreatePrimitive(PrimitiveType.Cube);
                    reveal.name = $"Reveal_Y{ry}";
                    reveal.transform.SetParent(woodPanel.transform);
                    reveal.transform.localPosition = new Vector3(0.52f, (ry / totalH) - 0.5f, 0);
                    reveal.transform.localScale = new Vector3(0.1f, 0.015f, 1.02f);
                    reveal.GetComponent<Renderer>().sharedMaterial = frameMat;
                    Object.DestroyImmediate(reveal.GetComponent<Collider>());
                }
            }
        }

        private static void BuildMainRooftopSignage(Transform parent, float roofY, float width, float depth, float facadeZ,
            Material bronzeMat, Material frameMat, Material goldMat)
        {
            var roofGroup = new GameObject("Rooftop_Signage_Parapet");
            roofGroup.transform.SetParent(parent);
            roofGroup.transform.position = new Vector3(0, roofY, facadeZ);

            // Dark Coffee-Bronze Fascia Signboard Box (Photos 9.29.08 PM)
            var fascia = GameObject.CreatePrimitive(PrimitiveType.Cube);
            fascia.name = "SignageFasciaPanel";
            fascia.transform.SetParent(roofGroup.transform);
            fascia.transform.localPosition = new Vector3(0, 1.1f, -0.2f);
            fascia.transform.localScale = new Vector3(18.0f, 1.6f, 0.45f);
            fascia.GetComponent<Renderer>().sharedMaterial = bronzeMat;

            // Crisp White Coping Top Cap
            var coping = GameObject.CreatePrimitive(PrimitiveType.Cube);
            coping.name = "SignageCoping";
            coping.transform.SetParent(roofGroup.transform);
            coping.transform.localPosition = new Vector3(0, 1.95f, -0.2f);
            coping.transform.localScale = new Vector3(18.5f, 0.16f, 0.6f);
            coping.GetComponent<Renderer>().sharedMaterial = frameMat;

            // Bold 3D Golden Lettering: "ST. PAUL'S BLOCK" (Photo 9.29.08 PM)
            var textObj = new GameObject("SignageText");
            textObj.transform.SetParent(fascia.transform);
            textObj.transform.localPosition = new Vector3(0, 0, -0.6f);
            textObj.transform.localRotation = Quaternion.identity;
            var textMesh = textObj.AddComponent<TextMesh>();
            textMesh.text = "ST. PAUL'S BLOCK";
            textMesh.fontSize = 48;
            textMesh.characterSize = 0.038f;
            textMesh.alignment = TextAlignment.Center;
            textMesh.anchor = TextAnchor.MiddleCenter;
            textMesh.color = new Color(0.98f, 0.78f, 0.18f); // Gold
        }

        private static void BuildRooftopPergola(Transform parent, Vector3 center, Vector3 size, Material pergolaMat)
        {
            var pergola = new GameObject("Courtyard_Pergola_Trellis");
            pergola.transform.SetParent(parent);
            pergola.transform.position = center;

            var beamLeft = GameObject.CreatePrimitive(PrimitiveType.Cube);
            beamLeft.name = "SupportBeam_Left";
            beamLeft.transform.SetParent(pergola.transform);
            beamLeft.transform.localPosition = new Vector3(-size.x * 0.5f, size.y, 0);
            beamLeft.transform.localScale = new Vector3(0.2f, 0.3f, size.z);
            beamLeft.GetComponent<Renderer>().sharedMaterial = pergolaMat;

            var beamRight = GameObject.CreatePrimitive(PrimitiveType.Cube);
            beamRight.name = "SupportBeam_Right";
            beamRight.transform.SetParent(pergola.transform);
            beamRight.transform.localPosition = new Vector3(size.x * 0.5f, size.y, 0);
            beamRight.transform.localScale = new Vector3(0.2f, 0.3f, size.z);
            beamRight.GetComponent<Renderer>().sharedMaterial = pergolaMat;

            for (float rz = -size.z * 0.45f; rz <= size.z * 0.45f; rz += 1.5f)
            {
                var rafter = GameObject.CreatePrimitive(PrimitiveType.Cube);
                rafter.name = "PergolaRafter";
                rafter.transform.SetParent(pergola.transform);
                rafter.transform.localPosition = new Vector3(0, size.y + 0.15f, rz);
                rafter.transform.localScale = new Vector3(size.x + 0.6f, 0.15f, 0.12f);
                rafter.GetComponent<Renderer>().sharedMaterial = pergolaMat;
            }
        }

        private static void BuildGroundGapBarrier(Transform parent, Material curbMat)
        {
            // Connecting alleyway driveway between Main & Annexure is kept fully open
        }
    }
}
