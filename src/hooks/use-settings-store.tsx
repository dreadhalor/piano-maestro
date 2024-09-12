import { create } from "zustand";
import { persist } from "zustand/middleware";
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
      // Custom serialize and deserialize functions to handle Sets properly
      serialize: (state) =>
        JSON.stringify({
          ...state,
          state: {
            ...state.state,
            enabledChordTypes: Array.from(state.state.enabledChordTypes), // Serialize Set to array
          },
        }),
      deserialize: (str) => {
        const data = JSON.parse(str);
        return {
          ...data,
          state: {
            ...data.state,
            enabledChordTypes: new Set(data.state.enabledChordTypes), // Deserialize array back to Set
          },
        };
      },
    },
  ),
);
