import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CHORD_TYPES, ChordTypeKey } from "@/utils/chords";

// Zustand store for settings
interface SettingsState {
  lowKey: number;
  highKey: number;
  enabledChordTypes: Set<ChordTypeKey>; // Use ChordTypeKey instead of string
  setLowKey: (value: number) => void;
  setHighKey: (value: number) => void;
  toggleChordType: (type: ChordTypeKey) => void; // Toggle chord type state
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      lowKey: 36,
      highKey: 84,
      enabledChordTypes: new Set<ChordTypeKey>(
        Object.keys(CHORD_TYPES) as ChordTypeKey[],
      ), // All types enabled by default
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
    }),
    {
      name: "piano-maestro-settings",
      storage: createJSONStorage(() => localStorage),
      // Customize serialization and deserialization
      partialize: (state) => ({
        lowKey: state.lowKey,
        highKey: state.highKey,
        enabledChordTypes: Array.from(state.enabledChordTypes), // Serialize Set to array
      }),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<SettingsState>; // Cast persistedState to partial
        return {
          ...currentState,
          ...persisted,
          enabledChordTypes: new Set(persisted.enabledChordTypes || []), // Deserialize array back to Set
        };
      },
    },
  ),
);
