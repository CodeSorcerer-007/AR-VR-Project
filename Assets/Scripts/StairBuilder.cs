using UnityEngine;

namespace StPaulsVR
{
    public static class StairBuilder
    {
        public static GameObject BuildMainDoglegStaircase(Transform parent, string name, Vector3 origin,
            Material wallMat, Material treadMat, Material riserMat, Material landingMat, Material railingMat,
            Material skirtingMat, Material beamMat)
        {
            var stairRoot = new GameObject(name);
            stairRoot.transform.SetParent(parent);
            stairRoot.transform.position = origin;

            // Build across 3 vertical levels: 0->4m, 4->8m, 8->12m
            for (int level = 0; level < 3; level++)
            {
                float baseY = level * 4.0f;
                var levelObj = new GameObject($"StairFlight_Level_{level}_to_{level + 1}");
                levelObj.transform.SetParent(stairRoot.transform);
                levelObj.transform.localPosition = new Vector3(0, baseY, 0);

                // 1. Enclosing Masonry Stairwell Walls (Photo 9.29.12 PM (1))
                // West Wall
                var wallW = GameObject.CreatePrimitive(PrimitiveType.Cube);
                wallW.name = "Stairwell_Wall_West";
                wallW.transform.SetParent(levelObj.transform);
                wallW.transform.localPosition = new Vector3(-1.55f, 1.95f, 0.75f);
                wallW.transform.localScale = new Vector3(0.2f, 3.9f, 4.8f);
                wallW.GetComponent<Renderer>().sharedMaterial = wallMat;

                // East Wall
                var wallE = GameObject.CreatePrimitive(PrimitiveType.Cube);
                wallE.name = "Stairwell_Wall_East";
                wallE.transform.SetParent(levelObj.transform);
                wallE.transform.localPosition = new Vector3(1.55f, 1.95f, 0.75f);
                wallE.transform.localScale = new Vector3(0.2f, 3.9f, 4.8f);
                wallE.GetComponent<Renderer>().sharedMaterial = wallMat;

                // North Back Wall (behind mid-landing)
                var wallN = GameObject.CreatePrimitive(PrimitiveType.Cube);
                wallN.name = "Stairwell_Wall_North";
                wallN.transform.SetParent(levelObj.transform);
                wallN.transform.localPosition = new Vector3(0, 1.95f, 3.05f);
                wallN.transform.localScale = new Vector3(3.2f, 3.9f, 0.2f);
                wallN.GetComponent<Renderer>().sharedMaterial = wallMat;

                // Black Protective Granite Skirting around base
                CreateSkirting(levelObj.transform, "Skirting_W", new Vector3(-1.43f, 0.08f, 0.75f), new Vector3(0.04f, 0.16f, 4.6f), skirtingMat);
                CreateSkirting(levelObj.transform, "Skirting_E", new Vector3(1.43f, 0.08f, 0.75f), new Vector3(0.04f, 0.16f, 4.6f), skirtingMat);
                CreateSkirting(levelObj.transform, "Skirting_MidLanding", new Vector3(0, 2.08f, 2.93f), new Vector3(2.8f, 0.16f, 0.04f), skirtingMat);

                // South Entrance Portal Frame (Navy Blue Accent Columns & Overhead Tie-Beam)
                var colL = GameObject.CreatePrimitive(PrimitiveType.Cube);
                colL.name = "Portal_Col_Left";
                colL.transform.SetParent(levelObj.transform);
                colL.transform.localPosition = new Vector3(-1.55f, 1.95f, -1.6f);
                colL.transform.localScale = new Vector3(0.35f, 3.9f, 0.35f);
                colL.GetComponent<Renderer>().sharedMaterial = beamMat;

                var colR = GameObject.CreatePrimitive(PrimitiveType.Cube);
                colR.name = "Portal_Col_Right";
                colR.transform.SetParent(levelObj.transform);
                colR.transform.localPosition = new Vector3(1.55f, 1.95f, -1.6f);
                colR.transform.localScale = new Vector3(0.35f, 3.9f, 0.35f);
                colR.GetComponent<Renderer>().sharedMaterial = beamMat;

                var portalLintel = GameObject.CreatePrimitive(PrimitiveType.Cube);
                portalLintel.name = "Portal_Lintel_Beam";
                portalLintel.transform.SetParent(levelObj.transform);
                portalLintel.transform.localPosition = new Vector3(0, 3.75f, -1.6f);
                portalLintel.transform.localScale = new Vector3(3.4f, 0.35f, 0.35f);
                portalLintel.GetComponent<Renderer>().sharedMaterial = beamMat;

                // 2. Flight 1: climbs +Z from Y=0 to Y=2.0m (West half: X = -0.75m)
                BuildFlight(levelObj.transform, "Flight_1_Up",
                    new Vector3(-0.75f, 0, -1.54f),
                    steps: 11, stepWidth: 1.35f, treadDepth: 0.28f, riserHeight: 0.182f,
                    directionZ: 1.0f,
                    treadMat, riserMat, railingMat);

                // 3. Mid-Landing Slab at Y = 2.0m spanning both flights (Z: 1.54 to 2.94m)
                var midLanding = GameObject.CreatePrimitive(PrimitiveType.Cube);
                midLanding.name = "MidLanding_Slab";
                midLanding.transform.SetParent(levelObj.transform);
                midLanding.transform.localPosition = new Vector3(0, 1.925f, 2.24f);
                midLanding.transform.localScale = new Vector3(2.9f, 0.15f, 1.4f);
                midLanding.GetComponent<Renderer>().sharedMaterial = landingMat;

                // Mid-Landing Safety Handrail along back wall
                var midRail = GameObject.CreatePrimitive(PrimitiveType.Cube);
                midRail.name = "MidLanding_BackHandrail";
                midRail.transform.SetParent(levelObj.transform);
                midRail.transform.localPosition = new Vector3(0, 2.85f, 2.92f);
                midRail.transform.localScale = new Vector3(2.8f, 0.08f, 0.06f);
                midRail.GetComponent<Renderer>().sharedMaterial = railingMat;

                // Central Well Divider Railing between Flight 1 and Flight 2
                var wellRail = GameObject.CreatePrimitive(PrimitiveType.Cube);
                wellRail.name = "CentralWell_DividerRail";
                wellRail.transform.SetParent(levelObj.transform);
                wellRail.transform.localPosition = new Vector3(0f, 2.2f, 0.0f);
                wellRail.transform.localScale = new Vector3(0.06f, 1.1f, 3.2f);
                wellRail.GetComponent<Renderer>().sharedMaterial = railingMat;

                // 4. Flight 2: climbs -Z from Y=2.0 to Y=4.0m (East half: X = +0.75m)
                BuildFlight(levelObj.transform, "Flight_2_Up",
                    new Vector3(0.75f, 2.0f, 1.54f),
                    steps: 11, stepWidth: 1.35f, treadDepth: 0.28f, riserHeight: 0.182f,
                    directionZ: -1.0f,
                    treadMat, riserMat, railingMat);

                // 5. Top Landing Connector at Y = 4.0m connecting stairhead to upper floor corridor
                var topLanding = GameObject.CreatePrimitive(PrimitiveType.Cube);
                topLanding.name = "TopLanding_Connector";
                topLanding.transform.SetParent(levelObj.transform);
                topLanding.transform.localPosition = new Vector3(0f, 3.85f, -1.75f);
                topLanding.transform.localScale = new Vector3(2.9f, 0.30f, 3.5f);
                topLanding.GetComponent<Renderer>().sharedMaterial = landingMat;

                // Stairwell Landing Soft Illumination
                var lightObj = new GameObject($"StairLandingLight_L{level}");
                lightObj.transform.SetParent(levelObj.transform);
                lightObj.transform.localPosition = new Vector3(0, 3.5f, 0.5f);
                var lgt = lightObj.AddComponent<Light>();
                lgt.type = LightType.Point;
                lgt.range = 8.0f;
                lgt.color = new Color(1.0f, 0.95f, 0.85f);
                lgt.intensity = 1.2f;
                lgt.shadows = LightShadows.None;
            }

            return stairRoot;
        }

