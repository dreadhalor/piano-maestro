import { ChordTypeKey } from "@/utils/chords";
import { ScaleTypeKey } from "@/utils/scale-utils";
import { IntervalKey, IntervalDirections } from "@/utils/interval-utils";

export interface KeyboardSettingsSlice {
  lowKey: number;
  highKey: number;
  setLowKey: (value: number) => void;
  setHighKey: (value: number) => void;
}

export interface IntervalSettingsSlice {
  enabledIntervals: Set<IntervalKey>;
  intervalDirection: IntervalDirections;
  toggleInterval: (interval: IntervalKey) => void;
  setIntervalDirection: (direction: IntervalDirections) => void;
}

export interface ChordSettingsSlice {
  enabledChordTypes: Set<ChordTypeKey>;
  toggleChordType: (type: ChordTypeKey) => void;
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

// Combined State Interface
export type SettingsState = KeyboardSettingsSlice &
  IntervalSettingsSlice &
  ChordSettingsSlice &
  ScaleSettingsSlice &
  IntervalRecognitionSettingsSlice;
