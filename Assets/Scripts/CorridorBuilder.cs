using UnityEngine;

namespace StPaulsVR
{
    public static class CorridorBuilder
    {
        public static void BuildCampusCorridors(Transform parent,
            Material navyColMat, Material skirtingMat, Material lightBaseMat, Material lightEmissiveMat,
            Material signBlueMat, Material signGoldMat)
        {
            var corridorRoot = new GameObject("Corridor_Collegiate_Appointments");
            corridorRoot.transform.SetParent(parent);
            corridorRoot.transform.localPosition = Vector3.zero;

            // Build corridor architecture for all 4 floors: 0, 1, 2, 3
            for (int f = 0; f < 4; f++)
            {
                float baseY = f * 4.0f;
                var floorCorridors = new GameObject($"CorridorAppointments_Floor_{f}");
                floorCorridors.transform.SetParent(corridorRoot.transform);
                floorCorridors.transform.localPosition = new Vector3(0, baseY, 0);

                // 1. Main Block Structural Portal Columns, Tie-Beams & Skirting
                BuildMainCorridorColumns(floorCorridors.transform, navyColMat, skirtingMat, lightBaseMat, lightEmissiveMat);

                // 2. Annexure Structural Portal Columns & Beams
                BuildAnnexureCorridorColumns(floorCorridors.transform, navyColMat, skirtingMat, lightBaseMat, lightEmissiveMat);

                // 3. Ground Floor Main Entrance Foyer Appointments
                if (f == 0)
                {
                    BuildGroundFoyerAppointments(floorCorridors.transform, signBlueMat, signGoldMat);
                }
            }
        }

        private static void BuildMainCorridorColumns(Transform parent,
            Material navyColMat, Material skirtingMat, Material lightBaseMat, Material lightEmissiveMat)
        {
            var mainCols = new GameObject("MainBlock_PortalColumns");
            mainCols.transform.SetParent(parent);
            mainCols.transform.localPosition = Vector3.zero;

            float colH = 3.6f;

            // Front Corridor Columns & Ceiling Beams (Z = -2.0, X: -18 to +18)
            float[] frontX = new float[] { -18f, -12f, -6f, 6f, 12f, 18f };
            foreach (var cx in frontX)
            {
                // Vertical Column
                CreateColumn(mainCols.transform, $"Col_Front_{cx}", new Vector3(cx, colH * 0.5f, -2.0f), new Vector3(0.4f, colH, 0.4f), navyColMat);
                // Transverse Ceiling Tie-Beam spanning across corridor (Z: -2 to 2.5m, length 4.5m)
                CreateColumn(mainCols.transform, $"Beam_Front_{cx}", new Vector3(cx, colH - 0.15f, 0.25f), new Vector3(0.35f, 0.3f, 4.5f), navyColMat);
            }

            // Rear Corridor Columns & Ceiling Beams (Z = 34.0, X: -18 to +18)
            foreach (var cx in frontX)
            {
                CreateColumn(mainCols.transform, $"Col_Rear_{cx}", new Vector3(cx, colH * 0.5f, 34.0f), new Vector3(0.4f, colH, 0.4f), navyColMat);
                CreateColumn(mainCols.transform, $"Beam_Rear_{cx}", new Vector3(cx, colH - 0.15f, 31.75f), new Vector3(0.35f, 0.3f, 4.5f), navyColMat);
            }

            // West Corridor Columns & Ceiling Beams (X = -15.0, Z: 0 to 27)
            float[] westZ = new float[] { 0f, 9f, 18f, 27f };
            foreach (var cz in westZ)
            {
                CreateColumn(mainCols.transform, $"Col_West_{cz}", new Vector3(-15.0f, colH * 0.5f, cz), new Vector3(0.4f, colH, 0.4f), navyColMat);
                CreateColumn(mainCols.transform, $"Beam_West_{cz}", new Vector3(-13.0f, colH - 0.15f, cz), new Vector3(4.0f, 0.3f, 0.35f), navyColMat);
            }

            // East Corridor Columns & Ceiling Beams (X = 15.0, Z: 0 to 27)
            foreach (var cz in westZ)
            {
                CreateColumn(mainCols.transform, $"Col_East_{cz}", new Vector3(15.0f, colH * 0.5f, cz), new Vector3(0.4f, colH, 0.4f), navyColMat);
                CreateColumn(mainCols.transform, $"Beam_East_{cz}", new Vector3(13.0f, colH - 0.15f, cz), new Vector3(4.0f, 0.3f, 0.35f), navyColMat);
            }

            // Black Protective Granite Skirting (15cm high along corridor base)
            CreateSkirting(mainCols.transform, "Skirting_Front", new Vector3(0, 0.075f, -1.89f), new Vector3(42f, 0.15f, 0.04f), skirtingMat);
            CreateSkirting(mainCols.transform, "Skirting_Rear", new Vector3(0, 0.075f, 33.89f), new Vector3(42f, 0.15f, 0.04f), skirtingMat);
            CreateSkirting(mainCols.transform, "Skirting_West", new Vector3(-14.89f, 0.075f, 16f), new Vector3(0.04f, 0.15f, 36f), skirtingMat);
            CreateSkirting(mainCols.transform, "Skirting_East", new Vector3(14.89f, 0.075f, 16f), new Vector3(0.04f, 0.15f, 36f), skirtingMat);

            // Linear LED Tube Lights along corridor ceilings
            float ceilY = colH - 0.05f;
            for (float lx = -14.0f; lx <= 14.0f; lx += 5.5f)
            {
                CreateCeilingLightFixture(mainCols.transform, new Vector3(lx, ceilY, 0.25f), true, lightBaseMat, lightEmissiveMat);
                CreateCeilingLightFixture(mainCols.transform, new Vector3(lx, ceilY, 31.75f), true, lightBaseMat, lightEmissiveMat);
            }
            for (float lz = 3.0f; lz <= 28.0f; lz += 6.0f)
            {
                CreateCeilingLightFixture(mainCols.transform, new Vector3(-13.0f, ceilY, lz), false, lightBaseMat, lightEmissiveMat);
                CreateCeilingLightFixture(mainCols.transform, new Vector3(13.0f, ceilY, lz), false, lightBaseMat, lightEmissiveMat);
            }
        }

