using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace StPaulsVR
{
    public class ServerRoomLEDController : MonoBehaviour
    {
        public List<Renderer> greenLEDs = new List<Renderer>();
        public List<Renderer> blueLEDs = new List<Renderer>();
        public List<Renderer> amberLEDs = new List<Renderer>();

        private Material greenMat;
        private Material blueMat;
        private Material amberMat;

        private static readonly Color BaseGreen = new Color(0.0f, 1.0f, 0.2f);
        private static readonly Color BaseBlue = new Color(0.0f, 0.4f, 1.0f);
        private static readonly Color BaseAmber = new Color(1.0f, 0.6f, 0.0f);

        public void Initialize(Material gMat, Material bMat, Material aMat)
        {
            greenMat = gMat;
            blueMat = bMat;
            amberMat = aMat;
        }

        private void Start()
        {
            // If materials were not passed directly, grab from first renderers
            if (greenMat == null && greenLEDs.Count > 0 && greenLEDs[0] != null) greenMat = greenLEDs[0].sharedMaterial;
            if (blueMat == null && blueLEDs.Count > 0 && blueLEDs[0] != null) blueMat = blueLEDs[0].sharedMaterial;
            if (amberMat == null && amberLEDs.Count > 0 && amberLEDs[0] != null) amberMat = amberLEDs[0].sharedMaterial;

            if (greenMat != null) StartCoroutine(BlinkRoutine(greenMat, BaseGreen, 0.25f, 0.75f));
            if (blueMat != null) StartCoroutine(BlinkRoutine(blueMat, BaseBlue, 0.15f, 0.50f));
            if (amberMat != null) StartCoroutine(BlinkRoutine(amberMat, BaseAmber, 0.35f, 1.10f));
        }

        private IEnumerator BlinkRoutine(Material mat, Color baseColor, float minDelay, float maxDelay)
        {
            if (mat == null) yield break;
            mat.EnableKeyword("_EMISSION");

            while (true)
            {
                float delay = Random.Range(minDelay, maxDelay);
                float intensity = Random.Range(0.8f, 1.8f);
                mat.SetColor("_EmissionColor", baseColor * intensity);
                yield return new WaitForSeconds(delay);
            }
        }
    }
}

