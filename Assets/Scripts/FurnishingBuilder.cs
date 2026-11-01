using UnityEngine;

namespace StPaulsVR
{
    public static class FurnishingBuilder
    {
        public static void FurnishFlagshipLab(Transform parent, Vector3 roomCenter, Vector3 roomSize,
            Material deskMat, Material pcMat, Material screenMat, Material chairMat, Material projectorMat, Material boardMat)
        {
            var labGroup = new GameObject("Lab_Furnishings");
            labGroup.transform.SetParent(parent);
            labGroup.transform.localPosition = Vector3.zero;

            // 1. Front Teacher Command Podium & Smart Screen
            float frontZ = roomCenter.z + roomSize.z * 0.42f;
            var podium = GameObject.CreatePrimitive(PrimitiveType.Cube);
            podium.name = "TeacherPodium";
            podium.transform.SetParent(labGroup.transform);
            podium.transform.position = new Vector3(roomCenter.x, roomCenter.y + 0.45f, frontZ - 1.0f);
            podium.transform.localScale = new Vector3(1.8f, 0.9f, 0.8f);
            podium.GetComponent<Renderer>().sharedMaterial = deskMat;

            // Master PC on podium
            var masterPC = GameObject.CreatePrimitive(PrimitiveType.Cube);
            masterPC.name = "MasterMonitor";
            masterPC.transform.SetParent(podium.transform);
            masterPC.transform.localPosition = new Vector3(0, 0.65f, 0);
            masterPC.transform.localScale = new Vector3(0.5f, 0.35f, 0.05f);
            masterPC.GetComponent<Renderer>().sharedMaterial = pcMat;

            // Front Smart Projection Screen
            var screen = GameObject.CreatePrimitive(PrimitiveType.Cube);
            screen.name = "SmartProjectionScreen";
            screen.transform.SetParent(labGroup.transform);
            screen.transform.position = new Vector3(roomCenter.x, roomCenter.y + 2.0f, frontZ - 0.1f);
            screen.transform.localScale = new Vector3(Mathf.Min(4.5f, roomSize.x * 0.6f), 2.0f, 0.05f);
            screen.GetComponent<Renderer>().sharedMaterial = screenMat;

            // 2. Ceiling Projectors
            int projCount = roomSize.x > 8f ? 3 : 1;
            float spanX = roomSize.x * 0.35f;
            for (int p = 0; p < projCount; p++)
            {
                float px = projCount == 1 ? roomCenter.x : (roomCenter.x - spanX + p * spanX);
                var proj = GameObject.CreatePrimitive(PrimitiveType.Cube);
                proj.name = $"CeilingProjector_{p}";
                proj.transform.SetParent(labGroup.transform);
                proj.transform.position = new Vector3(px, roomCenter.y + 3.2f, roomCenter.z);
                proj.transform.localScale = new Vector3(0.4f, 0.2f, 0.35f);
                proj.GetComponent<Renderer>().sharedMaterial = projectorMat;
            }

            // 3. Workstation Rows (dynamically sized inside room)
            int cols = roomSize.x > 8.0f ? 3 : 2;
            float usableWidth = roomSize.x * 0.75f;
            float colSpacing = usableWidth / cols;
            float benchWidth = Mathf.Min(2.8f, colSpacing * 0.85f);
            int rows = Mathf.Clamp((int)((roomSize.z - 3.5f) / 1.8f), 2, 4);
            float startZ = frontZ - 2.4f;
            float rowSpacing = 1.8f;

            for (int c = 0; c < cols; c++)
            {
                float cx = roomCenter.x - (usableWidth * 0.5f) + (c + 0.5f) * colSpacing;
                for (int r = 0; r < rows; r++)
                {
                    float z = startZ - r * rowSpacing;
                    Vector3 benchPos = new Vector3(cx, roomCenter.y + 0.37f, z);

                    var desk = GameObject.CreatePrimitive(PrimitiveType.Cube);
                    desk.name = $"WorkstationDesk_C{c}_R{r}";
                    desk.transform.SetParent(labGroup.transform);
                    desk.transform.position = benchPos;
                    desk.transform.localScale = new Vector3(benchWidth, 0.74f, 0.65f);
                    desk.GetComponent<Renderer>().sharedMaterial = deskMat;

                    // 2 to 3 PC Monitors per bench
                    int pcCount = benchWidth > 2.2f ? 3 : 2;
                    for (int pc = 0; pc < pcCount; pc++)
                    {
                        float offsetX = -benchWidth * 0.35f + pc * (benchWidth * 0.7f / (pcCount - 1));
                        var monitor = GameObject.CreatePrimitive(PrimitiveType.Cube);
                        monitor.name = $"PC_Monitor_{pc}";
                        monitor.transform.SetParent(desk.transform);
                        monitor.transform.localPosition = new Vector3(offsetX / benchWidth, 0.65f, 0.1f);
                        monitor.transform.localScale = new Vector3(0.12f, 0.45f, 0.08f);
                        monitor.GetComponent<Renderer>().sharedMaterial = pcMat;

                        var display = GameObject.CreatePrimitive(PrimitiveType.Cube);
                        display.name = "Display";
                        display.transform.SetParent(monitor.transform);
                        display.transform.localPosition = new Vector3(0, 0, -0.6f);
                        display.transform.localScale = new Vector3(0.9f, 0.85f, 0.1f);
                        display.GetComponent<Renderer>().sharedMaterial = screenMat;

                        var chair = GameObject.CreatePrimitive(PrimitiveType.Cube);
                        chair.name = $"Chair_{pc}";
                        chair.transform.SetParent(labGroup.transform);
                        chair.transform.position = new Vector3(cx + offsetX, roomCenter.y + 0.4f, z - 0.65f);
                        chair.transform.localScale = new Vector3(0.45f, 0.8f, 0.45f);
                        chair.GetComponent<Renderer>().sharedMaterial = chairMat;
                    }
                }
            }

            // 4. Split AC units on side walls
            CreateSplitAC(labGroup.transform, new Vector3(roomCenter.x - roomSize.x * 0.45f, roomCenter.y + 2.8f, roomCenter.z), pcMat);
            CreateSplitAC(labGroup.transform, new Vector3(roomCenter.x + roomSize.x * 0.45f, roomCenter.y + 2.8f, roomCenter.z), pcMat);
        }

