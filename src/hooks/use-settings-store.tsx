import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CHORD_TYPES, ChordTypeKey } from "@/utils/chords";
import { SCALE_TYPES, ScaleTypeKey } from "@/utils/scale-utils";
import { INTERVAL_TYPES, IntervalKey } from "@/utils/interval-utils"; // Import interval types

// Zustand store for settings
interface SettingsState {
  lowKey: number;
  highKey: number;
  enabledChordTypes: Set<ChordTypeKey>;
  enabledScales: Set<ScaleTypeKey>;
  enabledIntervals: Set<IntervalKey>; // Enabled intervals
  intervalDirection: "ascending" | "descending" | "both"; // Interval direction
  setLowKey: (value: number) => void;
  setHighKey: (value: number) => void;
  toggleChordType: (type: ChordTypeKey) => void;
  toggleScale: (mode: ScaleTypeKey) => void;
  toggleInterval: (interval: IntervalKey) => void; // Toggle interval
  setIntervalDirection: (
    direction: "ascending" | "descending" | "both",
  ) => void; // Set direction
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      lowKey: 36,
      highKey: 84,
      enabledChordTypes: new Set<ChordTypeKey>(
        Object.keys(CHORD_TYPES) as ChordTypeKey[],
      ), // All chord types enabled by default
      enabledScales: new Set<ScaleTypeKey>(
        Object.keys(SCALE_TYPES) as ScaleTypeKey[],
      ), // All scale types enabled by default
      enabledIntervals: new Set<IntervalKey>(
        Object.keys(INTERVAL_TYPES) as IntervalKey[],
      ), // All intervals enabled by default
      intervalDirection: "both", // Default direction
      setLowKey: (value: number) => set({ lowKey: value }),
      setHighKey: (value: number) => set({ highKey: value }),
      toggleChordType: (type: ChordTypeKey) =>
        set((state) => {
          const updatedTypes = new Set(state.enabledChordTypes);
          if (updatedTypes.has(type)) {
            updatedTypes.delete(type);
          } else {
            updatedTypes.add(type);
          }
          return { enabledChordTypes: updatedTypes };
        }),
      toggleScale: (mode: ScaleTypeKey) =>
        set((state) => {
          const updatedModes = new Set(state.enabledScales);
          if (updatedModes.has(mode)) {
            updatedModes.delete(mode);
          } else {
            updatedModes.add(mode);
          }
          return { enabledScales: updatedModes };
        }),
      toggleInterval: (interval: IntervalKey) =>
        set((state) => {
          const updatedIntervals = new Set(state.enabledIntervals);
          if (updatedIntervals.has(interval)) {
            updatedIntervals.delete(interval);
          } else {
            updatedIntervals.add(interval);
          }
          return { enabledIntervals: updatedIntervals };
        }),
      setIntervalDirection: (direction: "ascending" | "descending" | "both") =>
        set({
          intervalDirection: direction,
        }),
    }),
    {
      name: "piano-maestro-settings",
      storage: createJSONStorage(() => localStorage),
      // Customize serialization and deserialization
      partialize: (state) => ({
        lowKey: state.lowKey,
        highKey: state.highKey,
        enabledChordTypes: Array.from(state.enabledChordTypes), // Serialize Set to array
        enabledScales: Array.from(state.enabledScales), // Serialize Set to array
        enabledIntervals: Array.from(state.enabledIntervals), // Serialize Set to array
        intervalDirection: state.intervalDirection, // Serialize direction
      }),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<SettingsState>; // Cast persistedState to partial
        return {
          ...currentState,
          ...persisted,
          enabledChordTypes: new Set(persisted.enabledChordTypes || []), // Deserialize array back to Set
          enabledScales: new Set(persisted.enabledScales || []), // Deserialize array back to Set
          enabledIntervals: new Set(persisted.enabledIntervals || []), // Deserialize array back to Set
        };
      },
    },
  ),
);
