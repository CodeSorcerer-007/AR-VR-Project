export interface PresentationWaypoint {
  title: string;
  subtitle: string;
  camPos: [number, number, number];
  lookAt: [number, number, number];
}

export const presentationWaypoints: PresentationWaypoint[] = [
  {
    title: "1. Campus Approach & St. Paul's Block Facade",
    subtitle: "Main entrance portico showing 4-storey exterior architecture, maroon department pediment, and 'ST. PAUL'S BLOCK' rooftop signage.",
    camPos: [0, 5.5, -30],
    lookAt: [0, 8.0, -8]
  },
  {
    title: '2. First-Floor Open Pedestrian Bridge',
    subtitle: 'Uncovered pedestrian link spanning between Faculty Cabin 3 on Main and Room 471 on Annexure.',
    camPos: [27, 6.5, -6],
    lookAt: [27, 4.0, 1.5]
  },
  {
    title: '3. Annexure Lecture Hall 1 (LH1)',
    subtitle: 'Flat-floor 60-seat academic lecture hall with student benches and audiovisual projection.',
    camPos: [43, 2.8, 14],
    lookAt: [47, 1.8, 8]
  },
  {
    title: '4. Second-Floor Pedestrian Bridge',
    subtitle: 'Upper open-air bridge link between Faculty Cabin 6 on Main and Room 474 on Annexure.',
    camPos: [27, 10.5, -6],
    lookAt: [27, 8.0, 1.5]
  },
  {
    title: '5. Flagship Gen AI Laboratory',
    subtitle: 'Standardized 180-computer engineering lab setup with 3 ceiling-mounted projectors and feature glass entrance.',
    camPos: [43, 14.5, 14],
    lookAt: [43, 13.5, 8]
  },
  {
    title: '6. Server Room Infrastructure',
    subtitle: 'Concealed data room behind Machine Vision Lab with glass viewing panels and blinking rack LEDs.',
    camPos: [0, 9.7, 16],
    lookAt: [0, 9.7, 20]
  },
  {
    title: '7. Campus Bird’s-Eye Overview',
    subtitle: 'Unified architectural perspective matching 3D isometric overview showing both 4-storey collegiate blocks, rooftop solar arrays, cruciform tile walkway, and arched blue connecting corridor.',
    camPos: [18, 48.0, -54],
    lookAt: [16, 10.0, 16]
  }
];
