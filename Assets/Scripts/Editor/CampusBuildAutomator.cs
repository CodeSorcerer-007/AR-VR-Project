using System.IO;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.SceneManagement;

namespace StPaulsVR.Editor
{
    public static class CampusBuildAutomator
    {
        private const string ScenePath = "Assets/Scenes/StPaulsCampus.unity";

        [MenuItem("StPauls/Bake Master Scene")]
        public static void BuildAndSaveScene()
        {
            BuildSceneGeometry();
            EditorApplication.Exit(0);
        }

        public static Scene BuildSceneGeometry()
        {
            Debug.Log("[CampusBuildAutomator] Creating master scene: " + ScenePath);

            // Create new scene
            Scene scene = EditorSceneManager.NewScene(NewSceneSetup.DefaultGameObjects, NewSceneMode.Single);

            // 1. Setup Directional Sunlight
            var lights = Object.FindObjectsOfType<Light>();
            Light dirLight = null;
            foreach (var l in lights)
            {
                if (l.type == LightType.Directional)
                {
                    dirLight = l;
                    break;
                }
            }

            if (dirLight == null)
            {
                var lightObj = new GameObject("Directional Light");
                dirLight = lightObj.AddComponent<Light>();
                dirLight.type = LightType.Directional;
            }

            dirLight.transform.rotation = Quaternion.Euler(50f, -30f, 0f);
            dirLight.color = new Color(1.0f, 0.98f, 0.92f);
            dirLight.intensity = 1.25f;
            dirLight.shadows = LightShadows.Soft;

            RenderSettings.ambientMode = UnityEngine.Rendering.AmbientMode.Flat;
            RenderSettings.ambientLight = new Color(0.72f, 0.74f, 0.78f);

            // 2. Setup Campus Builder
            var builderObj = new GameObject("CampusBuilder");
            var builder = builderObj.AddComponent<CampusBuilder>();
            builder.BuildCompleteCampus();

            // 3. Remove default scene camera (PlayerController has its own camera)
            var defaultCams = Object.FindObjectsOfType<Camera>();
            foreach (var oldCam in defaultCams)
            {
                if (oldCam.gameObject.name == "Main Camera")
                {
                    Object.DestroyImmediate(oldCam.gameObject);
                }
            }

            // 4. Setup First-Person Player Controller
            var playerObj = new GameObject("Player");
            playerObj.tag = "Player";
            playerObj.transform.position = new Vector3(0f, 0.60f, -12.0f); // Main entrance (Y=0.60: slab top Y:0 + 0.55 capsule offset + 0.05 margin)

            var playerRb = playerObj.AddComponent<Rigidbody>();
            playerRb.freezeRotation = true;
            playerRb.interpolation = RigidbodyInterpolation.Interpolate;
            playerRb.collisionDetectionMode = CollisionDetectionMode.Continuous;

            var playerCol = playerObj.AddComponent<CapsuleCollider>();
            playerCol.height = 1.8f;
            playerCol.radius = 0.4f;
            playerCol.center = new Vector3(0, 0.9f, 0);

            var camObj = new GameObject("FirstPersonCamera");
            camObj.transform.SetParent(playerObj.transform);
            camObj.transform.localPosition = new Vector3(0f, 1.65f, 0f);
            var cam = camObj.AddComponent<Camera>();
            cam.fieldOfView = 75f;
            camObj.AddComponent<AudioListener>();

            var controller = playerObj.AddComponent<FirstPersonController>();
            controller.playerCamera = cam;

            playerObj.AddComponent<CinematicTour>();

            // 5. Setup Campus HUD
            var hudObj = new GameObject("CampusHUD");
            hudObj.AddComponent<CampusHUD>();

            // 6. Save Scene
            Directory.CreateDirectory("Assets/Scenes");
            bool saved = EditorSceneManager.SaveScene(scene, ScenePath);
            Debug.Log("[CampusBuildAutomator] Scene saved successfully: " + saved);

            // 7. Add to Build Settings
            EditorBuildSettingsScene[] buildScenes = new EditorBuildSettingsScene[]
            {
                new EditorBuildSettingsScene(ScenePath, true)
            };
            EditorBuildSettings.scenes = buildScenes;
            Debug.Log("[CampusBuildAutomator] EditorBuildSettings updated with master scene.");

            return scene;
        }

