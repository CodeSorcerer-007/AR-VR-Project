using System.Collections.Generic;
using UnityEngine;

namespace StPaulsVR
{
    public class CinematicTour : MonoBehaviour
    {
        public bool isTourActive = false;
        public float moveSpeed = 6.0f;
        public float rotSpeed = 3.0f;

        private Camera playerCamera;
        private FirstPersonController fpController;
        private Rigidbody rb;
        private int currentWaypointIndex = 0;
        private List<Waypoint> waypoints = new List<Waypoint>();

        private struct Waypoint
        {
            public Vector3 position;
            public Vector3 lookAt;
            public string description;
            public float waitDuration;

            public Waypoint(Vector3 pos, Vector3 look, string desc, float wait = 3.5f)
            {
                position = pos;
                lookAt = look;
                description = desc;
                waitDuration = wait;
            }
        }

        private float currentWaitTimer = 0f;

        private void Start()
        {
            fpController = GetComponent<FirstPersonController>();
            rb = GetComponent<Rigidbody>();
            if (fpController != null)
            {
                playerCamera = fpController.playerCamera;
            }
            if (playerCamera == null)
            {
                playerCamera = Camera.main;
            }

            SetupTourWaypoints();
        }

        private void SetupTourWaypoints()
        {
            waypoints.Clear();
            // 1. Campus Aerial Panorama
            waypoints.Add(new Waypoint(new Vector3(-16f, 26f, -38f), new Vector3(-16f, 8f, 16f), "Aerial Panorama: St. Paul's Main Block & Annexure Block", 4.0f));
            // 2. Entrance Portico
            waypoints.Add(new Waypoint(new Vector3(0f, 2.2f, -15f), new Vector3(0f, 2.2f, -8f), "Grand Entrance Portico & Tuscan Columns", 3.5f));
            // 3. Ground Corridor
            waypoints.Add(new Waypoint(new Vector3(0f, 1.65f, -1.0f), new Vector3(0f, 1.65f, 10f), "Ground Floor Grand Corridor Spine", 3.0f));
            // 4. CSS Flagship Lab
            waypoints.Add(new Waypoint(new Vector3(0f, 1.65f, 12f), new Vector3(0f, 1.65f, 20f), "Flagship CSS Lab — High Capacity Workstations", 4.0f));
            // 5. 1st Floor Bridge
            waypoints.Add(new Waypoint(new Vector3(-27f, 5.65f, 1.5f), new Vector3(-43f, 5.65f, 1.5f), "1st Floor Pedestrian Bridge to Annexure Block", 4.0f));
            // 6. Annexure 3rd Floor Gen AI Lab
            waypoints.Add(new Waypoint(new Vector3(-45f, 13.65f, 6f), new Vector3(-45f, 13.65f, 14f), "Annexure 3rd Floor: Gen AI Research Laboratory", 4.0f));
            // 7. Rooftop Signage
            waypoints.Add(new Waypoint(new Vector3(0f, 18.5f, -18f), new Vector3(0f, 18.2f, -8f), "Rooftop Parapet: ST. PAUL'S BLOCK Gold Lettering", 4.5f));
        }

        private void Update()
        {
            // Toggle Tour with 'T'
            if (Input.GetKeyDown(KeyCode.T))
            {
                if (isTourActive) StopTour();
                else StartTour();
            }

            if (isTourActive)
            {
                // Cancel tour if user presses any movement key
                if (Input.GetKeyDown(KeyCode.W) || Input.GetKeyDown(KeyCode.S) ||
                    Input.GetKeyDown(KeyCode.D) || Input.GetKeyDown(KeyCode.Space))
                {
                    StopTour();
                    return;
                }

                ExecuteTourStep();
            }
        }

        public void StartTour()
        {
            if (waypoints.Count == 0) SetupTourWaypoints();
            isTourActive = true;
            currentWaypointIndex = 0;
            currentWaitTimer = 0f;

            if (fpController != null)
            {
                fpController.enabled = false;
            }
            // Kill rigidbody physics so tour can move freely through the air
            if (rb != null)
            {
                rb.isKinematic = true;
                rb.velocity = Vector3.zero;
            }

            Debug.Log("[CinematicTour] Tour started.");
        }

        public void StopTour()
        {
            isTourActive = false;
            if (rb != null)
            {
                rb.isKinematic = false;
            }
            if (fpController != null)
            {
                fpController.enabled = true;
            }
            Debug.Log("[CinematicTour] Tour stopped.");
        }

        private void ExecuteTourStep()
        {
            if (currentWaypointIndex >= waypoints.Count)
            {
                StopTour();
                return;
            }

            var wp = waypoints[currentWaypointIndex];

            // Smoothly move player position (kinematic, so direct transform is fine)
            transform.position = Vector3.Lerp(transform.position, wp.position, Time.deltaTime * moveSpeed);

            // Smoothly rotate camera towards lookAt
            if (playerCamera != null)
            {
                Vector3 targetDir = (wp.lookAt - transform.position).normalized;
                if (targetDir.sqrMagnitude > 0.001f)
                {
                    Quaternion targetRot = Quaternion.LookRotation(targetDir);
                    transform.rotation = Quaternion.Slerp(transform.rotation, Quaternion.Euler(0, targetRot.eulerAngles.y, 0), Time.deltaTime * rotSpeed);
                    playerCamera.transform.localRotation = Quaternion.Slerp(playerCamera.transform.localRotation, Quaternion.Euler(targetRot.eulerAngles.x, 0, 0), Time.deltaTime * rotSpeed);
                }
            }

            float dist = Vector3.Distance(transform.position, wp.position);
            if (dist < 1.0f)
            {
                currentWaitTimer += Time.deltaTime;
                if (currentWaitTimer >= wp.waitDuration)
                {
                    currentWaitTimer = 0f;
                    currentWaypointIndex++;
                }
            }
        }

        public string GetCurrentTourDescription()
        {
            if (!isTourActive || currentWaypointIndex >= waypoints.Count) return string.Empty;
            return waypoints[currentWaypointIndex].description;
        }
    }
}
