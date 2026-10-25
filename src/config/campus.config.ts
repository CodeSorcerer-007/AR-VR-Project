import { CampusConfig } from '../types/campus';

export const campusConfig: CampusConfig = {
  name: "St. Paul's Campus",
  blocks: {
    main: {
      name: "St. Paul's Main Block",
      floors: 4,
      exteriorSign: "ST. PAUL'S BLOCK",
      origin: [0, 0, 0],
      dimensions: [42, 16, 48] // [width, height, depth]
    },
    annexure: {
      name: "St. Paul's Annexure Block",
      floors: 4,
      origin: [-32, 0, 0],
      dimensions: [20, 16, 48]
    }
  },
  floorHeight: 4.0,
  ceilingHeight: 3.5,
  corridorWidth: 3.0,
  courtyardParapetHeight: 1.2
};