        public static void FurnishProjectHub(Transform parent, Vector3 roomCenter, Vector3 roomSize,
            Material deskMat, Material screenMat, Material chairMat, Material boardMat, Material whiteMat)
        {
            var hubGroup = new GameObject("ProjectHub_Furnishings");
            hubGroup.transform.SetParent(parent);
            hubGroup.transform.localPosition = Vector3.zero;

            // 1. Central Innovation Presentation Screen on Rear Wall
            var mainScreen = GameObject.CreatePrimitive(PrimitiveType.Cube);
            mainScreen.name = "InnovationDisplayScreen";
            mainScreen.transform.SetParent(hubGroup.transform);
            mainScreen.transform.position = new Vector3(roomCenter.x, roomCenter.y + 2.0f, roomCenter.z + roomSize.z * 0.44f);
            mainScreen.transform.localScale = new Vector3(Mathf.Min(3.6f, roomSize.x * 0.7f), 1.8f, 0.05f);
            mainScreen.GetComponent<Renderer>().sharedMaterial = screenMat;

            // Presentation Banner Board
            var banner = GameObject.CreatePrimitive(PrimitiveType.Cube);
            banner.name = "HubBanner";
            banner.transform.SetParent(hubGroup.transform);
            banner.transform.position = new Vector3(roomCenter.x, roomCenter.y + 3.1f, roomCenter.z + roomSize.z * 0.44f);
            banner.transform.localScale = new Vector3(Mathf.Min(4.0f, roomSize.x * 0.8f), 0.35f, 0.04f);
            banner.GetComponent<Renderer>().sharedMaterial = boardMat;

            // 2. Student Project Showcase Plinths / Display Pedestals (Photo & Point 7)
            float halfW = roomSize.x * 0.32f;
            float halfD = roomSize.z * 0.28f;
            Vector3[] plinthPositions = new Vector3[]
            {
                new Vector3(roomCenter.x - halfW, roomCenter.y + 0.45f, roomCenter.z + halfD),
                new Vector3(roomCenter.x + halfW, roomCenter.y + 0.45f, roomCenter.z + halfD),
                new Vector3(roomCenter.x - halfW, roomCenter.y + 0.45f, roomCenter.z - halfD),
                new Vector3(roomCenter.x + halfW, roomCenter.y + 0.45f, roomCenter.z - halfD)
            };

            for (int i = 0; i < plinthPositions.Length; i++)
            {
                // Pedestal Base
                var plinth = GameObject.CreatePrimitive(PrimitiveType.Cube);
                plinth.name = $"ProjectShowcasePlinth_{i}";
                plinth.transform.SetParent(hubGroup.transform);
                plinth.transform.position = plinthPositions[i];
                plinth.transform.localScale = new Vector3(1.1f, 0.9f, 0.9f);
                plinth.GetComponent<Renderer>().sharedMaterial = whiteMat;

                // Hardware Prototype on Display (Robotics / IoT embedded module)
                var prototype = GameObject.CreatePrimitive(PrimitiveType.Cube);
                prototype.name = $"ProjectPrototype_{i}";
                prototype.transform.SetParent(plinth.transform);
                prototype.transform.localPosition = new Vector3(0, 0.6f, 0);
                prototype.transform.localScale = new Vector3(0.5f, 0.25f, 0.4f);
                prototype.GetComponent<Renderer>().sharedMaterial = deskMat;

                // Acrylic Display Plaque
                var plaque = GameObject.CreatePrimitive(PrimitiveType.Cube);
                plaque.name = "DescriptionPlaque";
                plaque.transform.SetParent(plinth.transform);
                plaque.transform.localPosition = new Vector3(0, 0.45f, -0.48f);
                plaque.transform.localScale = new Vector3(0.35f, 0.2f, 0.02f);
                plaque.GetComponent<Renderer>().sharedMaterial = screenMat;
            }

            // 3. Center Collaboration Standing Round Table & Stools
            var centerTable = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
            centerTable.name = "CollaborationRoundTable";
            centerTable.transform.SetParent(hubGroup.transform);
            centerTable.transform.position = new Vector3(roomCenter.x, roomCenter.y + 0.5f, roomCenter.z);
            centerTable.transform.localScale = new Vector3(1.2f, 0.5f, 1.2f);
            centerTable.GetComponent<Renderer>().sharedMaterial = deskMat;

            // 4 Stools around table
            for (int s = 0; s < 4; s++)
            {
                float ang = s * 90.0f * Mathf.Deg2Rad;
                var stool = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
                stool.name = $"HubStool_{s}";
                stool.transform.SetParent(hubGroup.transform);
                stool.transform.position = new Vector3(roomCenter.x + Mathf.Cos(ang) * 1.0f, roomCenter.y + 0.35f, roomCenter.z + Mathf.Sin(ang) * 1.0f);
                stool.transform.localScale = new Vector3(0.36f, 0.35f, 0.36f);
                stool.GetComponent<Renderer>().sharedMaterial = chairMat;
            }
        }

