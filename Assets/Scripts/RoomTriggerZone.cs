using UnityEngine;

namespace StPaulsVR
{
    public class RoomTriggerZone : MonoBehaviour
    {
        public bool isBridge = false;
        public string bridgeName = "";
        public RoomDefinition roomInfo;

        private void OnTriggerEnter(Collider other)
        {
            if (other.CompareTag("Player") || other.GetComponent<FirstPersonController>() != null)
            {
                var hud = FindObjectOfType<CampusHUD>();
                if (hud != null)
                {
                    if (isBridge)
                    {
                        hud.SetBridgeAlert(bridgeName);
                    }
                    else
                    {
                        hud.UpdateRoomDisplay(roomInfo);
                    }
                }
            }
        }

        private void OnTriggerExit(Collider other)
        {
            if (other.CompareTag("Player") || other.GetComponent<FirstPersonController>() != null)
            {
                var hud = FindObjectOfType<CampusHUD>();
                if (hud != null)
                {
                    hud.ClearRoomDisplay();
                }
            }
        }
    }
}
