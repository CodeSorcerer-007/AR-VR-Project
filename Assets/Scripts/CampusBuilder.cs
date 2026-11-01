using System.Collections.Generic;
using UnityEngine;

namespace StPaulsVR
{
    [ExecuteInEditMode]
    public class CampusBuilder : MonoBehaviour
    {
        [Header("Campus Generation Settings")]
        public bool buildOnStart = true;

        // Shared Material References
        private Material wallMat;
        private Material wallGreyMat;
        private Material floorMat;
        private Material terracottaMat;
        private Material windowGlassMat;
        private Material windowFrameMat;
        private Material windowSillMat;
        private Material sunshadeNavyMat;
        private Material acCompressorMat;
        private Material acGrillMat;
        private Material pvcPipeMat;
        private Material columnWhiteMat;
        private Material columnNavyMat;
        private Material porticoMaroonMat;
        private Material signGoldMat;
        private Material signBlueMat;
        private Material asphaltMat;
        private Material grassMat;
        private Material curbMat;
        private Material bridgeMat;
        private Material railingMat;
        private Material bridgeRailingMat;
        private Material solarPanelMat;
        private Material solarFrameMat;
        private Material barricadeYellowMat;
        private Material treeTrunkMat;
        private Material treeFoliageMat;
        private Material woodDoorMat;
        private Material woodFrameMat;
        private Material handleMat;
        private Material placardMat;
        private Material blackboardMat;
        private Material deskMat;
        private Material pcMat;
        private Material pcScreenMat;
        private Material chairMat;
        private Material projectorMat;
        private Material lightBaseMat;
        private Material lightEmissiveMat;
        private Material skirtingMat;
        private Material fanMat;
        private Material woodSlatMat;
        private Material curbBlueMat;
        private Material curbWhiteMat;
        private Material terracottaAccentMat;

        private GameObject campusRoot;

        private void Start()
        {
            if (buildOnStart && Application.isPlaying)
            {
                BuildCompleteCampus();

                // After building, teleport player to Ground Floor Main Entrance at correct height.
                // Ground slab top = Y:0. Player capsule: center=+0.9, radius=0.35 → bottom at Y-0.55.
                // Spawn at Y=0.60 → bottom at 0.60-0.55=0.05 (just above floor). Safe.
                var fpc = FindObjectOfType<FirstPersonController>();
                if (fpc != null)
                {
                    fpc.TeleportTo(new Vector3(0f, 0.60f, -12.0f), Quaternion.Euler(0f, 0f, 0f));
                    Debug.Log("[CampusBuilder] Player spawned at Ground Floor Main Entrance.");
                }
            }
        }

        private void Update()
        {
            if (Input.GetKeyDown(KeyCode.F5))
            {
                Debug.Log("[CampusBuilder] F5 pressed: Rebuilding complete campus live!");
                BuildCompleteCampus();
                // Re-spawn player at Ground Floor entrance after rebuild
                var fpc = FindObjectOfType<FirstPersonController>();
                if (fpc != null)
                {
                    fpc.TeleportTo(new Vector3(0f, 0.60f, -12.0f), Quaternion.Euler(0f, 0f, 0f));
                }
            }
        }

        [ContextMenu("Build Complete Campus")]
        public void BuildCompleteCampus()
        {
            InitMaterials();

            // Destroy existing campus hierarchy if any
            var existing = transform.Find("--- ST PAULS CAMPUS ---");
            if (existing != null)
            {
                if (Application.isPlaying)
                    Destroy(existing.gameObject);
                else
                    DestroyImmediate(existing.gameObject);
            }

            campusRoot = new GameObject("--- ST PAULS CAMPUS ---");
            campusRoot.transform.SetParent(this.transform);

            // 1. Full Exterior Architectural Shell, Site Grounds, Driveway, Modern Portal & Rooftop Signage
            ArchitecturalShell.BuildCampusShell(campusRoot.transform,
                wallMat, wallGreyMat, terracottaMat, floorMat,
                windowGlassMat, windowFrameMat, windowSillMat, sunshadeNavyMat,
                acCompressorMat, acGrillMat, pvcPipeMat,
                columnWhiteMat, porticoMaroonMat, signGoldMat, signBlueMat,
                asphaltMat, grassMat, curbMat, railingMat,
                solarPanelMat, solarFrameMat, barricadeYellowMat,
                treeTrunkMat, treeFoliageMat,
                woodSlatMat, curbBlueMat, curbWhiteMat, terracottaAccentMat);

            // 2. Enclosed Corridor Loops, Portal Columns, Beams, Skirting & Linear LED Ceiling Troffers
            CorridorBuilder.BuildCampusCorridors(campusRoot.transform,
                columnNavyMat, skirtingMat, lightBaseMat, lightEmissiveMat, signBlueMat, signGoldMat);

            // 2b. Ground Entrance Appointments (Wood-Slat Ceiling, CSE Directory, Dedication Wall, Vending Machines)
            BuildGroundEntranceAppointments(campusRoot.transform);

            // 3. Open-Air Pedestrian Connecting Bridges (Floors 1 & 2)
            BuildConnectingBridges();

            // 4. Physical Stairwells with Zero-Friction Smooth Ramps (2 Dog-Leg in Main, 1 Straight in Annexure)
            BuildStairwells();

            // 5. Open-To-Sky Courtyards with 1.2m Safety Parapets
            BuildCourtyards();

            // 6. Complete 4-Sided Room Enclosures, Partition Walls, Proximity Auto-Swing Doors & Authentic Furnishings
            BuildAllRooms();

            Debug.Log($"[CampusBuilder] Successfully built St. Paul's Campus Digital Twin with full 4-sided room enclosures, walkable stairs, and collegiate architecture!");
        }

