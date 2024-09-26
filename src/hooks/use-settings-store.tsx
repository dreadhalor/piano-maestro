import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CHORD_TYPES, ChordTypeKey } from "@/utils/chords";
import { SCALE_TYPES, ScaleTypeKey } from "@/utils/scale-utils";
import { INTERVAL_TYPES, IntervalKey } from "@/utils/interval-utils";

// Zustand store for settings
interface SettingsState {
  lowKey: number;
  highKey: number;
  enabledChordTypes: Set<ChordTypeKey>;
  enabledScales: Set<ScaleTypeKey>;
  enabledIntervalRecognitionIntervals: Set<IntervalKey>;
  intervalRecognitionDirection: "ascending" | "descending" | "both";
  setLowKey: (value: number) => void;
  setHighKey: (value: number) => void;
  toggleChordType: (type: ChordTypeKey) => void;
  toggleScale: (mode: ScaleTypeKey) => void;
  toggleIntervalRecognitionInterval: (interval: IntervalKey) => void;
  setIntervalRecognitionDirection: (
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
      enabledIntervalRecognitionIntervals: new Set<IntervalKey>(
        Object.keys(INTERVAL_TYPES) as IntervalKey[],
      ), // All intervals enabled by default
      intervalRecognitionDirection: "both", // Default direction
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
      toggleIntervalRecognitionInterval: (interval: IntervalKey) =>
        set((state) => {
          const updatedIntervals = new Set(
            state.enabledIntervalRecognitionIntervals,
          );
          if (updatedIntervals.has(interval)) {
            updatedIntervals.delete(interval);
          } else {
            updatedIntervals.add(interval);
          }
          return { enabledIntervalRecognitionIntervals: updatedIntervals };
        }),
      setIntervalRecognitionDirection: (
        direction: "ascending" | "descending" | "both",
      ) =>
        set({
          intervalRecognitionDirection: direction,
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
        enabledIntervalRecognitionIntervals: Array.from(
          state.enabledIntervalRecognitionIntervals,
        ), // Serialize Set to array
        intervalRecognitionDirection: state.intervalRecognitionDirection, // Serialize direction
      }),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<SettingsState>; // Cast persistedState to partial
        return {
          ...currentState,
          ...persisted,
          enabledChordTypes: new Set(persisted.enabledChordTypes || []), // Deserialize array back to Set
          enabledScales: new Set(persisted.enabledScales || []), // Deserialize array back to Set
          enabledIntervalRecognitionIntervals: new Set(
            persisted.enabledIntervalRecognitionIntervals || [],
          ), // Deserialize array back to Set
        };
      },
    },
  ),
);
