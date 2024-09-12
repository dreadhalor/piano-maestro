// utils/chord-utils.ts

export interface Chord {
  name: string;
  notes: number[];
}

const NOTES = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "G#", "A", "Bb", "B"];

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

// Function to get a random note from a single octave (e.g., C4 to B4)
const getTrueRandomNote = (): number => {
  // Random octave between 2 and 5 (C2 to B5)
  const octave = Math.floor(Math.random() * 4) + 2;
  const randomNote = Math.floor(Math.random() * 12); // Random number between 0 and 11
  return 12 * (octave + 1) + randomNote; // Calculate MIDI note number for the given octave
};

export const getRandomNote = (note?: number): number => {
  let newNote = getTrueRandomNote();
  if (!note) return newNote;

  while (newNote === note) {
    newNote = getTrueRandomNote();
  }
  return newNote;
};