        private void InitMaterials()
        {
            var standardShader = Shader.Find("Standard");

            // Corridor/room wall: (0.94, 0.93, 0.88), Gloss 0.05, Metallic 0.0 — Cream off-white
            wallMat = new Material(standardShader) { color = new Color(0.94f, 0.93f, 0.88f) };
            wallMat.SetFloat("_Glossiness", 0.05f);
            wallMat.SetFloat("_Metallic", 0.0f);
            wallMat.name = "Mat_Wall_CreamOffWhite";

            // Exterior facade: (0.92, 0.90, 0.84), Gloss 0.05, Metallic 0.0 — Cream exterior
            wallGreyMat = new Material(standardShader) { color = new Color(0.92f, 0.90f, 0.84f) };
            wallGreyMat.SetFloat("_Glossiness", 0.05f);
            wallGreyMat.SetFloat("_Metallic", 0.0f);
            wallGreyMat.name = "Mat_Exterior_CreamFacade";

            // Floor tile: (0.82, 0.82, 0.80), Gloss 0.65, Metallic 0.0 — Light grey polished
            floorMat = new Material(standardShader) { color = new Color(0.82f, 0.82f, 0.80f) };
            floorMat.SetFloat("_Glossiness", 0.65f);
            floorMat.SetFloat("_Metallic", 0.0f);
            floorMat.name = "Mat_Floor_PolishedVitrifiedTile";

            // Terracotta band: (0.75, 0.38, 0.18), Gloss 0.1, Metallic 0.0 — Orange terracotta
            terracottaMat = new Material(standardShader) { color = new Color(0.75f, 0.38f, 0.18f) };
            terracottaMat.SetFloat("_Glossiness", 0.10f);
            terracottaMat.SetFloat("_Metallic", 0.0f);
            terracottaMat.name = "Mat_Cornice_Terracotta";

            terracottaAccentMat = new Material(standardShader) { color = new Color(0.75f, 0.38f, 0.18f) };
            terracottaAccentMat.SetFloat("_Glossiness", 0.10f);
            terracottaAccentMat.SetFloat("_Metallic", 0.0f);
            terracottaAccentMat.name = "Mat_Terracotta_Accent";

            // Foyer false ceiling: (0.40, 0.28, 0.16), Gloss 0.15, Metallic 0.0 — Teak wood slat
            woodSlatMat = new Material(standardShader) { color = new Color(0.40f, 0.28f, 0.16f) };
            woodSlatMat.SetFloat("_Glossiness", 0.15f);
            woodSlatMat.SetFloat("_Metallic", 0.0f);
            woodSlatMat.name = "Mat_Wood_Slat_Teak";

            // Window Glass setup with proper Fade Transparency in Standard Shader: (0.70, 0.88, 0.95, 0.35 alpha), Gloss 0.95
            windowGlassMat = new Material(standardShader);
            windowGlassMat.name = "Mat_Window_Glass";
            windowGlassMat.SetFloat("_Mode", 2);
            windowGlassMat.SetOverrideTag("RenderType", "Transparent");
            windowGlassMat.SetInt("_SrcBlend", (int)UnityEngine.Rendering.BlendMode.SrcAlpha);
            windowGlassMat.SetInt("_DstBlend", (int)UnityEngine.Rendering.BlendMode.OneMinusSrcAlpha);
            windowGlassMat.SetInt("_ZWrite", 0);
            windowGlassMat.DisableKeyword("_ALPHATEST_ON");
            windowGlassMat.EnableKeyword("_ALPHABLEND_ON");
            windowGlassMat.DisableKeyword("_ALPHAPREMULTIPLY_ON");
            windowGlassMat.renderQueue = (int)UnityEngine.Rendering.RenderQueue.Transparent;
            windowGlassMat.color = new Color(0.70f, 0.88f, 0.95f, 0.35f);
            windowGlassMat.SetFloat("_Glossiness", 0.95f);
            windowGlassMat.SetFloat("_Metallic", 0.0f);

            // Window frame: (0.60, 0.62, 0.65), Gloss 0.6, Metallic 0.4 — Anodised grey aluminium
            windowFrameMat = new Material(standardShader) { color = new Color(0.60f, 0.62f, 0.65f) };
            windowFrameMat.SetFloat("_Glossiness", 0.60f);
            windowFrameMat.SetFloat("_Metallic", 0.40f);
            windowFrameMat.name = "Mat_Window_AluminiumGrey";

            // Window sill & Courtyard parapet: (0.88, 0.87, 0.83), Gloss 0.1
            windowSillMat = new Material(standardShader) { color = new Color(0.88f, 0.87f, 0.83f) };
            windowSillMat.SetFloat("_Glossiness", 0.10f);
            windowSillMat.name = "Mat_Window_SillWhite";

            // Navy blue column & sunshade: (0.05, 0.09, 0.28), Gloss 0.3, Metallic 0.1 — Dark navy
            sunshadeNavyMat = new Material(standardShader) { color = new Color(0.05f, 0.09f, 0.28f) };
            sunshadeNavyMat.SetFloat("_Glossiness", 0.30f);
            sunshadeNavyMat.SetFloat("_Metallic", 0.10f);
            sunshadeNavyMat.name = "Mat_Sunshade_Navy";

            columnNavyMat = new Material(standardShader) { color = new Color(0.05f, 0.09f, 0.28f) };
            columnNavyMat.SetFloat("_Glossiness", 0.30f);
            columnNavyMat.SetFloat("_Metallic", 0.10f);
            columnNavyMat.name = "Mat_Column_NavyBlue";

            acCompressorMat = new Material(standardShader) { color = new Color(0.88f, 0.90f, 0.92f) };
            acCompressorMat.name = "Mat_AC_Compressor";

            acGrillMat = new Material(standardShader) { color = new Color(0.20f, 0.25f, 0.33f) };
            acGrillMat.name = "Mat_AC_Grill";

            pvcPipeMat = new Material(standardShader) { color = new Color(0.94f, 0.94f, 0.94f) };
            pvcPipeMat.name = "Mat_PVC_Downspout";

            columnWhiteMat = new Material(standardShader) { color = new Color(0.94f, 0.94f, 0.92f) };
            columnWhiteMat.name = "Mat_Column_White";

            porticoMaroonMat = new Material(standardShader) { color = new Color(0.18f, 0.15f, 0.14f) };
            porticoMaroonMat.SetFloat("_Glossiness", 0.40f);
            porticoMaroonMat.name = "Mat_Portico_Bronze";

            signGoldMat = new Material(standardShader) { color = new Color(0.98f, 0.78f, 0.18f) };
            signGoldMat.SetFloat("_Metallic", 0.85f);
            signGoldMat.SetFloat("_Glossiness", 0.75f);
            signGoldMat.EnableKeyword("_EMISSION");
            signGoldMat.SetColor("_EmissionColor", new Color(0.70f, 0.50f, 0.08f));
            signGoldMat.name = "Mat_Sign_Gold";

            signBlueMat = new Material(standardShader) { color = new Color(0.05f, 0.09f, 0.28f) };
            signBlueMat.name = "Mat_Sign_NavyBlue";

            // Pathway: (0.60, 0.60, 0.58), Gloss 0.2, Metallic 0.0 — Grey concrete
            asphaltMat = new Material(standardShader) { color = new Color(0.22f, 0.24f, 0.26f) };
            asphaltMat.SetFloat("_Glossiness", 0.1f);
            asphaltMat.name = "Mat_Driveway_Asphalt";

            // Grass/ground: (0.22, 0.45, 0.18), Gloss 0.0, Metallic 0.0 — Green
            grassMat = new Material(standardShader) { color = new Color(0.22f, 0.45f, 0.18f) };
            grassMat.name = "Mat_Lawn_Grass";

            curbMat = new Material(standardShader) { color = new Color(0.60f, 0.60f, 0.58f) };
            curbMat.SetFloat("_Glossiness", 0.20f);
            curbMat.name = "Mat_Pathway_Concrete";

            curbBlueMat = new Material(standardShader) { color = new Color(0.05f, 0.09f, 0.28f) };
            curbBlueMat.name = "Mat_Curb_NavyBlue";

            curbWhiteMat = new Material(standardShader) { color = new Color(0.92f, 0.94f, 0.96f) };
            curbWhiteMat.name = "Mat_Curb_White";

            // Bridge deck: (0.60, 0.62, 0.65), Gloss 0.2, Metallic 0.0 — Concrete grey
            bridgeMat = new Material(standardShader) { color = new Color(0.60f, 0.62f, 0.65f) };
            bridgeMat.SetFloat("_Glossiness", 0.20f);
            bridgeMat.name = "Mat_Bridge_Deck";

            // Stair railing: (0.15, 0.15, 0.17), Gloss 0.3, Metallic 0.3 — Dark grey/black metal
            railingMat = new Material(standardShader) { color = new Color(0.15f, 0.15f, 0.17f) };
            railingMat.SetFloat("_Glossiness", 0.30f);
            railingMat.SetFloat("_Metallic", 0.30f);
            railingMat.name = "Mat_Railing_DarkMetal";

            // Bridge railing: (0.05, 0.09, 0.28), Gloss 0.4, Metallic 0.3 — Navy blue steel
            bridgeRailingMat = new Material(standardShader) { color = new Color(0.05f, 0.09f, 0.28f) };
            bridgeRailingMat.SetFloat("_Glossiness", 0.40f);
            bridgeRailingMat.SetFloat("_Metallic", 0.30f);
            bridgeRailingMat.name = "Mat_Bridge_Railing_NavySteel";

            solarPanelMat = new Material(standardShader) { color = new Color(0.06f, 0.09f, 0.16f) };
            solarPanelMat.SetFloat("_Glossiness", 0.85f);
            solarPanelMat.SetFloat("_Metallic", 0.40f);
            solarPanelMat.name = "Mat_Solar_Photovoltaic";

            solarFrameMat = new Material(standardShader) { color = new Color(0.60f, 0.65f, 0.72f) };
            solarFrameMat.SetFloat("_Metallic", 0.75f);
            solarFrameMat.SetFloat("_Glossiness", 0.50f);
            solarFrameMat.name = "Mat_Solar_AluminumFrame";

            barricadeYellowMat = new Material(standardShader) { color = new Color(0.98f, 0.80f, 0.08f) };
            barricadeYellowMat.name = "Mat_Barricade_Yellow";

            treeTrunkMat = new Material(standardShader) { color = new Color(0.36f, 0.25f, 0.20f) };
            treeTrunkMat.name = "Mat_Tree_Trunk";

            treeFoliageMat = new Material(standardShader) { color = new Color(0.18f, 0.49f, 0.20f) };
            treeFoliageMat.name = "Mat_Tree_Foliage";

            // Door (wood): (0.40, 0.28, 0.16), Gloss 0.1, Metallic 0.0 — Medium brown
            woodDoorMat = new Material(standardShader) { color = new Color(0.40f, 0.28f, 0.16f) };
            woodDoorMat.SetFloat("_Glossiness", 0.10f);
            woodDoorMat.name = "Mat_Door_Teak";

            woodFrameMat = new Material(standardShader) { color = new Color(0.30f, 0.20f, 0.12f) };
            woodFrameMat.name = "Mat_Door_Frame";

            handleMat = new Material(standardShader) { color = new Color(0.82f, 0.84f, 0.86f) };
            handleMat.SetFloat("_Metallic", 0.80f);
            handleMat.name = "Mat_Door_Handle";

            placardMat = new Material(standardShader) { color = new Color(0.98f, 0.98f, 0.98f) };
            placardMat.name = "Mat_Placard_Plate";

            // Blackboard: (0.08, 0.18, 0.12), Gloss 0.02, Metallic 0.0 — Dark green/black
            blackboardMat = new Material(standardShader) { color = new Color(0.08f, 0.18f, 0.12f) };
            blackboardMat.SetFloat("_Glossiness", 0.02f);
            blackboardMat.name = "Mat_Blackboard_Green";

            // Desk (wood): (0.55, 0.40, 0.22), Gloss 0.15, Metallic 0.0 — Warm wood
            deskMat = new Material(standardShader) { color = new Color(0.55f, 0.40f, 0.22f) };
            deskMat.SetFloat("_Glossiness", 0.15f);
            deskMat.name = "Mat_Desk_WarmWood";

            // PC monitor & Server rack: (0.10, 0.10, 0.12), Gloss 0.3, Metallic 0.5 — Dark grey/black
            pcMat = new Material(standardShader) { color = new Color(0.10f, 0.10f, 0.12f) };
            pcMat.SetFloat("_Glossiness", 0.30f);
            pcMat.SetFloat("_Metallic", 0.50f);
            pcMat.name = "Mat_PC_Chassis";

            // PC screen: (0.08, 0.45, 0.85) — Blue lit emissive
            pcScreenMat = new Material(standardShader) { color = new Color(0.08f, 0.45f, 0.85f) };
            pcScreenMat.EnableKeyword("_EMISSION");
            pcScreenMat.SetColor("_EmissionColor", new Color(0.08f, 0.45f, 0.85f));
            pcScreenMat.name = "Mat_PC_Screen";

            // Chair: (0.12, 0.12, 0.14), Gloss 0.2, Metallic 0.1 — Dark
            chairMat = new Material(standardShader) { color = new Color(0.12f, 0.12f, 0.14f) };
            chairMat.SetFloat("_Glossiness", 0.20f);
            chairMat.SetFloat("_Metallic", 0.10f);
            chairMat.name = "Mat_Chair_Dark";

            projectorMat = new Material(standardShader) { color = new Color(0.92f, 0.92f, 0.92f) };
            projectorMat.name = "Mat_Projector_White";

            lightBaseMat = new Material(standardShader) { color = new Color(0.90f, 0.92f, 0.95f) };
            lightBaseMat.name = "Mat_Light_Base";

            lightEmissiveMat = new Material(standardShader) { color = new Color(1.0f, 0.98f, 0.85f) };
            lightEmissiveMat.EnableKeyword("_EMISSION");
            lightEmissiveMat.SetColor("_EmissionColor", new Color(1.0f, 0.95f, 0.80f));
            lightEmissiveMat.name = "Mat_Light_Emissive";

            // Black skirting: (0.08, 0.08, 0.09), Gloss 0.4, Metallic 0.1 — Black granite
            skirtingMat = new Material(standardShader) { color = new Color(0.08f, 0.08f, 0.09f) };
            skirtingMat.SetFloat("_Glossiness", 0.40f);
            skirtingMat.SetFloat("_Metallic", 0.10f);
            skirtingMat.name = "Mat_Skirting_Black";

            fanMat = new Material(standardShader) { color = new Color(0.85f, 0.85f, 0.82f) };
            fanMat.name = "Mat_CeilingFan_White";
        }

