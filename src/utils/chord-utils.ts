export interface Chord {
  name: string;
  notes: number[];
}

export const NOTES = [
  "C",
  "C#",
  "D",
  "Eb",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "Bb",
  "B",
];

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

export const midiToNoteName = (midiNumber: number): string => {
  const note = NOTES[midiNumber % 12];
  const octave = Math.floor(midiNumber / 12) - 1; // MIDI note 0 is C-1
  return `${note}${octave}`;
};

// New function: Convert MIDI note to note name without the octave
export const midiToNoteNameWithoutOctave = (midiNumber: number): string => {
  return NOTES[midiNumber % 12];
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
