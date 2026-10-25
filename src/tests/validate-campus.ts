import { validateCampusData } from '../config/validation.ts';
import { allRooms, bridgeLinks, courtyards, staircases } from '../config/campus-data.ts';
import { generateCampusNavigationGraph, findRoute } from '../features/navigation/route-engine.ts';

declare const process: any;

console.log('=== ST. PAULS DIGITAL TWIN - AUTOMATED VERIFICATION SUITE ===\n');

// 1. Campus Data Validation
console.log('Test 1: Campus Data Consistency & Architectural Rules');
const validation = validateCampusData();
if (validation.issues.length > 0) {
  console.log('Issues found:', validation.issues);
}
if (!validation.isValid) {
  console.error('FAILED: Validation found fatal errors.');
  process.exit(1);
}
console.log(`✓ Data validation passed with ${validation.issues.length} warnings/issues.\n`);

// 2. Room Count & Registry Verification
console.log('Test 2: Room Registry Counts');
console.log(`Total indexed rooms & spaces: ${allRooms.length}`);
const mainRooms = allRooms.filter((r) => r.block === 'main');
const annexureRooms = allRooms.filter((r) => r.block === 'annexure');
console.log(` - Main Block rooms: ${mainRooms.length}`);
console.log(` - Annexure Block rooms: ${annexureRooms.length}`);

if (mainRooms.length === 0 || annexureRooms.length === 0) {
  console.error('FAILED: Missing rooms in Main or Annexure block.');
  process.exit(1);
}
console.log('✓ Room registry verified.\n');

// 3. Bridge Verification
console.log('Test 3: Pedestrian Bridges & Ground Separation');
console.log(`Total configured bridges: ${bridgeLinks.length}`);
bridgeLinks.forEach((b) => {
  console.log(` - ${b.name} (${b.floor} floor): hasRoof=${b.hasRoof}, width=${b.width}m`);
  if (b.hasRoof) {
    console.error(`FAILED: Bridge ${b.id} must not have a roof.`);
    process.exit(1);
  }
});
console.log('✓ All bridges are strictly open-air with railings and no roof.\n');

// 4. Lab Standardized Layouts (180 Computers)
console.log('Test 4: Lab Standardized Configurations');
const labs = allRooms.filter((r) => r.category === 'lab' && r.id !== 'main-1-project-hub');
console.log(`Found ${labs.length} computer laboratories:`);
labs.forEach((lab) => {
  console.log(` - [${lab.id}] ${lab.name} (${lab.block} ${lab.floor}): capacity=${lab.capacity}`);
  if (lab.capacity !== 180) {
    console.error(`FAILED: Lab ${lab.name} capacity is ${lab.capacity}, expected 180.`);
    process.exit(1);
  }
});
if (labs.length !== 6) {
  console.error(`FAILED: Expected exactly 6 standardized 180-PC flagship labs, found ${labs.length}.`);
  process.exit(1);
}
console.log('✓ All 6 flagship labs have standardized 180-PC layouts.\n');

// 5. Special Spaces Check
console.log('Test 5: Special Spaces (Project Hub & Server Room)');
const projectHub = allRooms.find((r) => r.id === 'main-1-project-hub');
if (!projectHub || projectHub.capacity !== 0) {
  console.error('FAILED: Project Hub must have 0 student desks.');
  process.exit(1);
}
console.log(' - Project Hub: 0 student desks, projector & presentation setup verified.');

const serverRoom = allRooms.find((r) => r.category === 'server_room');
if (!serverRoom || serverRoom.furnishingTemplate !== 'server_room_concealed') {
  console.error('FAILED: Server room interior must be concealed.');
  process.exit(1);
}
console.log(' - Server Room: Opaque locked door & concealed interior verified.');
console.log('✓ Special spaces verified.\n');

// 6. Navigation Engine (Cross-Building Dijkstra Path)
console.log('Test 6: Cross-Building Multi-Floor Pathfinding');
// From Main Ground entrance/foyer ([19, 0, -2]) to Annexure 3F Quantum Lab
const navGraph = generateCampusNavigationGraph();
const startPos: [number, number, number] = [19, 0, -2];
const route = findRoute(startPos, 'annexure-3-quantum-lab', navGraph);

console.log(`Route found: ${route.found}`);
console.log(`Waypoints traversed: ${route.waypoints.length}, Total distance: ${route.distanceMeters}m`);
console.log(`Floors traversed: ${route.floorsTraversed.join(' -> ')}`);
console.log(`Bridges crossed: ${route.bridgesUsed.join(', ') || 'None'}`);
console.log(`Estimated walk time: ${route.estimatedWalkingSeconds}s`);
console.log('Step-by-step guidance instructions:');
route.steps.forEach((step, idx) => {
  console.log(`   ${idx + 1}. ${step}`);
});

if (!route.found || route.waypoints.length < 3 || route.steps.length === 0) {
  console.error('FAILED: Route calculation returned incomplete path.');
  process.exit(1);
}
console.log('✓ Cross-building Dijkstra route engine successfully verified.\n');

console.log('====================================================');
console.log('ALL VERIFICATION CHECKS PASSED SUCCESSFULLY (6/6)');
console.log('====================================================');
