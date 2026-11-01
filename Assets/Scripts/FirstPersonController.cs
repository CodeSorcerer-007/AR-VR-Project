using UnityEngine;

namespace StPaulsVR
{
    [RequireComponent(typeof(Rigidbody))]
    [RequireComponent(typeof(CapsuleCollider))]
    public class FirstPersonController : MonoBehaviour
    {
        [Header("Locomotion (Syllabus Unit 2 Speeds)")]
        [Tooltip("Standard walking speed in m/s (Human perception range 1.4 - 3.0 m/s)")]
        public float walkSpeed = 2.0f;
        [Tooltip("Sprint speed in m/s")]
        public float sprintSpeed = 4.0f;
        public float jumpForce = 4.5f;

        [Header("Stair & Slope Climbing")]
        public float maxSlopeAngle = 55.0f;
        public float stepHeight = 0.28f;
        public float stepSmooth = 0.12f;

        [Header("Look Settings")]
        public float mouseSensitivity = 2.0f;
        public float maxPitch = 80.0f;
        public float minPitch = -80.0f;

        [Header("References")]
        public Camera playerCamera;

        private Rigidbody rb;
        private CapsuleCollider col;
        private float pitch = 0.0f;
        private bool isGrounded = false;
        private Vector3 groundNormal = Vector3.up;
        private bool cursorLocked = true;
        private bool wasLockedBeforeFocusLoss = true;

        private void Awake()
        {
            rb = GetComponent<Rigidbody>();
            col = GetComponent<CapsuleCollider>();

            DoorController.GlobalPlayerTransform = transform;

            // Configure Rigidbody physics per Syllabus Unit 4/5
            rb.freezeRotation = true;
            rb.interpolation = RigidbodyInterpolation.Interpolate;
            rb.collisionDetectionMode = CollisionDetectionMode.Continuous;

            // Configure Capsule Collider
            col.height = 1.8f;
            col.radius = 0.35f;
            col.center = new Vector3(0, 0.9f, 0);

            // Frictionless physics material so capsule never snags on stair edges or door frames
            var physMat = new PhysicMaterial("PlayerZeroFriction")
            {
                dynamicFriction = 0f,
                staticFriction = 0f,
                frictionCombine = PhysicMaterialCombine.Minimum,
                bounciness = 0f,
                bounceCombine = PhysicMaterialCombine.Minimum
            };
            col.material = physMat;

            // Find or setup camera
            if (playerCamera == null)
            {
                playerCamera = GetComponentInChildren<Camera>();
                if (playerCamera == null)
                {
                    var camObj = new GameObject("PlayerCamera");
                    camObj.transform.SetParent(this.transform);
                    camObj.transform.localPosition = new Vector3(0, 1.65f, 0); // Eye height ~1.65m
                    playerCamera = camObj.AddComponent<Camera>();
                    camObj.AddComponent<AudioListener>();
                }
            }

            SetCursorLock(true);
        }

        private void Start()
        {
            DoorController.GlobalPlayerTransform = transform;
            SetCursorLock(true);
            EnsureCamera();
        }

        private void OnApplicationFocus(bool hasFocus)
        {
            if (!hasFocus)
            {
                wasLockedBeforeFocusLoss = cursorLocked;
            }
            else
            {
                if (wasLockedBeforeFocusLoss)
                {
                    SetCursorLock(true);
                }
            }
        }

        private void EnsureCamera()
        {
            if (playerCamera == null)
            {
                playerCamera = GetComponentInChildren<Camera>();
                if (playerCamera == null)
                {
                    playerCamera = Camera.main;
                }
            }
        }

        private void Update()
        {
            // Standard FPS click-to-lock: Clicking in 3D world locks cursor (HUD clicks are preserved)
            if (Input.GetMouseButtonDown(0) || Input.GetMouseButtonDown(1))
            {
                if (!cursorLocked && !CampusHUD.IsMouseOverUI())
                {
                    SetCursorLock(true);
                }
            }

            HandleCursorToggle();

            if (cursorLocked)
            {
                HandleMouseLook();
            }

            CheckGroundStatus();
            HandleJump();
        }

        private void FixedUpdate()
        {
            HandleMovement();
            HandleStepClimb();
        }

        private void HandleCursorToggle()
        {
            if (Input.GetKeyDown(KeyCode.Escape))
            {
                SetCursorLock(!cursorLocked);
            }
        }

        public void SetCursorLock(bool locked)
        {
            cursorLocked = locked;
            Cursor.lockState = locked ? CursorLockMode.Locked : CursorLockMode.None;
            Cursor.visible = !locked;
        }

        private void HandleMouseLook()
        {
            EnsureCamera();

            float mouseX = Input.GetAxis("Mouse X") * mouseSensitivity;
            float mouseY = Input.GetAxis("Mouse Y") * mouseSensitivity;

            // Horizontal Yaw rotates the Player GameObject
            transform.Rotate(Vector3.up * mouseX);

            // Vertical Pitch rotates the Camera
            pitch -= mouseY;
            pitch = Mathf.Clamp(pitch, minPitch, maxPitch);
            if (playerCamera != null)
            {
                playerCamera.transform.localEulerAngles = new Vector3(pitch, 0, 0);
            }
        }

