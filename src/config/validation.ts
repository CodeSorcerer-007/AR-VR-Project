import { allRooms, bridgeLinks, courtyards, staircases } from './campus-data';

export interface ValidationIssue {
  severity: 'fatal' | 'warning';
  category: string;
  message: string;
}

export function validateCampusData(): { isValid: boolean; issues: ValidationIssue[] } {
  const issues: ValidationIssue[] = [];

  // 1. Check for Duplicate Room IDs
  const idSet = new Set<string>();
  for (const room of allRooms) {
    if (idSet.has(room.id)) {
      issues.push({
        severity: 'fatal',
        category: 'Integrity',
        message: `Duplicate room ID detected: ${room.id}`
      });
    }
    idSet.add(room.id);
  }

  // 2. Validate Bridges
  for (const bridge of bridgeLinks) {
    if (bridge.hasRoof) {
      issues.push({
        severity: 'fatal',
        category: 'Architecture',
        message: `Bridge ${bridge.id} violates explicit requirement: Bridges must NOT have roofs.`
      });
    }

    if (bridge.floor !== 'first' && bridge.floor !== 'second') {
      issues.push({
        severity: 'fatal',
        category: 'Architecture',
        message: `Bridge ${bridge.id} configured on invalid floor ${bridge.floor}. Only 1st and 2nd floors have bridges.`
      });
    }

    // Verify endpoints exist
    const fromRoom = allRooms.find((r) => r.id === bridge.fromRoomId);
    const toRoom = allRooms.find((r) => r.id === bridge.toRoomId);
    if (!fromRoom || !toRoom) {
      issues.push({
        severity: 'fatal',
        category: 'Navigation',
        message: `Bridge ${bridge.id} has invalid endpoints: from=${bridge.fromRoomId}, to=${bridge.toRoomId}`
      });
    }
  }

  // 3. Ground Level Gap Rule
  const groundBridge = bridgeLinks.find((b) => (b.floor as string) === 'ground');
  if (groundBridge) {
    issues.push({
      severity: 'fatal',
      category: 'Architecture',
      message: `Prohibited ground bridge found: ${groundBridge.id}. Blocks are physically separated at ground level.`
    });
  }

  // 4. Validate Lab Standardized Setup (180 computers each)
  const namedLabs = allRooms.filter((r) => r.category === 'lab' && r.id !== 'main-1-project-hub');
  for (const lab of namedLabs) {
    if (lab.capacity !== 180) {
      issues.push({
        severity: 'warning',
        category: 'Furnishing',
        message: `Lab ${lab.name} has capacity ${lab.capacity}, expected standardized 180 computers.`
      });
    }
  }

  // 5. Restroom Separation on Annexure
  const annexure2FBoys = allRooms.find((r) => r.id === 'annexure-2-boys-restroom');
  const annexure3FBoys = allRooms.find((r) => r.id === 'annexure-3-boys-restroom');
  if (!annexure2FBoys || !annexure3FBoys || annexure2FBoys.id === annexure3FBoys.id) {
    issues.push({
      severity: 'fatal',
      category: 'Architecture',
      message: 'Annexure 2nd floor and 3rd floor boys restrooms must be distinct, separate facilities.'
    });
  }

  // 6. Server Room Concealment Check
  const serverRoom = allRooms.find((r) => r.category === 'server_room');
  if (!serverRoom || serverRoom.furnishingTemplate !== 'server_room_concealed') {
    issues.push({
      severity: 'warning',
      category: 'Architecture',
      message: 'Server Room must have concealed interior and opaque door per Master Brief §6.'
    });
  }

  // 7. Courtyard Voids
  if (courtyards.length < 5) {
    issues.push({
      severity: 'warning',
      category: 'Architecture',
      message: `Expected 5 courtyard voids (4 Main, 1 Annexure), found ${courtyards.length}.`
    });
  }

  const hasFatal = issues.some((i) => i.severity === 'fatal');
  return {
    isValid: !hasFatal,
    issues
  };
}
