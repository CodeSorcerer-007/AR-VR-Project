import { create } from 'zustand';
import { RoomMetadata, FloorLevel, BuildingBlock } from '../types/campus';
import { RouteResult, findRoute, generateCampusNavigationGraph } from '../features/navigation/route-engine';
import { allRooms, getRoomById } from '../config/campus-data';

export type CameraViewMode = 'first-person' | 'third-person' | 'orbit';
export type QualityPreset = 'auto' | 'low' | 'medium' | 'high' | 'ultra';
export type TimeOfDay = 'day' | 'golden' | 'night';

export interface CampusState {
  // Visitor Physical State (Spawn: outside Main Entrance between 401 & 415)
  visitorPosition: [number, number, number];
  visitorRotation: [number, number, number];
  cameraMode: CameraViewMode;
  currentBlock: BuildingBlock | 'exterior';
  currentFloor: FloorLevel;
  currentRoom: RoomMetadata | null;
  contextualRoomToast: RoomMetadata | null;

  // Navigation & Destination Preview
  selectedDestination: RoomMetadata | null;
  activeRoute: RouteResult | null;
  isNavigating: boolean;
  navStepIndex: number;
  navigationGraph: ReturnType<typeof generateCampusNavigationGraph>;

  // Inspection & Modals
  searchOpen: boolean;
  floorPlanOpen: boolean;
  floorPlanViewFloor: FloorLevel;
  floorPlanViewBlock: BuildingBlock;
  explodedView: boolean;
  overviewMode: boolean;
  comparisonModalOpen: boolean;
  comparisonRooms: [RoomMetadata | null, RoomMetadata | null];
  inspectedObject: { title: string; category: string; description: string; verified: boolean; confidence: string } | null;
  aboutModalOpen: boolean;
  controlsHelpOpen: boolean;

  // Presentation Mode
  presentationActive: boolean;
  presentationIndex: number;
  presentationPlaying: boolean;

  // Cinematic Intro
  cinematicActive: boolean;

  // Visual & Performance Settings
  qualityPreset: QualityPreset;
  timeOfDay: TimeOfDay;
  interiorLightsOn: boolean;
  hudOpacity: number;

  // Accessibility
  highContrast: boolean;
  reducedMotion: boolean;
  largeText: boolean;
  audioGuidance: boolean;
  simplifiedHUD: boolean;

  // Offline Caching & Package
  offlineReady: boolean;
  downloadingPackage: boolean;
  downloadProgress: number; // 0 to 100
  downloadedBytes: number;
  totalPackageBytes: number;

  // Actions
  setVisitorPosition: (pos: [number, number, number]) => void;
  setVisitorRotation: (rot: [number, number, number]) => void;
  setCameraMode: (mode: CameraViewMode) => void;
  updateSpatialLocation: (pos: [number, number, number]) => void;
  selectDestination: (room: RoomMetadata | null) => void;
  startNavigation: (room: RoomMetadata) => void;
  cancelNavigation: () => void;
  resetToMainEntrance: () => void;
  setSearchOpen: (open: boolean) => void;
  setFloorPlanOpen: (open: boolean) => void;
  setFloorPlanView: (block: BuildingBlock, floor: FloorLevel) => void;
  setExplodedView: (open: boolean) => void;
  setOverviewMode: (open: boolean) => void;
  setAboutModalOpen: (open: boolean) => void;
  setControlsHelpOpen: (open: boolean) => void;
  setComparisonModalOpen: (open: boolean) => void;
  setComparisonRoom: (index: 0 | 1, room: RoomMetadata | null) => void;
  inspectObject: (obj: { title: string; category: string; description: string; verified: boolean; confidence: string } | null) => void;
  setQualityPreset: (preset: QualityPreset) => void;
  setTimeOfDay: (time: TimeOfDay) => void;
  toggleInteriorLights: () => void;
  setHudOpacity: (opacity: number) => void;
  toggleHighContrast: () => void;
  toggleReducedMotion: () => void;
  toggleLargeText: () => void;
  toggleAudioGuidance: () => void;
  toggleSimplifiedHUD: () => void;
  skipCinematic: () => void;
  togglePresentation: () => void;
  setPresentationIndex: (index: number) => void;
  nextPresentationStep: () => void;
  prevPresentationStep: () => void;
  downloadCompleteCampusPackage: () => Promise<void>;
  clearDownloadedPackage: () => void;
}

