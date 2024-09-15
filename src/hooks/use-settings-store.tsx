import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CHORD_TYPES, ChordTypeKey } from "@/utils/chords";
import { SCALE_MODES, ScaleTypeKey } from "@/utils/scale-utils";

// Zustand store for settings
interface SettingsState {
  lowKey: number;
  highKey: number;
  enabledChordTypes: Set<ChordTypeKey>;
  enabledScales: Set<ScaleTypeKey>;
  setLowKey: (value: number) => void;
  setHighKey: (value: number) => void;
  toggleChordType: (type: ChordTypeKey) => void;
  toggleScale: (mode: ScaleTypeKey) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      lowKey: 36,
      highKey: 84,
      enabledChordTypes: new Set<ChordTypeKey>(
        Object.keys(CHORD_TYPES) as ChordTypeKey[],
      ), // All types enabled by default
      enabledScales: new Set<ScaleTypeKey>(
        Object.keys(SCALE_MODES) as ScaleTypeKey[],
      ), // All modes enabled by default
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
      }),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<SettingsState>; // Cast persistedState to partial
        return {
          ...currentState,
          ...persisted,
          enabledChordTypes: new Set(persisted.enabledChordTypes || []), // Deserialize array back to Set
          enabledScales: new Set(persisted.enabledScales || []), // Deserialize array back to Set
        };
      },
    },
  ),
);
