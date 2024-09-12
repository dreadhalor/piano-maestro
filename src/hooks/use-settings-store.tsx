// use-settings-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsStore {
  lowKey: number;
  highKey: number;
  setLowKey: (value: number) => void;
  setHighKey: (value: number) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      lowKey: 36, // MIDI for C2
      highKey: 84, // MIDI for C6
      setLowKey: (value: number) => set({ lowKey: value }),
      setHighKey: (value: number) => set({ highKey: value }),
    }),
    {
      name: "piano-settings", // Name of the item in localStorage
      partialize: (state) => ({ lowKey: state.lowKey, highKey: state.highKey }), // Only persist lowKey and highKey
    },
  ),
);
