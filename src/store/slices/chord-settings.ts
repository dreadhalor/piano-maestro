import { StateCreator } from "zustand";
import { ChordSettingsSlice } from "../types";
import { ChordTypeKey, CHORD_TYPES } from "@/utils/chords";
import { toggleSetItem } from "../helpers";

export const createChordSettingsSlice: StateCreator<
  ChordSettingsSlice,
  [],
  [],
  ChordSettingsSlice
> = (set, get) => ({
  enabledChordTypes: new Set<ChordTypeKey>(
    Object.keys(CHORD_TYPES) as ChordTypeKey[],
  ),
  toggleChordType: (type: ChordTypeKey) => {
    const updatedSet = toggleSetItem(get().enabledChordTypes, type);
    set({ enabledChordTypes: updatedSet });
  },
});