        private static void BuildAnnexureCorridorColumns(Transform parent,
            Material navyColMat, Material skirtingMat, Material lightBaseMat, Material lightEmissiveMat)
        {
            var annCols = new GameObject("Annexure_PortalColumns");
            annCols.transform.SetParent(parent);
            annCols.transform.localPosition = Vector3.zero;

            float colH = 3.6f;

            // Columns and Beams along Annexure Corridor (X: -37 to -33, Z: -4 to 40)
            // Note: Omit Z = 0 to 6m to ensure 100% unobstructed vertical clearance above the straight staircase
            float[] annZ = new float[] { -4f, 8f, 16f, 24f, 32f, 40f };
            foreach (var cz in annZ)
            {
                CreateColumn(annCols.transform, $"Col_AnnE_{cz}", new Vector3(-33.0f, colH * 0.5f, cz), new Vector3(0.4f, colH, 0.4f), navyColMat);
                CreateColumn(annCols.transform, $"Col_AnnW_{cz}", new Vector3(-37.0f, colH * 0.5f, cz), new Vector3(0.4f, colH, 0.4f), navyColMat);
                CreateColumn(annCols.transform, $"Beam_Ann_{cz}", new Vector3(-35.0f, colH - 0.15f, cz), new Vector3(4.0f, 0.3f, 0.35f), navyColMat);
            }

            // Skirting along Annexure Corridor (along room wall at X = -36.92)
            CreateSkirting(annCols.transform, "Skirting_Annexure", new Vector3(-36.92f, 0.075f, 18f), new Vector3(0.04f, 0.15f, 52f), skirtingMat);

            // Ceiling Lights along Annexure Corridor (skip over stairwell void Z: -1 to 6)
            float ceilY = colH - 0.05f;
            for (float lz = -4.0f; lz <= 40.0f; lz += 6.0f)
            {
                if (lz >= -1.0f && lz <= 6.0f) continue;
                CreateCeilingLightFixture(annCols.transform, new Vector3(-35.0f, ceilY, lz), false, lightBaseMat, lightEmissiveMat);
            }
        }

