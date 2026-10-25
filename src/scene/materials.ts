import * as THREE from 'three';

// Procedural Canvas Texture Generator for Polished Grey Granite with Veining & Grout
function createTileTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Polished architectural grey granite base
  ctx.fillStyle = '#dde3ea';
  ctx.fillRect(0, 0, 512, 512);

  // Natural granite fine grain / mineral specks
  for (let i = 0; i < 2000; i++) {
    const v = Math.floor(Math.random() * 45 + 175);
    const alpha = Math.random() * 0.45 + 0.1;
    ctx.fillStyle = `rgba(${v - 20}, ${v - 15}, ${v}, ${alpha})`;
    ctx.fillRect(Math.random() * 512, Math.random() * 512, 1 + Math.random() * 2, 1 + Math.random() * 2);
  }

  // Subtle organic vein strokes
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 6; i++) {
    ctx.beginPath();
    let sx = Math.random() * 512;
    let sy = Math.random() * 512;
    ctx.moveTo(sx, sy);
    for (let s = 0; s < 4; s++) {
      sx += (Math.random() - 0.4) * 80;
      sy += (Math.random() - 0.4) * 80;
      ctx.lineTo(sx, sy);
    }
    ctx.stroke();
  }

  // Crisp fine dark-grey tile joints (600x600 grid)
  ctx.strokeStyle = 'rgba(71, 85, 105, 0.45)';
  ctx.lineWidth = 2;

  const tileSize = 128;
  for (let x = 0; x <= 512; x += tileSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 512);
    ctx.stroke();
  }
  for (let y = 0; y <= 512; y += tileSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(12, 12);
  return texture;
}

// Procedural Canvas Texture for Teak Wood Flush Doors with Chevron Grooves
function createDoorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Warm honey-teak wood base
  const grad = ctx.createLinearGradient(0, 0, 256, 512);
  grad.addColorStop(0, '#a16207');
  grad.addColorStop(0.5, '#b45309');
  grad.addColorStop(1, '#92400e');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 512);

  // Subtle vertical wood grain fibers
  for (let x = 0; x < 256; x += 3) {
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(120, 53, 15, 0.25)' : 'rgba(217, 119, 6, 0.18)';
    ctx.fillRect(x, 0, 1 + Math.random() * 2, 512);
  }

  // Subtle routed chevron / geometric accent grooves
  ctx.strokeStyle = 'rgba(67, 20, 7, 0.35)';
  ctx.lineWidth = 2;
  for (let y = 80; y < 440; y += 45) {
    ctx.beginPath();
    ctx.moveTo(30, y);
    ctx.lineTo(128, y - 25);
    ctx.lineTo(226, y);
    ctx.stroke();
  }

  // Perimeter margin bevel
  ctx.strokeStyle = 'rgba(67, 20, 7, 0.5)';
  ctx.lineWidth = 4;
  ctx.strokeRect(6, 6, 244, 500);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// Procedural Canvas Texture for Linear Wood-Slat Ceilings (Portico & Web 3 Lab)
function createWoodSlatTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Dark shadow backing behind slats
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, 256, 256);

  // Golden teak wood slats with dark reveal grooves
  const slatWidth = 16;
  const slatSpacing = 20;

  for (let x = 0; x < 256; x += slatSpacing) {
    ctx.fillStyle = '#b45309';
    ctx.fillRect(x, 0, slatWidth, 256);

    // Slat wood highlight
    ctx.fillStyle = 'rgba(251, 191, 36, 0.25)';
    ctx.fillRect(x + 1, 0, 3, 256);

    // Slat edge shadow
    ctx.fillStyle = 'rgba(69, 26, 3, 0.45)';
    ctx.fillRect(x + slatWidth - 2, 0, 2, 256);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

// Procedural Canvas Texture for Courtyard Terracotta Paver Flooring
function createCourtyardTileTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#9a3412'; // Terracotta clay red
  ctx.fillRect(0, 0, 256, 256);

  // Paver texture noise
  for (let i = 0; i < 500; i++) {
    const v = Math.random() > 0.5 ? 'rgba(154, 52, 18, 0.35)' : 'rgba(234, 88, 12, 0.25)';
    ctx.fillStyle = v;
    ctx.fillRect(Math.random() * 256, Math.random() * 256, 4, 4);
  }

  // Interlocking grid joints
  ctx.strokeStyle = '#431407';
  ctx.lineWidth = 3;
  const s = 64;
  for (let x = 0; x <= 256; x += s) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 256);
    ctx.stroke();
  }
  for (let y = 0; y <= 256; y += s) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(256, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 6);
  return texture;
}