        public static void FurnishServerRoom(Transform parent, Vector3 roomCenter, Vector3 roomSize,
            Material chassisMat, Material screenMat, Material lightEmissiveMat)
        {
            var srvGroup = new GameObject("ServerRoom_Furnishings");
            srvGroup.transform.SetParent(parent);
            srvGroup.transform.localPosition = Vector3.zero;

            // Setup Emissive Status LED Materials for blinking server rack lights (Part 7 exact colors)
            var shader = Shader.Find("Standard");
            var greenLedMat = new Material(shader) { color = new Color(0.0f, 1.0f, 0.2f) };
            greenLedMat.EnableKeyword("_EMISSION");
            greenLedMat.SetColor("_EmissionColor", new Color(0.0f, 1.0f, 0.2f) * 2.0f);
            greenLedMat.name = "Mat_Server_LED_Green";

            var blueLedMat = new Material(shader) { color = new Color(0.0f, 0.4f, 1.0f) };
            blueLedMat.EnableKeyword("_EMISSION");
            blueLedMat.SetColor("_EmissionColor", new Color(0.0f, 0.4f, 1.0f) * 2.0f);
            blueLedMat.name = "Mat_Server_LED_Blue";

            var amberLedMat = new Material(shader) { color = new Color(1.0f, 0.6f, 0.0f) };
            amberLedMat.EnableKeyword("_EMISSION");
            amberLedMat.SetColor("_EmissionColor", new Color(1.0f, 0.6f, 0.0f) * 2.0f);
            amberLedMat.name = "Mat_Server_LED_Amber";

            // Server rack cabinet material: (0.12, 0.12, 0.14), Gloss 0.4, Metallic 0.6
            var rackMat = new Material(shader) { color = new Color(0.12f, 0.12f, 0.14f) };
            rackMat.SetFloat("_Glossiness", 0.40f);
            rackMat.SetFloat("_Metallic", 0.60f);
            rackMat.name = "Mat_Server_Rack_Chassis";

            // 1. Exactly 6x 42U 19" Server Rack Cabinets facing South (towards viewing panel)
            int totalRacks = 6;
            float rackW = 0.85f;
            float rackH = 2.4f;
            float rackD = 1.0f;
            float rackSpacing = 1.25f;
            float startX = -((totalRacks - 1) * rackSpacing) * 0.5f;

            for (int r = 0; r < totalRacks; r++)
            {
                float rx = roomCenter.x + startX + r * rackSpacing;
                var rack = GameObject.CreatePrimitive(PrimitiveType.Cube);
                rack.name = $"ServerRack_42U_{r}";
                rack.transform.SetParent(srvGroup.transform);
                rack.transform.position = new Vector3(rx, roomCenter.y + rackH * 0.5f, roomCenter.z + 0.15f);
                rack.transform.localScale = new Vector3(rackW, rackH, rackD);
                rack.GetComponent<Renderer>().sharedMaterial = rackMat;

                // Blade Server Units inside the rack
                int blades = 6;
                for (int b = 0; b < blades; b++)
                {
                    float localY = -0.38f + b * 0.15f;

                    // Blade Faceplate (facing -Z towards viewing panel)
                    var blade = GameObject.CreatePrimitive(PrimitiveType.Cube);
                    blade.name = $"BladeServer_{b}";
                    blade.transform.SetParent(rack.transform);
                    blade.transform.localPosition = new Vector3(0, localY, -0.49f);
                    blade.transform.localScale = new Vector3(0.92f, 0.10f, 0.04f);
                    blade.GetComponent<Renderer>().sharedMaterial = rackMat;
                    Object.DestroyImmediate(blade.GetComponent<Collider>());

                    // Blinking Activity Status LEDs (Green, Blue, Amber)
                    var ledGreen = GameObject.CreatePrimitive(PrimitiveType.Cube);
                    ledGreen.name = "LED_Online";
                    ledGreen.transform.SetParent(blade.transform);
                    ledGreen.transform.localPosition = new Vector3(-0.35f, 0, -0.6f);
                    ledGreen.transform.localScale = new Vector3(0.08f, 0.4f, 0.2f);
                    ledGreen.GetComponent<Renderer>().sharedMaterial = greenLedMat;
                    Object.DestroyImmediate(ledGreen.GetComponent<Collider>());

                    var ledBlue = GameObject.CreatePrimitive(PrimitiveType.Cube);
                    ledBlue.name = "LED_NetworkLink";
                    ledBlue.transform.SetParent(blade.transform);
                    ledBlue.transform.localPosition = new Vector3(-0.20f, 0, -0.6f);
                    ledBlue.transform.localScale = new Vector3(0.08f, 0.4f, 0.2f);
                    ledBlue.GetComponent<Renderer>().sharedMaterial = blueLedMat;
                    Object.DestroyImmediate(ledBlue.GetComponent<Collider>());

                    var ledAmber = GameObject.CreatePrimitive(PrimitiveType.Cube);
                    ledAmber.name = "LED_DiskIO";
                    ledAmber.transform.SetParent(blade.transform);
                    ledAmber.transform.localPosition = new Vector3(-0.05f, 0, -0.6f);
                    ledAmber.transform.localScale = new Vector3(0.08f, 0.4f, 0.2f);
                    ledAmber.GetComponent<Renderer>().sharedMaterial = amberLedMat;
                    Object.DestroyImmediate(ledAmber.GetComponent<Collider>());
                }
            }

            // 2. Attach ServerRoomLEDController for active blinking routine
            var ledController = srvGroup.AddComponent<ServerRoomLEDController>();
            ledController.Initialize(greenLedMat, blueLedMat, amberLedMat);

            // 3. Overhead Suspended Cable Ladder Tray
            var cableTray = GameObject.CreatePrimitive(PrimitiveType.Cube);
            cableTray.name = "Ceiling_CableTray";
            cableTray.transform.SetParent(srvGroup.transform);
            cableTray.transform.position = new Vector3(roomCenter.x, roomCenter.y + 2.85f, roomCenter.z + 0.15f);
            cableTray.transform.localScale = new Vector3(roomSize.x * 0.85f, 0.12f, 0.6f);
            cableTray.GetComponent<Renderer>().sharedMaterial = rackMat;

            // 4. CRAC Precision Environmental Cooling Units along North Wall
            float cracZ = roomCenter.z + roomSize.z * 0.38f;
            float[] cracX = new float[] { roomCenter.x - 3.8f, roomCenter.x + 3.8f };
            for (int i = 0; i < cracX.Length; i++)
            {
                var crac = GameObject.CreatePrimitive(PrimitiveType.Cube);
                crac.name = $"CRAC_CoolingUnit_{i}";
                crac.transform.SetParent(srvGroup.transform);
                crac.transform.position = new Vector3(cracX[i], roomCenter.y + 1.25f, cracZ);
                crac.transform.localScale = new Vector3(1.1f, 2.5f, 0.85f);
                crac.GetComponent<Renderer>().sharedMaterial = rackMat;
            }
        }

