// utils/scales.ts

import { noteOffsets, NOTES } from "./chord-utils";

// Define the modes and their corresponding interval patterns
export const SCALE_MODES = {
  ionian: { label: "Ionian (Major)", intervals: [0, 2, 4, 5, 7, 9, 11, 12] },
  dorian: { label: "Dorian", intervals: [0, 2, 3, 5, 7, 9, 10, 12] },
  phrygian: { label: "Phrygian", intervals: [0, 1, 3, 5, 7, 8, 10, 12] },
  lydian: { label: "Lydian", intervals: [0, 2, 4, 6, 7, 9, 11, 12] },
  mixolydian: { label: "Mixolydian", intervals: [0, 2, 4, 5, 7, 9, 10, 12] },
  aeolian: { label: "Aeolian (Minor)", intervals: [0, 2, 3, 5, 7, 8, 10, 12] },
  locrian: { label: "Locrian", intervals: [0, 1, 3, 5, 6, 8, 10, 12] },
} as const;

export type ScaleTypeKey = keyof typeof SCALE_MODES;

// Interface for a scale
export interface Scale {
  name: string; // Human-readable name
  notes: number[]; // MIDI note numbers for the scale
  mode: ScaleTypeKey; // Unique key for the scale mode
}

const generateScaleNotes = (root: string, pattern: ReadonlyArray<number>) => {
  const rootMidi = 60 + noteOffsets[root] - 12; // Assume starting from Middle C (C4, MIDI 60)
  return pattern.map((interval) => rootMidi + interval);
};

// Precompute all possible scales with all possible roots and modes
export const SCALES: Scale[] = NOTES.flatMap((note) =>
  Object.entries(SCALE_MODES).map(([key, { label, intervals }]) => ({
    name: `${note} ${label}`,
    notes: generateScaleNotes(note, intervals),
    mode: key as ScaleTypeKey,
  })),
);

// Function to get a random scale, optionally different from the current one
export const getRandomScale = ({
  currentScale,
  enabledScales,
}: {
  currentScale?: Scale;
  enabledScales?: ScaleTypeKey[];
} = {}) => {
  let randomScale: Scale;
  // return SCALES[0];
  // If no enabled scales, return the first scale
  if (enabledScales && enabledScales.length === 0) return SCALES[0];

  do {
    randomScale = SCALES[Math.floor(Math.random() * SCALES.length)];
  } while (
    (currentScale && randomScale.name === currentScale.name) ||
    (enabledScales && !enabledScales.includes(randomScale.mode))
  );
  return randomScale;
};
