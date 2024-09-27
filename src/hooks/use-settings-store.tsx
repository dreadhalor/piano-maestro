import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { SettingsState } from "@/store/types";
import { createKeyboardSettingsSlice } from "@/store/slices/keyboard-settings";
import { createIntervalSettingsSlice } from "@/store/slices/interval-settings";
import { createChordSettingsSlice } from "@/store/slices/chord-settings";
import { createScaleSettingsSlice } from "@/store/slices/scale-settings";
import { createIntervalRecognitionSettingsSlice } from "@/store/slices/interval-recognition-settings";
import { StateCreator } from "zustand";

// Helper type to simplify StateCreator typing
type MyStateCreator = StateCreator<SettingsState, [], [], SettingsState>;

// Combine all slices into one store creator
const combinedStore: MyStateCreator = (set, get, store) => ({
  ...createKeyboardSettingsSlice(set, get, store),
  ...createIntervalSettingsSlice(set, get, store),
  ...createChordSettingsSlice(set, get, store),
  ...createScaleSettingsSlice(set, get, store),
  ...createIntervalRecognitionSettingsSlice(set, get, store),
});

// Create the Zustand store with persistence
export const useSettingsStore = create<SettingsState>()(
  persist(combinedStore, {
    name: "piano-maestro-settings",
    storage: createJSONStorage(() => localStorage),
    partialize: (state) => ({
      lowKey: state.lowKey,
      highKey: state.highKey,
      enabledIntervals: Array.from(state.enabledIntervals),
      intervalDirection: state.intervalDirection,
      enabledChordTypes: Array.from(state.enabledChordTypes),
      enabledScales: Array.from(state.enabledScales),
      enabledIntervalRecognitionIntervals: Array.from(
        state.enabledIntervalRecognitionIntervals,
      ),
      intervalRecognitionDirection: state.intervalRecognitionDirection,
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    merge: (persistedState: any, currentState) => ({
      ...currentState,
      ...persistedState,
      enabledIntervals: new Set(persistedState.enabledIntervals || []),
      enabledChordTypes: new Set(persistedState.enabledChordTypes || []),
      enabledScales: new Set(persistedState.enabledScales || []),
      enabledIntervalRecognitionIntervals: new Set(
        persistedState.enabledIntervalRecognitionIntervals || [],
      ),
    }),
  }),
);
