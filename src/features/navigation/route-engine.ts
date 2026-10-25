import { NavigationWaypoint, FloorLevel, BuildingBlock } from '../../types/campus';
import { allRooms, bridgeLinks, staircases } from '../../config/campus-data';

// Auto-generate indoor corridor & portal waypoints
export function generateCampusNavigationGraph(): NavigationWaypoint[] {
  const waypoints: NavigationWaypoint[] = [];

  const floors: FloorLevel[] = ['ground', 'first', 'second', 'third'];
  const floorElevations: Record<FloorLevel, number> = {
    ground: 0,
    first: 4.0,
    second: 8.0,
    third: 12.0
  };

  // 1. Generate waypoints for each floor of St. Paul's Main Block
  floors.forEach((fl) => {
    const y = floorElevations[fl];

    // Main corridors: Front (Z = -2), Rear (Z = 32), West (X = -15), East (X = 15), Center cross (Z = 16)
    const pts = [
      // Front corridor
      { id: `main-${fl}-wp-front-west`, pos: [-15, y, -2], label: `Main ${fl} Front-West Corridor` },
      { id: `main-${fl}-wp-front-midwest`, pos: [-7, y, -2], label: `Main ${fl} Front Corridor` },
      { id: `main-${fl}-wp-front-center`, pos: [0, y, -2], label: `Main ${fl} Front Foyer` },
      { id: `main-${fl}-wp-front-mideast`, pos: [7, y, -2], label: `Main ${fl} Front Corridor` },
      { id: `main-${fl}-wp-front-east`, pos: [15, y, -2], label: `Main ${fl} Front-East Corridor` },

      // West Corridor (along X = -15, Annexure Bridge side)
      { id: `main-${fl}-wp-west-mid1`, pos: [-15, y, 1.5], label: `Main ${fl} West Corridor (Bridge Portal)` },
      { id: `main-${fl}-wp-west-cross`, pos: [-15, y, 16], label: `Main ${fl} West Junction` },
      { id: `main-${fl}-wp-west-mid2`, pos: [-15, y, 26], label: `Main ${fl} West Corridor (North)` },
      { id: `main-${fl}-wp-west-rear`, pos: [-15, y, 32], label: `Main ${fl} Rear-West Corridor` },

      // East Corridor (along X = 15)
      { id: `main-${fl}-wp-east-mid1`, pos: [15, y, 6], label: `Main ${fl} East Corridor (South)` },
      { id: `main-${fl}-wp-east-cross`, pos: [15, y, 16], label: `Main ${fl} East Junction` },
      { id: `main-${fl}-wp-east-mid2`, pos: [15, y, 26], label: `Main ${fl} East Corridor (North)` },
      { id: `main-${fl}-wp-east-rear`, pos: [15, y, 32], label: `Main ${fl} Rear-East Corridor` },

      // Central cross corridor (along Z = 16)
      { id: `main-${fl}-wp-center-core`, pos: [0, y, 16], label: `Main ${fl} Central Lab Portal` },

      // Rear corridor (along Z = 32)
      { id: `main-${fl}-wp-rear-midwest`, pos: [-7, y, 32], label: `Main ${fl} Rear Corridor` },
      { id: `main-${fl}-wp-rear-center`, pos: [0, y, 32], label: `Main ${fl} Rear Foyer` },
      { id: `main-${fl}-wp-rear-mideast`, pos: [7, y, 32], label: `Main ${fl} Rear Corridor` }
    ];

    pts.forEach((p) => {
      waypoints.push({
        id: p.id,
        label: p.label,
        position: p.pos as [number, number, number],
        floor: fl,
        block: 'main',
        neighbors: []
      });
    });

    // Add ground exterior entrance node
    if (fl === 'ground') {
      waypoints.push({
        id: 'main-g-wp-exterior-approach',
        label: 'Main Exterior Approach (Outside Main Entrance)',
        position: [0, 0, -12],
        floor: 'ground',
        block: 'main',
        neighbors: ['main-ground-wp-front-center']
      });
    }

    // Connect corridor nodes on this floor
    connectWaypoints(waypoints, `main-${fl}-wp-front-west`, `main-${fl}-wp-front-midwest`);
    connectWaypoints(waypoints, `main-${fl}-wp-front-midwest`, `main-${fl}-wp-front-center`);
    connectWaypoints(waypoints, `main-${fl}-wp-front-center`, `main-${fl}-wp-front-mideast`);
    connectWaypoints(waypoints, `main-${fl}-wp-front-mideast`, `main-${fl}-wp-front-east`);

    connectWaypoints(waypoints, `main-${fl}-wp-front-west`, `main-${fl}-wp-west-mid1`);
    connectWaypoints(waypoints, `main-${fl}-wp-west-mid1`, `main-${fl}-wp-west-cross`);
    connectWaypoints(waypoints, `main-${fl}-wp-west-cross`, `main-${fl}-wp-west-mid2`);
    connectWaypoints(waypoints, `main-${fl}-wp-west-mid2`, `main-${fl}-wp-west-rear`);

    connectWaypoints(waypoints, `main-${fl}-wp-front-east`, `main-${fl}-wp-east-mid1`);
    connectWaypoints(waypoints, `main-${fl}-wp-east-mid1`, `main-${fl}-wp-east-cross`);
    connectWaypoints(waypoints, `main-${fl}-wp-east-cross`, `main-${fl}-wp-east-mid2`);
    connectWaypoints(waypoints, `main-${fl}-wp-east-mid2`, `main-${fl}-wp-east-rear`);

    connectWaypoints(waypoints, `main-${fl}-wp-west-cross`, `main-${fl}-wp-center-core`);
    connectWaypoints(waypoints, `main-${fl}-wp-center-core`, `main-${fl}-wp-east-cross`);

    connectWaypoints(waypoints, `main-${fl}-wp-west-rear`, `main-${fl}-wp-rear-midwest`);
    connectWaypoints(waypoints, `main-${fl}-wp-rear-midwest`, `main-${fl}-wp-rear-center`);
    connectWaypoints(waypoints, `main-${fl}-wp-rear-center`, `main-${fl}-wp-rear-mideast`);
    connectWaypoints(waypoints, `main-${fl}-wp-rear-mideast`, `main-${fl}-wp-east-rear`);
  });

  // 2. Generate waypoints for St. Paul's Annexure Block
  floors.forEach((fl) => {
    const y = floorElevations[fl];

    // Annexure corridor runs along X = -36 from Z = -2 to Z = 37
    const pts = [
      { id: `annexure-${fl}-wp-south`, pos: [-36, y, -2], label: `Annexure ${fl} South Foyer` },
      { id: `annexure-${fl}-wp-bridge-portal`, pos: [-36, y, 1.5], label: `Annexure ${fl} Bridge/Stair Portal` },
      { id: `annexure-${fl}-wp-mid1`, pos: [-36, y, 10], label: `Annexure ${fl} Corridor (South)` },
      { id: `annexure-${fl}-wp-mid2`, pos: [-36, y, 20], label: `Annexure ${fl} Corridor (Center)` },
      { id: `annexure-${fl}-wp-mid3`, pos: [-36, y, 30], label: `Annexure ${fl} Corridor (North)` },
      { id: `annexure-${fl}-wp-north`, pos: [-36, y, 37], label: `Annexure ${fl} North End` }
    ];

    pts.forEach((p) => {
      waypoints.push({
        id: p.id,
        label: p.label,
        position: p.pos as [number, number, number],
        floor: fl,
        block: 'annexure',
        neighbors: []
      });
    });

    connectWaypoints(waypoints, `annexure-${fl}-wp-south`, `annexure-${fl}-wp-bridge-portal`);
    connectWaypoints(waypoints, `annexure-${fl}-wp-bridge-portal`, `annexure-${fl}-wp-mid1`);
    connectWaypoints(waypoints, `annexure-${fl}-wp-mid1`, `annexure-${fl}-wp-mid2`);
    connectWaypoints(waypoints, `annexure-${fl}-wp-mid2`, `annexure-${fl}-wp-mid3`);
    connectWaypoints(waypoints, `annexure-${fl}-wp-mid3`, `annexure-${fl}-wp-north`);
  });

  // 3. Connect Staircases (Vertical inter-floor physical paths)
  // Main West Stairs (Ground <-> First <-> Second <-> Third)
  connectWaypoints(waypoints, 'main-ground-wp-front-west', 'main-first-wp-front-west');
  connectWaypoints(waypoints, 'main-first-wp-front-west', 'main-second-wp-front-west');
  connectWaypoints(waypoints, 'main-second-wp-front-west', 'main-third-wp-front-west');

  // Main East Stairs (Ground <-> First <-> Second <-> Third)
  connectWaypoints(waypoints, 'main-ground-wp-front-east', 'main-first-wp-front-east');
  connectWaypoints(waypoints, 'main-first-wp-front-east', 'main-second-wp-front-east');
  connectWaypoints(waypoints, 'main-second-wp-front-east', 'main-third-wp-front-east');

  // Annexure Stairs (Ground <-> First <-> Second <-> Third)
  connectWaypoints(waypoints, 'annexure-ground-wp-bridge-portal', 'annexure-first-wp-bridge-portal');
  connectWaypoints(waypoints, 'annexure-first-wp-bridge-portal', 'annexure-second-wp-bridge-portal');
  connectWaypoints(waypoints, 'annexure-second-wp-bridge-portal', 'annexure-third-wp-bridge-portal');

  // 4. Connect Permitted Open-Air Bridges (1st Floor and 2nd Floor ONLY)
  // Bridge 1F: Main 1st Floor (West) <-> Annexure 1st Floor Portal
  connectWaypoints(waypoints, 'main-first-wp-west-mid1', 'annexure-first-wp-bridge-portal');

  // Bridge 2F: Main 2nd Floor (West) <-> Annexure 2nd Floor Portal
  connectWaypoints(waypoints, 'main-second-wp-west-mid1', 'annexure-second-wp-bridge-portal');

  // 5. Connect Ground-Level Outdoor Walkway (Between Main and Annexure)
  connectWaypoints(waypoints, 'main-ground-wp-front-west', 'annexure-ground-wp-bridge-portal');
  connectWaypoints(waypoints, 'main-g-wp-exterior-approach', 'annexure-ground-wp-south');

  // 5. Connect Rooms to Nearest Corridor Waypoints
  allRooms.forEach((room) => {
    const rWpId = `wp-room-${room.id}`;
    waypoints.push({
      id: rWpId,
      label: `${room.number} - ${room.name}`,
      position: room.doorPosition,
      floor: room.floor,
      block: room.block,
      roomId: room.id,
      neighbors: []
    });

    // Find closest corridor waypoint on the same floor and block
    let closestId = '';
    let closestDist = Infinity;
    waypoints.forEach((wp) => {
      if (wp.id !== rWpId && wp.floor === room.floor && wp.block === room.block && !wp.roomId) {
        const dx = wp.position[0] - room.doorPosition[0];
        const dz = wp.position[2] - room.doorPosition[2];
        const d = Math.sqrt(dx * dx + dz * dz);
        if (d < closestDist) {
          closestDist = d;
          closestId = wp.id;
        }
      }
    });

    if (closestId) {
      connectWaypoints(waypoints, rWpId, closestId);
    }
  });

  return waypoints;
}