        private void HandleMovement()
        {
            float horizontal = Input.GetAxis("Horizontal"); // A/D
            float vertical = Input.GetAxis("Vertical");     // W/S

            bool isSprinting = Input.GetKey(KeyCode.LeftShift) || Input.GetKey(KeyCode.RightShift);
            float currentSpeed = isSprinting ? sprintSpeed : walkSpeed;

            Vector3 inputDir = (transform.forward * vertical + transform.right * horizontal).normalized;

            if (inputDir.sqrMagnitude < 0.001f)
            {
                // Smooth deceleration when no input
                Vector3 vel = rb.velocity;
                vel.x = Mathf.MoveTowards(vel.x, 0, currentSpeed * Time.fixedDeltaTime * 10f);
                vel.z = Mathf.MoveTowards(vel.z, 0, currentSpeed * Time.fixedDeltaTime * 10f);
                rb.velocity = vel;
                return;
            }

            float slopeAngle = Vector3.Angle(Vector3.up, groundNormal);
            bool onSlope = isGrounded && slopeAngle > 1.0f && slopeAngle <= maxSlopeAngle;

            if (onSlope)
            {
                // Project movement along slope normal for butter-smooth slope/stair climbing
                Vector3 slopeDir = Vector3.ProjectOnPlane(inputDir, groundNormal).normalized;
                Vector3 targetVelocity = slopeDir * currentSpeed;

                rb.velocity = targetVelocity;
            }
            else
            {
                // Standard flat walking with preserved vertical velocity (gravity/falling)
                Vector3 targetVelocity = inputDir * currentSpeed;
                Vector3 velocity = rb.velocity;
                velocity.x = targetVelocity.x;
                velocity.z = targetVelocity.z;

                rb.velocity = velocity;
            }
        }

        private void HandleStepClimb()
        {
            float horizontal = Input.GetAxisRaw("Horizontal");
            float vertical = Input.GetAxisRaw("Vertical");
            Vector3 moveDir = (transform.forward * vertical + transform.right * horizontal).normalized;
            if (moveDir.sqrMagnitude < 0.01f)
            {
                moveDir = transform.forward;
            }

            Vector3 bottomOrigin = transform.position + Vector3.up * 0.08f;
            Vector3 topOrigin = transform.position + Vector3.up * (stepHeight + 0.05f);

            // Raycast forward along movement direction at bottom of capsule
            if (Physics.Raycast(bottomOrigin, moveDir, out RaycastHit hitLower, col.radius + 0.25f))
            {
                if (!hitLower.collider.isTrigger)
                {
                    // Verify upper region is clear
                    if (!Physics.Raycast(topOrigin, moveDir, col.radius + 0.35f))
                    {
                        // Smoothly nudge player up onto step
                        rb.position += new Vector3(0, stepSmooth, 0);
                    }
                }
            }
        }

        private void HandleJump()
        {
            if (Input.GetButtonDown("Jump") && isGrounded)
            {
                rb.AddForce(Vector3.up * jumpForce, ForceMode.Impulse);
                isGrounded = false;
            }
        }

        private void CheckGroundStatus()
        {
            // SphereCast down from capsule center for robust ground detection on slabs, landings, and ramps.
            // Origin at center (0.9m above transform.position), cast down far enough to reach slab surface.
            // Capsule center is at +0.9, bottom is at +0.35 (radius). Slab top is at floor Y (e.g. Y=4.0).
            // For a player at transform.position.y=5.0: center=5.9, cast needs (5.9 - 0.35 - 4.0) + margin = 1.75 min.
            Vector3 origin = transform.position + Vector3.up * 0.9f; // capsule center
            float radius = col.radius * 0.85f;
            float castDistance = 1.2f; // Enough to reach floor from normal standing position

            if (Physics.SphereCast(origin, radius, Vector3.down, out RaycastHit hit, castDistance,
                ~0, QueryTriggerInteraction.Ignore))
            {
                isGrounded = true;
                groundNormal = hit.normal;
            }
            else
            {
                isGrounded = false;
                groundNormal = Vector3.up;
            }
        }

        public void TeleportTo(Vector3 position, Quaternion rotation)
        {
            // Kill all physics momentum first
            rb.velocity = Vector3.zero;
            rb.angularVelocity = Vector3.zero;

            // Use rb.position for proper physics engine sync (avoids 1-frame interpolation desync)
            rb.position = position;
            transform.position = position;
            transform.rotation = rotation;
            pitch = 0f;
            if (playerCamera != null)
            {
                playerCamera.transform.localEulerAngles = Vector3.zero;
            }
            // Force physics engine to acknowledge the new position immediately
            Physics.SyncTransforms();
        }
    }
}
