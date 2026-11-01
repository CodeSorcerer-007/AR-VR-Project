using System;
using System.Collections.Generic;
using UnityEngine;

namespace StPaulsVR
{
    [Serializable]
    public struct RoomDefinition
    {
        public string id;
        public string number;
        public string name;
        public string category;
        public string block;
        public string floor;
        public int capacity;
        public Vector3 position;
        public Vector3 dimensions;
    }

    [Serializable]
    public struct BridgeDefinition
    {
        public string id;
        public string name;
        public string floor;
        public string fromBlock;
        public string toBlock;
        public Vector3 startPoint;
        public Vector3 endPoint;
        public float width;
        public bool hasRoof;
    }

    [Serializable]
    public struct CourtyardDefinition
    {
        public string id;
        public string block;
        public Vector3 position;
        public Vector3 dimensions;
        public float parapetHeight;
    }

    public static class CampusData
    {
        public static readonly List<BridgeDefinition> Bridges = new List<BridgeDefinition>
        {
            new BridgeDefinition
            {
                id = "bridge-first-floor",
                name = "First-Floor Pedestrian Bridge",
                floor = "first",
                fromBlock = "main",
                toBlock = "annexure",
                startPoint = new Vector3(-21f, 4.0f, 1.5f),
                endPoint = new Vector3(-33f, 4.0f, 1.5f),
                width = 3.0f,
                hasRoof = false
            },
            new BridgeDefinition
            {
                id = "bridge-second-floor",
                name = "Second-Floor Pedestrian Bridge",
                floor = "second",
                fromBlock = "main",
                toBlock = "annexure",
                startPoint = new Vector3(-21f, 8.0f, 1.5f),
                endPoint = new Vector3(-33f, 8.0f, 1.5f),
                width = 3.0f,
                hasRoof = false
            }
        };

        public static readonly List<CourtyardDefinition> Courtyards = new List<CourtyardDefinition>
        {
            new CourtyardDefinition { id = "main-courtyard-front-west", block = "main", position = new Vector3(-7f, 8f, 6.5f), dimensions = new Vector3(7f, 16f, 6f), parapetHeight = 1.2f },
            new CourtyardDefinition { id = "main-courtyard-front-east", block = "main", position = new Vector3(7f, 8f, 6.5f), dimensions = new Vector3(7f, 16f, 6f), parapetHeight = 1.2f },
            new CourtyardDefinition { id = "main-courtyard-rear-west", block = "main", position = new Vector3(-7f, 8f, 25.5f), dimensions = new Vector3(7f, 16f, 6f), parapetHeight = 1.2f },
            new CourtyardDefinition { id = "main-courtyard-rear-east", block = "main", position = new Vector3(7f, 8f, 25.5f), dimensions = new Vector3(7f, 16f, 6f), parapetHeight = 1.2f },
            new CourtyardDefinition { id = "annexure-courtyard-east", block = "annexure", position = new Vector3(-43f, 8f, 19f), dimensions = new Vector3(3f, 16f, 12f), parapetHeight = 1.2f }
        };