function connectWaypoints(list: NavigationWaypoint[], idA: string, idB: string) {
  const a = list.find((w) => w.id === idA);
  const b = list.find((w) => w.id === idB);
  if (a && b) {
    if (!a.neighbors.includes(idB)) a.neighbors.push(idB);
    if (!b.neighbors.includes(idA)) b.neighbors.push(idA);
  }
}

export interface RouteResult {
  found: boolean;
  path: [number, number, number][];
  waypoints: NavigationWaypoint[];
  distanceMeters: number;
  estimatedWalkingSeconds: number;
  steps: string[];
  floorsTraversed: FloorLevel[];
  bridgesUsed: string[];
  blockTransition: boolean;
}

export function findRoute(
  fromPosition: [number, number, number],
  targetRoomId: string,
  waypoints: NavigationWaypoint[]
): RouteResult {
  const targetWp = waypoints.find((w) => w.roomId === targetRoomId);
  if (!targetWp) {
    return {
      found: false,
      path: [],
      waypoints: [],
      distanceMeters: 0,
      estimatedWalkingSeconds: 0,
      steps: ['Target destination not recognized in campus directory.'],
      floorsTraversed: [],
      bridgesUsed: [],
      blockTransition: false
    };
  }

  // Find start waypoint closest to fromPosition
  let startWp = waypoints[0];
  let minStartDist = Infinity;
  for (const wp of waypoints) {
    const dx = wp.position[0] - fromPosition[0];
    const dy = wp.position[1] - fromPosition[1];
    const dz = wp.position[2] - fromPosition[2];
    const d = Math.sqrt(dx * dx + dy * dy * 4 + dz * dz); // Penalize vertical floor differences
    if (d < minStartDist) {
      minStartDist = d;
      startWp = wp;
    }
  }

  // Dijkstra Shortest Path Search
  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const unvisited = new Set<string>();

  waypoints.forEach((w) => {
    distances[w.id] = Infinity;
    previous[w.id] = null;
    unvisited.add(w.id);
  });
  distances[startWp.id] = 0;

  const wpMap = new Map<string, NavigationWaypoint>();
  waypoints.forEach((w) => wpMap.set(w.id, w));

  while (unvisited.size > 0) {
    // Find unvisited with lowest distance
    let currentId: string | null = null;
    let lowestDist = Infinity;
    unvisited.forEach((id) => {
      if (distances[id] < lowestDist) {
        lowestDist = distances[id];
        currentId = id;
      }
    });

    if (!currentId || lowestDist === Infinity) break;
    if (currentId === targetWp.id) break;

    unvisited.delete(currentId);
    const curr = wpMap.get(currentId)!;

    for (const neighborId of curr.neighbors) {
      if (!unvisited.has(neighborId)) continue;
      const neighbor = wpMap.get(neighborId);
      if (!neighbor) continue;

      const dx = neighbor.position[0] - curr.position[0];
      const dy = neighbor.position[1] - curr.position[1];
      const dz = neighbor.position[2] - curr.position[2];
      const edgeWeight = Math.sqrt(dx * dx + dy * dy + dz * dz) + (dy !== 0 ? 8 : 0); // slight stair penalty

      const alt = distances[currentId] + edgeWeight;
      if (alt < distances[neighborId]) {
        distances[neighborId] = alt;
        previous[neighborId] = currentId;
      }
    }
  }

  // Reconstruct path
  const pathWaypoints: NavigationWaypoint[] = [];
  let currStep: string | null = targetWp.id;

  if (distances[targetWp.id] === Infinity) {
    return {
      found: false,
      path: [],
      waypoints: [],
      distanceMeters: 0,
      estimatedWalkingSeconds: 0,
      steps: [
        'No valid physical route exists to this destination from current position. Ground level between blocks is impassable. Please use a staircase to 1st or 2nd floor to cross bridges.'
      ],
      floorsTraversed: [],
      bridgesUsed: [],
      blockTransition: false
    };
  }

  while (currStep) {
    const wp = wpMap.get(currStep);
    if (wp) pathWaypoints.unshift(wp);
    currStep = previous[currStep];
  }

  // Compute metrics and natural language turn-by-turn guidance
  const path: [number, number, number][] = [fromPosition, ...pathWaypoints.map((w) => w.position)];
  let totalDistance = 0;
  for (let i = 1; i < path.length; i++) {
    const [x1, y1, z1] = path[i - 1];
    const [x2, y2, z2] = path[i];
    totalDistance += Math.hypot(x2 - x1, y2 - y1, z2 - z1);
  }

  const floorsTraversed = Array.from(new Set(pathWaypoints.map((w) => w.floor)));
  const blocksTraversed = Array.from(new Set(pathWaypoints.map((w) => w.block)));
  const blockTransition = blocksTraversed.length > 1;

  const bridgesUsed: string[] = [];
  const steps: string[] = [];

  steps.push(`Start journey at ${startWp.label}`);

  for (let i = 0; i < pathWaypoints.length - 1; i++) {
    const w1 = pathWaypoints[i];
    const w2 = pathWaypoints[i + 1];

    if (w1.floor !== w2.floor) {
      steps.push(`Use staircase to transition from ${w1.floor.toUpperCase()} floor to ${w2.floor.toUpperCase()} floor`);
    } else if (w1.block !== w2.block) {
      const bName = w1.floor === 'first' ? 'First-Floor Open Pedestrian Bridge' : 'Second-Floor Open Pedestrian Bridge';
      bridgesUsed.push(bName);
      steps.push(`Cross the ${bName} from ${w1.block === 'main' ? "Main" : "Annexure"} to ${w2.block === 'main' ? "Main" : "Annexure"}`);
    }
  }

  const destRoom = allRooms.find((r) => r.id === targetRoomId);
  steps.push(`Arrive at ${destRoom ? `${destRoom.number} — ${destRoom.name}` : targetWp.label}`);

  return {
    found: true,
    path,
    waypoints: pathWaypoints,
    distanceMeters: Math.round(totalDistance * 10) / 10,
    estimatedWalkingSeconds: Math.round(totalDistance / 1.4), // 1.4 m/s typical walking speed
    steps,
    floorsTraversed,
    bridgesUsed: Array.from(new Set(bridgesUsed)),
    blockTransition
  };
}
