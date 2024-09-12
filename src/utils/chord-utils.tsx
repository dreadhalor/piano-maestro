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

// Function to get a random note from a single octave (e.g., C4 to B4)
export const getRandomNote = (): number => {
  const octave = 4; // Specify the octave you want to use
  const randomNote = Math.floor(Math.random() * 12); // Random number between 0 and 11
  return 12 * (octave + 1) + randomNote; // Calculate MIDI note number for the given octave
};
