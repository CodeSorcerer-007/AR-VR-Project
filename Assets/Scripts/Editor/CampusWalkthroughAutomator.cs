using System;
using System.Collections.Generic;
using System.IO;
using UnityEditor;
using UnityEngine;

namespace StPaulsVR.Editor
{
    public static class CampusWalkthroughAutomator
    {
        [Serializable]
        public class WalkthroughShotMeta
        {
            public string id;
            public string category;
            public string floor;
            public string locationName;
            public string relativePath;
            public Vector3 cameraPosition;
            public Vector3 cameraTarget;
            public bool collisionPass;
            public float floorHitY;
            public float headClearance;
        }

        [Serializable]
        public class WalkthroughReportData
        {
            public string timestamp;
            public int totalShots;
            public int collisionPassedShots;
            public List<WalkthroughShotMeta> shots = new List<WalkthroughShotMeta>();
        }

        private struct ShotTarget
        {
            public string id;
            public string category;
            public string floor;
            public string locationName;
            public string subfolder;
            public Vector3 pos;
            public Vector3 target;
            public float expectedBaseY;

            public ShotTarget(string id, string category, string floor, string locationName, string subfolder, Vector3 pos, Vector3 target, float expectedBaseY)
            {
                this.id = id;
                this.category = category;
                this.floor = floor;
                this.locationName = locationName;
                this.subfolder = subfolder;
                this.pos = pos;
                this.target = target;
                this.expectedBaseY = expectedBaseY;
            }
        }

        [MenuItem("StPauls/Run Full Walkthrough")]
        public static void RunFullWalkthrough()
        {
            Debug.Log("[CampusWalkthroughAutomator] Starting exhaustive campus walkthrough...");

            // 1. Freshly build master scene
            CampusBuildAutomator.BuildSceneGeometry();
            Physics.SyncTransforms();

            // 2. Prepare root output directory
            string baseDir = Path.GetFullPath("Screenshots/Walkthrough");
            string[] subdirs = new string[]
            {
                "GroundFloor",
                "FirstFloor",
                "SecondFloor",
                "ThirdFloor",
                "SpecialSpaces",
                "StairsAndCorridors",
                "BridgesAndCourtyards",
                "ExteriorsAndAerial"
            };

            foreach (var sub in subdirs)
            {
                string p = Path.Combine(baseDir, sub);
                if (!Directory.Exists(p)) Directory.CreateDirectory(p);
            }

            // 3. Assemble all walkthrough shot targets
            List<ShotTarget> shots = GenerateAllShotTargets();
            Debug.Log($"[CampusWalkthroughAutomator] Generated {shots.Count} comprehensive shot targets across all campus spaces.");

            // 4. Setup temporary camera & RenderTexture (1920x1080)
            var camObj = new GameObject("WalkthroughCamera");
            var cam = camObj.AddComponent<Camera>();
            cam.fieldOfView = 75f;
            cam.nearClipPlane = 0.1f;
            cam.farClipPlane = 600f;
            cam.clearFlags = CameraClearFlags.Skybox;

            int width = 1920;
            int height = 1080;
            var rt = new RenderTexture(width, height, 24, RenderTextureFormat.ARGB32);
            cam.targetTexture = rt;

            var currentRT = RenderTexture.active;
            RenderTexture.active = rt;
            var tex = new Texture2D(width, height, TextureFormat.RGB24, false);

            var report = new WalkthroughReportData();
            report.timestamp = DateTime.UtcNow.ToString("o");
            report.totalShots = shots.Count;

            int passCount = 0;

            for (int i = 0; i < shots.Count; i++)
            {
                var s = shots[i];

                // A. Position Camera
                cam.transform.position = s.pos;
                cam.transform.LookAt(s.target);
                cam.Render();

                // B. Read and Save PNG
                tex.ReadPixels(new Rect(0, 0, width, height), 0, 0);
                tex.Apply();

                byte[] bytes = tex.EncodeToPNG();
                string relPath = Path.Combine(s.subfolder, $"{s.id}.png");
                string fullPath = Path.Combine(baseDir, relPath);
                File.WriteAllBytes(fullPath, bytes);

                // C. Walkability & Collision Verification
                bool colPass = true;
                float hitY = 0f;
                float clearance = 3.2f;

                // Test floor collision & ceiling clearance
                if (s.category != "aerial" && s.category != "exterior")
                {
                    if (Physics.Raycast(s.pos, Vector3.down, out RaycastHit downHit, 6.0f, ~0, QueryTriggerInteraction.Ignore))
                    {
                        hitY = downHit.point.y;
                        if (Mathf.Abs(hitY - s.expectedBaseY) > 1.2f)
                        {
                            colPass = false;
                        }
                    }
                    else
                    {
                        colPass = false;
                    }

                    if (Physics.Raycast(s.pos, Vector3.up, out RaycastHit upHit, 6.0f, ~0, QueryTriggerInteraction.Ignore))
                    {
                        clearance = upHit.distance;
                        if (clearance < 0.8f) colPass = false;
                    }
                }

                if (colPass) passCount++;

                var meta = new WalkthroughShotMeta
                {
                    id = s.id,
                    category = s.category,
                    floor = s.floor,
                    locationName = s.locationName,
                    relativePath = relPath.Replace('\\', '/'),
                    cameraPosition = s.pos,
                    cameraTarget = s.target,
                    collisionPass = colPass,
                    floorHitY = hitY,
                    headClearance = clearance
                };
                report.shots.Add(meta);

                if ((i + 1) % 50 == 0 || i == shots.Count - 1)
                {
                    Debug.Log($"[CampusWalkthroughAutomator] Rendered {i + 1}/{shots.Count} shots... ({passCount} collision pass)");
                }
            }

            report.collisionPassedShots = passCount;

            // 5. Save JSON report
            string json = JsonUtility.ToJson(report, true);
            string jsonPath = Path.Combine(baseDir, "walkthrough_index.json");
            File.WriteAllText(jsonPath, json);
            Debug.Log($"[CampusWalkthroughAutomator] Saved walkthrough metadata index to: {jsonPath}");

            // 6. Cleanup
            RenderTexture.active = currentRT;
            cam.targetTexture = null;
            UnityEngine.Object.DestroyImmediate(rt);
            UnityEngine.Object.DestroyImmediate(tex);
            UnityEngine.Object.DestroyImmediate(camObj);

            Debug.Log($"[CampusWalkthroughAutomator] Completed walkthrough: {shots.Count} shots captured, {passCount} passed collision checks.");
            EditorApplication.Exit(0);
        }