        [MenuItem("StPauls/Capture Checkpoints")]
        public static void CaptureCheckpoints()
        {
            Debug.Log("[CampusBuildAutomator] Capturing Checkpoints C1-C10...");

            // 1. Freshly build master scene
            BuildSceneGeometry();

            // 2. Prepare destination folder
            string screenshotDir = Path.GetFullPath("Screenshots/Checkpoints");
            if (!Directory.Exists(screenshotDir))
            {
                Directory.CreateDirectory(screenshotDir);
            }

            // 3. Setup temporary Render Camera & RenderTexture
            var camObj = new GameObject("CheckpointCaptureCamera");
            var cam = camObj.AddComponent<Camera>();
            cam.fieldOfView = 75f;
            cam.nearClipPlane = 0.1f;
            cam.farClipPlane = 500f;
            cam.clearFlags = CameraClearFlags.Skybox;

            int width = 1920;
            int height = 1080;
            var rt = new RenderTexture(width, height, 24, RenderTextureFormat.ARGB32);
            cam.targetTexture = rt;

            // 4. Checkpoint definitions (Positions and LookAt targets)
            var checkpoints = new (string id, Vector3 pos, Vector3 target)[]
            {
                ("C1", new Vector3(0f, 1.8f, -18.0f), new Vector3(0f, 2.5f, -6.0f)),     // Main Entrance Exterior
                ("C2", new Vector3(0f, 1.65f, -7.0f), new Vector3(0f, 1.65f, -2.5f)),   // Foyer Interior (vending machines, portrait, ceiling)
                ("C3", new Vector3(0f, 1.65f, -2.0f), new Vector3(-15.0f, 1.65f, -2.0f)), // Ground Floor Corridor looking West
                ("C4", new Vector3(-13.0f, 1.65f, 0.5f), new Vector3(-13.0f, 2.5f, 4.5f)), // Main Staircase (granite treads, balusters, navy columns)
                ("C5", new Vector3(0f, 1.65f, 8.5f), new Vector3(0f, 1.65f, 15.0f)),    // CSS Lab (workstations, podium, screen)
                ("C6", new Vector3(-24.0f, 5.65f, 1.5f), new Vector3(-33.0f, 5.65f, 1.5f)), // 1F Bridge across to Annexure
                ("C7", new Vector3(-2.5f, 13.65f, 6.5f), new Vector3(-7.0f, 4.0f, 6.5f)),  // Courtyard lightwell from 3F overlooking parapet
                ("C8", new Vector3(0f, 9.65f, 15.0f), new Vector3(0f, 9.65f, 21.0f)),   // Server Room viewing window from Machine Vision Lab
                ("C9", new Vector3(-43.0f, 4.0f, -22.0f), new Vector3(-38.0f, 8.0f, 0.0f)), // Annexure Exterior & Facade
                ("C10", new Vector3(-16.0f, 65.0f, -8.0f), new Vector3(-16.0f, 0f, 20.0f))   // Bird's Eye Campus Panorama
            };

            var currentRT = RenderTexture.active;
            RenderTexture.active = rt;

            var tex = new Texture2D(width, height, TextureFormat.RGB24, false);

            foreach (var cp in checkpoints)
            {
                cam.transform.position = cp.pos;
                cam.transform.LookAt(cp.target);
                cam.Render();

                tex.ReadPixels(new Rect(0, 0, width, height), 0, 0);
                tex.Apply();

                byte[] bytes = tex.EncodeToPNG();
                string filePath = Path.Combine(screenshotDir, $"{cp.id}.png");
                File.WriteAllBytes(filePath, bytes);
                Debug.Log($"[CampusBuildAutomator] Saved {cp.id} to {filePath} ({bytes.Length} bytes)");
            }

            RenderTexture.active = currentRT;
            cam.targetTexture = null;
            Object.DestroyImmediate(rt);
            Object.DestroyImmediate(tex);
            Object.DestroyImmediate(camObj);

            Debug.Log("[CampusBuildAutomator] Checkpoints capture complete!");
            EditorApplication.Exit(0);
        }

        [MenuItem("StPauls/Build Standalone Windows x64")]
        public static void BuildStandalonePlayer()
        {
            Debug.Log("[CampusBuildAutomator] Starting Standalone Windows x64 build...");

            // 1. FRESHLY GENERATE AND SAVE THE MASTER CAMPUS SCENE
            Debug.Log("[CampusBuildAutomator] Step 1: Baking master campus scene from latest code...");
            BuildSceneGeometry();

            // 2. Ensure the newly saved scene is registered in Build Settings
            EditorBuildSettings.scenes = new EditorBuildSettingsScene[]
            {
                new EditorBuildSettingsScene(ScenePath, true)
            };

            string buildPath = System.IO.Path.GetFullPath("Build/StPaulsVR.exe");
            System.IO.Directory.CreateDirectory(System.IO.Path.GetDirectoryName(buildPath));
            Debug.Log("[CampusBuildAutomator] Output path: " + buildPath);

            BuildPlayerOptions opts = new BuildPlayerOptions();
            opts.scenes = new[] { ScenePath };
            opts.locationPathName = buildPath;
            opts.target = BuildTarget.StandaloneWindows64;
            opts.options = BuildOptions.None;

            var report = BuildPipeline.BuildPlayer(opts);
            if (report.summary.result == UnityEditor.Build.Reporting.BuildResult.Succeeded)
            {
                Debug.Log($"[CampusBuildAutomator] BUILD SUCCEEDED: {buildPath} ({report.summary.totalSize} bytes)");
                EditorApplication.Exit(0);
            }
            else
            {
                Debug.LogError($"[CampusBuildAutomator] BUILD FAILED with {report.summary.totalErrors} errors.");
                EditorApplication.Exit(1);
            }
        }
    }
}