        private void BuildConnectingBridges()
        {
            var bridgesParent = new GameObject("Connecting_Bridges").transform;
            bridgesParent.SetParent(campusRoot.transform);

            foreach (var br in CampusData.Bridges)
            {
                var brObj = new GameObject(br.id);
                brObj.transform.SetParent(bridgesParent);

                Vector3 mid = (br.startPoint + br.endPoint) * 0.5f;
                float length = Vector3.Distance(br.startPoint, br.endPoint);

                // 1. Concrete Walkway Slab (3.0m wide, 0.3m slab thickness)
                var slab = GameObject.CreatePrimitive(PrimitiveType.Cube);
                slab.name = $"{br.id}_DeckSlab";
                slab.transform.SetParent(brObj.transform);
                slab.transform.position = new Vector3(mid.x, mid.y - 0.15f, mid.z);
                slab.transform.localScale = new Vector3(length, 0.3f, br.width);
                slab.GetComponent<Renderer>().sharedMaterial = bridgeMat;

                // 2. Open-Air Navy Blue Steel Safety Balustrades (1.2m height) — NO solid boxes!
                float halfWidth = br.width * 0.5f;
                float railingH = 1.2f;

                // North Railing (from X=-21 to X=-33 at Z = mid.z + halfWidth)
                BuildBridgeBalustrade(brObj.transform, "BridgeBalustrade_North",
                    new Vector3(br.startPoint.x, mid.y, mid.z + halfWidth),
                    new Vector3(br.endPoint.x, mid.y, mid.z + halfWidth),
                    railingH, bridgeRailingMat);

                // South Railing (from X=-21 to X=-33 at Z = mid.z - halfWidth)
                BuildBridgeBalustrade(brObj.transform, "BridgeBalustrade_South",
                    new Vector3(br.startPoint.x, mid.y, mid.z - halfWidth),
                    new Vector3(br.endPoint.x, mid.y, mid.z - halfWidth),
                    railingH, bridgeRailingMat);

                // 3. Bridge Walkway Sensor Trigger (alerts HUD)
                var trigger = new GameObject($"{br.id}_SensorTrigger");
                trigger.transform.SetParent(brObj.transform);
                trigger.transform.position = mid;
                var boxCol = trigger.AddComponent<BoxCollider>();
                boxCol.isTrigger = true;
                boxCol.size = new Vector3(length * 0.8f, 3.0f, br.width);
                var zone = trigger.AddComponent<RoomTriggerZone>();
                zone.isBridge = true;
                zone.bridgeName = br.name;
            }
        }

        private void BuildBridgeBalustrade(Transform parent, string name, Vector3 startPos, Vector3 endPos, float height, Material mat)
        {
            var railGroup = new GameObject(name);
            railGroup.transform.SetParent(parent);

            Vector3 mid = (startPos + endPos) * 0.5f;
            float length = Vector3.Distance(startPos, endPos);

            // 1. Top Handrail Bar (horizontal)
            var topBar = GameObject.CreatePrimitive(PrimitiveType.Cube);
            topBar.name = "TopHandrailBar";
            topBar.transform.SetParent(railGroup.transform);
            topBar.transform.position = new Vector3(mid.x, mid.y + height, mid.z);
            topBar.transform.localScale = new Vector3(length, 0.06f, 0.06f);
            topBar.GetComponent<Renderer>().sharedMaterial = mat;

            // 2. Bottom Runner Bar (horizontal)
            var botBar = GameObject.CreatePrimitive(PrimitiveType.Cube);
            botBar.name = "BottomRunnerBar";
            botBar.transform.SetParent(railGroup.transform);
            botBar.transform.position = new Vector3(mid.x, mid.y + 0.05f, mid.z);
            botBar.transform.localScale = new Vector3(length, 0.04f, 0.04f);
            botBar.GetComponent<Renderer>().sharedMaterial = mat;

            // 3. Thin Vertical Balusters spaced every ~0.35m
            int balusterCount = Mathf.Max(6, (int)(length / 0.35f));
            float balusterH = height - 0.07f;
            for (int i = 0; i <= balusterCount; i++)
            {
                float t = (float)i / balusterCount;
                Vector3 p = Vector3.Lerp(startPos, endPos, t);
                p.y = mid.y + height * 0.5f;

                var post = GameObject.CreatePrimitive(PrimitiveType.Cube);
                post.name = $"Baluster_{i}";
                post.transform.SetParent(railGroup.transform);
                post.transform.position = p;
                post.transform.localScale = new Vector3(0.035f, balusterH, 0.035f);
                post.GetComponent<Renderer>().sharedMaterial = mat;
                Object.DestroyImmediate(post.GetComponent<Collider>());
            }

            // 4. Invisible Safety Collider so player cannot slip through
            var colObj = new GameObject("SafetyCollider");
            colObj.transform.SetParent(railGroup.transform);
            colObj.transform.position = new Vector3(mid.x, mid.y + height * 0.5f, mid.z);
            var col = colObj.AddComponent<BoxCollider>();
            col.size = new Vector3(length, height, 0.08f);
        }

