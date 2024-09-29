import { Chord, noteOffsets } from "./chord-utils";
import { NOTES } from "./note-utils";

const generateChordNotes = (root: string, pattern: readonly number[]) => {
  const rootMidi = 60 + noteOffsets[root]; // Assume starting from Middle C (C4, MIDI 60)
  return pattern.map((interval) => rootMidi + interval);
};

// Typed definition of chord types for better TypeScript support
export const CHORD_TYPES = {
  major: { label: "Major", shorthand: "", intervals: [0, 4, 7] },
  minor: { label: "Minor", shorthand: "m", intervals: [0, 3, 7] },
  diminished: { label: "Diminished", shorthand: "dim", intervals: [0, 3, 6] },
  augmented: { label: "Augmented", shorthand: "aug", intervals: [0, 4, 8] },
  "major-7": { label: "Major 7", shorthand: "maj7", intervals: [0, 4, 7, 11] },
  "minor-7": { label: "Minor 7", shorthand: "m7", intervals: [0, 3, 7, 10] },
  "dominant-7": {
    label: "Dominant 7",
    shorthand: "7",
    intervals: [0, 4, 7, 10],
  },
  "suspended-2": {
    label: "Suspended 2",
    shorthand: "sus2",
    intervals: [0, 2, 7],
  },
  "suspended-4": {
    label: "Suspended 4",
    shorthand: "sus4",
    intervals: [0, 5, 7],
  },
} as const;

// Type for ChordTypeKey
export type ChordTypeKey = keyof typeof CHORD_TYPES;

// Precompute all possible chords with all possible roots
export const CHORDS: Chord[] = NOTES.flatMap((note) =>
  Object.entries(CHORD_TYPES).map(([key, { label, intervals, shorthand }]) => ({
    name: `${note} ${label}`,
    notes: generateChordNotes(note, intervals),
    baseNotes: generateChordNotes(note, intervals),
    type: key as ChordTypeKey,
    steps: intervals,
    baseSteps: intervals,
    inversion: 0,
    shorthand,
  })),
);

// Function to get a random chord, optionally different from the current one
export const getRandomChord = ({
  currentChord,
  enabledChords,
}: {
  currentChord?: Chord;
  enabledChords?: ChordTypeKey[];
}) => {
  let randomChord: Chord;
  // If no enabled chords, return the first chord I guess
  if (enabledChords && enabledChords.length === 0) return CHORDS[0];

  do {
    randomChord = CHORDS[Math.floor(Math.random() * CHORDS.length)];
  } while (
    (currentChord && randomChord.name === currentChord.name) ||
    (enabledChords && !enabledChords.includes(randomChord.type))
  );
  return randomChord;
};