// Procedural Canvas Texture for Asphalt Road
function createAsphaltTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#262930';
  ctx.fillRect(0, 0, 256, 256);

  // Noise specks
  for (let i = 0; i < 400; i++) {
    const v = Math.floor(Math.random() * 30 + 35);
    ctx.fillStyle = `rgb(${v},${v},${v})`;
    ctx.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 8);
  return texture;
}

// Procedural Canvas Texture for Black & White Striped Curb
export function createCurbTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 64, 32);
  ctx.fillStyle = '#1e232a';
  ctx.fillRect(64, 0, 64, 32);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(16, 1);
  return texture;
}

let cachedGrillTex: THREE.CanvasTexture | null = null;
export function createWindowGrillTexture(): THREE.CanvasTexture {
  if (cachedGrillTex) return cachedGrillTex;
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Translucent tinted glass aperture backing
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, 'rgba(15, 23, 42, 0.92)');
  grad.addColorStop(1, 'rgba(15, 23, 42, 0.85)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Metal window security bars
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 5;

  // Vertical security bars (spacing = 48px)
  for (let x = 48; x < 512; x += 48) {
    ctx.beginPath();
    ctx.moveTo(x, 16);
    ctx.lineTo(x, 496);
    ctx.stroke();
  }

  // Horizontal security bars (spacing = 96px)
  for (let y = 96; y < 512; y += 96) {
    ctx.beginPath();
    ctx.moveTo(16, y);
    ctx.lineTo(496, y);
    ctx.stroke();
  }

  // Inner sash border
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 8;
  ctx.strokeRect(16, 16, 480, 480);

  // Crisp outer white window casing
  ctx.strokeStyle = '#f8fafc';
  ctx.lineWidth = 16;
  ctx.strokeRect(0, 0, 512, 512);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  cachedGrillTex = texture;
  return texture;
}

// Materials Singleton Cache
export class CampusMaterials {
  private static instance: CampusMaterials;

  public windowGrillTexture: THREE.CanvasTexture;

  public exteriorWall: THREE.MeshStandardMaterial;
  public terracottaAccent: THREE.MeshStandardMaterial;
  public roofSlab: THREE.MeshStandardMaterial;
  public interiorWall: THREE.MeshStandardMaterial;
  public interiorFloorTile: THREE.MeshStandardMaterial;
  public ceilingConcrete: THREE.MeshStandardMaterial;
  public doorWood: THREE.MeshStandardMaterial;
  public doorMetalFrame: THREE.MeshStandardMaterial;
  public blackboard: THREE.MeshStandardMaterial;
  public projectorScreen: THREE.MeshStandardMaterial;
  public deskWood: THREE.MeshStandardMaterial;
  public chairBlack: THREE.MeshStandardMaterial;
  public computerChassis: THREE.MeshStandardMaterial;
  public computerScreenGlow: THREE.MeshStandardMaterial;
  public railingSteel: THREE.MeshStandardMaterial;
  public glassWindow: THREE.MeshPhysicalMaterial;
  public lawnGrass: THREE.MeshStandardMaterial;
  public asphaltRoad: THREE.MeshStandardMaterial;
  public curbStriped: THREE.MeshStandardMaterial;
  public signLettering: THREE.MeshStandardMaterial;
  public windowWhiteFrame: THREE.MeshStandardMaterial;
  public windowSill: THREE.MeshStandardMaterial;
  public windowCavity: THREE.MeshBasicMaterial;
  public windowGlass: THREE.MeshStandardMaterial;