        private void BuildStairwells()
        {
            var stairsParent = new GameObject("Stairwells").transform;
            stairsParent.SetParent(campusRoot.transform);

            // 1. Main Block West Dogleg Staircase in enclosed stairwell bay (X: -13, Z: 3.5)
            StairBuilder.BuildMainDoglegStaircase(stairsParent, "Main_West_DoglegStairwell",
                new Vector3(-13.0f, 0, 3.5f), wallMat, floorMat, curbMat, floorMat, curbMat, skirtingMat, columnNavyMat);

            // 2. Main Block East Dogleg Staircase in enclosed stairwell bay (X: +13, Z: 3.5)
            StairBuilder.BuildMainDoglegStaircase(stairsParent, "Main_East_DoglegStairwell",
                new Vector3(13.0f, 0, 3.5f), wallMat, floorMat, curbMat, floorMat, curbMat, skirtingMat, columnNavyMat);

            // 3. Annexure Block Straight Staircase with navy portal columns (Photo 9.29.10 PM)
            StairBuilder.BuildAnnexureStraightStaircase(stairsParent, "Annexure_West_StraightStairwell",
                new Vector3(-41.0f, 0, 2.5f), wallMat, floorMat, curbMat, curbMat, skirtingMat, columnNavyMat);
        }

        private void BuildCourtyards()
        {
            var cyParent = new GameObject("Courtyards_LightWells").transform;
            cyParent.SetParent(campusRoot.transform);

            foreach (var cy in CampusData.Courtyards)
            {
                var cyObj = new GameObject($"Courtyard_{cy.id}");
                cyObj.transform.SetParent(cyParent);
                cyObj.transform.position = cy.position;

                float halfW = cy.dimensions.x * 0.5f;
                float halfD = cy.dimensions.z * 0.5f;
                float pHeight = cy.parapetHeight;

                // Ground Floor (Floor 0): Landscaped Courtyard Floor Patio with Planters (Photo 9.29.16 PM (2))
                var groundPatio = GameObject.CreatePrimitive(PrimitiveType.Cube);
                groundPatio.name = "GroundCourtyard_Patio";
                groundPatio.transform.SetParent(cyObj.transform);
                groundPatio.transform.position = new Vector3(cy.position.x, 0.02f, cy.position.z);
                groundPatio.transform.localScale = new Vector3(cy.dimensions.x, 0.04f, cy.dimensions.z);
                groundPatio.GetComponent<Renderer>().sharedMaterial = floorMat;

                // Center planter box in ground courtyard
                var planter = GameObject.CreatePrimitive(PrimitiveType.Cube);
                planter.name = "CourtyardPlanterBox";
                planter.transform.SetParent(cyObj.transform);
                planter.transform.position = new Vector3(cy.position.x, 0.35f, cy.position.z);
                planter.transform.localScale = new Vector3(Mathf.Min(3.0f, cy.dimensions.x * 0.6f), 0.7f, Mathf.Min(3.0f, cy.dimensions.z * 0.6f));
                planter.GetComponent<Renderer>().sharedMaterial = curbMat;

                var shrub = GameObject.CreatePrimitive(PrimitiveType.Sphere);
                shrub.name = "CourtyardShrub";
                shrub.transform.SetParent(planter.transform);
                shrub.transform.localPosition = new Vector3(0, 0.65f, 0);
                shrub.transform.localScale = new Vector3(0.9f, 0.8f, 0.9f);
                shrub.GetComponent<Renderer>().sharedMaterial = treeFoliageMat;

                // Floors 1, 2, 3: 1.1m Parapet Breast Walls with Navy Blue Columns & Black Skirting (Photo 9.29.13 PM (1))
                for (int floor = 1; floor <= 3; floor++)
                {
                    float floorY = floor * 4.0f;

                    // North & South Parapets
                    CreateCourtyardParapetWall(cyObj.transform, $"Parapet_F{floor}_N",
                        new Vector3(cy.position.x, floorY + pHeight * 0.5f, cy.position.z + halfD),
                        new Vector3(cy.dimensions.x, pHeight, 0.25f), floorY, true, cy.dimensions.x);

                    CreateCourtyardParapetWall(cyObj.transform, $"Parapet_F{floor}_S",
                        new Vector3(cy.position.x, floorY + pHeight * 0.5f, cy.position.z - halfD),
                        new Vector3(cy.dimensions.x, pHeight, 0.25f), floorY, true, cy.dimensions.x);

                    // East & West Parapets
                    CreateCourtyardParapetWall(cyObj.transform, $"Parapet_F{floor}_E",
                        new Vector3(cy.position.x + halfW, floorY + pHeight * 0.5f, cy.position.z),
                        new Vector3(0.25f, pHeight, cy.dimensions.z), floorY, false, cy.dimensions.z);

                    CreateCourtyardParapetWall(cyObj.transform, $"Parapet_F{floor}_W",
                        new Vector3(cy.position.x - halfW, floorY + pHeight * 0.5f, cy.position.z),
                        new Vector3(0.25f, pHeight, cy.dimensions.z), floorY, false, cy.dimensions.z);
                }
            }
        }

        private void CreateCourtyardParapetWall(Transform parent, string name, Vector3 pos, Vector3 size, float floorY, bool alignX, float length)
        {
            // 1. Concrete Breast Parapet Wall
            var wall = GameObject.CreatePrimitive(PrimitiveType.Cube);
            wall.name = name;
            wall.transform.SetParent(parent);
            wall.transform.position = pos;
            wall.transform.localScale = size;
            wall.GetComponent<Renderer>().sharedMaterial = curbMat;

            // 2. Black Skirting along the base of the parapet wall
            var skirt = GameObject.CreatePrimitive(PrimitiveType.Cube);
            skirt.name = $"{name}_Skirting";
            skirt.transform.SetParent(wall.transform);
            skirt.transform.localPosition = new Vector3(0, -0.42f, 0);
            skirt.transform.localScale = new Vector3(1.01f, 0.16f, 1.15f);
            skirt.GetComponent<Renderer>().sharedMaterial = skirtingMat;
            Object.DestroyImmediate(skirt.GetComponent<Collider>());

            // 3. Navy Blue Portal Columns Framing Openings (Photo 9.29.13 PM (1))
            float colH = 3.6f - size.y;
            int colCount = Mathf.Max(2, (int)(length / 3.0f));
            for (int i = 0; i <= colCount; i++)
            {
                float t = (float)i / colCount;
                float offset = -length * 0.5f + t * length;
                var col = GameObject.CreatePrimitive(PrimitiveType.Cube);
                col.name = $"{name}_NavyCol_{i}";
                col.transform.SetParent(parent);
                Vector3 colPos = alignX ? new Vector3(pos.x + offset, floorY + size.y + colH * 0.5f, pos.z)
                                        : new Vector3(pos.x, floorY + size.y + colH * 0.5f, pos.z + offset);
                col.transform.position = colPos;
                col.transform.localScale = new Vector3(0.35f, colH, 0.35f);
                col.GetComponent<Renderer>().sharedMaterial = columnNavyMat;
            }
        }

        private void BuildAllRooms()
        {
            var roomsParent = new GameObject("Rooms_And_Laboratories").transform;
            roomsParent.SetParent(campusRoot.transform);

            foreach (var r in CampusData.Rooms)
            {
                var roomObj = new GameObject($"Room_{r.number}_{r.name.Replace(" ", "_")}");
                roomObj.transform.SetParent(roomsParent);
                roomObj.transform.position = r.position;

                // 1. Room Trigger Sensor Zone
                var zone = roomObj.AddComponent<RoomTriggerZone>();
                zone.roomInfo = r;

                var trigger = roomObj.AddComponent<BoxCollider>();
                trigger.isTrigger = true;
                trigger.size = new Vector3(r.dimensions.x * 0.90f, 3.5f, r.dimensions.z * 0.90f);
                trigger.center = new Vector3(0, 1.75f, 0);

                // 2. Full 4-Sided Room Enclosure with Door Cutout & Proximity Door
                // ONLY main entrance portal, bridge connectors, and dedicated stairwell bays skip room enclosure
                bool isOpenPassage = (r.id == "main-g-entrance") || r.id.Contains("bridge-portal") || r.category == "stairwell";
                if (!isOpenPassage)
                {
                    BuildRoomFullEnclosure(roomObj.transform, r);
                    BuildRoomFurnishings(roomObj.transform, r);
                }

                // 4. Room Ceiling Illumination Light
                var lightObj = new GameObject("RoomCeilingLight");
                lightObj.transform.SetParent(roomObj.transform);
                lightObj.transform.localPosition = new Vector3(0, 3.2f, 0);
                var rLight = lightObj.AddComponent<Light>();
                rLight.type = LightType.Point;
                rLight.range = Mathf.Max(r.dimensions.x, r.dimensions.z) * 1.6f;
                rLight.color = new Color(1.0f, 0.98f, 0.92f);
                rLight.intensity = 1.7f;
                rLight.shadows = LightShadows.None;
            }
        }