        public static GameObject BuildAnnexureStraightStaircase(Transform parent, string name, Vector3 origin,
            Material wallMat, Material treadMat, Material riserMat, Material railingMat,
            Material skirtingMat, Material beamMat)
        {
            var stairRoot = new GameObject(name);
            stairRoot.transform.SetParent(parent);
            stairRoot.transform.position = origin;

            for (int level = 0; level < 3; level++)
            {
                float baseY = level * 4.0f;
                var levelObj = new GameObject($"StraightFlight_Level_{level}_to_{level + 1}");
                levelObj.transform.SetParent(stairRoot.transform);
                levelObj.transform.localPosition = new Vector3(0, baseY, 0);

                // 1. Enclosing Side Walls (Photo 9.29.10 PM)
                // Left Wall (Solid wall with black skirting)
                var wallL = GameObject.CreatePrimitive(PrimitiveType.Cube);
                wallL.name = "AnnexStair_Wall_Left";
                wallL.transform.SetParent(levelObj.transform);
                wallL.transform.localPosition = new Vector3(-1.35f, 1.95f, 0.4f);
                wallL.transform.localScale = new Vector3(0.2f, 3.9f, 6.2f);
                wallL.GetComponent<Renderer>().sharedMaterial = wallMat;

                // Right Wall / Parapet
                var wallR = GameObject.CreatePrimitive(PrimitiveType.Cube);
                wallR.name = "AnnexStair_Wall_Right";
                wallR.transform.SetParent(levelObj.transform);
                wallR.transform.localPosition = new Vector3(1.35f, 1.95f, 0.4f);
                wallR.transform.localScale = new Vector3(0.2f, 3.9f, 6.2f);
                wallR.GetComponent<Renderer>().sharedMaterial = wallMat;

                // Protective Skirting
                CreateSkirting(levelObj.transform, "Skirting_L", new Vector3(-1.23f, 0.08f, 0.4f), new Vector3(0.04f, 0.16f, 6.0f), skirtingMat);
                CreateSkirting(levelObj.transform, "Skirting_R", new Vector3(1.23f, 0.08f, 0.4f), new Vector3(0.04f, 0.16f, 6.0f), skirtingMat);

                // Navy Blue Portal Entrance Columns (Photo 9.29.10 PM)
                var colL = GameObject.CreatePrimitive(PrimitiveType.Cube);
                colL.name = "Portal_Col_Left";
                colL.transform.SetParent(levelObj.transform);
                colL.transform.localPosition = new Vector3(-1.35f, 1.95f, -2.6f);
                colL.transform.localScale = new Vector3(0.4f, 3.9f, 0.4f);
                colL.GetComponent<Renderer>().sharedMaterial = beamMat;

                var colR = GameObject.CreatePrimitive(PrimitiveType.Cube);
                colR.name = "Portal_Col_Right";
                colR.transform.SetParent(levelObj.transform);
                colR.transform.localPosition = new Vector3(1.35f, 1.95f, -2.6f);
                colR.transform.localScale = new Vector3(0.4f, 3.9f, 0.4f);
                colR.GetComponent<Renderer>().sharedMaterial = beamMat;

                var lintel = GameObject.CreatePrimitive(PrimitiveType.Cube);
                lintel.name = "Portal_Lintel";
                lintel.transform.SetParent(levelObj.transform);
                lintel.transform.localPosition = new Vector3(0, 3.75f, -2.6f);
                lintel.transform.localScale = new Vector3(3.0f, 0.35f, 0.4f);
                lintel.GetComponent<Renderer>().sharedMaterial = beamMat;

                // 2. 16 steps climbing +Z from Y=0 to Y=4.0m
                BuildFlight(levelObj.transform, "StraightFlight",
                    new Vector3(0, 0, -2.4f),
                    steps: 16, stepWidth: 2.2f, treadDepth: 0.30f, riserHeight: 0.25f,
                    directionZ: 1.0f,
                    treadMat, riserMat, railingMat);

                // 3. Upper landing slab at Y = 4.0m connecting to corridor
                var topLanding = GameObject.CreatePrimitive(PrimitiveType.Cube);
                topLanding.name = "StraightTopLanding";
                topLanding.transform.SetParent(levelObj.transform);
                topLanding.transform.localPosition = new Vector3(0, 3.85f, 3.2f);
                topLanding.transform.localScale = new Vector3(2.4f, 0.30f, 1.6f);
                topLanding.GetComponent<Renderer>().sharedMaterial = treadMat;

                // Stair Landing Illumination Light
                var lightObj = new GameObject($"AnnexLandingLight_L{level}");
                lightObj.transform.SetParent(levelObj.transform);
                lightObj.transform.localPosition = new Vector3(0, 3.5f, 0.5f);
                var lgt = lightObj.AddComponent<Light>();
                lgt.type = LightType.Point;
                lgt.range = 8.0f;
                lgt.color = new Color(1.0f, 0.95f, 0.85f);
                lgt.intensity = 1.2f;
                lgt.shadows = LightShadows.None;
            }

            return stairRoot;
        }

