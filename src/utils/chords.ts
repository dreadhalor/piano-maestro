// utils/chords.ts

import { NOTES } from "./chord-utils";

export interface Chord {
  name: string; // Human-readable name
  notes: number[]; // MIDI note numbers for the chord
  type: ChordTypeKey; // Unique key for the chord type
}

// Function to generate MIDI notes for chords
const noteOffsets: { [key: string]: number } = {
  C: 0,
  "C#": 1,
  D: 2,
  Eb: 3,
  E: 4,
  F: 5,
  "F#": 6,
  G: 7,
  "G#": 8,
  A: 9,
  Bb: 10,
  B: 11,
};

const generateChordNotes = (root: string, pattern: number[]): number[] => {
  const rootMidi = 60 + noteOffsets[root]; // Assume starting from Middle C (C4, MIDI 60)
  return pattern.map((interval) => rootMidi + interval);
};

export const CHORD_TYPES = {
  major: {
    label: "Major",
    intervals: [0, 4, 7],
  },
  minor: {
    label: "Minor",
    intervals: [0, 3, 7],
  },
  diminished: {
    label: "Diminished",
    intervals: [0, 3, 6],
  },
  "major-7": {
    label: "Major 7",
    intervals: [0, 4, 7, 11],
  },
  "minor-7": {
    label: "Minor 7",
    intervals: [0, 3, 7, 10],
  },
  "dominant-7": {
    label: "Dominant 7",
    intervals: [0, 4, 7, 10],
  },
  augmented: {
    label: "Augmented",
    intervals: [0, 4, 8],
  },
  "suspended-2": {
    label: "Suspended 2",
    intervals: [0, 2, 7],
  },
  "suspended-4": {
    label: "Suspended 4",
    intervals: [0, 5, 7],
  },
};
// Type for ChordTypeKey
export type ChordTypeKey = keyof typeof CHORD_TYPES;

// Make an array of all possible chords with all possible roots
// Example shape of a chord: { name: "C Major", notes: [60, 64, 67], type: "major" }
export const CHORDS: Chord[] = Object.entries(CHORD_TYPES).reduce(
  (acc, [key, { label, intervals }]) => [
    ...acc,
    ...NOTES.map((note) => ({
      name: `${note} ${label}`,
      notes: generateChordNotes(note, intervals),
      type: key as ChordTypeKey,
    })),
  ],
  new Array<Chord>(),
);

// Function to get a random chord
export const getTrueRandomChord = (): Chord => {
  const randomIndex = Math.floor(Math.random() * CHORDS.length);
  return CHORDS[randomIndex];
};

// Function to get a random chord but not the same as the current chord
export const getRandomChord = (currentChord?: Chord): Chord => {
  let randomChord = getTrueRandomChord();
  if (!currentChord) return randomChord;
  while (randomChord.name === currentChord.name) {
    randomChord = getTrueRandomChord();
  }
  return randomChord;
};