        private void BuildRoomFullEnclosure(Transform parent, RoomDefinition r)
        {
            float wallH = 3.6f;
            float wallT = 0.2f;
            float doorW = 1.1f;
            float doorH = 2.25f;
            float lintelH = wallH - doorH;

            float rw = r.dimensions.x;
            float rd = r.dimensions.z;

            // Determine which wall has the doorway entering from the corridor:
            // 1: South, 2: North, 3: West, 4: East
            int doorWall = 2; // Default North

            bool isMain = string.Equals(r.block, "main", System.StringComparison.OrdinalIgnoreCase);
            bool isAnnex = string.Equals(r.block, "annexure", System.StringComparison.OrdinalIgnoreCase);

            if (isMain)
            {
                if (r.position.z < 0) doorWall = 2; // Front rooms -> North wall faces corridor
                else if (r.position.z > 28) doorWall = 1; // Rear rooms -> South wall faces corridor
                else if (r.position.x < -10) doorWall = 4; // West rooms -> East wall faces corridor
                else if (r.position.x > 10) doorWall = 3; // East rooms -> West wall faces corridor
                else doorWall = 1; // Central core labs -> South wall faces front corridor (Point 9!)
            }
            else // Annexure Block
            {
                doorWall = 4; // All Annexure rooms face the East spine corridor
            }

            // Detect exterior perimeter walls so we DO NOT block the real window apertures built by ArchitecturalShell
            bool isSouthExterior = (isMain && (r.position.z - rd * 0.5f <= -7.0f)) ||
                                   (isAnnex && (r.position.z - rd * 0.5f <= -7.0f));
            bool isNorthExterior = (isMain && (r.position.z + rd * 0.5f >= 39.0f)) ||
                                   (isAnnex && (r.position.z + rd * 0.5f >= 43.0f));
            bool isWestExterior  = (isMain && (r.position.x - rw * 0.5f <= -20.0f)) ||
                                   (isAnnex && (r.position.x - rw * 0.5f <= -51.0f));
            bool isEastExterior  = (isMain && (r.position.x + rw * 0.5f >= 20.0f));

            // 1. South Wall
            if (r.id == "main-2-server-room")
            {
                // Point 8: Server Room partition facing Machine Vision Lab has glass viewing panel!
                BuildServerRoomViewingPartition(parent, -rd * 0.5f, rw, wallH, wallT);
            }
            else if (doorWall == 1)
            {
                BuildWallWithDoorOpening(parent, "SouthWall_Door", new Vector3(0, 0, -rd * 0.5f), rw, wallH, wallT, doorW, doorH, lintelH, true);
                DoorController.CreateDoorFixture(parent, new Vector3(0, 0, -rd * 0.5f), Quaternion.Euler(0, 180, 0),
                    r.number, r.name, woodDoorMat, woodFrameMat, handleMat, placardMat);
            }
            else if (isSouthExterior)
            {
                // Interior window sill board below exterior aperture
                var intSill = GameObject.CreatePrimitive(PrimitiveType.Cube);
                intSill.name = "InteriorWindowSill_South";
                intSill.transform.SetParent(parent);
                intSill.transform.localPosition = new Vector3(0, 0.90f, -rd * 0.5f + 0.10f);
                intSill.transform.localScale = new Vector3(2.4f, 0.05f, 0.22f);
                intSill.GetComponent<Renderer>().sharedMaterial = windowSillMat;
            }
            else
            {
                var wS = GameObject.CreatePrimitive(PrimitiveType.Cube);
                wS.name = "Wall_South_Solid";
                wS.transform.SetParent(parent);
                wS.transform.localPosition = new Vector3(0, wallH * 0.5f, -rd * 0.5f);
                wS.transform.localScale = new Vector3(rw, wallH, wallT);
                wS.GetComponent<Renderer>().sharedMaterial = wallMat;
            }

            // 2. North Wall
            if (r.category == "project_hub")
            {
                BuildOpenPresentationArchway(parent, "ProjectHub_OpenArchway", new Vector3(0, 0, rd * 0.5f), rw, wallH, wallT, Mathf.Min(3.8f, rw * 0.75f));
            }
            else if (r.id == "main-2-machine-vision-lab")
            {
                // Machine Vision Lab shares its North wall with Server Room's South viewing partition at Z=18.0.
                // Do not build a solid North wall here so the glass viewing window and access door remain visible and open.
            }
            else if (doorWall == 2)
            {
                BuildWallWithDoorOpening(parent, "NorthWall_Door", new Vector3(0, 0, rd * 0.5f), rw, wallH, wallT, doorW, doorH, lintelH, true);
                DoorController.CreateDoorFixture(parent, new Vector3(0, 0, rd * 0.5f), Quaternion.Euler(0, 0, 0),
                    r.number, r.name, woodDoorMat, woodFrameMat, handleMat, placardMat);
            }
            else if (isNorthExterior)
            {
                var intSill = GameObject.CreatePrimitive(PrimitiveType.Cube);
                intSill.name = "InteriorWindowSill_North";
                intSill.transform.SetParent(parent);
                intSill.transform.localPosition = new Vector3(0, 0.90f, rd * 0.5f - 0.10f);
                intSill.transform.localScale = new Vector3(2.4f, 0.05f, 0.22f);
                intSill.GetComponent<Renderer>().sharedMaterial = windowSillMat;
            }
            else
            {
                var wN = GameObject.CreatePrimitive(PrimitiveType.Cube);
                wN.name = "Wall_North_Solid";
                wN.transform.SetParent(parent);
                wN.transform.localPosition = new Vector3(0, wallH * 0.5f, rd * 0.5f);
                wN.transform.localScale = new Vector3(rw, wallH, wallT);
                wN.GetComponent<Renderer>().sharedMaterial = wallMat;
            }

            // 3. West Wall
            if (doorWall == 3)
            {
                BuildWallWithDoorOpening(parent, "WestWall_Door", new Vector3(-rw * 0.5f, 0, 0), rd, wallH, wallT, doorW, doorH, lintelH, false);
                DoorController.CreateDoorFixture(parent, new Vector3(-rw * 0.5f, 0, 0), Quaternion.Euler(0, -90, 0),
                    r.number, r.name, woodDoorMat, woodFrameMat, handleMat, placardMat);
            }
            else if (isWestExterior)
            {
                var intSill = GameObject.CreatePrimitive(PrimitiveType.Cube);
                intSill.name = "InteriorWindowSill_West";
                intSill.transform.SetParent(parent);
                intSill.transform.localPosition = new Vector3(-rw * 0.5f + 0.10f, 0.90f, 0);
                intSill.transform.localScale = new Vector3(0.22f, 0.05f, 2.4f);
                intSill.GetComponent<Renderer>().sharedMaterial = windowSillMat;
            }
            else
            {
                var wW = GameObject.CreatePrimitive(PrimitiveType.Cube);
                wW.name = "Wall_West_Solid";
                wW.transform.SetParent(parent);
                wW.transform.localPosition = new Vector3(-rw * 0.5f, wallH * 0.5f, 0);
                wW.transform.localScale = new Vector3(wallT, wallH, rd);
                wW.GetComponent<Renderer>().sharedMaterial = wallMat;
            }

            // 4. East Wall
            if (doorWall == 4)
            {
                BuildWallWithDoorOpening(parent, "EastWall_Door", new Vector3(rw * 0.5f, 0, 0), rd, wallH, wallT, doorW, doorH, lintelH, false);
                DoorController.CreateDoorFixture(parent, new Vector3(rw * 0.5f, 0, 0), Quaternion.Euler(0, 90, 0),
                    r.number, r.name, woodDoorMat, woodFrameMat, handleMat, placardMat);
            }
            else if (isEastExterior)
            {
                var intSill = GameObject.CreatePrimitive(PrimitiveType.Cube);
                intSill.name = "InteriorWindowSill_East";
                intSill.transform.SetParent(parent);
                intSill.transform.localPosition = new Vector3(rw * 0.5f - 0.10f, 0.90f, 0);
                intSill.transform.localScale = new Vector3(0.22f, 0.05f, 2.4f);
                intSill.GetComponent<Renderer>().sharedMaterial = windowSillMat;
            }
            else
            {
                var wE = GameObject.CreatePrimitive(PrimitiveType.Cube);
                wE.name = "Wall_East_Solid";
                wE.transform.SetParent(parent);
                wE.transform.localPosition = new Vector3(rw * 0.5f, wallH * 0.5f, 0);
                wE.transform.localScale = new Vector3(wallT, wallH, rd);
                wE.GetComponent<Renderer>().sharedMaterial = wallMat;
            }
        }

