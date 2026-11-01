using UnityEngine;

namespace StPaulsVR
{
    public class CampusHUD : MonoBehaviour
    {
        public static CampusHUD Instance { get; private set; }

        private bool hasActiveRoom = false;
        private RoomDefinition currentRoom;
        private string activeBridge = "";
        private float bridgeAlertTimer = 0f;
        public bool showHelpModal = false;

        private void Awake()
        {
            Instance = this;
        }

        public static bool IsMouseOverUI()
        {
            Vector2 m = Input.mousePosition;
            float mx = m.x;
            float my = Screen.height - m.y; // Convert bottom-up GUI coordinates

            // 1. Top-Right Navigation Panel: Rect(Screen.width - 325, 15, 310, 330)
            Rect navRect = new Rect(Screen.width - 325, 15, 310, 330);
            if (navRect.Contains(new Vector2(mx, my))) return true;

            // 2. Top-Left Badge: Rect(15, 15, 380, 150)
            Rect badgeRect = new Rect(15, 15, 380, 150);
            if (badgeRect.Contains(new Vector2(mx, my))) return true;

            // 3. Bottom-Left Locomotion Controls: Rect(15, Screen.height - 150, 340, 135)
            Rect locoRect = new Rect(15, Screen.height - 150, 340, 135);
            if (locoRect.Contains(new Vector2(mx, my))) return true;

            // 4. Center Hint Banner (Bottom-Center)
            float hintW = 460;
            float hintH = 50;
            Rect hintRect = new Rect((Screen.width - hintW) * 0.5f, Screen.height - 58, hintW, hintH);
            if (hintRect.Contains(new Vector2(mx, my))) return true;

            // 5. Help Modal
            if (Instance != null && Instance.showHelpModal)
            {
                Rect modalRect = new Rect((Screen.width - 500) * 0.5f, (Screen.height - 340) * 0.5f, 500, 340);
                if (modalRect.Contains(new Vector2(mx, my))) return true;
            }

            return false;
        }

        private FirstPersonController player;
        private CinematicTour tour;

        private void Start()
        {
            player = FindObjectOfType<FirstPersonController>();
            tour = FindObjectOfType<CinematicTour>();
        }

        private void Update()
        {
            if (tour == null) tour = FindObjectOfType<CinematicTour>();

            if (bridgeAlertTimer > 0f)
            {
                bridgeAlertTimer -= Time.deltaTime;
                if (bridgeAlertTimer <= 0f)
                {
                    activeBridge = "";
                }
            }

            if (Input.GetKeyDown(KeyCode.H))
            {
                showHelpModal = !showHelpModal;
            }

            HandleQuickTeleports();
        }

