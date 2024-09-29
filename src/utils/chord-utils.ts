import { CHORD_TYPES, ChordTypeKey } from "./chords";
import {
  getRandomAbstractNote,
  stepFromAbstractNote,
  type AbstractNote,
} from "./note-utils";

export interface Chord {
  name: string; // Human-readable name
  notes: number[]; // MIDI note numbers for the chord
  baseNotes: number[]; // MIDI note numbers for the chord without inversion
  steps: readonly number[]; // Intervals between notes
  baseSteps: readonly number[]; // Intervals between notes without inversion
  inversion: number; // Inversion of the chord
  type: ChordTypeKey; // Unique key for the chord type
  shorthand: string; // Shortened label for the chord
}
export interface AbstractChord extends Omit<Chord, "notes" | "baseNotes"> {
  notes: AbstractNote[];
  baseNotes: AbstractNote[];
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

const calculateChordNotes = ({
  notes,
  steps,
  inversion,
}: {
  notes: AbstractNote[];
  steps: readonly number[];
  inversion: number;
}) => {
  const _notes = [...notes.slice(inversion), ...notes.slice(0, inversion)];
  let _steps = [...steps.slice(inversion), ...steps.slice(0, inversion)];
  _steps = _steps.map((step) => (step - _steps[0] + 12) % 12);

  return {
    notes: _notes,
    steps: _steps,
  };
};

const calculateChordLabel = ({
  baseNotes,
  chord,
  inversion,
}: {
  baseNotes: AbstractNote[];
  chord: ChordTypeKey;
  inversion: number;
}) => {
  const chordType = CHORD_TYPES[chord];
  if (inversion === 0) return `${baseNotes[0]}${chordType.shorthand}`;
  return `${baseNotes[0]}${chordType.shorthand}/${baseNotes[inversion]}`;
};

const getTrueRandomAbstractChord = ({
  enabledChords,
  enabledRootNotes,
  inversionsEnabled,
}: {
  enabledChords?: ChordTypeKey[];
  enabledRootNotes?: AbstractNote[];
  inversionsEnabled?: boolean;
}) => {
  const randomIntervalKey = getRandomChordKey({ enabledChords });
  const randomRoot = getRandomAbstractNote({
    enabledNotes: enabledRootNotes,
  });

  const chord = CHORD_TYPES[randomIntervalKey];
  const inversion = inversionsEnabled
    ? Math.floor(Math.random() * chord.intervals.length)
    : 0;

  const baseNotes = chord.intervals.map((interval) =>
    stepFromAbstractNote(randomRoot, interval),
  );
  let steps: readonly number[] = chord.intervals;
  const notesAndSteps = calculateChordNotes({
    notes: baseNotes,
    steps,
    inversion,
  });
  const notes = notesAndSteps.notes;
  steps = notesAndSteps.steps;

  return {
    name: calculateChordLabel({
      baseNotes,
      chord: randomIntervalKey,
      inversion,
    }),
    notes,
    baseNotes: notes,
    type: randomIntervalKey,
    steps,
    baseSteps: chord.intervals,
    inversion,
    shorthand: chord.shorthand,
  } satisfies AbstractChord;
};

export const getRandomAbstractChord = ({
  currentChord,
  enabledChords,
  enabledRootNotes,
  inversionsEnabled,
}: {
  currentChord?: AbstractChord;
  enabledChords?: ChordTypeKey[];
  enabledRootNotes?: AbstractNote[];
  inversionsEnabled?: boolean;
}) => {
  const otherEnabledIntervals = (enabledChords ?? []).length > 1;
  const otherEnabledRootNotes = (enabledRootNotes ?? []).length > 1;
  const otherEnabledInversions = inversionsEnabled;
  const onlyOneOption =
    !otherEnabledIntervals && !otherEnabledRootNotes && !otherEnabledInversions;
  if (onlyOneOption)
    return getTrueRandomAbstractChord({
      enabledChords,
      enabledRootNotes,
      inversionsEnabled,
    });

  let result: AbstractChord;

  let matchingKey, matchingRoot, matchingInversion, exactSameChord;

  do {
    matchingKey = false;
    matchingRoot = false;
    matchingInversion = false;
    exactSameChord = false;

    result = getTrueRandomAbstractChord({
      enabledChords,
      enabledRootNotes,
      inversionsEnabled,
    });

    if (currentChord) {
      if (result.type === currentChord.type) matchingKey = true;
      if (result.notes[0] === currentChord.notes[0]) matchingRoot = true;
      if (result.inversion === currentChord.inversion) matchingInversion = true;
      if (matchingKey && matchingRoot && matchingInversion)
        exactSameChord = true;
    }
  } while (exactSameChord);

  return result;
};
