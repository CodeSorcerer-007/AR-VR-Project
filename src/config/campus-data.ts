import { RoomMetadata, CourtyardVoid, BridgeLink, StairFlight } from '../types/campus';
import { mainGroundRooms } from './floors/main-ground';
import { mainFirstRooms } from './floors/main-first';
import { mainSecondRooms } from './floors/main-second';
import { mainThirdRooms } from './floors/main-third';
import { annexureGroundRooms } from './floors/annexure-ground';
import { annexureFirstRooms } from './floors/annexure-first';
import { annexureSecondRooms } from './floors/annexure-second';
import { annexureThirdRooms } from './floors/annexure-third';

// Aggregated Room Catalog
export const allRooms: RoomMetadata[] = [
  ...mainGroundRooms,
  ...mainFirstRooms,
  ...mainSecondRooms,
  ...mainThirdRooms,
  ...annexureGroundRooms,
  ...annexureFirstRooms,
  ...annexureSecondRooms,
  ...annexureThirdRooms
];

// Open-to-sky vertical courtyards (voids through all 4 floors)
export const courtyards: CourtyardVoid[] = [
  // St. Paul's Main: 4 vertical light wells
  {
    id: 'main-courtyard-front-west',
    block: 'main',
    position: [-7, 8, 6.5],
    dimensions: [7, 16, 6],
    parapetHeight: 1.2
  },
  {
    id: 'main-courtyard-front-east',
    block: 'main',
    position: [7, 8, 6.5],
    dimensions: [7, 16, 6],
    parapetHeight: 1.2
  },
  {
    id: 'main-courtyard-rear-west',
    block: 'main',
    position: [-7, 8, 25.5],
    dimensions: [7, 16, 6],
    parapetHeight: 1.2
  },
  {
    id: 'main-courtyard-rear-east',
    block: 'main',
    position: [7, 8, 25.5],
    dimensions: [7, 16, 6],
    parapetHeight: 1.2
  },
  // St. Paul's Annexure: central light well
  {
    id: 'annexure-courtyard-east',
    block: 'annexure',
    position: [-43, 8, 19],
    dimensions: [3, 16, 12],
    parapetHeight: 1.2
  }
];

// Open-air Pedestrian Bridges between Main (West wall) and Annexure (East corridor)
export const bridgeLinks: BridgeLink[] = [
  {
    id: 'bridge-first-floor',
    name: 'First-Floor Pedestrian Bridge',
    floor: 'first',
    fromBlock: 'main',
    fromRoomId: 'main-1-fc3',
    toBlock: 'annexure',
    toRoomId: 'annexure-1-469',
    startPoint: [-21, 4.0, 1.5],
    endPoint: [-33, 4.0, 1.5],
    width: 3.0,
    hasRoof: false // Strictly open-air
  },
  {
    id: 'bridge-second-floor',
    name: 'Second-Floor Pedestrian Bridge',
    floor: 'second',
    fromBlock: 'main',
    fromRoomId: 'main-2-fc6',
    toBlock: 'annexure',
    toRoomId: 'annexure-2-474',
    startPoint: [-21, 8.0, 1.5],
    endPoint: [-33, 8.0, 1.5],
    width: 3.0,
    hasRoof: false // Strictly open-air
  }
];

// Staircase flights connecting floors (Two U-shaped dog-leg stairs in Main, one in Annexure)
export const staircases: StairFlight[] = [
  // Main West Stairs (Southwest Room side: Ground -> 1st -> 2nd -> 3rd)
  {
    id: 'main-west-stair-g-1',
    block: 'main',
    fromFloor: 'ground',
    toFloor: 'first',
    bottomPosition: [-15, 0, 0.5],
    topPosition: [-15, 4.0, 4.5],
    width: 2.4
  },
  {
    id: 'main-west-stair-1-2',
    block: 'main',
    fromFloor: 'first',
    toFloor: 'second',
    bottomPosition: [-15, 4.0, 0.5],
    topPosition: [-15, 8.0, 4.5],
    width: 2.4
  },
  {
    id: 'main-west-stair-2-3',
    block: 'main',
    fromFloor: 'second',
    toFloor: 'third',
    bottomPosition: [-15, 8.0, 0.5],
    topPosition: [-15, 12.0, 4.5],
    width: 2.4
  },
  // Main East Stairs (Southeast Room side: Ground -> 1st -> 2nd -> 3rd)
  {
    id: 'main-east-stair-g-1',
    block: 'main',
    fromFloor: 'ground',
    toFloor: 'first',
    bottomPosition: [15, 0, 0.5],
    topPosition: [15, 4.0, 4.5],
    width: 2.4
  },
  {
    id: 'main-east-stair-1-2',
    block: 'main',
    fromFloor: 'first',
    toFloor: 'second',
    bottomPosition: [15, 4.0, 0.5],
    topPosition: [15, 8.0, 4.5],
    width: 2.4
  },
  {
    id: 'main-east-stair-2-3',
    block: 'main',
    fromFloor: 'second',
    toFloor: 'third',
    bottomPosition: [15, 8.0, 0.5],
    topPosition: [15, 12.0, 4.5],
    width: 2.4
  },
  // Annexure Stairs (West Corridor side: Ground -> 1st -> 2nd -> 3rd)
  {
    id: 'annexure-stair-g-1',
    block: 'annexure',
    fromFloor: 'ground',
    toFloor: 'first',
    bottomPosition: [-45, 0, 0.5],
    topPosition: [-45, 4.0, 4.5],
    width: 2.4
  },
  {
    id: 'annexure-stair-1-2',
    block: 'annexure',
    fromFloor: 'first',
    toFloor: 'second',
    bottomPosition: [-45, 4.0, 0.5],
    topPosition: [-45, 8.0, 4.5],
    width: 2.4
  },
  {
    id: 'annexure-stair-2-3',
    block: 'annexure',
    fromFloor: 'second',
    toFloor: 'third',
    bottomPosition: [-45, 8.0, 0.5],
    topPosition: [-45, 12.0, 4.5],
    width: 2.4
  }
];

// Helper queries
export function getRoomById(id: string): RoomMetadata | undefined {
  return allRooms.find((r) => r.id === id);
}

export function getRoomsByFloor(block: 'main' | 'annexure', floor: 'ground' | 'first' | 'second' | 'third'): RoomMetadata[] {
  return allRooms.filter((r) => r.block === block && r.floor === floor);
}

export function searchRooms(query: string): RoomMetadata[] {
  const q = query.trim().toLowerCase();
  if (!q) return allRooms;
  return allRooms.filter((r) =>
    r.number.toLowerCase().includes(q) ||
    r.name.toLowerCase().includes(q) ||
    r.category.toLowerCase().includes(q) ||
    r.block.toLowerCase().includes(q) ||
    r.floor.toLowerCase().includes(q) ||
    r.features.some((f) => f.toLowerCase().includes(q))
  );
}