        private void HandleQuickTeleports()
        {
            if (player == null) return;
            if (tour != null && tour.isTourActive) return; // Don't interrupt tour with teleport unless cancelled

            // Teleport Y formula: floor_slab_top + capsule_bottom_offset(0.55) + safety_margin(0.05) = floor + 0.60
            // Ground floor slab top = Y:0   → spawn Y = 0.60
            // 1st floor slab top   = Y:4.0  → spawn Y = 4.60
            // 2nd floor slab top   = Y:8.0  → spawn Y = 8.60
            // 3rd floor slab top   = Y:12.0 → spawn Y = 12.60

            // 'G' = Ground Floor Main Entrance Approach
            if (Input.GetKeyDown(KeyCode.G))
            {
                player.TeleportTo(new Vector3(0f, 0.60f, -12.0f), Quaternion.Euler(0, 0, 0));
                Debug.Log("[CampusHUD] Teleported to Ground Floor Main Entrance.");
            }
            // '1' = First Floor Bridge Entrance (Room 418)
            else if (Input.GetKeyDown(KeyCode.Alpha1))
            {
                player.TeleportTo(new Vector3(-15.0f, 4.60f, 1.5f), Quaternion.Euler(0, -90, 0));
                Debug.Log("[CampusHUD] Teleported to 1st Floor Bridge Entrance.");
            }
            // '2' = Second Floor Bridge (Room 434)
            else if (Input.GetKeyDown(KeyCode.Alpha2))
            {
                player.TeleportTo(new Vector3(-15.0f, 8.60f, 1.5f), Quaternion.Euler(0, -90, 0));
                Debug.Log("[CampusHUD] Teleported to 2nd Floor Bridge Entrance.");
            }
            // '3' = Third Floor
            else if (Input.GetKeyDown(KeyCode.Alpha3))
            {
                player.TeleportTo(new Vector3(0f, 12.60f, 2.0f), Quaternion.Euler(0, 0, 0));
                Debug.Log("[CampusHUD] Teleported to 3rd Floor.");
            }
            // 'B' = On the Connecting Bridge (bridge deck at Y=4.0 → spawn Y=4.60)
            else if (Input.GetKeyDown(KeyCode.B))
            {
                player.TeleportTo(new Vector3(-27.0f, 4.60f, 1.5f), Quaternion.Euler(0, -90, 0));
                SetBridgeAlert("First-Floor Pedestrian Bridge (Open-Air)");
            }
            // 'N' = Annexure Veranda (was 'A' — changed to avoid WASD strafe conflict!)
            else if (Input.GetKeyDown(KeyCode.N))
            {
                player.TeleportTo(new Vector3(-35.0f, 0.60f, 2.5f), Quaternion.Euler(0, -90, 0));
                Debug.Log("[CampusHUD] Teleported to Annexure Veranda & Dogleg Staircase Entryway.");
            }
            // 'R' = Reset to Ground Floor Entrance
            else if (Input.GetKeyDown(KeyCode.R))
            {
                player.TeleportTo(new Vector3(0f, 0.60f, -12.0f), Quaternion.Euler(0, 0, 0));
                Debug.Log("[CampusHUD] Reset to Ground Floor Main Entrance.");
            }
        }

        public void UpdateRoomDisplay(RoomDefinition room)
        {
            currentRoom = room;
            hasActiveRoom = true;
        }

        public void ClearRoomDisplay()
        {
            hasActiveRoom = false;
        }

        public void SetBridgeAlert(string bridgeName)
        {
            activeBridge = bridgeName;
            bridgeAlertTimer = 5.0f;
        }