// Initial Spawn Point: Outside St. Paul's Main entrance, between Rooms 401 & 415, facing +Z into entrance
const INITIAL_SPAWN: [number, number, number] = [0, 1.7, -18];

export const useCampusStore = create<CampusState>((set, get) => {
  const graph = generateCampusNavigationGraph();

  // Load saved preferences if available
  const savedContrast = localStorage.getItem('stpauls_highContrast') === 'true';
  const savedReducedMotion = localStorage.getItem('stpauls_reducedMotion') === 'true';
  const savedQuality = (localStorage.getItem('stpauls_qualityPreset') as QualityPreset) || 'medium';
  const savedOffline = localStorage.getItem('stpauls_offlineReady') === 'true';

  return {
    visitorPosition: INITIAL_SPAWN,
    visitorRotation: [0, Math.PI, 0],
    cameraMode: 'first-person',
    currentBlock: 'exterior',
    currentFloor: 'ground',
    currentRoom: null,
    contextualRoomToast: null,

    selectedDestination: null,
    activeRoute: null,
    isNavigating: false,
    navStepIndex: 0,
    navigationGraph: graph,

    searchOpen: false,
    floorPlanOpen: false,
    floorPlanViewFloor: 'ground',
    floorPlanViewBlock: 'main',
    explodedView: false,
    overviewMode: false,
    comparisonModalOpen: false,
    comparisonRooms: [null, null],
    inspectedObject: null,
    aboutModalOpen: false,
    controlsHelpOpen: false,

    presentationActive: false,
    presentationIndex: 0,
    presentationPlaying: false,

    cinematicActive: false,

    qualityPreset: savedQuality,
    timeOfDay: 'day',
    interiorLightsOn: true,
    hudOpacity: 0.88,

    highContrast: savedContrast,
    reducedMotion: savedReducedMotion,
    largeText: false,
    audioGuidance: true,
    simplifiedHUD: false,

    offlineReady: savedOffline,
    downloadingPackage: false,
    downloadProgress: savedOffline ? 100 : 0,
    downloadedBytes: savedOffline ? 48500000 : 0,
    totalPackageBytes: 48500000,

    setVisitorPosition: (pos) => set({ visitorPosition: pos }),
    setVisitorRotation: (rot) => set({ visitorRotation: rot }),
    setCameraMode: (mode) => set({ cameraMode: mode }),

    updateSpatialLocation: (pos) => {
      const [x, y, z] = pos;
      let blk: BuildingBlock | 'exterior' = 'exterior';
      let fl: FloorLevel = 'ground';

      if (y >= 10.5) fl = 'third';
      else if (y >= 6.5) fl = 'second';
      else if (y >= 2.5) fl = 'first';
      else fl = 'ground';

      if (x >= -23 && x <= 23 && z >= -7 && z <= 42) {
        blk = 'main';
      } else if (x >= -55 && x <= -31 && z >= -7 && z <= 44) {
        blk = 'annexure';
      }

      // Check current room
      let foundRoom: RoomMetadata | null = null;
      for (const room of allRooms) {
        if (room.floor === fl && room.block === blk) {
          const halfW = room.dimensions[0] / 2;
          const halfD = room.dimensions[2] / 2;
          const rx = room.position[0];
          const rz = room.position[2];
          if (x >= rx - halfW && x <= rx + halfW && z >= rz - halfD && z <= rz + halfD) {
            foundRoom = room;
            break;
          }
        }
      }

      const state = get();
      const prevRoom = state.currentRoom;
      if (foundRoom && (!prevRoom || prevRoom.id !== foundRoom.id)) {
        set({ currentRoom: foundRoom, contextualRoomToast: foundRoom });
        // Auto fade toast after 4s
        setTimeout(() => {
          if (get().contextualRoomToast?.id === foundRoom?.id) {
            set({ contextualRoomToast: null });
          }
        }, 4000);
      } else if (!foundRoom && prevRoom) {
        set({ currentRoom: null });
      }

      if (state.currentBlock !== blk || state.currentFloor !== fl) {
        set({ currentBlock: blk, currentFloor: fl });
      }
    },

    selectDestination: (room) => {
      if (!room) {
        set({ selectedDestination: null, activeRoute: null });
        return;
      }
      const route = findRoute(get().visitorPosition, room.id, get().navigationGraph);
      set({ selectedDestination: room, activeRoute: route });
    },

    startNavigation: (room) => {
      const route = findRoute(get().visitorPosition, room.id, get().navigationGraph);
      set({
        selectedDestination: room,
        activeRoute: route,
        isNavigating: true,
        navStepIndex: 0,
        searchOpen: false,
        floorPlanOpen: false,
        overviewMode: false
      });
    },

    cancelNavigation: () => {
      set({ isNavigating: false, activeRoute: null, selectedDestination: null });
    },

    resetToMainEntrance: () => {
      set({
        visitorPosition: INITIAL_SPAWN,
        visitorRotation: [0, Math.PI, 0],
        cameraMode: 'first-person',
        isNavigating: false,
        activeRoute: null,
        selectedDestination: null,
        explodedView: false,
        overviewMode: false
      });
    },

    setSearchOpen: (open) => set({ searchOpen: open }),
    setFloorPlanOpen: (open) => set({ floorPlanOpen: open }),
    setFloorPlanView: (block, floor) => set({ floorPlanViewBlock: block, floorPlanViewFloor: floor }),
    setExplodedView: (open) => set({ explodedView: open }),
    setOverviewMode: (open) => set({ overviewMode: open }),
    setAboutModalOpen: (open) => set({ aboutModalOpen: open }),
    setControlsHelpOpen: (open) => set({ controlsHelpOpen: open }),
    setComparisonModalOpen: (open) => set({ comparisonModalOpen: open }),
    setComparisonRoom: (index, room) => {
      const current = [...get().comparisonRooms] as [RoomMetadata | null, RoomMetadata | null];
      current[index] = room;
      set({ comparisonRooms: current });
    },
    inspectObject: (obj) => set({ inspectedObject: obj }),

    setQualityPreset: (preset) => {
      localStorage.setItem('stpauls_qualityPreset', preset);
      set({ qualityPreset: preset });
    },
    setTimeOfDay: (time) => set({ timeOfDay: time }),
    toggleInteriorLights: () => set((s) => ({ interiorLightsOn: !s.interiorLightsOn })),
    setHudOpacity: (opacity) => set({ hudOpacity: opacity }),

    toggleHighContrast: () => {
      const val = !get().highContrast;
      localStorage.setItem('stpauls_highContrast', String(val));
      document.documentElement.setAttribute('data-high-contrast', String(val));
      set({ highContrast: val });
    },
    toggleReducedMotion: () => {
      const val = !get().reducedMotion;
      localStorage.setItem('stpauls_reducedMotion', String(val));
      set({ reducedMotion: val });
    },
    toggleLargeText: () => set((s) => ({ largeText: !s.largeText })),
    toggleAudioGuidance: () => set((s) => ({ audioGuidance: !s.audioGuidance })),
    toggleSimplifiedHUD: () => set((s) => ({ simplifiedHUD: !s.simplifiedHUD })),

    skipCinematic: () => set({ cinematicActive: false }),

    togglePresentation: () => {
      const active = !get().presentationActive;
      set({
        presentationActive: active,
        presentationIndex: 0,
        presentationPlaying: active,
        cameraMode: active ? 'orbit' : 'first-person'
      });
    },
    setPresentationIndex: (index: number) => {
      const idx = Math.max(0, Math.min(6, index));
      set({ presentationActive: true, presentationIndex: idx, cameraMode: 'orbit' });
    },
    nextPresentationStep: () => {
      const next = (get().presentationIndex + 1) % 7;
      set({ presentationIndex: next });
    },
    prevPresentationStep: () => {
      const prev = (get().presentationIndex - 1 + 7) % 7;
      set({ presentationIndex: prev });
    },

    downloadCompleteCampusPackage: async () => {
      set({ downloadingPackage: true, downloadProgress: 10 });
      // Simulate real progressive caching of all procedural textures, audio assets, and geometry data
      for (let p = 15; p <= 100; p += 15) {
        await new Promise((res) => setTimeout(res, 350));
        set({ downloadProgress: p, downloadedBytes: Math.round((p / 100) * 48500000) });
      }
      localStorage.setItem('stpauls_offlineReady', 'true');
      set({
        downloadingPackage: false,
        offlineReady: true,
        downloadProgress: 100,
        downloadedBytes: 48500000
      });
    },

    clearDownloadedPackage: () => {
      localStorage.removeItem('stpauls_offlineReady');
      set({ offlineReady: false, downloadProgress: 0, downloadedBytes: 0 });
    }
  };
});

if (typeof window !== 'undefined') {
  (window as any).__campusStore = useCampusStore;
  (window as any).__goToPresentationStop = (idx: number) => {
    useCampusStore.getState().setPresentationIndex(idx);
  };
}