  // ══ NEW REALISTIC ARCHITECTURAL FINISHES (From Real Photos) ══
  public columnNavyBlue: THREE.MeshStandardMaterial;
  public skirtingBlack: THREE.MeshStandardMaterial;
  public sunshadeNavyBlue: THREE.MeshStandardMaterial;
  public goldLettering: THREE.MeshStandardMaterial;
  public woodSlatCeiling: THREE.MeshStandardMaterial;
  public metalTrussGray: THREE.MeshStandardMaterial;
  public canopyTranslucent: THREE.MeshStandardMaterial;
  public waterCoolerSteel: THREE.MeshStandardMaterial;
  public fireExtinguisherRed: THREE.MeshStandardMaterial;
  public barricadeYellow: THREE.MeshStandardMaterial;
  public corniceBronze: THREE.MeshStandardMaterial;
  public stairTreadGranite: THREE.MeshStandardMaterial;
  public stairNosingBlack: THREE.MeshStandardMaterial;
  public courtyardTile: THREE.MeshStandardMaterial;
  public marbleCladding: THREE.MeshStandardMaterial;
  public acCompressorWhite: THREE.MeshStandardMaterial;
  public acFanGrill: THREE.MeshStandardMaterial;
  public pvcPipeWhite: THREE.MeshStandardMaterial;
  public ledTubeLight: THREE.MeshStandardMaterial;
  public canopyBlue: THREE.MeshStandardMaterial;
  public solarPanel: THREE.MeshStandardMaterial;
  public solarFrame: THREE.MeshStandardMaterial;
  public roofTerracottaTile: THREE.MeshStandardMaterial;
  public porticoMaroon: THREE.MeshStandardMaterial;

