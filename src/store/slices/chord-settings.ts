import { StateCreator } from "zustand";
import { ChordSettingsSlice } from "../types";
import { ChordTypeKey, CHORD_TYPES } from "@/utils/chords";
import { toggleSetItem } from "../helpers";
import { AbstractNote, NOTES } from "@/utils/note-utils";

export const createChordSettingsSlice: StateCreator<
  ChordSettingsSlice,
  [],
  [],
  ChordSettingsSlice
> = (set, get) => ({
  enabledChordPracticeRootNotes: new Set<AbstractNote>(new Set(NOTES)),
  toggleChordPracticeRootNote: (note: AbstractNote) => {
    const updatedSet = toggleSetItem(get().enabledChordPracticeRootNotes, note);
    set({ enabledChordPracticeRootNotes: updatedSet });
  },
  enabledChordTypes: new Set<ChordTypeKey>(
    Object.keys(CHORD_TYPES) as ChordTypeKey[],
  ),
  toggleChordType: (type: ChordTypeKey) => {
    const updatedSet = toggleSetItem(get().enabledChordTypes, type);
    set({ enabledChordTypes: updatedSet });
  },
  inversionsEnabled: true,
  toggleInversions: () =>
    set((state) => ({ inversionsEnabled: !state.inversionsEnabled })),
});