        private void BuildGroundEntranceAppointments(Transform parent)
        {
            var appParent = new GameObject("GroundEntrance_Appointments").transform;
            appParent.SetParent(parent);

            // 0a. Warm Linear Wood-Slat False Ceiling across Foyer (Photos 9.29.08 PM (1) & (2))
            var foyerCeiling = GameObject.CreatePrimitive(PrimitiveType.Cube);
            foyerCeiling.name = "Foyer_WoodSlat_Ceiling";
            foyerCeiling.transform.SetParent(appParent);
            foyerCeiling.transform.position = new Vector3(0, 3.68f, -4.0f);
            foyerCeiling.transform.localScale = new Vector3(5.8f, 0.05f, 7.8f);
            foyerCeiling.GetComponent<Renderer>().sharedMaterial = woodSlatMat;

            // Longitudinal wood-slat accent strips for visual depth
            for (float sx = -2.6f; sx <= 2.6f; sx += 0.45f)
            {
                var slat = GameObject.CreatePrimitive(PrimitiveType.Cube);
                slat.name = "CeilingSlatStrip";
                slat.transform.SetParent(foyerCeiling.transform);
                slat.transform.localPosition = new Vector3(sx / 5.8f, -0.4f, 0);
                slat.transform.localScale = new Vector3(0.04f, 0.2f, 0.98f);
                slat.GetComponent<Renderer>().sharedMaterial = terracottaMat;
                Object.DestroyImmediate(slat.GetComponent<Collider>());
            }

            // 0b. Polished Dark Granite Foyer Inlay Floor Surface with Black Skirting
            var foyerFloor = GameObject.CreatePrimitive(PrimitiveType.Cube);
            foyerFloor.name = "Foyer_DarkGranite_Floor";
            foyerFloor.transform.SetParent(appParent);
            foyerFloor.transform.position = new Vector3(0, 0.015f, -4.0f);
            foyerFloor.transform.localScale = new Vector3(5.8f, 0.03f, 7.8f);
            foyerFloor.GetComponent<Renderer>().sharedMaterial = skirtingMat;

            // 0c. Foyer Ceiling Spot/Point Light (Photo 9.29.09 PM warm entrance glow)
            var foyerLight = new GameObject("FoyerCeilingLight");
            foyerLight.transform.SetParent(appParent);
            foyerLight.transform.position = new Vector3(0, 3.3f, -4.0f);
            var fLt = foyerLight.AddComponent<Light>();
            fLt.type = LightType.Point;
            fLt.range = 14f;
            fLt.color = new Color(1.0f, 0.95f, 0.85f);
            fLt.intensity = 2.4f;

            // 1. Blue CSE Department Directory & Dedication Wall (Photo 9.29.09 PM)
            // Mounted on East foyer wall at X = 2.85, Y = 1.8, Z = -0.6
            var dirWall = new GameObject("CSE_Department_Directory");
            dirWall.transform.SetParent(appParent);
            dirWall.transform.position = new Vector3(2.85f, 1.8f, -0.6f);
            dirWall.transform.rotation = Quaternion.Euler(0, -90, 0);

            // Navy Blue Directory Board Panel
            var dirBoard = GameObject.CreatePrimitive(PrimitiveType.Cube);
            dirBoard.name = "DirectoryBoard";
            dirBoard.transform.SetParent(dirWall.transform);
            dirBoard.transform.localPosition = Vector3.zero;
            dirBoard.transform.localScale = new Vector3(2.4f, 1.4f, 0.04f);
            dirBoard.GetComponent<Renderer>().sharedMaterial = signBlueMat;

            // Gold Header Trim
            var dirTrim = GameObject.CreatePrimitive(PrimitiveType.Cube);
            dirTrim.name = "DirectoryTrim";
            dirTrim.transform.SetParent(dirWall.transform);
            dirTrim.transform.localPosition = new Vector3(0, 0.68f, 0);
            dirTrim.transform.localScale = new Vector3(2.44f, 0.06f, 0.05f);
            dirTrim.GetComponent<Renderer>().sharedMaterial = signGoldMat;

            // 3D Text on Directory Board
            var titleObj = new GameObject("DirectoryTitle");
            titleObj.transform.SetParent(dirWall.transform);
            titleObj.transform.localPosition = new Vector3(0, 0.48f, -0.03f);
            var titleTm = titleObj.AddComponent<TextMesh>();
            titleTm.text = "DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING";
            titleTm.fontSize = 24;
            titleTm.characterSize = 0.032f;
            titleTm.alignment = TextAlignment.Center;
            titleTm.anchor = TextAnchor.MiddleCenter;
            titleTm.color = Color.white;

            var subTitleObj = new GameObject("DirectorySubTitle");
            subTitleObj.transform.SetParent(dirWall.transform);
            subTitleObj.transform.localPosition = new Vector3(0, 0.34f, -0.03f);
            var subTitleTm = subTitleObj.AddComponent<TextMesh>();
            subTitleTm.text = "ST. PAUL'S BLOCK — FLOOR DIRECTORY";
            subTitleTm.fontSize = 22;
            subTitleTm.characterSize = 0.028f;
            subTitleTm.alignment = TextAlignment.Center;
            subTitleTm.anchor = TextAnchor.MiddleCenter;
            subTitleTm.color = new Color(0.98f, 0.75f, 0.15f);

            var bodyObj = new GameObject("DirectoryBody");
            bodyObj.transform.SetParent(dirWall.transform);
            bodyObj.transform.localPosition = new Vector3(0, -0.08f, -0.03f);
            var bodyTm = bodyObj.AddComponent<TextMesh>();
            bodyTm.text = "GROUND FLOOR: Centre for Computer Security & Society | Dean | HOD\n" +
                          "FIRST FLOOR: Design Thinking Lab | Research Project Hub\n" +
                          "SECOND FLOOR: Machine Vision Lab | Server Room (Restricted)\n" +
                          "THIRD FLOOR: Web 3.0 Lab | Annexure Connecting Bridge";
            bodyTm.fontSize = 18;
            bodyTm.characterSize = 0.022f;
            bodyTm.lineSpacing = 1.3f;
            bodyTm.alignment = TextAlignment.Center;
            bodyTm.anchor = TextAnchor.MiddleCenter;
            bodyTm.color = new Color(0.95f, 0.98f, 1.0f);

            // Dedication Plaque below Directory (CCSS Inauguration)
            var plaqueObj = new GameObject("CCSS_Dedication_Plaque");
            plaqueObj.transform.SetParent(dirWall.transform);
            plaqueObj.transform.localPosition = new Vector3(0, -1.05f, 0);

            var plaqueBoard = GameObject.CreatePrimitive(PrimitiveType.Cube);
            plaqueBoard.name = "PlaqueBoard";
            plaqueBoard.transform.SetParent(plaqueObj.transform);
            plaqueBoard.transform.localPosition = Vector3.zero;
            plaqueBoard.transform.localScale = new Vector3(2.0f, 0.5f, 0.03f);
            plaqueBoard.GetComponent<Renderer>().sharedMaterial = skirtingMat;

            var plaqueGoldTrim = GameObject.CreatePrimitive(PrimitiveType.Cube);
            plaqueGoldTrim.name = "PlaqueGoldTrim";
            plaqueGoldTrim.transform.SetParent(plaqueObj.transform);
            plaqueGoldTrim.transform.localPosition = new Vector3(0, 0.24f, 0);
            plaqueGoldTrim.transform.localScale = new Vector3(2.02f, 0.03f, 0.04f);
            plaqueGoldTrim.GetComponent<Renderer>().sharedMaterial = signGoldMat;

            var plaqueTextObj = new GameObject("PlaqueText");
            plaqueTextObj.transform.SetParent(plaqueObj.transform);
            plaqueTextObj.transform.localPosition = new Vector3(0, 0.02f, -0.025f);
            var plaqueTm = plaqueTextObj.AddComponent<TextMesh>();
            plaqueTm.text = "CENTRE FOR COMPUTER SECURITY AND SOCIETY\nInaugurated on 19th April 2023 | Sathyabama Institute";
            plaqueTm.fontSize = 20;
            plaqueTm.characterSize = 0.022f;
            plaqueTm.lineSpacing = 1.25f;
            plaqueTm.alignment = TextAlignment.Center;
            plaqueTm.anchor = TextAnchor.MiddleCenter;
            plaqueTm.color = new Color(0.25f, 0.75f, 0.95f);

            // 2. East Snack & Beverage Vending Machine (Photo 9.29.09 PM (1) in Foyer side alcove)
            CreateVendingMachine(appParent, new Vector3(2.75f, 0, -3.5f), Quaternion.Euler(0, -90, 0));

            // 3. West Smart Beverage / Water Vending Machine (Opposite East machine in Foyer side alcove)
            CreateVendingMachine(appParent, new Vector3(-2.75f, 0, -3.5f), Quaternion.Euler(0, 90, 0));

            // 4. Dr. Jeppiaar Framed Portrait with Overhead Spotlights (Photo 9.29.09 PM (1))
            var portraitObj = new GameObject("Dr_Jeppiaar_Portrait");
            portraitObj.transform.SetParent(appParent);
            portraitObj.transform.position = new Vector3(-2.85f, 1.85f, -1.8f);
            portraitObj.transform.rotation = Quaternion.Euler(0, 90, 0);

            var pFrame = GameObject.CreatePrimitive(PrimitiveType.Cube);
            pFrame.name = "GoldFrame";
            pFrame.transform.SetParent(portraitObj.transform);
            pFrame.transform.localPosition = Vector3.zero;
            pFrame.transform.localScale = new Vector3(1.2f, 1.6f, 0.05f);
            pFrame.GetComponent<Renderer>().sharedMaterial = signGoldMat;

            var pCanvas = GameObject.CreatePrimitive(PrimitiveType.Cube);
            pCanvas.name = "PortraitCanvas";
            pCanvas.transform.SetParent(portraitObj.transform);
            pCanvas.transform.localPosition = new Vector3(0, 0, -0.03f);
            pCanvas.transform.localScale = new Vector3(1.05f, 1.45f, 0.02f);
            pCanvas.GetComponent<Renderer>().sharedMaterial = placardMat;

            var pText = new GameObject("PortraitText");
            pText.transform.SetParent(pCanvas.transform);
            pText.transform.localPosition = new Vector3(0, -0.4f, -0.6f);
            var pTm = pText.AddComponent<TextMesh>();
            pTm.text = "COLONEL DR. JEPPIAAR, M.A., B.L., Ph.D.\nFOUNDER CHANCELLOR\nSathyabama Institute";
            pTm.fontSize = 20;
            pTm.characterSize = 0.02f;
            pTm.alignment = TextAlignment.Center;
            pTm.anchor = TextAnchor.MiddleCenter;
            pTm.color = new Color(0.12f, 0.15f, 0.25f);
        }