        public static void FurnishClassroom(Transform parent, Vector3 roomCenter, Vector3 roomSize,
            Material deskMat, Material boardMat, Material chairMat, Material pcMat, Material ceilingFanMat)
        {
            var crGroup = new GameObject("Classroom_Furnishings");
            crGroup.transform.SetParent(parent);
            crGroup.transform.localPosition = Vector3.zero;

            // 1. Large Green Chalkboard on front wall with wooden frame trim
            float frontZ = roomCenter.z + roomSize.z * 0.44f;
            var board = GameObject.CreatePrimitive(PrimitiveType.Cube);
            board.name = "Blackboard";
            board.transform.SetParent(crGroup.transform);
            board.transform.position = new Vector3(roomCenter.x, roomCenter.y + 1.8f, frontZ - 0.05f);
            board.transform.localScale = new Vector3(Mathf.Min(3.6f, roomSize.x * 0.65f), 1.3f, 0.04f);
            board.GetComponent<Renderer>().sharedMaterial = boardMat;

            // 2. Teacher Lectern & Desk
            var teacherDesk = GameObject.CreatePrimitive(PrimitiveType.Cube);
            teacherDesk.name = "TeacherDesk";
            teacherDesk.transform.SetParent(crGroup.transform);
            teacherDesk.transform.position = new Vector3(roomCenter.x - 1.1f, roomCenter.y + 0.38f, frontZ - 1.0f);
            teacherDesk.transform.localScale = new Vector3(1.2f, 0.75f, 0.6f);
            teacherDesk.GetComponent<Renderer>().sharedMaterial = deskMat;

            var lectern = GameObject.CreatePrimitive(PrimitiveType.Cube);
            lectern.name = "TeacherLectern";
            lectern.transform.SetParent(crGroup.transform);
            lectern.transform.position = new Vector3(roomCenter.x + 1.0f, roomCenter.y + 0.55f, frontZ - 1.0f);
            lectern.transform.localScale = new Vector3(0.55f, 1.1f, 0.45f);
            lectern.GetComponent<Renderer>().sharedMaterial = deskMat;

            // 3. Student Dual-Desk Benches (dynamically sized inside room)
            float colOffset = Mathf.Min(1.5f, roomSize.x * 0.25f);
            float[] colX = new float[] { roomCenter.x - colOffset, roomCenter.x + colOffset };
            int rows = Mathf.Clamp((int)((roomSize.z - 3.2f) / 1.5f), 2, 4);
            float startZ = frontZ - 2.2f;

            for (int c = 0; c < colX.Length; c++)
            {
                for (int r = 0; r < rows; r++)
                {
                    float z = startZ - r * 1.5f;

                    var desk = GameObject.CreatePrimitive(PrimitiveType.Cube);
                    desk.name = $"Desk_C{c}_R{r}";
                    desk.transform.SetParent(crGroup.transform);
                    desk.transform.position = new Vector3(colX[c], roomCenter.y + 0.36f, z);
                    desk.transform.localScale = new Vector3(1.3f, 0.72f, 0.45f);
                    desk.GetComponent<Renderer>().sharedMaterial = deskMat;

                    var seat = GameObject.CreatePrimitive(PrimitiveType.Cube);
                    seat.name = $"Seat_C{c}_R{r}";
                    seat.transform.SetParent(crGroup.transform);
                    seat.transform.position = new Vector3(colX[c], roomCenter.y + 0.22f, z - 0.45f);
                    seat.transform.localScale = new Vector3(1.3f, 0.44f, 0.30f);
                    seat.GetComponent<Renderer>().sharedMaterial = chairMat;
                }
            }

            // 4. Ceiling Fans (Photo 3)
            CreateCeilingFan(crGroup.transform, new Vector3(roomCenter.x - 1.2f, roomCenter.y + 3.2f, roomCenter.z), ceilingFanMat);
            CreateCeilingFan(crGroup.transform, new Vector3(roomCenter.x + 1.2f, roomCenter.y + 3.2f, roomCenter.z), ceilingFanMat);

            // 5. Wall Split AC Unit
            CreateSplitAC(crGroup.transform, new Vector3(roomCenter.x - roomSize.x * 0.44f, roomCenter.y + 2.7f, roomCenter.z), pcMat);
        }

