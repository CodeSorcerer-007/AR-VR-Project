using System;
using System.Collections.Generic;
using UnityEngine;

namespace StPaulsVR.Tests
{
    public static class Assert
    {
        public static void IsTrue(bool condition, string message)
        {
            if (!condition) throw new Exception("Assert.IsTrue failed: " + message);
        }

        public static void IsFalse(bool condition, string message)
        {
            if (condition) throw new Exception("Assert.IsFalse failed: " + message);
        }

        public static void IsNotNull(object obj, string message)
        {
            if (obj == null) throw new Exception("Assert.IsNotNull failed: " + message);
        }

        public static void AreEqual(object expected, object actual, string message)
        {
            if (!object.Equals(expected, actual))
                throw new Exception($"Assert.AreEqual failed. Expected: {expected}, Actual: {actual}. {message}");
        }

        public static void AreEqual(float expected, float actual, float delta, string message)
        {
            if (Math.Abs(expected - actual) > delta)
                throw new Exception($"Assert.AreEqual (float) failed. Expected: {expected}, Actual: {actual}, Delta: {delta}. {message}");
        }

        public static void Greater(float val, float thresh, string message)
        {
            if (val <= thresh)
                throw new Exception($"Assert.Greater failed. Value: {val} not greater than: {thresh}. {message}");
        }
    }

    public class CampusDataValidation
    {
        public void Test_Rooms_ExistAndHaveNoDuplicateIds()
        {
            var rooms = CampusData.Rooms;
            Assert.IsNotNull(rooms, "Rooms list must not be null");
            Assert.Greater(rooms.Count, 50, "Campus must contain comprehensive room set");

            var seenIds = new HashSet<string>();
            foreach (var r in rooms)
            {
                Assert.IsFalse(string.IsNullOrEmpty(r.id), "Room ID must not be empty");
                Assert.IsTrue(seenIds.Add(r.id), $"Duplicate room ID detected: {r.id}");
                Assert.Greater(r.dimensions.x, 0, $"Room {r.id} width must be positive");
                Assert.Greater(r.dimensions.y, 0, $"Room {r.id} height must be positive");
                Assert.Greater(r.dimensions.z, 0, $"Room {r.id} depth must be positive");
            }
        }

        public void Test_Bridges_StrictlyOpenAirAndConnectCorrectFloors()
        {
            var bridges = CampusData.Bridges;
            Assert.AreEqual(2, bridges.Count, "Must have exactly 2 connecting bridges");

            var b1 = bridges.Find(b => b.id == "bridge-first-floor");
            Assert.IsNotNull(b1, "Bridge 1 (First Floor) must exist");
            Assert.AreEqual("first", b1.floor, "Bridge 1 floor mismatch");
            Assert.AreEqual(4.0f, b1.startPoint.y, 0.01f, "Bridge 1 must be at Y=4.0m");
            Assert.IsFalse(b1.hasRoof, "Bridge 1 must be strictly open-air (no roof)");

            var b2 = bridges.Find(b => b.id == "bridge-second-floor");
            Assert.IsNotNull(b2, "Bridge 2 (Second Floor) must exist");
            Assert.AreEqual("second", b2.floor, "Bridge 2 floor mismatch");
            Assert.AreEqual(8.0f, b2.startPoint.y, 0.01f, "Bridge 2 must be at Y=8.0m");
            Assert.IsFalse(b2.hasRoof, "Bridge 2 must be strictly open-air (no roof)");
        }

        public void Test_Courtyards_LightWellsPreserved()
        {
            var courtyards = CampusData.Courtyards;
            Assert.AreEqual(5, courtyards.Count, "Must have 5 vertical courtyards total (4 Main, 1 Annexure)");

            int mainCount = 0;
            int annexureCount = 0;
            foreach (var cy in courtyards)
            {
                if (cy.block == "main") mainCount++;
                if (cy.block == "annexure") annexureCount++;
                Assert.AreEqual(1.2f, cy.parapetHeight, 0.01f, "Parapet safety height must be 1.2m");
            }

            Assert.AreEqual(4, mainCount, "Main Block must have 4 vertical light wells");
            Assert.AreEqual(1, annexureCount, "Annexure Block must have 1 central light well");
        }

        public void Test_StandardizedLabs_Identified()
        {
            var rooms = CampusData.Rooms;
            var namedLabs = new List<string>
            {
                "Computer Systems & Software (CSS) Lab",
                "Design Thinking & Innovation Laboratory",
                "Machine Vision & Perception Laboratory",
                "Web 3.0 & Distributed Systems Laboratory",
                "Generative AI & Deep Learning Laboratory",
                "Quantum Information & Computing Laboratory"
            };

            foreach (var labName in namedLabs)
            {
                var found = rooms.Find(r => r.name.Contains(labName) || r.number.Contains(labName));
                Assert.IsNotNull(found, $"Standardized lab must exist in catalog: {labName}");
            }
        }
    }
}