        private void CreateVendingMachine(Transform parent, Vector3 pos, Quaternion rot)
        {
            var vm = new GameObject("VendingMachine");
            vm.transform.SetParent(parent);
            vm.transform.position = pos;
            vm.transform.rotation = rot;

            // Main Cabinet
            var body = GameObject.CreatePrimitive(PrimitiveType.Cube);
            body.name = "CabinetBody";
            body.transform.SetParent(vm.transform);
            body.transform.localPosition = new Vector3(0, 1.0f, 0);
            body.transform.localScale = new Vector3(0.9f, 2.0f, 0.75f);
            body.GetComponent<Renderer>().sharedMaterial = pcMat;

            // Glass Showcase Display Window
            var glass = GameObject.CreatePrimitive(PrimitiveType.Cube);
            glass.name = "GlassShowcase";
            glass.transform.SetParent(vm.transform);
            glass.transform.localPosition = new Vector3(0, 1.15f, 0.38f);
            glass.transform.localScale = new Vector3(0.75f, 1.3f, 0.02f);
            glass.GetComponent<Renderer>().sharedMaterial = windowGlassMat;

            // Beverage Display Shelves
            for (int s = 0; s < 3; s++)
            {
                var shelf = GameObject.CreatePrimitive(PrimitiveType.Cube);
                shelf.name = $"Shelf_{s}";
                shelf.transform.SetParent(vm.transform);
                shelf.transform.localPosition = new Vector3(0, 0.8f + s * 0.35f, 0.2f);
                shelf.transform.localScale = new Vector3(0.72f, 0.03f, 0.35f);
                shelf.GetComponent<Renderer>().sharedMaterial = windowFrameMat;
            }

            // Keypad & Payment LED Screen
            var screen = GameObject.CreatePrimitive(PrimitiveType.Cube);
            screen.name = "PaymentScreen";
            screen.transform.SetParent(vm.transform);
            screen.transform.localPosition = new Vector3(0.32f, 1.05f, 0.39f);
            screen.transform.localScale = new Vector3(0.14f, 0.28f, 0.03f);
            screen.GetComponent<Renderer>().sharedMaterial = pcScreenMat;

            // Bottom Product Dispense Chute
            var chute = GameObject.CreatePrimitive(PrimitiveType.Cube);
            chute.name = "DispenseChute";
            chute.transform.SetParent(vm.transform);
            chute.transform.localPosition = new Vector3(0, 0.28f, 0.35f);
            chute.transform.localScale = new Vector3(0.65f, 0.22f, 0.12f);
            chute.GetComponent<Renderer>().sharedMaterial = skirtingMat;
        }

        private void BuildWallWithDoorOpening(Transform parent, string name, Vector3 center,
            float totalLength, float wallH, float wallT, float doorW, float doorH, float lintelH, bool alignX)
        {
            var wallGroup = new GameObject(name);
            wallGroup.transform.SetParent(parent);
            wallGroup.transform.localPosition = Vector3.zero;

            float segLen = (totalLength - doorW) * 0.5f;

            if (alignX)
            {
                // Left Wall Segment
                var leftSeg = GameObject.CreatePrimitive(PrimitiveType.Cube);
                leftSeg.name = "LeftWall";
                leftSeg.transform.SetParent(wallGroup.transform);
                leftSeg.transform.localPosition = new Vector3(center.x - doorW * 0.5f - segLen * 0.5f, wallH * 0.5f, center.z);
                leftSeg.transform.localScale = new Vector3(segLen, wallH, wallT);
                leftSeg.GetComponent<Renderer>().sharedMaterial = wallMat;

                // Right Wall Segment
                var rightSeg = GameObject.CreatePrimitive(PrimitiveType.Cube);
                rightSeg.name = "RightWall";
                rightSeg.transform.SetParent(wallGroup.transform);
                rightSeg.transform.localPosition = new Vector3(center.x + doorW * 0.5f + segLen * 0.5f, wallH * 0.5f, center.z);
                rightSeg.transform.localScale = new Vector3(segLen, wallH, wallT);
                rightSeg.GetComponent<Renderer>().sharedMaterial = wallMat;

                // Overhead Lintel
                var lintel = GameObject.CreatePrimitive(PrimitiveType.Cube);
                lintel.name = "OverheadLintel";
                lintel.transform.SetParent(wallGroup.transform);
                lintel.transform.localPosition = new Vector3(center.x, doorH + lintelH * 0.5f, center.z);
                lintel.transform.localScale = new Vector3(doorW, lintelH, wallT);
                lintel.GetComponent<Renderer>().sharedMaterial = wallMat;
            }
            else
            {
                // Front Wall Segment
                var frontSeg = GameObject.CreatePrimitive(PrimitiveType.Cube);
                frontSeg.name = "FrontWall";
                frontSeg.transform.SetParent(wallGroup.transform);
                frontSeg.transform.localPosition = new Vector3(center.x, wallH * 0.5f, center.z - doorW * 0.5f - segLen * 0.5f);
                frontSeg.transform.localScale = new Vector3(wallT, wallH, segLen);
                frontSeg.GetComponent<Renderer>().sharedMaterial = wallMat;

                // Back Wall Segment
                var backSeg = GameObject.CreatePrimitive(PrimitiveType.Cube);
                backSeg.name = "BackWall";
                backSeg.transform.SetParent(wallGroup.transform);
                backSeg.transform.localPosition = new Vector3(center.x, wallH * 0.5f, center.z + doorW * 0.5f + segLen * 0.5f);
                backSeg.transform.localScale = new Vector3(wallT, wallH, segLen);
                backSeg.GetComponent<Renderer>().sharedMaterial = wallMat;

                // Overhead Lintel
                var lintel = GameObject.CreatePrimitive(PrimitiveType.Cube);
                lintel.name = "OverheadLintel";
                lintel.transform.SetParent(wallGroup.transform);
                lintel.transform.localPosition = new Vector3(center.x, doorH + lintelH * 0.5f, center.z);
                lintel.transform.localScale = new Vector3(wallT, lintelH, doorW);
                lintel.GetComponent<Renderer>().sharedMaterial = wallMat;
            }
        }