        public static void FurnishLectureHall(Transform parent, Vector3 roomCenter, Vector3 roomSize,
            Material deskMat, Material boardMat, Material chairMat, Material screenMat)
        {
            var lhGroup = new GameObject("LectureHall_Furnishings");
            lhGroup.transform.SetParent(parent);
            lhGroup.transform.localPosition = Vector3.zero;

            // 1. Massive 4.5m Blackboard & Presentation Screen on Front Wall
            float frontZ = roomCenter.z + roomSize.z * 0.44f;
            var board = GameObject.CreatePrimitive(PrimitiveType.Cube);
            board.name = "LectureHall_Board";
            board.transform.SetParent(lhGroup.transform);
            board.transform.position = new Vector3(roomCenter.x, roomCenter.y + 1.8f, frontZ - 0.05f);
            board.transform.localScale = new Vector3(Mathf.Min(4.8f, roomSize.x * 0.8f), 1.5f, 0.04f);
            board.GetComponent<Renderer>().sharedMaterial = boardMat;

            // Teacher Podium
            var podium = GameObject.CreatePrimitive(PrimitiveType.Cube);
            podium.name = "ProfessorPodium";
            podium.transform.SetParent(lhGroup.transform);
            podium.transform.position = new Vector3(roomCenter.x, roomCenter.y + 0.55f, frontZ - 1.2f);
            podium.transform.localScale = new Vector3(1.6f, 1.1f, 0.7f);
            podium.GetComponent<Renderer>().sharedMaterial = deskMat;

            // 2. Flat-Floor Continuous Desks & Seating for 60 Seats (Point 10)
            int rows = 5;
            float startZ = frontZ - 2.6f;
            float colW = (roomSize.x * 0.85f - 1.2f) * 0.5f; // Left and right seating blocks divided by center aisle
            float aisleOffsetX = colW * 0.5f + 0.6f;

            for (int r = 0; r < rows; r++)
            {
                float z = startZ - r * 1.6f;

                // Left Desk & Seat
                var deskL = GameObject.CreatePrimitive(PrimitiveType.Cube);
                deskL.name = $"FlatDesk_L_{r}";
                deskL.transform.SetParent(lhGroup.transform);
                deskL.transform.position = new Vector3(roomCenter.x - aisleOffsetX, roomCenter.y + 0.38f, z);
                deskL.transform.localScale = new Vector3(colW, 0.75f, 0.45f);
                deskL.GetComponent<Renderer>().sharedMaterial = deskMat;

                var seatL = GameObject.CreatePrimitive(PrimitiveType.Cube);
                seatL.name = $"FlatSeat_L_{r}";
                seatL.transform.SetParent(lhGroup.transform);
                seatL.transform.position = new Vector3(roomCenter.x - aisleOffsetX, roomCenter.y + 0.24f, z - 0.5f);
                seatL.transform.localScale = new Vector3(colW, 0.46f, 0.32f);
                seatL.GetComponent<Renderer>().sharedMaterial = chairMat;

                // Right Desk & Seat
                var deskR = GameObject.CreatePrimitive(PrimitiveType.Cube);
                deskR.name = $"FlatDesk_R_{r}";
                deskR.transform.SetParent(lhGroup.transform);
                deskR.transform.position = new Vector3(roomCenter.x + aisleOffsetX, roomCenter.y + 0.38f, z);
                deskR.transform.localScale = new Vector3(colW, 0.75f, 0.45f);
                deskR.GetComponent<Renderer>().sharedMaterial = deskMat;

                var seatR = GameObject.CreatePrimitive(PrimitiveType.Cube);
                seatR.name = $"FlatSeat_R_{r}";
                seatR.transform.SetParent(lhGroup.transform);
                seatR.transform.position = new Vector3(roomCenter.x + aisleOffsetX, roomCenter.y + 0.24f, z - 0.5f);
                seatR.transform.localScale = new Vector3(colW, 0.46f, 0.32f);
                seatR.GetComponent<Renderer>().sharedMaterial = chairMat;
            }
        }