  private constructor() {
    const tileTex = createTileTexture();
    const doorTex = createDoorTexture();
    const woodSlatTex = createWoodSlatTexture();
    const courtyardTex = createCourtyardTileTexture();
    const asphaltTex = createAsphaltTexture();
    const curbTex = createCurbTexture();
    const grillTex = createWindowGrillTexture();
    this.windowGrillTexture = grillTex;

    // High-performance shared window materials
    this.windowWhiteFrame = new THREE.MeshStandardMaterial({
      color: '#ffffff',
      roughness: 0.25,
      metalness: 0.1
    });

    this.windowSill = new THREE.MeshStandardMaterial({
      color: '#f8fafc',
      roughness: 0.35,
      metalness: 0.05
    });

    this.windowCavity = new THREE.MeshBasicMaterial({
      color: '#070b14',
      side: THREE.DoubleSide
    });

    this.windowGlass = new THREE.MeshStandardMaterial({
      map: grillTex,
      color: '#1e293b',
      roughness: 0.12,
      metalness: 0.8,
      side: THREE.DoubleSide
    });

    // Exterior smooth architectural grey facade (Photos 1, 4, 5)
    this.exteriorWall = new THREE.MeshStandardMaterial({
      color: '#5b6978',
      roughness: 0.8,
      metalness: 0.08
    });

    // Terracotta vertical accent panel (signature stairwell tower & trims)
    this.terracottaAccent = new THREE.MeshStandardMaterial({
      color: '#a84c30',
      roughness: 0.75,
      metalness: 0.15
    });

    // Dark bronze/chocolate cornice bands between floors
    this.corniceBronze = new THREE.MeshStandardMaterial({
      color: '#28201a',
      roughness: 0.65,
      metalness: 0.2
    });

    // Rooftop slab & parapet coping
    this.roofSlab = new THREE.MeshStandardMaterial({
      color: '#8892a0',
      roughness: 0.9,
      metalness: 0.05
    });

    // Interior neutral architectural grey walls
    this.interiorWall = new THREE.MeshStandardMaterial({
      color: '#bcc4cd',
      roughness: 0.88,
      metalness: 0.04
    });

    // Polished light-grey vitrified granite floor tiles
    this.interiorFloorTile = new THREE.MeshStandardMaterial({
      color: '#f1f5f9',
      map: tileTex,
      roughness: 0.22,
      metalness: 0.15
    });

    // Concrete ceiling
    this.ceilingConcrete = new THREE.MeshStandardMaterial({
      color: '#f8fafc',
      roughness: 0.95,
      metalness: 0.02
    });

    // Honey-teak wood flush doors with chevron grooves
    this.doorWood = new THREE.MeshStandardMaterial({
      color: '#b45309',
      map: doorTex,
      roughness: 0.5,
      metalness: 0.08
    });

    // Door frames - solid black / charcoal
    this.doorMetalFrame = new THREE.MeshStandardMaterial({
      color: '#12151a',
      roughness: 0.35,
      metalness: 0.4
    });

    // Classroom blackboard
    this.blackboard = new THREE.MeshStandardMaterial({
      color: '#162e24',
      roughness: 0.7,
      metalness: 0.1
    });

    // Projector screen
    this.projectorScreen = new THREE.MeshStandardMaterial({
      color: '#f8fafc',
      roughness: 0.4,
      metalness: 0.05
    });

    // Desks
    this.deskWood = new THREE.MeshStandardMaterial({
      color: '#b47743',
      roughness: 0.6,
      metalness: 0.1
    });

    // Chairs
    this.chairBlack = new THREE.MeshStandardMaterial({
      color: '#1e293b',
      roughness: 0.8,
      metalness: 0.2
    });

    // Computers
    this.computerChassis = new THREE.MeshStandardMaterial({
      color: '#0f172a',
      roughness: 0.5,
      metalness: 0.5
    });

    this.computerScreenGlow = new THREE.MeshStandardMaterial({
      color: '#38bdf8',
      emissive: '#0284c7',
      emissiveIntensity: 0.35,
      roughness: 0.3
    });

    // Railings & metal trims
    this.railingSteel = new THREE.MeshStandardMaterial({
      color: '#1e293b',
      roughness: 0.35,
      metalness: 0.85
    });

    // Physical window glass
    this.glassWindow = new THREE.MeshPhysicalMaterial({
      color: '#94a3b8',
      transparent: true,
      opacity: 0.45,
      roughness: 0.1,
      metalness: 0.2,
      transmission: 0.7,
      ior: 1.5
    });

    // Landscaped grass lawns
    this.lawnGrass = new THREE.MeshStandardMaterial({
      color: '#2b7530',
      roughness: 0.92,
      metalness: 0.0
    });

    // Asphalt road
    this.asphaltRoad = new THREE.MeshStandardMaterial({
      color: '#333740',
      map: asphaltTex,
      roughness: 0.9,
      metalness: 0.1
    });

    // Black and white striped curb
    this.curbStriped = new THREE.MeshStandardMaterial({
      map: curbTex,
      roughness: 0.7,
      metalness: 0.1
    });

    // Sign 3D white lettering
    this.signLettering = new THREE.MeshStandardMaterial({
      color: '#ffffff',
      roughness: 0.2,
      metalness: 0.3,
      emissive: '#ffffff',
      emissiveIntensity: 0.15
    });

    // ══ REALISTIC MATERIALS FROM ST. PAUL'S PHOTOS ══

    // Structural portal frames and ceiling beams painted deep navy blue (#1e2b3e)
    this.columnNavyBlue = new THREE.MeshStandardMaterial({
      color: '#1d2737',
      roughness: 0.38,
      metalness: 0.22
    });

    // 15cm polished black skirting along walls and parapets (#121316)
    this.skirtingBlack = new THREE.MeshStandardMaterial({
      color: '#111317',
      roughness: 0.3,
      metalness: 0.3
    });

    // Window sunshade / chajja cantilever tops painted rich royal blue (Photos 1, 4, 5)
    this.sunshadeNavyBlue = new THREE.MeshStandardMaterial({
      color: '#1d4ed8',
      roughness: 0.38,
      metalness: 0.22
    });

    // Arched blue translucent canopy covering the connecting corridor (Satellite & Isometric overview)
    this.canopyBlue = new THREE.MeshStandardMaterial({
      color: '#0284c7',
      roughness: 0.15,
      metalness: 0.1,
      transparent: true,
      opacity: 0.72,
      side: THREE.DoubleSide
    });

    // Dark photovoltaic solar panels on St. Paul's roof
    this.solarPanel = new THREE.MeshStandardMaterial({
      color: '#0b1329',
      roughness: 0.12,
      metalness: 0.92
    });

    // Aluminum silver frames for solar racking
    this.solarFrame = new THREE.MeshStandardMaterial({
      color: '#94a3b8',
      roughness: 0.35,
      metalness: 0.9
    });

    // Terracotta cross walkway tiles on St. Paul's roof (Satellite overview)
    this.roofTerracottaTile = new THREE.MeshStandardMaterial({
      color: '#a84825',
      roughness: 0.85,
      metalness: 0.05
    });

    // Entrance portico dark burgundy/maroon fascia box (Photo 1)
    this.porticoMaroon = new THREE.MeshStandardMaterial({
      color: '#3b1212',
      roughness: 0.45,
      metalness: 0.25
    });

    // Prominent 3D Gold serif lettering for "ST. PAUL'S BLOCK"
    this.goldLettering = new THREE.MeshStandardMaterial({
      color: '#f59e0b',
      roughness: 0.22,
      metalness: 0.85,
      emissive: '#b45309',
      emissiveIntensity: 0.28
    });

    // Linear warm wood-slat false ceiling (portico & Web 3 Lab)
    this.woodSlatCeiling = new THREE.MeshStandardMaterial({
      color: '#d97706',
      map: woodSlatTex,
      roughness: 0.5,
      metalness: 0.08
    });

    // Bridge arched steel trusses and courtyard pergola trellis
    this.metalTrussGray = new THREE.MeshStandardMaterial({
      color: '#475569',
      roughness: 0.38,
      metalness: 0.85
    });

    // Bridge overhead canopy translucent corrugated skylight roof
    this.canopyTranslucent = new THREE.MeshStandardMaterial({
      color: '#cbd5e1',
      roughness: 0.25,
      metalness: 0.1,
      transparent: true,
      opacity: 0.68,
      side: THREE.DoubleSide
    });

    // Blue Star stainless steel drinking water coolers
    this.waterCoolerSteel = new THREE.MeshStandardMaterial({
      color: '#e2e8f0',
      roughness: 0.22,
      metalness: 0.92
    });

    // Wall-mounted fire extinguishers
    this.fireExtinguisherRed = new THREE.MeshStandardMaterial({
      color: '#dc2626',
      roughness: 0.3,
      metalness: 0.35
    });

    // Sathyabama yellow safety barricades
    this.barricadeYellow = new THREE.MeshStandardMaterial({
      color: '#facc15',
      roughness: 0.35,
      metalness: 0.15
    });

    // Granite stair treads
    this.stairTreadGranite = new THREE.MeshStandardMaterial({
      color: '#94a3b8',
      roughness: 0.35,
      metalness: 0.15
    });

    // Stair bullnose black nosing / risers
    this.stairNosingBlack = new THREE.MeshStandardMaterial({
      color: '#0f172a',
      roughness: 0.28,
      metalness: 0.25
    });

    // Courtyard paver tiles
    this.courtyardTile = new THREE.MeshStandardMaterial({
      color: '#9a3412',
      map: courtyardTex,
      roughness: 0.8,
      metalness: 0.05
    });

    // Web 3 Lab feature wall polished grey marble cladding
    this.marbleCladding = new THREE.MeshStandardMaterial({
      color: '#f1f5f9',
      roughness: 0.2,
      metalness: 0.15
    });

    // Outdoor Split-AC Compressor Units (Photos 9.28.57 PM & 9.29.11 PM)
    this.acCompressorWhite = new THREE.MeshStandardMaterial({
      color: '#e2e8f0',
      roughness: 0.42,
      metalness: 0.35
    });

    this.acFanGrill = new THREE.MeshStandardMaterial({
      color: '#1e293b',
      roughness: 0.6,
      metalness: 0.5
    });

    // Vertical white PVC drain / downspout pipes
    this.pvcPipeWhite = new THREE.MeshStandardMaterial({
      color: '#f8fafc',
      roughness: 0.3,
      metalness: 0.1
    });

    // Corridor linear recessed/surface LED tube luminaires (Photo 9.28.54 PM)
    this.ledTubeLight = new THREE.MeshStandardMaterial({
      color: '#ffffff',
      emissive: '#fffbeb',
      emissiveIntensity: 0.85,
      roughness: 0.2
    });
  }

  public static getInstance(): CampusMaterials {
    if (!CampusMaterials.instance) {
      CampusMaterials.instance = new CampusMaterials();
    }
    return CampusMaterials.instance;
  }
}

