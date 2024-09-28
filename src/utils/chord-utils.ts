import { CHORD_TYPES, ChordTypeKey } from "./chords";
import {
  getRandomAbstractNote,
  stepFromAbstractNote,
  type AbstractNote,
} from "./note-utils";

export interface Chord {
  name: string; // Human-readable name
  notes: number[]; // MIDI note numbers for the chord
  steps: Readonly<number[]>; // Intervals between notes
  type: ChordTypeKey; // Unique key for the chord type
}
export interface AbstractChord extends Omit<Chord, "notes"> {
  notes: AbstractNote[];
}

export const noteOffsets: { [key: string]: number } = {
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

// Calculate intervals between notes from the root note
export const calculateIntervals = (notes: number[]): number[] => {
  const root = notes[0]; // First note is considered the root
  return notes.slice(1).map((note) => note - root); // Calculate intervals from the root
};

// Check if the played notes match the target chord intervals
export const notesMatchWithExactIntervals = (
  playedNotes: number[],
  targetNotes: number[],
): boolean => {
  if (playedNotes.length !== targetNotes.length) return false;

  // Sort both played notes and target notes
  const sortedPlayed = [...playedNotes].sort((a, b) => a - b);
  const sortedTarget = [...targetNotes].sort((a, b) => a - b);

  // Ensure root notes match
  if (sortedPlayed[0] % 12 !== sortedTarget[0] % 12) return false;

  // Calculate intervals from root for both played and target notes
  const playedIntervals = calculateIntervals(sortedPlayed);
  const targetIntervals = calculateIntervals(sortedTarget);

  // Compare intervals
  for (let i = 0; i < playedIntervals.length; i++) {
    if (playedIntervals[i] !== targetIntervals[i]) return false;
  }

  return true;
};

// Generate a random note within a specified MIDI range
const getTrueRandomNoteInRange = (lowKey: number, highKey: number): number => {
  const rangeSize = highKey - lowKey + 1; // Calculate the size of the range
  return lowKey + Math.floor(Math.random() * rangeSize); // Generate a random note within the range
};

// Modified function to get a random note within a user-defined range
export const getRandomNote = (
  lowKey: number,
  highKey: number,
  currentNote?: number,
): number => {
  let newNote = getTrueRandomNoteInRange(lowKey, highKey); // Generate a random note within the range
  if (!currentNote || lowKey === highKey) return newNote;

  while (newNote === currentNote) {
    newNote = getTrueRandomNoteInRange(lowKey, highKey); // Ensure a new random note is selected
  }
  return newNote;
};

const getRandomChordKey = ({
  enabledChords,
}: {
  enabledChords?: ChordTypeKey[];
}) => {
  let randomChord: ChordTypeKey;
  if (enabledChords && enabledChords.length === 0) return "major";
  if (enabledChords && enabledChords.length === 1) return enabledChords[0];

  do {
    randomChord = Object.keys(CHORD_TYPES)[
      Math.floor(Math.random() * Object.keys(CHORD_TYPES).length)
    ] as ChordTypeKey;
  } while (enabledChords && !enabledChords.includes(randomChord));

  return randomChord;
};

export const getTrueRandomAbstractChord = ({
  enabledChords,
  enabledRootNotes,
}: {
  enabledChords?: ChordTypeKey[];
  enabledRootNotes?: AbstractNote[];
}) => {
  const randomIntervalKey = getRandomChordKey({ enabledChords });
  const randomRoot = getRandomAbstractNote({
    enabledNotes: enabledRootNotes,
  });

  const chord = CHORD_TYPES[randomIntervalKey];
  const notes = chord.intervals.map((interval) =>
    stepFromAbstractNote(randomRoot, interval),
  );

  return {
    name: `${randomRoot} ${chord.label}`,
    notes,
    type: randomIntervalKey,
    steps: chord.intervals,
  } satisfies AbstractChord;
};