        private static void BuildFlight(Transform parent, string name, Vector3 startPos,
            int steps, float stepWidth, float treadDepth, float riserHeight, float directionZ,
            Material treadMat, Material riserMat, Material railingMat)
        {
            var flightObj = new GameObject(name);
            flightObj.transform.SetParent(parent);
            flightObj.transform.localPosition = Vector3.zero;

            for (int i = 0; i < steps; i++)
            {
                float y = startPos.y + i * riserHeight;
                float z = startPos.z + i * treadDepth * directionZ;

                // Step Tread (Granite slab)
                var tread = GameObject.CreatePrimitive(PrimitiveType.Cube);
                tread.name = $"Tread_{i}";
                tread.transform.SetParent(flightObj.transform);
                tread.transform.localPosition = new Vector3(startPos.x, y + riserHeight - 0.02f, z);
                tread.transform.localScale = new Vector3(stepWidth, 0.04f, treadDepth + 0.02f);
                tread.GetComponent<Renderer>().sharedMaterial = treadMat;
                Object.DestroyImmediate(tread.GetComponent<BoxCollider>());

                // Step Riser (Vertical kickboard)
                var riser = GameObject.CreatePrimitive(PrimitiveType.Cube);
                riser.name = $"Riser_{i}";
                riser.transform.SetParent(flightObj.transform);
                riser.transform.localPosition = new Vector3(startPos.x, y + riserHeight * 0.5f - 0.02f, z - (treadDepth * 0.5f * directionZ));
                riser.transform.localScale = new Vector3(stepWidth * 0.98f, riserHeight - 0.04f, 0.04f);
                riser.GetComponent<Renderer>().sharedMaterial = riserMat;
                Object.DestroyImmediate(riser.GetComponent<BoxCollider>());
            }

            // Butter-smooth invisible ramp collider perfectly aligned with tread nosings
            float totalRun = steps * treadDepth;
            float totalHeight = steps * riserHeight;
            float rampLength = Mathf.Sqrt(totalRun * totalRun + totalHeight * totalHeight);
            float angleDeg = Mathf.Atan2(totalHeight, totalRun) * Mathf.Rad2Deg * directionZ;

            var rampColliderObj = new GameObject($"{name}_SmoothWalkingRamp");
            rampColliderObj.transform.SetParent(flightObj.transform);
            float midZ = startPos.z + (totalRun * 0.5f - treadDepth * 0.5f) * directionZ;
            float midY = startPos.y + totalHeight * 0.5f + 0.02f;
            rampColliderObj.transform.localPosition = new Vector3(startPos.x, midY, midZ);
            rampColliderObj.transform.localEulerAngles = new Vector3(-angleDeg, 0, 0);

            var boxCol = rampColliderObj.AddComponent<BoxCollider>();
            boxCol.size = new Vector3(stepWidth, 0.12f, rampLength);

            var rampPhysMat = new PhysicMaterial("StairRampPhysMat")
            {
                dynamicFriction = 0f,
                staticFriction = 0f,
                frictionCombine = PhysicMaterialCombine.Minimum,
                bounciness = 0f,
                bounceCombine = PhysicMaterialCombine.Minimum
            };
            boxCol.material = rampPhysMat;

            // Side Balustrade Railings (matching Photo 9.29.12 PM (1) with dark vertical bars)
            float railHalfW = stepWidth * 0.5f - 0.05f;
            CreateSideRailing(flightObj.transform, $"{name}_Railing_Inner",
                new Vector3(startPos.x + (directionZ > 0 ? railHalfW : -railHalfW), midY + 0.5f, midZ),
                angleDeg, rampLength, railingMat);
        }

