import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { SettingsState } from "@/store/types";
import { createKeyboardSettingsSlice } from "@/store/slices/keyboard-settings";
import { createIntervalSettingsSlice } from "@/store/slices/interval-settings";
import { createChordSettingsSlice } from "@/store/slices/chord-settings";
import { createScaleSettingsSlice } from "@/store/slices/scale-settings";
import { createIntervalRecognitionSettingsSlice } from "@/store/slices/interval-recognition-settings";
import { StateCreator } from "zustand";
import { NOTES } from "@/utils/note-utils";
import { INTERVAL_NAMES } from "@/utils/interval-utils";
import { CHORD_TYPES } from "@/utils/chords";
import { SCALE_TYPES } from "@/utils/scale-utils";

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
      // shared settings
      lowKey: state.lowKey,
      highKey: state.highKey,
      // interval practice settings
      enabledIntervalPracticeRootNotes: Array.from(
        state.enabledIntervalPracticeRootNotes,
      ),
      enabledIntervals: Array.from(state.enabledIntervals),
      intervalDirection: state.intervalDirection,
      // chord settings
      enabledChordPracticeRootNotes: Array.from(
        state.enabledChordPracticeRootNotes,
      ),
      enabledChordTypes: Array.from(state.enabledChordTypes),
      // scale settings
      enabledScales: Array.from(state.enabledScales),
      // interval recognition settings
      enabledIntervalRecognitionIntervals: Array.from(
        state.enabledIntervalRecognitionIntervals,
      ),
      intervalRecognitionDirection: state.intervalRecognitionDirection,
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    merge: (persistedState: any, currentState) => ({
      ...currentState,
      ...persistedState,
      // Convert arrays back to sets
      enabledIntervalPracticeRootNotes: new Set(
        persistedState.enabledIntervalPracticeRootNotes || NOTES,
      ),
      enabledIntervals: new Set(
        persistedState.enabledIntervals || INTERVAL_NAMES,
      ),
      enabledChordPracticeRootNotes: new Set(
        persistedState.enabledChordPracticeRootNotes || NOTES,
      ),
      enabledChordTypes: new Set(
        persistedState.enabledChordTypes || CHORD_TYPES,
      ),
      enabledScales: new Set(persistedState.enabledScales || SCALE_TYPES),
      enabledIntervalRecognitionIntervals: new Set(
        persistedState.enabledIntervalRecognitionIntervals || INTERVAL_NAMES,
      ),
    }),
  }),
);