        public static void FurnishFacultyCabin(Transform parent, Vector3 roomCenter, Vector3 roomSize,
            Material deskMat, Material chairMat, Material pcMat)
        {
            var cabinGroup = new GameObject("Cabin_Furnishings");
            cabinGroup.transform.SetParent(parent);
            cabinGroup.transform.localPosition = Vector3.zero;

            // Executive L-Desk
            var desk = GameObject.CreatePrimitive(PrimitiveType.Cube);
            desk.name = "ExecutiveDesk";
            desk.transform.SetParent(cabinGroup.transform);
            desk.transform.position = new Vector3(roomCenter.x, roomCenter.y + 0.38f, roomCenter.z);
            desk.transform.localScale = new Vector3(1.5f, 0.76f, 0.8f);
            desk.GetComponent<Renderer>().sharedMaterial = deskMat;

            // PC on Desk
            var pc = GameObject.CreatePrimitive(PrimitiveType.Cube);
            pc.name = "FacultyPC";
            pc.transform.SetParent(desk.transform);
            pc.transform.localPosition = new Vector3(0.2f, 0.65f, 0);
            pc.transform.localScale = new Vector3(0.35f, 0.4f, 0.08f);
            pc.GetComponent<Renderer>().sharedMaterial = pcMat;

            // Executive Chair
            var chair = GameObject.CreatePrimitive(PrimitiveType.Cube);
            chair.name = "ExecutiveChair";
            chair.transform.SetParent(cabinGroup.transform);
            chair.transform.position = new Vector3(roomCenter.x, roomCenter.y + 0.5f, roomCenter.z + 0.7f);
            chair.transform.localScale = new Vector3(0.55f, 1.0f, 0.55f);
            chair.GetComponent<Renderer>().sharedMaterial = chairMat;

            // Visitor Chairs
            var vChair1 = GameObject.CreatePrimitive(PrimitiveType.Cube);
            vChair1.name = "VisitorChair_1";
            vChair1.transform.SetParent(cabinGroup.transform);
            vChair1.transform.position = new Vector3(roomCenter.x - 0.5f, roomCenter.y + 0.4f, roomCenter.z - 0.7f);
            vChair1.transform.localScale = new Vector3(0.45f, 0.8f, 0.45f);
            vChair1.GetComponent<Renderer>().sharedMaterial = chairMat;

            var vChair2 = GameObject.CreatePrimitive(PrimitiveType.Cube);
            vChair2.name = "VisitorChair_2";
            vChair2.transform.SetParent(cabinGroup.transform);
            vChair2.transform.position = new Vector3(roomCenter.x + 0.5f, roomCenter.y + 0.4f, roomCenter.z - 0.7f);
            vChair2.transform.localScale = new Vector3(0.45f, 0.8f, 0.45f);
            vChair2.GetComponent<Renderer>().sharedMaterial = chairMat;

            // Document Cabinet
            var cabinet = GameObject.CreatePrimitive(PrimitiveType.Cube);
            cabinet.name = "BookCabinet";
            cabinet.transform.SetParent(cabinGroup.transform);
            cabinet.transform.position = new Vector3(roomCenter.x - roomSize.x * 0.38f, roomCenter.y + 0.9f, roomCenter.z);
            cabinet.transform.localScale = new Vector3(0.4f, 1.8f, 1.2f);
            cabinet.GetComponent<Renderer>().sharedMaterial = deskMat;
        }