        private static void CreateSideRailing(Transform parent, string name, Vector3 pos, float angleDeg, float length, Material railMat)
        {
            var railObj = new GameObject(name);
            railObj.transform.SetParent(parent);
            railObj.transform.localPosition = pos;
            railObj.transform.localEulerAngles = new Vector3(-angleDeg, 0, 0);

            // Handrail top bar
            var bar = GameObject.CreatePrimitive(PrimitiveType.Cube);
            bar.name = "HandrailBar";
            bar.transform.SetParent(railObj.transform);
            bar.transform.localPosition = Vector3.zero;
            bar.transform.localRotation = Quaternion.identity;
            bar.transform.localScale = new Vector3(0.06f, 0.06f, length);
            bar.GetComponent<Renderer>().sharedMaterial = railMat;

            // Vertical Balusters (Photo 9.29.12 PM (1))
            int balusterCount = Mathf.Max(4, (int)(length / 0.35f));
            for (int b = 0; b <= balusterCount; b++)
            {
                float t = (float)b / balusterCount;
                float localZ = -length * 0.5f + t * length;

                var post = GameObject.CreatePrimitive(PrimitiveType.Cube);
                post.name = $"Baluster_{b}";
                post.transform.SetParent(railObj.transform);
                post.transform.localPosition = new Vector3(0, -0.4f, localZ);
                post.transform.localRotation = Quaternion.identity;
                post.transform.localScale = new Vector3(0.03f, 0.8f, 0.03f);
                post.GetComponent<Renderer>().sharedMaterial = railMat;
                Object.DestroyImmediate(post.GetComponent<Collider>());
            }
        }

        private static void CreateSkirting(Transform parent, string name, Vector3 localPos, Vector3 localScale, Material mat)
        {
            var sk = GameObject.CreatePrimitive(PrimitiveType.Cube);
            sk.name = name;
            sk.transform.SetParent(parent);
            sk.transform.localPosition = localPos;
            sk.transform.localScale = localScale;
            sk.GetComponent<Renderer>().sharedMaterial = mat;
            Object.DestroyImmediate(sk.GetComponent<Collider>());
        }
    }
}