        private void BuildServerRoomViewingPartition(Transform parent, float localZ, float totalW, float wallH, float wallT)
        {
            var partitionGroup = new GameObject("ServerRoom_ObservationPartition");
            partitionGroup.transform.SetParent(parent);
            partitionGroup.transform.localPosition = Vector3.zero;

            // Wide Double-Glazed Observation Window Panel (~3.2m wide x 1.3m high at eye level)
            float winW = 3.2f;
            float winH = 1.3f;
            float winY = 1.75f;
            float winX = -1.6f;

            float halfTotal = totalW * 0.5f;
            float winLeft = winX - winW * 0.5f;
            float winRight = winX + winW * 0.5f;

            // 1. Left Flank Solid Wall (from -halfTotal to winLeft)
            float leftW = winLeft - (-halfTotal);
            if (leftW > 0.05f)
            {
                var leftWall = GameObject.CreatePrimitive(PrimitiveType.Cube);
                leftWall.name = "LeftWall_Solid";
                leftWall.transform.SetParent(partitionGroup.transform);
                leftWall.transform.localPosition = new Vector3(-halfTotal + leftW * 0.5f, wallH * 0.5f, localZ);
                leftWall.transform.localScale = new Vector3(leftW, wallH, wallT);
                leftWall.GetComponent<Renderer>().sharedMaterial = wallMat;
            }

            // 2. Lower Wall below observation window
            float lowerH = winY - winH * 0.5f;
            var lowerWall = GameObject.CreatePrimitive(PrimitiveType.Cube);
            lowerWall.name = "LowerWall";
            lowerWall.transform.SetParent(partitionGroup.transform);
            lowerWall.transform.localPosition = new Vector3(winX, lowerH * 0.5f, localZ);
            lowerWall.transform.localScale = new Vector3(winW, lowerH, wallT);
            lowerWall.GetComponent<Renderer>().sharedMaterial = wallMat;

            // 3. Upper Lintel Wall above observation window
            float topY = winY + winH * 0.5f;
            float upperH = wallH - topY;
            var upperWall = GameObject.CreatePrimitive(PrimitiveType.Cube);
            upperWall.name = "UpperWall";
            upperWall.transform.SetParent(partitionGroup.transform);
            upperWall.transform.localPosition = new Vector3(winX, topY + upperH * 0.5f, localZ);
            upperWall.transform.localScale = new Vector3(winW, upperH, wallT);
            upperWall.GetComponent<Renderer>().sharedMaterial = wallMat;

            // 4. Double-Glazed Glass Viewing Panel
            var glass = GameObject.CreatePrimitive(PrimitiveType.Cube);
            glass.name = "ObservationWindow_Glass";
            glass.transform.SetParent(partitionGroup.transform);
            glass.transform.localPosition = new Vector3(winX, winY, localZ);
            glass.transform.localScale = new Vector3(winW, winH, 0.04f);
            glass.GetComponent<Renderer>().sharedMaterial = windowGlassMat;

            // 5. Aluminum Outer Casing Frame
            var frame = GameObject.CreatePrimitive(PrimitiveType.Cube);
            frame.name = "ObservationWindow_Frame";
            frame.transform.SetParent(partitionGroup.transform);
            frame.transform.localPosition = new Vector3(winX, winY, localZ);
            frame.transform.localScale = new Vector3(winW + 0.12f, winH + 0.12f, 0.08f);
            frame.GetComponent<Renderer>().sharedMaterial = windowFrameMat;
            Object.DestroyImmediate(frame.GetComponent<Collider>());

            // 6. Right Flank with Access Door into Server Room
            float rightW = halfTotal - winRight;
            float rightCenterX = winRight + rightW * 0.5f;
            BuildWallWithDoorOpening(partitionGroup.transform, "DoorWall_Flank", new Vector3(rightCenterX, 0, localZ), rightW, wallH, wallT, 1.1f, 2.25f, wallH - 2.25f, true);
            DoorController.CreateDoorFixture(partitionGroup.transform, new Vector3(rightCenterX, 0, localZ), Quaternion.Euler(0, 180, 0),
                "Server Room", "Central Campus Server Room", woodDoorMat, woodFrameMat, handleMat, placardMat);
        }

        private void BuildOpenPresentationArchway(Transform parent, string name, Vector3 center, float totalLength, float wallH, float wallT, float openingW)
        {
            var archGroup = new GameObject(name);
            archGroup.transform.SetParent(parent);
            archGroup.transform.localPosition = Vector3.zero;

            float segLen = (totalLength - openingW) * 0.5f;
            float openH = 2.8f;

            if (segLen > 0.1f)
            {
                var leftSeg = GameObject.CreatePrimitive(PrimitiveType.Cube);
                leftSeg.name = "ArchLeftPillar";
                leftSeg.transform.SetParent(archGroup.transform);
                leftSeg.transform.localPosition = new Vector3(center.x - openingW * 0.5f - segLen * 0.5f, wallH * 0.5f, center.z);
                leftSeg.transform.localScale = new Vector3(segLen, wallH, wallT);
                leftSeg.GetComponent<Renderer>().sharedMaterial = wallMat;

                var rightSeg = GameObject.CreatePrimitive(PrimitiveType.Cube);
                rightSeg.name = "ArchRightPillar";
                rightSeg.transform.SetParent(archGroup.transform);
                rightSeg.transform.localPosition = new Vector3(center.x + openingW * 0.5f + segLen * 0.5f, wallH * 0.5f, center.z);
                rightSeg.transform.localScale = new Vector3(segLen, wallH, wallT);
                rightSeg.GetComponent<Renderer>().sharedMaterial = wallMat;
            }

            var lintel = GameObject.CreatePrimitive(PrimitiveType.Cube);
            lintel.name = "ArchTopBeam";
            lintel.transform.SetParent(archGroup.transform);
            lintel.transform.localPosition = new Vector3(center.x, openH + (wallH - openH) * 0.5f, center.z);
            lintel.transform.localScale = new Vector3(totalLength, wallH - openH, wallT);
            lintel.GetComponent<Renderer>().sharedMaterial = wallMat;
        }

        private void BuildRoomFurnishings(Transform parent, RoomDefinition r)
        {
            string n = r.name.ToLower();

            // Student Project Innovation Hub (Point 7)
            if (r.category == "project_hub" || n.Contains("project hub"))
            {
                FurnishingBuilder.FurnishProjectHub(parent, r.position, r.dimensions,
                    deskMat, pcScreenMat, chairMat, blackboardMat, wallMat);
            }
            // Central Campus Server Room with Blinking LED Racks (Point 8)
            else if (r.category == "server_room" || n.Contains("server room"))
            {
                FurnishingBuilder.FurnishServerRoom(parent, r.position, r.dimensions,
                    pcMat, pcScreenMat, lightEmissiveMat);
            }
            // Flagship Research Laboratories (Point 7, 8, 9, 12)
            else if (n.Contains("css lab") || n.Contains("design thinking") ||
                n.Contains("machine vision") || n.Contains("web 3.0") ||
                n.Contains("gen ai") || n.Contains("quantum") || r.category == "lab")
            {
                FurnishingBuilder.FurnishFlagshipLab(parent, r.position, r.dimensions,
                    deskMat, pcMat, pcScreenMat, chairMat, projectorMat, blackboardMat);
            }
            // Lecture Halls (Lecture Hall 1, 2, 3 - Point 10)
            else if (n.Contains("lecture hall") || r.category == "lecture_hall")
            {
                FurnishingBuilder.FurnishLectureHall(parent, r.position, r.dimensions,
                    deskMat, blackboardMat, chairMat, pcScreenMat);
            }
            // General Classrooms (Point 5 & 11)
            else if (r.category == "classroom" || (r.number.StartsWith("4") && !n.Contains("restroom") && !n.Contains("fc")))
            {
                FurnishingBuilder.FurnishClassroom(parent, r.position, r.dimensions,
                    deskMat, blackboardMat, chairMat, pcMat, fanMat);
            }
            // Faculty Cabins, Staff Cabins, Dean, HOD
            else if (r.category == "faculty" || r.category == "staff_cabin" || r.category == "office" || n.Contains("dean") || n.Contains("hod") || n.Contains("cabin") || n.Contains("fc"))
            {
                FurnishingBuilder.FurnishFacultyCabin(parent, r.position, r.dimensions,
                    deskMat, chairMat, pcMat);
            }
        }
    }
}