        private static void BuildGroundFoyerAppointments(Transform parent, Material signBlueMat, Material signGoldMat)
        {
            var foyer = new GameObject("Main_Entrance_Foyer_Appointments");
            foyer.transform.SetParent(parent);
            foyer.transform.localPosition = Vector3.zero;

            // 1. CSE Department Dedication & Floor Directory Board (Photo 9.29.08 PM & 9.29.09 PM)
            var dirBoard = GameObject.CreatePrimitive(PrimitiveType.Cube);
            dirBoard.name = "FloorDirectoryBoard";
            dirBoard.transform.SetParent(foyer.transform);
            dirBoard.transform.localPosition = new Vector3(-3.2f, 1.8f, -1.8f);
            dirBoard.transform.localScale = new Vector3(2.4f, 1.6f, 0.08f);
            dirBoard.GetComponent<Renderer>().sharedMaterial = signBlueMat;

            var boardTextObj = new GameObject("DirectoryText");
            boardTextObj.transform.SetParent(dirBoard.transform);
            boardTextObj.transform.localPosition = new Vector3(0, 0, -0.6f);
            boardTextObj.transform.localRotation = Quaternion.identity;
            var textMesh = boardTextObj.AddComponent<TextMesh>();
            textMesh.text = "ST. PAUL'S BLOCK\nCAMPUS DIRECTORY\n\n3F: Web 3.0 / Gen AI Lab\n2F: Machine Vision / Server Room\n1F: Design Thinking Lab / Bridge\nGF: CSS Lab / Dean / HOD";
            textMesh.fontSize = 20;
            textMesh.characterSize = 0.013f;
            textMesh.alignment = TextAlignment.Center;
            textMesh.anchor = TextAnchor.MiddleCenter;
            textMesh.color = new Color(0.98f, 0.85f, 0.25f);
        }

        private static void CreateColumn(Transform parent, string name, Vector3 pos, Vector3 size, Material mat)
        {
            var col = GameObject.CreatePrimitive(PrimitiveType.Cube);
            col.name = name;
            col.transform.SetParent(parent);
            col.transform.localPosition = pos;
            col.transform.localScale = size;
            col.GetComponent<Renderer>().sharedMaterial = mat;
        }

        private static void CreateSkirting(Transform parent, string name, Vector3 pos, Vector3 size, Material mat)
        {
            var skirt = GameObject.CreatePrimitive(PrimitiveType.Cube);
            skirt.name = name;
            skirt.transform.SetParent(parent);
            skirt.transform.localPosition = pos;
            skirt.transform.localScale = size;
            skirt.GetComponent<Renderer>().sharedMaterial = mat;
        }

        private static void CreateCeilingLightFixture(Transform parent, Vector3 localPos, bool alignX, Material baseMat, Material emissiveMat)
        {
            var fixture = new GameObject("Linear_LED_TubeLight");
            fixture.transform.SetParent(parent);
            fixture.transform.localPosition = localPos;

            var baseObj = GameObject.CreatePrimitive(PrimitiveType.Cube);
            baseObj.name = "Housing";
            baseObj.transform.SetParent(fixture.transform);
            baseObj.transform.localPosition = new Vector3(0, 0.02f, 0);
            baseObj.transform.localScale = alignX ? new Vector3(1.3f, 0.04f, 0.15f) : new Vector3(0.15f, 0.04f, 1.3f);
            baseObj.GetComponent<Renderer>().sharedMaterial = baseMat;
            Object.DestroyImmediate(baseObj.GetComponent<Collider>());

            var tube = GameObject.CreatePrimitive(PrimitiveType.Cube);
            tube.name = "EmissiveTube";
            tube.transform.SetParent(fixture.transform);
            tube.transform.localPosition = new Vector3(0, -0.01f, 0);
            tube.transform.localScale = alignX ? new Vector3(1.2f, 0.02f, 0.10f) : new Vector3(0.10f, 0.02f, 1.2f);
            tube.GetComponent<Renderer>().sharedMaterial = emissiveMat;
            Object.DestroyImmediate(tube.GetComponent<Collider>());
        }
    }
}