        private void OnGUI()
        {
            GUI.skin.box.fontSize = 13;
            GUI.skin.label.fontSize = 13;

            // 1. Top-Center Tour Indicator
            if (tour != null && tour.isTourActive)
            {
                float tourW = 600;
                float tourH = 70;
                Rect tourRect = new Rect((Screen.width - tourW) * 0.5f, 20, tourW, tourH);
                GUI.color = new Color(0.1f, 0.15f, 0.25f, 0.95f);
                GUI.Box(tourRect, "");
                GUI.color = Color.cyan;
                GUI.skin.label.alignment = TextAnchor.MiddleCenter;
                GUI.Label(new Rect(tourRect.x, tourRect.y + 5, tourW, 25), "<b>★ AUTOMATED CINEMATIC TOUR IN PROGRESS ★</b>");
                GUI.color = Color.white;
                GUI.Label(new Rect(tourRect.x, tourRect.y + 30, tourW, 35), $"<b>{tour.GetCurrentTourDescription()}</b>\n<i>Press [T] or [W/A/S/D] to exit tour</i>");
                GUI.skin.label.alignment = TextAnchor.UpperLeft;
                return;
            }

            // 2. Top-Left: Active Room / Space Badge
            if (hasActiveRoom)
            {
                GUILayout.BeginArea(new Rect(20, 20, 360, 140), GUI.skin.box);
                GUI.color = Color.cyan;
                GUILayout.Label($"<b>LOCATION: {currentRoom.block.ToUpper()} BLOCK - {currentRoom.floor.ToUpper()} FLOOR</b>");
                GUI.color = Color.white;
                GUILayout.Label($"<b>Room:</b> {currentRoom.number}");
                GUILayout.Label($"<b>Name:</b> {currentRoom.name}");
                GUILayout.Label($"<b>Category:</b> {currentRoom.category.ToUpper()} | <b>Capacity:</b> {currentRoom.capacity}");
                GUILayout.EndArea();
            }
            else
            {
                GUILayout.BeginArea(new Rect(20, 20, 320, 65), GUI.skin.box);
                GUI.color = new Color(0.98f, 0.85f, 0.25f);
                GUILayout.Label("<b>ST. PAUL'S CAMPUS DIGITAL TWIN</b>");
                GUI.color = Color.white;
                GUILayout.Label("Grand Corridor / Outdoor Grounds");
                GUILayout.EndArea();
            }

            // 3. Top-Right: Quick Floor Teleport Controls & Tour Trigger (Clickable buttons + Keyboard shortcuts)
            GUILayout.BeginArea(new Rect(Screen.width - 320, 20, 300, 320), GUI.skin.box);
            GUI.color = Color.green;
            GUILayout.Label("<b>INSTANT TELEPORTATION & TOUR</b>");
            GUI.color = Color.white;

            if (GUILayout.Button(Cursor.lockState == CursorLockMode.Locked ? "<b>[ESC]</b> Release Mouse Pointer" : "<b>[CLICK VIEW]</b> Lock Mouse POV"))
            {
                if (player != null)
                {
                    player.SetCursorLock(Cursor.lockState != CursorLockMode.Locked);
                }
            }

            if (GUILayout.Button("<b>[G]</b> Ground Floor Entrance"))
            {
                player.TeleportTo(new Vector3(0f, 0.60f, -12.0f), Quaternion.Euler(0, 0, 0));
            }
            if (GUILayout.Button("<b>[1]</b> 1st Floor Bridge (Room 418)"))
            {
                player.TeleportTo(new Vector3(-15.0f, 4.60f, 1.5f), Quaternion.Euler(0, -90, 0));
            }
            if (GUILayout.Button("<b>[2]</b> 2nd Floor Bridge (Room 434)"))
            {
                player.TeleportTo(new Vector3(-15.0f, 8.60f, 1.5f), Quaternion.Euler(0, -90, 0));
            }
            if (GUILayout.Button("<b>[3]</b> 3rd Floor Spine"))
            {
                player.TeleportTo(new Vector3(0f, 12.60f, 2.0f), Quaternion.Euler(0, 0, 0));
            }
            if (GUILayout.Button("<b>[B]</b> Walk on Connecting Bridge"))
            {
                player.TeleportTo(new Vector3(-27.0f, 4.60f, 1.5f), Quaternion.Euler(0, -90, 0));
                SetBridgeAlert("First-Floor Pedestrian Bridge (Open-Air)");
            }
            if (GUILayout.Button("<b>[N]</b> Annexure Veranda"))
            {
                player.TeleportTo(new Vector3(-35.0f, 0.60f, 2.5f), Quaternion.Euler(0, -90, 0));
            }
            if (GUILayout.Button("<b>[T]</b> Launch Cinematic Tour"))
            {
                if (tour != null) tour.StartTour();
            }
            if (GUILayout.Button("<b>[R]</b> Reset to Main Entrance"))
            {
                player.TeleportTo(new Vector3(0f, 0.60f, -12.0f), Quaternion.Euler(0, 0, 0));
            }
            GUILayout.EndArea();

            // 4. Bottom-Left: Locomotion Controls Help
            GUILayout.BeginArea(new Rect(20, Screen.height - 140, 320, 120), GUI.skin.box);
            GUI.color = Color.white;
            GUILayout.Label("<b>CONTROLS (Syllabus Locomotion)</b>");
            GUILayout.Label("<b>W/A/S/D:</b> Walk (2.0 m/s)");
            GUILayout.Label("<b>Left Shift:</b> Sprint (4.0 m/s)");
            GUILayout.Label("<b>Left/Right Click:</b> Lock Mouse POV");
            GUILayout.Label("<b>Space:</b> Jump | <b>ESC:</b> Toggle Mouse");
            GUILayout.EndArea();

            // 4b. Center Hint if Cursor is Unlocked
            if (Cursor.lockState != CursorLockMode.Locked)
            {
                float hintW = 440;
                float hintH = 34;
                Rect hintRect = new Rect((Screen.width - hintW) * 0.5f, Screen.height - 50, hintW, hintH);
                GUI.color = new Color(0.1f, 0.1f, 0.1f, 0.85f);
                GUI.Box(hintRect, "");
                GUI.color = Color.yellow;
                GUI.skin.label.alignment = TextAnchor.MiddleCenter;
                GUI.Label(hintRect, "★ Click 3D view to look around | Press [ESC] to release mouse ★");
                GUI.skin.label.alignment = TextAnchor.UpperLeft;
                GUI.color = Color.white;
            }

            // 5. Center Alert Banner: Bridge Crossing
            if (!string.IsNullOrEmpty(activeBridge))
            {
                float bannerW = 520;
                float bannerH = 65;
                Rect bannerRect = new Rect((Screen.width - bannerW) * 0.5f, 90, bannerW, bannerH);
                GUI.color = new Color(0.15f, 0.45f, 0.85f, 0.95f);
                GUI.Box(bannerRect, "");
                GUI.color = Color.white;
                GUI.skin.label.alignment = TextAnchor.MiddleCenter;
                GUI.skin.label.fontSize = 15;
                GUI.Label(bannerRect, $"<b>PEDESTRIAN BRIDGE CROSSING (OPEN-AIR)</b>\n{activeBridge}");
                GUI.skin.label.alignment = TextAnchor.UpperLeft;
                GUI.skin.label.fontSize = 13;
            }

            // 6. Help Modal
            if (showHelpModal)
            {
                float mw = 480;
                float mh = 320;
                Rect modalRect = new Rect((Screen.width - mw) * 0.5f, (Screen.height - mh) * 0.5f, mw, mh);
                GUI.color = new Color(0.08f, 0.12f, 0.20f, 0.98f);
                GUI.Box(modalRect, "");
                GUI.color = Color.cyan;
                GUI.skin.label.alignment = TextAnchor.MiddleCenter;
                GUI.Label(new Rect(modalRect.x, modalRect.y + 15, mw, 30), "<b>ST. PAUL'S VR — PRESENTATION CONTROLS GUIDE</b>");
                GUI.skin.label.alignment = TextAnchor.UpperLeft;
                GUI.color = Color.white;
                GUILayout.BeginArea(new Rect(modalRect.x + 25, modalRect.y + 55, mw - 50, mh - 70));
                GUILayout.Label("• <b>Walk & Look:</b> WASD to move, Mouse to look around.");
                GUILayout.Label("• <b>Sprint:</b> Hold Left Shift for 4.0 m/s collegiate sprint.");
                GUILayout.Label("• <b>Proximity Doors:</b> Walk within 2.5m of any classroom or lab to smoothly open the door.");
                GUILayout.Label("• <b>Connecting Bridges:</b> Walk across the open-air bridges on 1st & 2nd floors between Main and Annexure.");
                GUILayout.Label("• <b>Stairwells:</b> Physically climb the West/East dogleg stairs or Annexure straight stairs.");
                GUILayout.Label("• <b>Cinematic Flythrough:</b> Press [T] anytime for an automated tour.");
                GUILayout.Label("• <b>Annexure:</b> Press [N] to teleport to Annexure Veranda (not [A] — that strafes!).");
                GUILayout.Label("• <b>Close this guide:</b> Press [H].");
                GUILayout.EndArea();
            }
        }
    }
}