        private static void CreateCeilingFan(Transform parent, Vector3 pos, Material fanMat)
        {
            var fanObj = new GameObject("CeilingFan");
            fanObj.transform.SetParent(parent);
            fanObj.transform.position = pos;

            var motor = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
            motor.name = "Motor";
            motor.transform.SetParent(fanObj.transform);
            motor.transform.localPosition = Vector3.zero;
            motor.transform.localScale = new Vector3(0.24f, 0.08f, 0.24f);
            motor.GetComponent<Renderer>().sharedMaterial = fanMat;

            for (int b = 0; b < 3; b++)
            {
                float angle = b * 120.0f;
                var blade = GameObject.CreatePrimitive(PrimitiveType.Cube);
                blade.name = $"Blade_{b}";
                blade.transform.SetParent(fanObj.transform);
                blade.transform.localPosition = Quaternion.Euler(0, angle, 0) * new Vector3(0.45f, 0, 0);
                blade.transform.localRotation = Quaternion.Euler(5f, angle, 0);
                blade.transform.localScale = new Vector3(0.7f, 0.02f, 0.12f);
                blade.GetComponent<Renderer>().sharedMaterial = fanMat;
                Object.DestroyImmediate(blade.GetComponent<Collider>());
            }
        }

        private static void CreateSplitAC(Transform parent, Vector3 pos, Material acMat)
        {
            var ac = GameObject.CreatePrimitive(PrimitiveType.Cube);
            ac.name = "SplitAC_Indoor";
            ac.transform.SetParent(parent);
            ac.transform.position = pos;
            ac.transform.localScale = new Vector3(1.1f, 0.32f, 0.22f);
            ac.GetComponent<Renderer>().sharedMaterial = acMat;
        }
    }
}
