import { ChordTypeKey } from "@/utils/chords";
import { ScaleTypeKey } from "@/utils/scale-utils";
import { IntervalKey, IntervalDirections } from "@/utils/interval-utils";
import { AbstractNote } from "@/utils/note-utils";
import { ChordRecognitionPlaybackStyle } from "./slices/chord-recognition-settings";

export interface KeyboardSettingsSlice {
  lowKey: number;
  highKey: number;
  setLowKey: (value: number) => void;
  setHighKey: (value: number) => void;
}

export interface IntervalSettingsSlice {
  enabledIntervalPracticeRootNotes: Set<AbstractNote>;
  toggleIntervalPracticeRootNote: (note: AbstractNote) => void;
  enabledIntervals: Set<IntervalKey>;
  intervalDirection: IntervalDirections;
  toggleInterval: (interval: IntervalKey) => void;
  setIntervalDirection: (direction: IntervalDirections) => void;
}

export interface ChordSettingsSlice {
  enabledChordPracticeRootNotes: Set<AbstractNote>;
  toggleChordPracticeRootNote: (note: AbstractNote) => void;
  enabledChordTypes: Set<ChordTypeKey>;
  toggleChordType: (type: ChordTypeKey) => void;
  inversionsEnabled: boolean;
  toggleInversions: () => void;
}

export interface ScaleSettingsSlice {
  enabledScales: Set<ScaleTypeKey>;
  toggleScale: (mode: ScaleTypeKey) => void;
}

export interface IntervalRecognitionSettingsSlice {
  enabledIntervalRecognitionIntervals: Set<IntervalKey>;
  intervalRecognitionDirection: IntervalDirections;
  toggleIntervalRecognitionInterval: (interval: IntervalKey) => void;
  setIntervalRecognitionDirection: (direction: IntervalDirections) => void;
}

export interface ChordRecognitionSettingsSlice {
  enabledChordRecognitionTypes: Set<ChordTypeKey>;
  chordRecognitionInversionsEnabled: boolean;
  chordRecognitionPlaybackStyle: ChordRecognitionPlaybackStyle;
  toggleChordRecognitionType: (type: ChordTypeKey) => void;
  setChordRecognitionInversionsEnabled: (enabled: boolean) => void;
  setChordRecognitionPlaybackStyle: (
    style: ChordRecognitionPlaybackStyle,
  ) => void;
}

export interface ProgressionSettingsSlice {
  enabledProgressions: Set<string>;
  toggleProgression: (name: string) => void;
}

// Combined State Interface
export type SettingsState = KeyboardSettingsSlice &
  IntervalSettingsSlice &
  ChordSettingsSlice &
  ScaleSettingsSlice &
  IntervalRecognitionSettingsSlice &
  ChordRecognitionSettingsSlice &
  ProgressionSettingsSlice;