        private static List<ShotTarget> GenerateAllShotTargets()
        {
            var list = new List<ShotTarget>();

            // -------------------------------------------------------------
            // PART 1: ALL INDIVIDUAL ROOMS (2 OPPOSING ANGLES PER ROOM)
            // -------------------------------------------------------------
            foreach (var r in CampusData.Rooms)
            {
                string subfolder = "GroundFloor";
                float baseY = r.position.y;
                if (r.floor == "first") subfolder = "FirstFloor";
                else if (r.floor == "second") subfolder = "SecondFloor";
                else if (r.floor == "third") subfolder = "ThirdFloor";

                float eyeY = baseY + 1.65f;
                bool isStair = r.category == "stairwell";
                float halfW = isStair ? Mathf.Min(0.4f, r.dimensions.x * 0.1f) : Mathf.Max(1.0f, r.dimensions.x * 0.35f);
                float halfD = Mathf.Max(1.0f, r.dimensions.z * 0.35f);

                // View A: South-West corner looking toward North-East
                Vector3 posA = new Vector3(r.position.x - halfW, eyeY, r.position.z - halfD);
                Vector3 targetA = isStair 
                    ? new Vector3(r.position.x, eyeY + 0.8f, r.position.z + halfD)
                    : new Vector3(r.position.x + halfW, eyeY - 0.2f, r.position.z + halfD);
                list.Add(new ShotTarget(
                    $"{r.id}_ViewA_SW",
                    r.category,
                    r.floor,
                    $"{r.number} - {r.name} (SW Angle)",
                    subfolder,
                    posA,
                    targetA,
                    baseY
                ));

                // View B: North-East corner looking toward South-West
                Vector3 posB = new Vector3(r.position.x + halfW, isStair ? eyeY + 1.0f : eyeY, r.position.z + halfD);
                Vector3 targetB = isStair 
                    ? new Vector3(r.position.x, eyeY, r.position.z - halfD)
                    : new Vector3(r.position.x - halfW, eyeY - 0.2f, r.position.z - halfD);
                list.Add(new ShotTarget(
                    $"{r.id}_ViewB_NE",
                    r.category,
                    r.floor,
                    $"{r.number} - {r.name} (NE Angle)",
                    subfolder,
                    posB,
                    targetB,
                    baseY
                ));
            }

            // -------------------------------------------------------------
            // PART 2: SPECIAL SPACES (DETAILED MULTI-ANGLE & CLOSE-UPS)
            // -------------------------------------------------------------
            // 1. Entrance Foyer & Portico
            list.Add(new ShotTarget("Foyer_PorticoApproach", "foyer", "ground", "Entrance Portico Tuscan Columns", "SpecialSpaces",
                new Vector3(0f, 1.8f, -14.0f), new Vector3(0f, 2.5f, -8.0f), 0f));
            list.Add(new ShotTarget("Foyer_LookingInNorth", "foyer", "ground", "Main Entrance Foyer Looking In", "SpecialSpaces",
                new Vector3(0f, 1.65f, -7.0f), new Vector3(0f, 1.65f, -2.5f), 0f));
            list.Add(new ShotTarget("Foyer_DrJeppiaarPortrait", "foyer", "ground", "Gold-Framed Col. Dr. Jeppiaar Portrait", "SpecialSpaces",
                new Vector3(1.5f, 1.65f, -4.5f), new Vector3(-3.0f, 1.8f, -4.5f), 0f));
            list.Add(new ShotTarget("Foyer_EastVendingMachine", "foyer", "ground", "East Wall Vending Machine", "SpecialSpaces",
                new Vector3(-1.5f, 1.65f, -4.5f), new Vector3(3.0f, 1.3f, -4.5f), 0f));
            list.Add(new ShotTarget("Foyer_TeakWoodSlatCeiling", "foyer", "ground", "Teak Wood-Slat False Ceiling", "SpecialSpaces",
                new Vector3(0f, 1.3f, -4.5f), new Vector3(0f, 3.5f, -3.0f), 0f));
            list.Add(new ShotTarget("Foyer_DirectoryBoard", "foyer", "ground", "CSE Department Directory Board", "SpecialSpaces",
                new Vector3(0f, 1.65f, -6.0f), new Vector3(0f, 1.8f, -2.0f), 0f));

            // 2. CSS Flagship Lab (Ground Floor)
            list.Add(new ShotTarget("CSSLab_EntranceDoubleDoors", "lab", "ground", "CSS Lab South Entrance Portal", "SpecialSpaces",
                new Vector3(0f, 1.65f, 4.0f), new Vector3(0f, 1.65f, 8.0f), 0f));
            list.Add(new ShotTarget("CSSLab_WorkstationAislesNorth", "lab", "ground", "CSS Lab Computer Workstation Rows", "SpecialSpaces",
                new Vector3(0f, 1.65f, 7.5f), new Vector3(0f, 1.4f, 16.0f), 0f));
            list.Add(new ShotTarget("CSSLab_FrontPodiumAndBoard", "lab", "ground", "CSS Lab Teacher Podium & Smart Screen", "SpecialSpaces",
                new Vector3(0f, 1.65f, 16.5f), new Vector3(0f, 1.4f, 8.0f), 0f));
            list.Add(new ShotTarget("CSSLab_AisleWestPerspective", "lab", "ground", "CSS Lab West Student Stations", "SpecialSpaces",
                new Vector3(-5.0f, 1.65f, 9.0f), new Vector3(4.0f, 1.3f, 15.0f), 0f));

            // 3. Dean's Cabin (Ground Floor South-West Corner)
            list.Add(new ShotTarget("DeanCabin_ExecutiveDesk", "cabin", "ground", "Dean's Executive Desk & Credenza", "SpecialSpaces",
                new Vector3(-19.5f, 1.65f, -6.5f), new Vector3(-16.0f, 1.4f, -3.5f), 0f));
            list.Add(new ShotTarget("DeanCabin_MeetingArea", "cabin", "ground", "Dean's Meeting & Guest Lounge", "SpecialSpaces",
                new Vector3(-16.0f, 1.65f, -3.5f), new Vector3(-19.5f, 1.4f, -6.5f), 0f));

            // 4. HOD's Cabin (Ground Floor South-East Corner)
            list.Add(new ShotTarget("HODCabin_ExecutiveDesk", "cabin", "ground", "HOD's Executive Desk & Trophy Cabinet", "SpecialSpaces",
                new Vector3(19.5f, 1.65f, -6.5f), new Vector3(16.0f, 1.4f, -3.5f), 0f));
            list.Add(new ShotTarget("HODCabin_ConferenceArea", "cabin", "ground", "HOD's Conference Table", "SpecialSpaces",
                new Vector3(16.0f, 1.65f, -3.5f), new Vector3(19.5f, 1.4f, -6.5f), 0f));

            // 5. Design Thinking Lab & Project Hub (1st Floor)
            list.Add(new ShotTarget("DesignThinkingLab_Overview", "lab", "first", "Design Thinking Lab 1F Overview", "SpecialSpaces",
                new Vector3(0f, 5.65f, 7.5f), new Vector3(0f, 5.4f, 15.0f), 4.0f));
            list.Add(new ShotTarget("ProjectHub_OpenInnovationArea", "project_hub", "first", "Project Hub Open Collaboration Zone", "SpecialSpaces",
                new Vector3(0f, 5.65f, 32.0f), new Vector3(0f, 5.5f, 38.0f), 4.0f));

            // 6. Machine Vision Lab & Server Room (2nd Floor)
            list.Add(new ShotTarget("MachineVisionLab_Overview", "lab", "second", "Machine Vision Lab Overview", "SpecialSpaces",
                new Vector3(0f, 9.65f, 7.5f), new Vector3(0f, 9.4f, 15.0f), 8.0f));
            list.Add(new ShotTarget("MachineVisionLab_GlassViewingWindow", "lab", "second", "Double-Glazed Viewing Window to Server Room", "SpecialSpaces",
                new Vector3(0f, 9.65f, 14.5f), new Vector3(0f, 9.65f, 19.5f), 8.0f));
            list.Add(new ShotTarget("ServerRoom_RacksBlinkingLEDs", "server_room", "second", "42U Server Racks Active Status LEDs", "SpecialSpaces",
                new Vector3(-3.5f, 9.65f, 19.5f), new Vector3(3.0f, 9.65f, 22.5f), 8.0f));
            list.Add(new ShotTarget("ServerRoom_CRACPrecisionCooling", "server_room", "second", "CRAC Precision Environmental Cooling Unit", "SpecialSpaces",
                new Vector3(3.5f, 9.65f, 22.5f), new Vector3(-3.0f, 9.65f, 19.5f), 8.0f));
            list.Add(new ShotTarget("ServerRoom_LookoutToLab", "server_room", "second", "Server Room Looking Into Machine Vision Lab", "SpecialSpaces",
                new Vector3(0f, 9.65f, 20.0f), new Vector3(0f, 9.65f, 14.0f), 8.0f));

            // 7. 3rd Floor Flagship Research Labs
            list.Add(new ShotTarget("Web3Lab_Overview", "lab", "third", "Web 3.0 Advanced Distributed Lab", "SpecialSpaces",
                new Vector3(0f, 13.65f, 7.5f), new Vector3(0f, 13.4f, 15.0f), 12.0f));
            list.Add(new ShotTarget("GenAILab_Overview", "lab", "third", "Generative AI Research Laboratory", "SpecialSpaces",
                new Vector3(-45.0f, 13.65f, 6.0f), new Vector3(-45.0f, 13.4f, 15.0f), 12.0f));
            list.Add(new ShotTarget("QuantumLab_Overview", "lab", "third", "Quantum Computing & HPC Laboratory", "SpecialSpaces",
                new Vector3(0f, 13.65f, 32.0f), new Vector3(0f, 13.4f, 38.0f), 12.0f));

            // -------------------------------------------------------------
            // PART 3: CORRIDORS & STAIRCASES
            // -------------------------------------------------------------
            string[] floorNames = new string[] { "ground", "first", "second", "third" };
            float[] floorHeights = new float[] { 0f, 4f, 8f, 12f };

            for (int f = 0; f < 4; f++)
            {
                string fn = floorNames[f];
                float y = floorHeights[f];
                float ey = y + 1.65f;

                // Main Block Corridors
                list.Add(new ShotTarget($"Corridor_{fn}_South_West", "corridor", fn, $"Main {fn} Front Corridor Looking West", "StairsAndCorridors",
                    new Vector3(0f, ey, -2.0f), new Vector3(-18.0f, ey, -2.0f), y));
                list.Add(new ShotTarget($"Corridor_{fn}_South_East", "corridor", fn, $"Main {fn} Front Corridor Looking East", "StairsAndCorridors",
                    new Vector3(0f, ey, -2.0f), new Vector3(18.0f, ey, -2.0f), y));
                list.Add(new ShotTarget($"Corridor_{fn}_WestWing_North", "corridor", fn, $"Main {fn} West Wing Corridor Looking North", "StairsAndCorridors",
                    new Vector3(-18.0f, ey, 0.0f), new Vector3(-18.0f, ey, 32.0f), y));
                list.Add(new ShotTarget($"Corridor_{fn}_EastWing_North", "corridor", fn, $"Main {fn} East Wing Corridor Looking North", "StairsAndCorridors",
                    new Vector3(18.0f, ey, 0.0f), new Vector3(18.0f, ey, 32.0f), y));
                list.Add(new ShotTarget($"Corridor_{fn}_North_West", "corridor", fn, $"Main {fn} Rear Corridor Looking West", "StairsAndCorridors",
                    new Vector3(0f, ey, 34.0f), new Vector3(-18.0f, ey, 34.0f), y));
                list.Add(new ShotTarget($"Corridor_{fn}_North_East", "corridor", fn, $"Main {fn} Rear Corridor Looking East", "StairsAndCorridors",
                    new Vector3(0f, ey, 34.0f), new Vector3(18.0f, ey, 34.0f), y));

                // Annexure Block Corridors
                list.Add(new ShotTarget($"Corridor_Annex_{fn}_North", "corridor", fn, $"Annexure {fn} Veranda Corridor Looking North", "StairsAndCorridors",
                    new Vector3(-35.0f, ey, 0.0f), new Vector3(-35.0f, ey, 38.0f), y));
                list.Add(new ShotTarget($"Corridor_Annex_{fn}_South", "corridor", fn, $"Annexure {fn} Veranda Corridor Looking South", "StairsAndCorridors",
                    new Vector3(-35.0f, ey, 38.0f), new Vector3(-35.0f, ey, 0.0f), y));

                // Staircase landings per floor
                list.Add(new ShotTarget($"Stair_MainSW_{fn}_Portal", "stairwell", fn, $"Main SW Stairwell {fn} Navy Portal Entry", "StairsAndCorridors",
                    new Vector3(-13.0f, ey, 0.5f), new Vector3(-13.0f, ey + 0.8f, 4.5f), y));
                list.Add(new ShotTarget($"Stair_MainSE_{fn}_Portal", "stairwell", fn, $"Main SE Stairwell {fn} Navy Portal Entry", "StairsAndCorridors",
                    new Vector3(13.0f, ey, 0.5f), new Vector3(13.0f, ey + 0.8f, 4.5f), y));
                list.Add(new ShotTarget($"Stair_Annex_{fn}_Portal", "stairwell", fn, $"Annexure Stairwell {fn} Portal Entry", "StairsAndCorridors",
                    new Vector3(-41.0f, ey, -0.5f), new Vector3(-41.0f, ey + 1.2f, 4.0f), y));
            }

            // -------------------------------------------------------------
            // PART 4: PEDESTRIAN BRIDGES & COURTYARDS
            // -------------------------------------------------------------
            // Floor 1 Bridge (Y = 4m)
            list.Add(new ShotTarget("Bridge_1F_LookingWest", "bridge", "first", "Floor 1 Pedestrian Bridge Looking to Annexure", "BridgesAndCourtyards",
                new Vector3(-23.0f, 5.65f, 1.5f), new Vector3(-33.0f, 5.65f, 1.5f), 4.0f));
            list.Add(new ShotTarget("Bridge_1F_LookingEast", "bridge", "first", "Floor 1 Pedestrian Bridge Looking to Main", "BridgesAndCourtyards",
                new Vector3(-31.0f, 5.65f, 1.5f), new Vector3(-21.0f, 5.65f, 1.5f), 4.0f));

            // Floor 2 Bridge (Y = 8m)
            list.Add(new ShotTarget("Bridge_2F_LookingWest", "bridge", "second", "Floor 2 Pedestrian Bridge Looking to Annexure", "BridgesAndCourtyards",
                new Vector3(-23.0f, 9.65f, 1.5f), new Vector3(-33.0f, 9.65f, 1.5f), 8.0f));
            list.Add(new ShotTarget("Bridge_2F_LookingEast", "bridge", "second", "Floor 2 Pedestrian Bridge Looking to Main", "BridgesAndCourtyards",
                new Vector3(-31.0f, 9.65f, 1.5f), new Vector3(-21.0f, 9.65f, 1.5f), 8.0f));

            // Open-air Bridge Gap Exterior
            list.Add(new ShotTarget("Bridge_OpenAirGap_SouthExterior", "bridge", "exterior", "Both Bridges Spanning Open Gap (South View)", "BridgesAndCourtyards",
                new Vector3(-27.0f, 7.0f, -12.0f), new Vector3(-27.0f, 6.0f, 1.5f), 0f));
            list.Add(new ShotTarget("Bridge_OpenAirGap_NorthExterior", "bridge", "exterior", "Both Bridges Spanning Open Gap (North View)", "BridgesAndCourtyards",
                new Vector3(-27.0f, 7.0f, 16.0f), new Vector3(-27.0f, 6.0f, 1.5f), 0f));

            // Courtyard Lightwells Overlooks
            list.Add(new ShotTarget("Courtyard_MainFrontWest_Overlook", "courtyard", "third", "Main Front-West Lightwell (3F Parapet Overlook)", "BridgesAndCourtyards",
                new Vector3(-2.5f, 13.65f, 6.5f), new Vector3(-7.0f, 4.0f, 6.5f), 12.0f));
            list.Add(new ShotTarget("Courtyard_MainFrontEast_Overlook", "courtyard", "third", "Main Front-East Lightwell (3F Parapet Overlook)", "BridgesAndCourtyards",
                new Vector3(2.5f, 13.65f, 6.5f), new Vector3(7.0f, 4.0f, 6.5f), 12.0f));
            list.Add(new ShotTarget("Courtyard_MainRearWest_Overlook", "courtyard", "third", "Main Rear-West Lightwell (3F Parapet Overlook)", "BridgesAndCourtyards",
                new Vector3(-2.5f, 13.65f, 25.5f), new Vector3(-7.0f, 4.0f, 25.5f), 12.0f));
            list.Add(new ShotTarget("Courtyard_MainRearEast_Overlook", "courtyard", "third", "Main Rear-East Lightwell (3F Parapet Overlook)", "BridgesAndCourtyards",
                new Vector3(2.5f, 13.65f, 25.5f), new Vector3(7.0f, 4.0f, 25.5f), 12.0f));
            list.Add(new ShotTarget("Courtyard_Annexure_Overlook", "courtyard", "third", "Annexure Lightwell Overlook", "BridgesAndCourtyards",
                new Vector3(-39.0f, 13.65f, 19.0f), new Vector3(-43.0f, 4.0f, 19.0f), 12.0f));
            list.Add(new ShotTarget("Courtyard_Ground_Skyward", "courtyard", "ground", "Ground Courtyard Open-To-Sky View", "BridgesAndCourtyards",
                new Vector3(-7.0f, 1.65f, 6.5f), new Vector3(-7.0f, 16.0f, 6.5f), 0f));

            // -------------------------------------------------------------
            // PART 5: EXTERIORS & HIGH-ALTITUDE AERIAL ELEVATIONS
            // -------------------------------------------------------------
            list.Add(new ShotTarget("Exterior_South_Entrance_Wide", "exterior", "exterior", "Main Block Grand South Entrance", "ExteriorsAndAerial",
                new Vector3(0f, 3.5f, -24.0f), new Vector3(0f, 6.0f, -8.0f), 0f));
            list.Add(new ShotTarget("Exterior_South_Portico_Detail", "exterior", "exterior", "Entrance Portico & Steps Detail", "ExteriorsAndAerial",
                new Vector3(0f, 1.8f, -15.0f), new Vector3(0f, 2.8f, -8.0f), 0f));
            list.Add(new ShotTarget("Exterior_SouthEast_Corner", "exterior", "exterior", "South-East Corner Architectural Perspective", "ExteriorsAndAerial",
                new Vector3(28.0f, 4.0f, -16.0f), new Vector3(15.0f, 8.0f, 5.0f), 0f));
            list.Add(new ShotTarget("Exterior_SouthWest_Corner", "exterior", "exterior", "South-West Corner Architectural Perspective", "ExteriorsAndAerial",
                new Vector3(-28.0f, 4.0f, -16.0f), new Vector3(-15.0f, 8.0f, 5.0f), 0f));
            list.Add(new ShotTarget("Exterior_East_Elevation", "exterior", "exterior", "Main Block East Facade Elevation", "ExteriorsAndAerial",
                new Vector3(34.0f, 8.0f, 16.0f), new Vector3(16.0f, 8.0f, 16.0f), 0f));
            list.Add(new ShotTarget("Exterior_West_Elevation", "exterior", "exterior", "Campus West Facade Elevation", "ExteriorsAndAerial",
                new Vector3(-65.0f, 8.0f, 18.0f), new Vector3(-45.0f, 8.0f, 18.0f), 0f));
            list.Add(new ShotTarget("Exterior_North_Rear", "exterior", "exterior", "North Rear Campus Elevation", "ExteriorsAndAerial",
                new Vector3(0f, 6.0f, 54.0f), new Vector3(0f, 8.0f, 34.0f), 0f));
            list.Add(new ShotTarget("Exterior_Annexure_FrontFacade", "exterior", "exterior", "Annexure Front Elevation & Terracotta Bands", "ExteriorsAndAerial",
                new Vector3(-43.0f, 3.5f, -22.0f), new Vector3(-43.0f, 8.0f, 0.0f), 0f));
            list.Add(new ShotTarget("Exterior_Annexure_Verandas", "exterior", "exterior", "Annexure Upper Verandas & Steel Railings", "ExteriorsAndAerial",
                new Vector3(-32.0f, 8.0f, -12.0f), new Vector3(-35.0f, 8.0f, 6.0f), 0f));
            list.Add(new ShotTarget("Exterior_Roof_GoldSignage", "exterior", "roof", "Rooftop ST. PAUL'S BLOCK Gold Lettering", "ExteriorsAndAerial",
                new Vector3(0f, 18.0f, -18.0f), new Vector3(0f, 18.2f, -8.0f), 16.0f));

            // High Altitude Aerial Views
            list.Add(new ShotTarget("Aerial_Campus_MasterPanorama", "aerial", "aerial", "Campus Aerial Master Panorama (All Blocks)", "ExteriorsAndAerial",
                new Vector3(-16.0f, 75.0f, -18.0f), new Vector3(-16.0f, 0f, 18.0f), 0f));
            list.Add(new ShotTarget("Aerial_MainBlock_TopDown", "aerial", "aerial", "Main Block Bird's Eye Top-Down", "ExteriorsAndAerial",
                new Vector3(0f, 65.0f, 16.0f), new Vector3(0f, 0f, 16.0f), 0f));
            list.Add(new ShotTarget("Aerial_Annexure_TopDown", "aerial", "aerial", "Annexure Block Bird's Eye Top-Down", "ExteriorsAndAerial",
                new Vector3(-43.0f, 65.0f, 18.0f), new Vector3(-43.0f, 0f, 18.0f), 0f));
            list.Add(new ShotTarget("Aerial_BridgesGap_TopDown", "aerial", "aerial", "Pedestrian Bridges Gap Bird's Eye", "ExteriorsAndAerial",
                new Vector3(-27.0f, 40.0f, 1.5f), new Vector3(-27.0f, 0f, 1.5f), 0f));

            return list;
        }
    }
}

