import { StateCreator } from "zustand";
import { ChordRecognitionSettingsSlice } from "../types";
import { ChordTypeKey, CHORD_TYPES } from "@/utils/chords";
import { toggleSetItem } from "../helpers";

export type ChordRecognitionPlaybackStyle = "block" | "arpeggiated";

export const createChordRecognitionSettingsSlice: StateCreator<
  ChordRecognitionSettingsSlice,
  [],
  [],
  ChordRecognitionSettingsSlice
> = (set, get) => ({
  enabledChordRecognitionTypes: new Set<ChordTypeKey>(
    Object.keys(CHORD_TYPES) as ChordTypeKey[],
  ),
  chordRecognitionInversionsEnabled: false,
  chordRecognitionPlaybackStyle: "block",
  toggleChordRecognitionType: (type: ChordTypeKey) => {
    const updatedSet = toggleSetItem(get().enabledChordRecognitionTypes, type);
    set({ enabledChordRecognitionTypes: updatedSet });
  },
  setChordRecognitionInversionsEnabled: (enabled: boolean) =>
    set({ chordRecognitionInversionsEnabled: enabled }),
  setChordRecognitionPlaybackStyle: (style: ChordRecognitionPlaybackStyle) =>
    set({ chordRecognitionPlaybackStyle: style }),
});
