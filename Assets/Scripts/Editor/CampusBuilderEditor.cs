using UnityEditor;
using UnityEngine;

namespace StPaulsVR.Editor
{
    [CustomEditor(typeof(CampusBuilder))]
    public class CampusBuilderEditor : UnityEditor.Editor
    {
        public override void OnInspectorGUI()
        {
            DrawDefaultInspector();

            CampusBuilder builder = (CampusBuilder)target;

            GUILayout.Space(15);
            if (GUILayout.Button("Generate Complete Campus", GUILayout.Height(35)))
            {
                builder.BuildCompleteCampus();
                EditorUtility.SetDirty(builder.gameObject);
            }
        }

        [MenuItem("StPauls/Generate Complete Campus")]
        public static void MenuGenerateCompleteCampus()
        {
            var builder = Object.FindObjectOfType<CampusBuilder>();
            if (builder == null)
            {
                var go = new GameObject("CampusBuilder");
                builder = go.AddComponent<CampusBuilder>();
            }

            builder.BuildCompleteCampus();
            EditorUtility.SetDirty(builder.gameObject);
            Debug.Log("[CampusBuilderEditor] Generated complete St. Paul's campus from menu item.");
        }
    }
}
