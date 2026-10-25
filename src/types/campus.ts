export type BuildingBlock = 'main' | 'annexure';

export type FloorLevel = 'ground' | 'first' | 'second' | 'third';

export type RoomCategory =
  | 'classroom'
  | 'lab'
  | 'lecture_hall'
  | 'staff_cabin'
  | 'office'
  | 'restroom'
  | 'bridge'
  | 'facility'
  | 'server_room';

export interface RoomMetadata {
  id: string;
  number: string;
  name: string;
  category: RoomCategory;
  block: BuildingBlock;
  floor: FloorLevel;
  capacity: number;
  description: string;
  features: string[];
  furnishingTemplate: 'classroom_60' | 'lecture_120' | 'lab_180' | 'staff_cubicles_10' | 'project_hub' | 'dean_office' | 'server_room_concealed' | 'restroom_girls' | 'restroom_boys' | 'corridor_passage';
  position: [number, number, number]; // [x, y, z] in meters
  dimensions: [number, number, number]; // [width, height, depth]
  doorPosition: [number, number, number];
  doorSwing: 'left' | 'right';
  verified: boolean;
  source: 'sketch' | 'photo' | 'written_requirement' | 'inferred';
  confidence: 'high' | 'medium' | 'low';
  notes: string;
}

export interface CourtyardVoid {
  id: string;
  block: BuildingBlock;
  position: [number, number, number];
  dimensions: [number, number, number];
  parapetHeight: number;
}

export interface BridgeLink {
  id: string;
  name: string;
  floor: 'first' | 'second';
  fromBlock: BuildingBlock;
  fromRoomId: string;
  toBlock: BuildingBlock;
  toRoomId: string;
  startPoint: [number, number, number];
  endPoint: [number, number, number];
  width: number;
  hasRoof: boolean; // Must always be false
}

export interface StairFlight {
  id: string;
  block: BuildingBlock;
  fromFloor: FloorLevel;
  toFloor: FloorLevel;
  bottomPosition: [number, number, number];
  topPosition: [number, number, number];
  width: number;
}

export interface NavigationWaypoint {
  id: string;
  label: string;
  position: [number, number, number];
  floor: FloorLevel;
  block: BuildingBlock;
  neighbors: string[];
  roomId?: string;
  isStair?: boolean;
  isBridge?: boolean;
}

export interface CampusConfig {
  name: string;
  blocks: {
    main: {
      name: string;
      floors: number;
      exteriorSign: string;
      origin: [number, number, number];
      dimensions: [number, number, number];
    };
    annexure: {
      name: string;
      floors: number;
      exteriorSign?: string;
      origin: [number, number, number];
      dimensions: [number, number, number];
    };
  };
  floorHeight: number;
  ceilingHeight: number;
  corridorWidth: number;
  courtyardParapetHeight: number;
}