        public static readonly List<RoomDefinition> Rooms = new List<RoomDefinition>
        {
            new RoomDefinition {
                id = "main-g-entrance",
                number = "Main Entrance",
                name = "St. Paul’s Main Entrance Passage",
                category = "facility",
                block = "main",
                floor = "ground",
                capacity = 50,
                position = new Vector3(0.0f, 0.0f, -5.0f),
                dimensions = new Vector3(6.0f, 3.5f, 6.0f)
            },
            new RoomDefinition {
                id = "main-g-dean",
                number = "Dean Cabin",
                name = "Dean Cabin (Main)",
                category = "office",
                block = "main",
                floor = "ground",
                capacity = 6,
                position = new Vector3(-18.0f, 0.0f, -5.0f),
                dimensions = new Vector3(6.0f, 3.5f, 6.0f)
            },
            new RoomDefinition {
                id = "main-g-402",
                number = "402",
                name = "Classroom 402",
                category = "classroom",
                block = "main",
                floor = "ground",
                capacity = 60,
                position = new Vector3(-12.0f, 0.0f, -5.0f),
                dimensions = new Vector3(6.0f, 3.5f, 6.0f)
            },
            new RoomDefinition {
                id = "main-g-401",
                number = "401",
                name = "Classroom 401",
                category = "classroom",
                block = "main",
                floor = "ground",
                capacity = 60,
                position = new Vector3(-6.0f, 0.0f, -5.0f),
                dimensions = new Vector3(6.0f, 3.5f, 6.0f)
            },
            new RoomDefinition {
                id = "main-g-415",
                number = "415",
                name = "Classroom 415",
                category = "classroom",
                block = "main",
                floor = "ground",
                capacity = 60,
                position = new Vector3(6.0f, 0.0f, -5.0f),
                dimensions = new Vector3(6.0f, 3.5f, 6.0f)
            },
            new RoomDefinition {
                id = "main-g-414",
                number = "414",
                name = "Classroom 414",
                category = "classroom",
                block = "main",
                floor = "ground",
                capacity = 60,
                position = new Vector3(12.0f, 0.0f, -5.0f),
                dimensions = new Vector3(6.0f, 3.5f, 6.0f)
            },
            new RoomDefinition {
                id = "main-g-hod",
                number = "HOD Cabin",
                name = "Head of Department (HOD) Cabin",
                category = "office",
                block = "main",
                floor = "ground",
                capacity = 8,
                position = new Vector3(18.0f, 0.0f, -5.0f),
                dimensions = new Vector3(6.0f, 3.5f, 6.0f)
            },
            new RoomDefinition {
                id = "main-g-403",
                number = "403",
                name = "Classroom 403",
                category = "classroom",
                block = "main",
                floor = "ground",
                capacity = 60,
                position = new Vector3(-18.0f, 0.0f, 4.5f),
                dimensions = new Vector3(6.0f, 3.5f, 9.0f)
            },
            new RoomDefinition {
                id = "main-g-404",
                number = "404",
                name = "Classroom 404",
                category = "classroom",
                block = "main",
                floor = "ground",
                capacity = 60,
                position = new Vector3(-18.0f, 0.0f, 13.5f),
                dimensions = new Vector3(6.0f, 3.5f, 9.0f)
            },
            new RoomDefinition {
                id = "main-g-405",
                number = "405",
                name = "Classroom 405",
                category = "classroom",
                block = "main",
                floor = "ground",
                capacity = 60,
                position = new Vector3(-18.0f, 0.0f, 22.5f),
                dimensions = new Vector3(6.0f, 3.5f, 9.0f)
            },
            new RoomDefinition {
                id = "main-g-girls-restroom",
                number = "Girls Restroom",
                name = "Girls Restroom (Ground Floor)",
                category = "restroom",
                block = "main",
                floor = "ground",
                capacity = 10,
                position = new Vector3(-18.0f, 0.0f, 30.5f),
                dimensions = new Vector3(6.0f, 3.5f, 7.0f)
            },
            new RoomDefinition {
                id = "main-g-406",
                number = "406",
                name = "Classroom 406",
                category = "classroom",
                block = "main",
                floor = "ground",
                capacity = 60,
                position = new Vector3(-12.0f, 0.0f, 37.0f),
                dimensions = new Vector3(6.0f, 3.5f, 6.0f)
            },
            new RoomDefinition {
                id = "main-g-407",
                number = "407",
                name = "Classroom 407",
                category = "classroom",
                block = "main",
                floor = "ground",
                capacity = 60,
                position = new Vector3(-6.0f, 0.0f, 37.0f),
                dimensions = new Vector3(6.0f, 3.5f, 6.0f)
            },
            new RoomDefinition {
                id = "main-g-408",
                number = "408",
                name = "Classroom 408",
                category = "classroom",
                block = "main",
                floor = "ground",
                capacity = 60,
                position = new Vector3(0.0f, 0.0f, 37.0f),
                dimensions = new Vector3(6.0f, 3.5f, 6.0f)
            },
            new RoomDefinition {
                id = "main-g-409",
                number = "409",
                name = "Classroom 409",
                category = "classroom",
                block = "main",
                floor = "ground",
                capacity = 60,
                position = new Vector3(6.0f, 0.0f, 37.0f),
                dimensions = new Vector3(6.0f, 3.5f, 6.0f)
            },
            new RoomDefinition {
                id = "main-g-410",
                number = "410",
                name = "Classroom 410",
                category = "classroom",
                block = "main",
                floor = "ground",
                capacity = 60,
                position = new Vector3(12.0f, 0.0f, 37.0f),
                dimensions = new Vector3(6.0f, 3.5f, 6.0f)
            },
            new RoomDefinition {
                id = "main-g-boys-restroom",
                number = "Boys Restroom",
                name = "Boys Restroom (Ground Floor)",
                category = "restroom",
                block = "main",
                floor = "ground",
                capacity = 10,
                position = new Vector3(18.0f, 0.0f, 37.0f),
                dimensions = new Vector3(6.0f, 3.5f, 6.0f)
            },
            new RoomDefinition {
                id = "main-g-411",
                number = "411",
                name = "Classroom 411",
                category = "classroom",
                block = "main",
                floor = "ground",
                capacity = 60,
                position = new Vector3(18.0f, 0.0f, 22.5f),
                dimensions = new Vector3(6.0f, 3.5f, 9.0f)
            },
            new RoomDefinition {
                id = "main-g-412",
                number = "412",
                name = "Classroom 412",
                category = "classroom",
                block = "main",
                floor = "ground",
                capacity = 60,
                position = new Vector3(18.0f, 0.0f, 13.5f),
                dimensions = new Vector3(6.0f, 3.5f, 9.0f)
            },
            new RoomDefinition {
                id = "main-g-413",
                number = "413",
                name = "Classroom 413",
                category = "classroom",
                block = "main",
                floor = "ground",
                capacity = 60,
                position = new Vector3(18.0f, 0.0f, 4.5f),
                dimensions = new Vector3(6.0f, 3.5f, 9.0f)
            },
            new RoomDefinition {
                id = "main-g-staff-cabin-1",
                number = "Staff Cabin (1)",
                name = "Staff Cabin (1) — Faculty Office",
                category = "staff_cabin",
                block = "main",
                floor = "ground",
                capacity = 10,
                position = new Vector3(-8.0f, 0.0f, 16.0f),
                dimensions = new Vector3(6.0f, 3.5f, 12.0f)
            },
            new RoomDefinition {
                id = "main-g-css-lab",
                number = "CSS Lab",
                name = "Computer Systems & Software (CSS) Lab",
                category = "lab",
                block = "main",
                floor = "ground",
                capacity = 180,
                position = new Vector3(0.0f, 0.0f, 16.0f),
                dimensions = new Vector3(9.0f, 3.5f, 12.0f)
            },
            new RoomDefinition {
                id = "main-g-staff-cabin-2",
                number = "Staff Cabin (2)",
                name = "Staff Cabin (2) — Faculty Office",
                category = "staff_cabin",
                block = "main",
                floor = "ground",
                capacity = 10,
                position = new Vector3(8.0f, 0.0f, 16.0f),
                dimensions = new Vector3(6.0f, 3.5f, 12.0f)
            },
            new RoomDefinition {
                id = "main-1-fc3",
                number = "FC(3)",
                name = "Faculty Cabin FC(3)",
                category = "staff_cabin",
                block = "main",
                floor = "first",
                capacity = 10,
                position = new Vector3(-18.0f, 4.0f, -5.0f),
                dimensions = new Vector3(6.0f, 3.5f, 6.0f)
            },
            new RoomDefinition {
                id = "main-1-417",
                number = "417",
                name = "Classroom 417",
                category = "classroom",
                block = "main",
                floor = "first",
                capacity = 60,
                position = new Vector3(-12.0f, 4.0f, -5.0f),
                dimensions = new Vector3(6.0f, 3.5f, 6.0f)
            },
            new RoomDefinition {
                id = "main-1-416",
                number = "416",
                name = "Classroom 416",
                category = "classroom",
                block = "main",
                floor = "first",
                capacity = 60,
                position = new Vector3(-6.0f, 4.0f, -5.0f),
                dimensions = new Vector3(6.0f, 3.5f, 6.0f)
            },
            new RoomDefinition {
                id = "main-1-project-hub",
                number = "Project Hub",
                name = "Project Hub Innovation Studio",
                category = "project_hub",
                block = "main",
                floor = "first",
                capacity = 0,
                position = new Vector3(0.0f, 4.0f, -5.0f),
                dimensions = new Vector3(6.0f, 3.5f, 6.0f)
            },
            new RoomDefinition {
                id = "main-1-430",
                number = "430",
                name = "Classroom 430",
                category = "classroom",
                block = "main",
                floor = "first",
                capacity = 60,
                position = new Vector3(6.0f, 4.0f, -5.0f),
                dimensions = new Vector3(6.0f, 3.5f, 6.0f)
            },
            new RoomDefinition {
                id = "main-1-429",
                number = "429",
                name = "Classroom 429",
                category = "classroom",
                block = "main",
                floor = "first",
                capacity = 60,
                position = new Vector3(12.0f, 4.0f, -5.0f),
                dimensions = new Vector3(6.0f, 3.5f, 6.0f)
            },
            new RoomDefinition {
                id = "main-1-fc5",
                number = "FC(5)",
                name = "Faculty Cabin FC(5)",
                category = "staff_cabin",
                block = "main",
                floor = "first",
                capacity = 10,
                position = new Vector3(18.0f, 4.0f, -5.0f),
                dimensions = new Vector3(6.0f, 3.5f, 6.0f)
            },
            new RoomDefinition {
                id = "main-1-418",
                number = "418",
                name = "Classroom 418",
                category = "classroom",
                block = "main",
                floor = "first",
                capacity = 60,
                position = new Vector3(-18.0f, 4.0f, 4.5f),
                dimensions = new Vector3(6.0f, 3.5f, 9.0f)
            },
            new RoomDefinition {
                id = "main-1-419",
                number = "419",
                name = "Classroom 419",
                category = "classroom",
                block = "main",
                floor = "first",
                capacity = 60,
                position = new Vector3(-18.0f, 4.0f, 13.5f),
                dimensions = new Vector3(6.0f, 3.5f, 9.0f)
            },
            new RoomDefinition {
                id = "main-1-420",
                number = "420",
                name = "Classroom 420",
                category = "classroom",
                block = "main",
                floor = "first",
                capacity = 60,
                position = new Vector3(-18.0f, 4.0f, 22.5f),
                dimensions = new Vector3(6.0f, 3.5f, 9.0f)
            },
            new RoomDefinition {
                id = "main-1-womens-restroom",
                number = "Women’s Restroom",
                name = "Women’s Restroom (First Floor)",
                category = "restroom",
                block = "main",
                floor = "first",
                capacity = 10,
                position = new Vector3(-18.0f, 4.0f, 30.5f),
                dimensions = new Vector3(6.0f, 3.5f, 7.0f)
            },
            new RoomDefinition {
                id = "main-1-421",
                number = "421",
                name = "Classroom 421",
                category = "classroom",
                block = "main",
                floor = "first",
                capacity = 60,
                position = new Vector3(-12.0f, 4.0f, 37.0f),
                dimensions = new Vector3(6.0f, 3.5f, 6.0f)
            },
            new RoomDefinition {
                id = "main-1-422",
                number = "422",
                name = "Classroom 422",
                category = "classroom",
                block = "main",
                floor = "first",
                capacity = 60,
                position = new Vector3(-6.0f, 4.0f, 37.0f),
                dimensions = new Vector3(6.0f, 3.5f, 6.0f)
            },
            new RoomDefinition {
                id = "main-1-423",
                number = "423",
                name = "Classroom 423",
                category = "classroom",
                block = "main",
                floor = "first",
                capacity = 60,
                position = new Vector3(0.0f, 4.0f, 37.0f),
                dimensions = new Vector3(6.0f, 3.5f, 6.0f)
            },
            new RoomDefinition {
                id = "main-1-424",
                number = "424",
                name = "Classroom 424",
                category = "classroom",
                block = "main",
                floor = "first",
                capacity = 60,
                position = new Vector3(6.0f, 4.0f, 37.0f),
                dimensions = new Vector3(6.0f, 3.5f, 6.0f)
            },
            new RoomDefinition {
                id = "main-1-425",
                number = "425",
                name = "Classroom 425",
                category = "classroom",
                block = "main",
                floor = "first",
                capacity = 60,
                position = new Vector3(12.0f, 4.0f, 37.0f),
                dimensions = new Vector3(6.0f, 3.5f, 6.0f)
            },
            new RoomDefinition {
                id = "main-1-mens-restroom",
                number = "Men’s Restroom",
                name = "Men’s Restroom (First Floor)",
                category = "restroom",
                block = "main",
                floor = "first",
                capacity = 10,
                position = new Vector3(18.0f, 4.0f, 37.0f),
                dimensions = new Vector3(6.0f, 3.5f, 6.0f)
            },
            new RoomDefinition {
                id = "main-1-426",
                number = "426",
                name = "Classroom 426",
                category = "classroom",
                block = "main",
                floor = "first",
                capacity = 60,
                position = new Vector3(18.0f, 4.0f, 22.5f),
                dimensions = new Vector3(6.0f, 3.5f, 9.0f)
            },
            new RoomDefinition {
                id = "main-1-427",
                number = "427",
                name = "Classroom 427",
                category = "classroom",
                block = "main",
                floor = "first",
                capacity = 60,
                position = new Vector3(18.0f, 4.0f, 13.5f),
                dimensions = new Vector3(6.0f, 3.5f, 9.0f)
            },
            new RoomDefinition {
                id = "main-1-428",
                number = "428",
                name = "Classroom 428",
                category = "classroom",
                block = "main",
                floor = "first",
                capacity = 60,
                position = new Vector3(18.0f, 4.0f, 4.5f),
                dimensions = new Vector3(6.0f, 3.5f, 9.0f)
            },
            new RoomDefinition {
                id = "main-1-fc4",
                number = "FC(4)",
                name = "Faculty Cabin FC(4)",
                category = "staff_cabin",
                block = "main",
                floor = "first",
                capacity = 10,
                position = new Vector3(-8.0f, 4.0f, 16.0f),
                dimensions = new Vector3(6.0f, 3.5f, 12.0f)
            },
            new RoomDefinition {
                id = "main-1-design-thinking-lab",
                number = "Design Thinking Lab",
                name = "Design Thinking & Innovation Laboratory",
                category = "lab",
                block = "main",
                floor = "first",
                capacity = 180,
                position = new Vector3(0.0f, 4.0f, 16.0f),
                dimensions = new Vector3(10.0f, 3.5f, 12.0f)
            },
            new RoomDefinition {
                id = "main-1-fc6",
                number = "FC(6)",
                name = "Faculty Cabin FC(6)",
                category = "staff_cabin",
                block = "main",
                floor = "first",
                capacity = 10,
                position = new Vector3(8.0f, 4.0f, 16.0f),
                dimensions = new Vector3(6.0f, 3.5f, 12.0f)
            },
            new RoomDefinition {
                id = "main-2-fc6",
                number = "FC(6)",
                name = "Faculty Cabin FC(6)",
                category = "staff_cabin",
                block = "main",
                floor = "second",
                capacity = 10,
                position = new Vector3(-18.0f, 8.0f, -5.0f),
                dimensions = new Vector3(6.0f, 3.5f, 6.0f)
            },
            new RoomDefinition {
                id = "main-2-433",
                number = "433",
                name = "Classroom 433",
                category = "classroom",
                block = "main",
                floor = "second",
                capacity = 60,
                position = new Vector3(-12.0f, 8.0f, -5.0f),
                dimensions = new Vector3(6.0f, 3.5f, 6.0f)
            },
            new RoomDefinition {
                id = "main-2-432",
                number = "432",
                name = "Classroom 432",
                category = "classroom",
                block = "main",
                floor = "second",
                capacity = 60,
                position = new Vector3(-6.0f, 8.0f, -5.0f),
                dimensions = new Vector3(6.0f, 3.5f, 6.0f)
            },
            new RoomDefinition {
                id = "main-2-431",
                number = "431",
                name = "Classroom 431",
                category = "classroom",
                block = "main",
                floor = "second",
                capacity = 60,
                position = new Vector3(0.0f, 8.0f, -5.0f),
                dimensions = new Vector3(6.0f, 3.5f, 6.0f)
            },
            new RoomDefinition {
                id = "main-2-446",
                number = "446",
                name = "Classroom 446",
                category = "classroom",
                block = "main",
                floor = "second",
                capacity = 60,
                position = new Vector3(6.0f, 8.0f, -5.0f),
                dimensions = new Vector3(6.0f, 3.5f, 6.0f)
            },
            new RoomDefinition {
                id = "main-2-445",
                number = "445",
                name = "Classroom 445",
                category = "classroom",
                block = "main",
                floor = "second",
                capacity = 60,
                position = new Vector3(12.0f, 8.0f, -5.0f),
                dimensions = new Vector3(6.0f, 3.5f, 6.0f)
            },
            new RoomDefinition {
                id = "main-2-fc9",
                number = "FC(9)",
                name = "Faculty Cabin FC(9)",
                category = "staff_cabin",
                block = "main",
                floor = "second",
                capacity = 10,
                position = new Vector3(18.0f, 8.0f, -5.0f),
                dimensions = new Vector3(6.0f, 3.5f, 6.0f)
            },
            new RoomDefinition {
                id = "main-2-434",
                number = "434",
                name = "Classroom 434",
                category = "classroom",
                block = "main",
                floor = "second",
                capacity = 60,
                position = new Vector3(-18.0f, 8.0f, 4.5f),
                dimensions = new Vector3(6.0f, 3.5f, 9.0f)
            },
            new RoomDefinition {
                id = "main-2-435",
                number = "435",
                name = "Classroom 435",
                category = "classroom",
                block = "main",
                floor = "second",
                capacity = 60,
                position = new Vector3(-18.0f, 8.0f, 13.5f),
                dimensions = new Vector3(6.0f, 3.5f, 9.0f)
            },
            new RoomDefinition {
                id = "main-2-436",
                number = "436",
                name = "Classroom 436",
                category = "classroom",
                block = "main",
                floor = "second",
                capacity = 60,
                position = new Vector3(-18.0f, 8.0f, 22.5f),
                dimensions = new Vector3(6.0f, 3.5f, 9.0f)
            },
            new RoomDefinition {
                id = "main-2-girls-restroom",
                number = "Girls Restroom",
                name = "Girls Restroom (Second Floor)",
                category = "restroom",
                block = "main",
                floor = "second",
                capacity = 10,
                position = new Vector3(-18.0f, 8.0f, 30.5f),
                dimensions = new Vector3(6.0f, 3.5f, 7.0f)
            },
            new RoomDefinition {
                id = "main-2-437",
                number = "437",
                name = "Classroom 437",
                category = "classroom",
                block = "main",
                floor = "second",
                capacity = 60,
                position = new Vector3(-12.0f, 8.0f, 37.0f),
                dimensions = new Vector3(6.0f, 3.5f, 6.0f)
            },
            new RoomDefinition {
                id = "main-2-438",
                number = "438",
                name = "Classroom 438",
                category = "classroom",
                block = "main",
                floor = "second",
                capacity = 60,
                position = new Vector3(-6.0f, 8.0f, 37.0f),
                dimensions = new Vector3(6.0f, 3.5f, 6.0f)
            },
            new RoomDefinition {
                id = "main-2-439",
                number = "439",
                name = "Classroom 439",
                category = "classroom",
                block = "main",
                floor = "second",
                capacity = 60,
                position = new Vector3(0.0f, 8.0f, 37.0f),
                dimensions = new Vector3(6.0f, 3.5f, 6.0f)
            },
            new RoomDefinition {
                id = "main-2-440",
                number = "440",
                name = "Classroom 440",
                category = "classroom",
                block = "main",
                floor = "second",
                capacity = 60,
                position = new Vector3(6.0f, 8.0f, 37.0f),
                dimensions = new Vector3(6.0f, 3.5f, 6.0f)
            },
            new RoomDefinition {
                id = "main-2-441",
                number = "441",
                name = "Classroom 441",
                category = "classroom",
                block = "main",
                floor = "second",
                capacity = 60,
                position = new Vector3(12.0f, 8.0f, 37.0f),
                dimensions = new Vector3(6.0f, 3.5f, 6.0f)
            },
            new RoomDefinition {
                id = "main-2-boys-restroom",
                number = "Boys Restroom",
                name = "Boys Restroom (Second Floor)",
                category = "restroom",
                block = "main",
                floor = "second",
                capacity = 10,
                position = new Vector3(18.0f, 8.0f, 37.0f),
                dimensions = new Vector3(6.0f, 3.5f, 6.0f)
            },
            new RoomDefinition {
                id = "main-2-442",
                number = "442",
                name = "Classroom 442",
                category = "classroom",
                block = "main",
                floor = "second",
                capacity = 60,
                position = new Vector3(18.0f, 8.0f, 22.5f),
                dimensions = new Vector3(6.0f, 3.5f, 9.0f)
            },
            new RoomDefinition {
                id = "main-2-443",
                number = "443",
                name = "Classroom 443",
                category = "classroom",
                block = "main",
                floor = "second",
                capacity = 60,
                position = new Vector3(18.0f, 8.0f, 13.5f),
                dimensions = new Vector3(6.0f, 3.5f, 9.0f)
            },
            new RoomDefinition {
                id = "main-2-444",
                number = "444",
                name = "Classroom 444",
                category = "classroom",
                block = "main",
                floor = "second",
                capacity = 60,
                position = new Vector3(18.0f, 8.0f, 4.5f),
                dimensions = new Vector3(6.0f, 3.5f, 9.0f)
            },
            new RoomDefinition {
                id = "main-2-fc7",
                number = "FC(7)",
                name = "Faculty Cabin FC(7)",
                category = "staff_cabin",
                block = "main",
                floor = "second",
                capacity = 10,
                position = new Vector3(-8.0f, 8.0f, 16.0f),
                dimensions = new Vector3(6.0f, 3.5f, 12.0f)
            },
            new RoomDefinition {
                id = "main-2-machine-vision-lab",
                number = "Machine Vision Lab",
                name = "Machine Vision & Perception Laboratory",
                category = "lab",
                block = "main",
                floor = "second",
                capacity = 180,
                position = new Vector3(0.0f, 8.0f, 14.0f),
                dimensions = new Vector3(10.0f, 3.5f, 8.0f)
            },
            new RoomDefinition {
                id = "main-2-server-room",
                number = "Server Room",
                name = "Central Campus Server Room",
                category = "server_room",
                block = "main",
                floor = "second",
                capacity = 0,
                position = new Vector3(0.0f, 8.0f, 20.0f),
                dimensions = new Vector3(10.0f, 3.5f, 4.0f)
            },
            new RoomDefinition {
                id = "main-2-fc8",
                number = "FC(8)",
                name = "Faculty Cabin FC(8)",
                category = "staff_cabin",
                block = "main",
                floor = "second",
                capacity = 10,
                position = new Vector3(8.0f, 8.0f, 16.0f),
                dimensions = new Vector3(6.0f, 3.5f, 12.0f)
            },
            new RoomDefinition {
                id = "main-3-fc10",
                number = "FC(10)",
                name = "Faculty Cabin FC(10)",
                category = "staff_cabin",
                block = "main",
                floor = "third",
                capacity = 10,
                position = new Vector3(-18.0f, 12.0f, -5.0f),
                dimensions = new Vector3(6.0f, 3.5f, 6.0f)
            },
            new RoomDefinition {
                id = "main-3-449",
                number = "449",
                name = "Classroom 449",
                category = "classroom",
                block = "main",
                floor = "third",
                capacity = 60,
                position = new Vector3(-12.0f, 12.0f, -5.0f),
                dimensions = new Vector3(6.0f, 3.5f, 6.0f)
            },
            new RoomDefinition {
                id = "main-3-448",
                number = "448",
                name = "Classroom 448",
                category = "classroom",
                block = "main",
                floor = "third",
                capacity = 60,
                position = new Vector3(-6.0f, 12.0f, -5.0f),
                dimensions = new Vector3(6.0f, 3.5f, 6.0f)
            },
            new RoomDefinition {
                id = "main-3-447",
                number = "447",
                name = "Classroom 447",
                category = "classroom",
                block = "main",
                floor = "third",
                capacity = 60,
                position = new Vector3(0.0f, 12.0f, -5.0f),
                dimensions = new Vector3(6.0f, 3.5f, 6.0f)
            },
            new RoomDefinition {
                id = "main-3-462",
                number = "462",
                name = "Classroom 462",
                category = "classroom",
                block = "main",
                floor = "third",
                capacity = 60,
                position = new Vector3(6.0f, 12.0f, -5.0f),
                dimensions = new Vector3(6.0f, 3.5f, 6.0f)
            },
            new RoomDefinition {
                id = "main-3-461",
                number = "461",
                name = "Classroom 461",
                category = "classroom",
                block = "main",
                floor = "third",
                capacity = 60,
                position = new Vector3(12.0f, 12.0f, -5.0f),
                dimensions = new Vector3(6.0f, 3.5f, 6.0f)
            },
            new RoomDefinition {
                id = "main-3-fc13",
                number = "FC(13)",
                name = "Faculty Cabin FC(13)",
                category = "staff_cabin",
                block = "main",
                floor = "third",
                capacity = 10,
                position = new Vector3(18.0f, 12.0f, -5.0f),
                dimensions = new Vector3(6.0f, 3.5f, 6.0f)
            },
            new RoomDefinition {
                id = "main-3-450",
                number = "450",
                name = "Classroom 450",
                category = "classroom",
                block = "main",
                floor = "third",
                capacity = 60,
                position = new Vector3(-18.0f, 12.0f, 4.5f),
                dimensions = new Vector3(6.0f, 3.5f, 9.0f)
            },
            new RoomDefinition {
                id = "main-3-451",
                number = "451",
                name = "Classroom 451",
                category = "classroom",
                block = "main",
                floor = "third",
                capacity = 60,
                position = new Vector3(-18.0f, 12.0f, 13.5f),
                dimensions = new Vector3(6.0f, 3.5f, 9.0f)
            },
            new RoomDefinition {
                id = "main-3-452",
                number = "452",
                name = "Classroom 452",
                category = "classroom",
                block = "main",
                floor = "third",
                capacity = 60,
                position = new Vector3(-18.0f, 12.0f, 22.5f),
                dimensions = new Vector3(6.0f, 3.5f, 9.0f)
            },
            new RoomDefinition {
                id = "main-3-girls-restroom",
                number = "Girls Restroom",
                name = "Girls Restroom (Third Floor)",
                category = "restroom",
                block = "main",
                floor = "third",
                capacity = 10,
                position = new Vector3(-18.0f, 12.0f, 30.5f),
                dimensions = new Vector3(6.0f, 3.5f, 7.0f)
            },
            new RoomDefinition {
                id = "main-3-453",
                number = "453",
                name = "Classroom 453",
                category = "classroom",
                block = "main",
                floor = "third",
                capacity = 60,
                position = new Vector3(-12.0f, 12.0f, 37.0f),
                dimensions = new Vector3(6.0f, 3.5f, 6.0f)
            },
            new RoomDefinition {
                id = "main-3-454",
                number = "454",
                name = "Classroom 454",
                category = "classroom",
                block = "main",
                floor = "third",
                capacity = 60,
                position = new Vector3(-6.0f, 12.0f, 37.0f),
                dimensions = new Vector3(6.0f, 3.5f, 6.0f)
            },
            new RoomDefinition {
                id = "main-3-455",
                number = "455",
                name = "Classroom 455",
                category = "classroom",
                block = "main",
                floor = "third",
                capacity = 60,
                position = new Vector3(0.0f, 12.0f, 37.0f),
                dimensions = new Vector3(6.0f, 3.5f, 6.0f)
            },
            new RoomDefinition {
                id = "main-3-456",
                number = "456",
                name = "Classroom 456",
                category = "classroom",
                block = "main",
                floor = "third",
                capacity = 60,
                position = new Vector3(6.0f, 12.0f, 37.0f),
                dimensions = new Vector3(6.0f, 3.5f, 6.0f)
            },
            new RoomDefinition {
                id = "main-3-457",
                number = "457",
                name = "Classroom 457",
                category = "classroom",
                block = "main",
                floor = "third",
                capacity = 60,
                position = new Vector3(12.0f, 12.0f, 37.0f),
                dimensions = new Vector3(6.0f, 3.5f, 6.0f)
            },
            new RoomDefinition {
                id = "main-3-boys-restroom",
                number = "Boys Restroom",
                name = "Boys Restroom (Third Floor)",
                category = "restroom",
                block = "main",
                floor = "third",
                capacity = 10,
                position = new Vector3(18.0f, 12.0f, 37.0f),
                dimensions = new Vector3(6.0f, 3.5f, 6.0f)
            },
            new RoomDefinition {
                id = "main-3-458",
                number = "458",
                name = "Classroom 458",
                category = "classroom",
                block = "main",
                floor = "third",
                capacity = 60,
                position = new Vector3(18.0f, 12.0f, 22.5f),
                dimensions = new Vector3(6.0f, 3.5f, 9.0f)
            },
            new RoomDefinition {
                id = "main-3-459",
                number = "459",
                name = "Classroom 459",
                category = "classroom",
                block = "main",
                floor = "third",
                capacity = 60,
                position = new Vector3(18.0f, 12.0f, 13.5f),
                dimensions = new Vector3(6.0f, 3.5f, 9.0f)
            },
            new RoomDefinition {
                id = "main-3-460",
                number = "460",
                name = "Classroom 460",
                category = "classroom",
                block = "main",
                floor = "third",
                capacity = 60,
                position = new Vector3(18.0f, 12.0f, 4.5f),
                dimensions = new Vector3(6.0f, 3.5f, 9.0f)
            },
            new RoomDefinition {
                id = "main-3-fc11",
                number = "FC(11)",
                name = "Faculty Cabin FC(11)",
                category = "staff_cabin",
                block = "main",
                floor = "third",
                capacity = 10,
                position = new Vector3(-8.0f, 12.0f, 16.0f),
                dimensions = new Vector3(6.0f, 3.5f, 12.0f)
            },
            new RoomDefinition {
                id = "main-3-web3-lab",
                number = "Web 3.0 Lab",
                name = "Web 3.0 & Distributed Systems Laboratory",
                category = "lab",
                block = "main",
                floor = "third",
                capacity = 180,
                position = new Vector3(0.0f, 12.0f, 16.0f),
                dimensions = new Vector3(10.0f, 3.5f, 12.0f)
            },
            new RoomDefinition {
                id = "main-3-fc12",
                number = "FC(12)",
                name = "Faculty Cabin FC(12)",
                category = "staff_cabin",
                block = "main",
                floor = "third",
                capacity = 10,
                position = new Vector3(8.0f, 12.0f, 16.0f),
                dimensions = new Vector3(6.0f, 3.5f, 12.0f)
            },
            new RoomDefinition {
                id = "annexure-g-dean",
                number = "Dean Cabin (Annexure)",
                name = "Dean Executive Office (Annexure)",
                category = "office",
                block = "annexure",
                floor = "ground",
                capacity = 8,
                position = new Vector3(-47.0f, 0.0f, -4.0f),
                dimensions = new Vector3(12.0f, 3.5f, 8.0f)
            },
            new RoomDefinition {
                id = "annexure-g-stairwell",
                number = "Annexure Stairwell",
                name = "Annexure South Stairwell Foyer",
                category = "stairwell",
                block = "annexure",
                floor = "ground",
                capacity = 30,
                position = new Vector3(-41.0f, 0.0f, 2.5f),
                dimensions = new Vector3(8.0f, 3.5f, 5.0f)
            },
            new RoomDefinition {
                id = "annexure-g-lh1",
                number = "Lecture Hall 1",
                name = "Lecture Hall 1 (LH1)",
                category = "lecture_hall",
                block = "annexure",
                floor = "ground",
                capacity = 60,
                position = new Vector3(-47.0f, 0.0f, 8.0f),
                dimensions = new Vector3(12.0f, 3.5f, 12.0f)
            },
            new RoomDefinition {
                id = "annexure-g-lh2",
                number = "Lecture Hall 2",
                name = "Lecture Hall 2 (LH2)",
                category = "lecture_hall",
                block = "annexure",
                floor = "ground",
                capacity = 60,
                position = new Vector3(-47.0f, 0.0f, 20.0f),
                dimensions = new Vector3(12.0f, 3.5f, 12.0f)
            },
            new RoomDefinition {
                id = "annexure-g-lh3",
                number = "Lecture Hall 3",
                name = "Lecture Hall 3 (LH3)",
                category = "lecture_hall",
                block = "annexure",
                floor = "ground",
                capacity = 60,
                position = new Vector3(-47.0f, 0.0f, 32.0f),
                dimensions = new Vector3(12.0f, 3.5f, 12.0f)
            },
            new RoomDefinition {
                id = "annexure-g-girls-restroom",
                number = "Girls Restroom (Annexure)",
                name = "Girls Restroom (Annexure Ground)",
                category = "restroom",
                block = "annexure",
                floor = "ground",
                capacity = 10,
                position = new Vector3(-47.0f, 0.0f, 41.0f),
                dimensions = new Vector3(12.0f, 3.5f, 6.0f)
            },
            new RoomDefinition {
                id = "annexure-1-fc14",
                number = "FC(14)",
                name = "Faculty Cabin FC(14)",
                category = "staff_cabin",
                block = "annexure",
                floor = "first",
                capacity = 10,
                position = new Vector3(-47.0f, 4.0f, -4.0f),
                dimensions = new Vector3(12.0f, 3.5f, 8.0f)
            },
            new RoomDefinition {
                id = "annexure-1-stairwell",
                number = "Annexure Stairwell 1F",
                name = "Annexure 1F Stairwell Landing",
                category = "stairwell",
                block = "annexure",
                floor = "first",
                capacity = 30,
                position = new Vector3(-41.0f, 4.0f, 2.5f),
                dimensions = new Vector3(8.0f, 3.5f, 5.0f)
            },
            new RoomDefinition {
                id = "annexure-1-bridge-portal",
                number = "Bridge 1F",
                name = "First-Floor Pedestrian Bridge Portal",
                category = "bridge",
                block = "annexure",
                floor = "first",
                capacity = 20,
                position = new Vector3(-35.0f, 4.0f, 1.5f),
                dimensions = new Vector3(4.0f, 3.5f, 3.0f)
            },
            new RoomDefinition {
                id = "annexure-1-469",
                number = "469",
                name = "Classroom 469",
                category = "classroom",
                block = "annexure",
                floor = "first",
                capacity = 60,
                position = new Vector3(-47.0f, 4.0f, 8.5f),
                dimensions = new Vector3(12.0f, 3.5f, 7.0f)
            },
            new RoomDefinition {
                id = "annexure-1-470",
                number = "470",
                name = "Classroom 470",
                category = "classroom",
                block = "annexure",
                floor = "first",
                capacity = 60,
                position = new Vector3(-47.0f, 4.0f, 12.0f),
                dimensions = new Vector3(12.0f, 3.5f, 8.0f)
            },
            new RoomDefinition {
                id = "annexure-1-471",
                number = "471",
                name = "Classroom 471",
                category = "classroom",
                block = "annexure",
                floor = "first",
                capacity = 60,
                position = new Vector3(-47.0f, 4.0f, 20.0f),
                dimensions = new Vector3(12.0f, 3.5f, 8.0f)
            },
            new RoomDefinition {
                id = "annexure-1-472",
                number = "472",
                name = "Classroom 472",
                category = "classroom",
                block = "annexure",
                floor = "first",
                capacity = 60,
                position = new Vector3(-47.0f, 4.0f, 28.0f),
                dimensions = new Vector3(12.0f, 3.5f, 8.0f)
            },
            new RoomDefinition {
                id = "annexure-1-473",
                number = "473",
                name = "Classroom 473",
                category = "classroom",
                block = "annexure",
                floor = "first",
                capacity = 60,
                position = new Vector3(-47.0f, 4.0f, 36.0f),
                dimensions = new Vector3(12.0f, 3.5f, 8.0f)
            },
            new RoomDefinition {
                id = "annexure-1-girls-restroom",
                number = "Girls Restroom (Annexure)",
                name = "Girls Restroom (Annexure 1st Floor)",
                category = "restroom",
                block = "annexure",
                floor = "first",
                capacity = 10,
                position = new Vector3(-47.0f, 4.0f, 42.0f),
                dimensions = new Vector3(12.0f, 3.5f, 4.0f)
            },
            new RoomDefinition {
                id = "annexure-2-fc15",
                number = "FC(15)",
                name = "Faculty Cabin FC(15)",
                category = "staff_cabin",
                block = "annexure",
                floor = "second",
                capacity = 10,
                position = new Vector3(-47.0f, 8.0f, -4.0f),
                dimensions = new Vector3(12.0f, 3.5f, 8.0f)
            },
            new RoomDefinition {
                id = "annexure-2-stairwell",
                number = "Annexure Stairwell 2F",
                name = "Annexure 2F Stairwell Landing",
                category = "stairwell",
                block = "annexure",
                floor = "second",
                capacity = 30,
                position = new Vector3(-41.0f, 8.0f, 2.5f),
                dimensions = new Vector3(8.0f, 3.5f, 5.0f)
            },
            new RoomDefinition {
                id = "annexure-2-bridge-portal",
                number = "Bridge 2F",
                name = "Second-Floor Pedestrian Bridge Portal",
                category = "bridge",
                block = "annexure",
                floor = "second",
                capacity = 20,
                position = new Vector3(-35.0f, 8.0f, 1.5f),
                dimensions = new Vector3(4.0f, 3.5f, 3.0f)
            },
            new RoomDefinition {
                id = "annexure-2-474",
                number = "474",
                name = "Classroom 474",
                category = "classroom",
                block = "annexure",
                floor = "second",
                capacity = 60,
                position = new Vector3(-47.0f, 8.0f, 8.5f),
                dimensions = new Vector3(12.0f, 3.5f, 7.0f)
            },
            new RoomDefinition {
                id = "annexure-2-475",
                number = "475",
                name = "Classroom 475",
                category = "classroom",
                block = "annexure",
                floor = "second",
                capacity = 60,
                position = new Vector3(-47.0f, 8.0f, 12.0f),
                dimensions = new Vector3(12.0f, 3.5f, 8.0f)
            },
            new RoomDefinition {
                id = "annexure-2-476",
                number = "476",
                name = "Classroom 476",
                category = "classroom",
                block = "annexure",
                floor = "second",
                capacity = 60,
                position = new Vector3(-47.0f, 8.0f, 20.0f),
                dimensions = new Vector3(12.0f, 3.5f, 8.0f)
            },
            new RoomDefinition {
                id = "annexure-2-477",
                number = "477",
                name = "Classroom 477",
                category = "classroom",
                block = "annexure",
                floor = "second",
                capacity = 60,
                position = new Vector3(-47.0f, 8.0f, 28.0f),
                dimensions = new Vector3(12.0f, 3.5f, 8.0f)
            },
            new RoomDefinition {
                id = "annexure-2-478",
                number = "478",
                name = "Classroom 478",
                category = "classroom",
                block = "annexure",
                floor = "second",
                capacity = 60,
                position = new Vector3(-47.0f, 8.0f, 36.0f),
                dimensions = new Vector3(12.0f, 3.5f, 8.0f)
            },
            new RoomDefinition {
                id = "annexure-2-boys-restroom",
                number = "Boys Restroom (Annexure 2F)",
                name = "Boys Restroom (Annexure 2nd Floor)",
                category = "restroom",
                block = "annexure",
                floor = "second",
                capacity = 10,
                position = new Vector3(-47.0f, 8.0f, 42.0f),
                dimensions = new Vector3(12.0f, 3.5f, 4.0f)
            },
            new RoomDefinition {
                id = "annexure-3-staircase-foyer",
                number = "3F Foyer",
                name = "Annexure Third Floor Foyer & Staircase Access",
                category = "stairwell",
                block = "annexure",
                floor = "third",
                capacity = 20,
                position = new Vector3(-41.0f, 12.0f, 2.5f),
                dimensions = new Vector3(8.0f, 3.5f, 5.0f)
            },
            new RoomDefinition {
                id = "annexure-3-genai-lab",
                number = "Gen AI Lab",
                name = "Generative AI & Deep Learning Laboratory",
                category = "lab",
                block = "annexure",
                floor = "third",
                capacity = 180,
                position = new Vector3(-47.0f, 12.0f, 9.0f),
                dimensions = new Vector3(12.0f, 3.5f, 18.0f)
            },
            new RoomDefinition {
                id = "annexure-3-quantum-lab",
                number = "Quantum Computing Lab",
                name = "Quantum Information & Computing Laboratory",
                category = "lab",
                block = "annexure",
                floor = "third",
                capacity = 180,
                position = new Vector3(-47.0f, 12.0f, 27.0f),
                dimensions = new Vector3(12.0f, 3.5f, 18.0f)
            },
            new RoomDefinition {
                id = "annexure-3-boys-restroom",
                number = "Boys Restroom (Annexure 3F)",
                name = "Boys Restroom (Annexure 3rd Floor)",
                category = "restroom",
                block = "annexure",
                floor = "third",
                capacity = 10,
                position = new Vector3(-47.0f, 12.0f, 40.0f),
                dimensions = new Vector3(12.0f, 3.5f, 8.0f)
            },
        };
    }
}