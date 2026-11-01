using UnityEngine;

namespace StPaulsVR
{
    public class DoorController : MonoBehaviour
    {
        [Header("Door Identification")]
        public string roomNumber = "401";
        public string roomName = "Classroom";
        public bool isRightHinged = false;

        [Header("Proximity Settings")]
        public float openDistance = 2.6f;
        public float swingAngle = 90.0f;
        public float swingSpeed = 4.0f;

        [Header("References")]
        public Transform hingeTransform;
        public Transform playerTransform;

        private float currentAngle = 0.0f;
        private float targetAngle = 0.0f;

        public static Transform GlobalPlayerTransform;

        private void Start()
        {
            if (GlobalPlayerTransform != null)
            {
                playerTransform = GlobalPlayerTransform;
            }
            else if (playerTransform == null)
            {
                var player = FindObjectOfType<FirstPersonController>();
                if (player != null)
                {
                    playerTransform = player.transform;
                    GlobalPlayerTransform = playerTransform;
                }
                else if (Camera.main != null)
                {
                    playerTransform = Camera.main.transform;
                    GlobalPlayerTransform = playerTransform;
                }
            }
        }

        private void Update()
        {
            if (playerTransform == null)
            {
                if (GlobalPlayerTransform != null)
                    playerTransform = GlobalPlayerTransform;
                else
                    return;
            }

            float dist = Vector3.Distance(transform.position, playerTransform.position);
            bool shouldOpen = dist <= openDistance;

            float target = shouldOpen ? (isRightHinged ? -swingAngle : swingAngle) : 0.0f;
            targetAngle = target;

            currentAngle = Mathf.Lerp(currentAngle, targetAngle, Time.deltaTime * swingSpeed);

            if (hingeTransform != null)
            {
                hingeTransform.localEulerAngles = new Vector3(0, currentAngle, 0);
            }
        }

        public static GameObject CreateDoorFixture(Transform parent, Vector3 localPos, Quaternion localRot, string roomNo, string rName, Material woodMat, Material frameMat, Material handleMat, Material placardMat, bool rightHinged = false)
        {
            var doorObj = new GameObject($"Door_{roomNo}");
            doorObj.transform.SetParent(parent);
            doorObj.transform.localPosition = localPos;
            doorObj.transform.localRotation = localRot;

            var ctrl = doorObj.AddComponent<DoorController>();
            ctrl.roomNumber = roomNo;
            ctrl.roomName = rName;
            ctrl.isRightHinged = rightHinged;

            float doorW = 1.0f;
            float doorH = 2.2f;
            float frameT = 0.06f;
            float wallD = 0.22f;

            // 1. Door Frame Jambs
            // Left Jamb
            var leftJamb = GameObject.CreatePrimitive(PrimitiveType.Cube);
            leftJamb.name = "LeftJamb";
            leftJamb.transform.SetParent(doorObj.transform);
            leftJamb.transform.localPosition = new Vector3(-doorW * 0.5f - frameT * 0.5f, doorH * 0.5f, 0);
            leftJamb.transform.localScale = new Vector3(frameT, doorH, wallD);
            leftJamb.GetComponent<Renderer>().sharedMaterial = frameMat;

            // Right Jamb
            var rightJamb = GameObject.CreatePrimitive(PrimitiveType.Cube);
            rightJamb.name = "RightJamb";
            rightJamb.transform.SetParent(doorObj.transform);
            rightJamb.transform.localPosition = new Vector3(doorW * 0.5f + frameT * 0.5f, doorH * 0.5f, 0);
            rightJamb.transform.localScale = new Vector3(frameT, doorH, wallD);
            rightJamb.GetComponent<Renderer>().sharedMaterial = frameMat;

            // Top Header
            var header = GameObject.CreatePrimitive(PrimitiveType.Cube);
            header.name = "DoorHeader";
            header.transform.SetParent(doorObj.transform);
            header.transform.localPosition = new Vector3(0, doorH + frameT * 0.5f, 0);
            header.transform.localScale = new Vector3(doorW + frameT * 2, frameT, wallD);
            header.GetComponent<Renderer>().sharedMaterial = frameMat;

            // 2. Hinge & Door Leaf
            var hinge = new GameObject("DoorHinge");
            hinge.transform.SetParent(doorObj.transform);
            float hingeX = rightHinged ? (doorW * 0.5f) : (-doorW * 0.5f);
            hinge.transform.localPosition = new Vector3(hingeX, 0, 0);
            ctrl.hingeTransform = hinge.transform;

            var leaf = GameObject.CreatePrimitive(PrimitiveType.Cube);
            leaf.name = "DoorLeaf";
            leaf.transform.SetParent(hinge.transform);
            float leafOffsetX = rightHinged ? (-doorW * 0.5f) : (doorW * 0.5f);
            leaf.transform.localPosition = new Vector3(leafOffsetX, doorH * 0.5f, 0);
            leaf.transform.localScale = new Vector3(doorW * 0.98f, doorH * 0.98f, 0.05f);
            leaf.GetComponent<Renderer>().sharedMaterial = woodMat;

            // Metal Lever Handle
            var handle = GameObject.CreatePrimitive(PrimitiveType.Cube);
            handle.name = "DoorHandle";
            handle.transform.SetParent(leaf.transform);
            float handleX = rightHinged ? (-0.4f) : 0.4f;
            handle.transform.localPosition = new Vector3(handleX, -0.1f, -0.04f);
            handle.transform.localScale = new Vector3(0.12f, 0.03f, 0.08f);
            handle.GetComponent<Renderer>().sharedMaterial = handleMat;

            // 3. Room Placard Plate above doorway
            var placard = GameObject.CreatePrimitive(PrimitiveType.Cube);
            placard.name = "RoomPlacard";
            placard.transform.SetParent(doorObj.transform);
            placard.transform.localPosition = new Vector3(0, doorH + 0.25f, -wallD * 0.5f - 0.015f);
            placard.transform.localScale = new Vector3(0.65f, 0.24f, 0.02f);
            placard.GetComponent<Renderer>().sharedMaterial = placardMat;

            // Placard Text
            var textObj = new GameObject("PlacardText");
            textObj.transform.SetParent(placard.transform);
            textObj.transform.localPosition = new Vector3(0, 0, -0.6f);
            textObj.transform.localRotation = Quaternion.identity;
            var textMesh = textObj.AddComponent<TextMesh>();
            textMesh.text = $"{roomNo}\n{rName}";
            textMesh.fontSize = 28;
            textMesh.characterSize = 0.012f;
            textMesh.alignment = TextAlignment.Center;
            textMesh.anchor = TextAnchor.MiddleCenter;
            textMesh.color = new Color(0.1f, 0.15f, 0.35f);

            return doorObj;
        }
    }
}
