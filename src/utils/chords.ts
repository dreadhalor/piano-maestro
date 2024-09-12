// utils/chords.ts

export interface Chord {
  name: string; // Human-readable name
  notes: number[]; // MIDI note numbers for the chord
  type: ChordTypeKey; // Unique key for the chord type
}

// Define unique keys and their human-readable labels for each chord type
export const CHORD_TYPES = {
  major: "Major",
  minor: "Minor",
  diminished: "Diminished",
  "major-7": "Major 7",
  "minor-7": "Minor 7",
  "dominant-7": "Dominant 7",
  augmented: "Augmented",
  "suspended-2": "Suspended 2",
  "suspended-4": "Suspended 4",
} as const;

// Type for ChordTypeKey
export type ChordTypeKey = keyof typeof CHORD_TYPES;

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

// Define chord patterns (intervals from the root note)
const major = [0, 4, 7];
const minor = [0, 3, 7];
const diminished = [0, 3, 6];
const major7 = [0, 4, 7, 11];
const minor7 = [0, 3, 7, 10];
const dominant7 = [0, 4, 7, 10];
const augmented = [0, 4, 8];
const suspended2 = [0, 2, 7];
const suspended4 = [0, 5, 7];

// Chords array with type keys
export const CHORDS: Chord[] = [
  // Major Chords
  { name: "C Major", notes: generateChordNotes("C", major), type: "major" },
  { name: "C# Major", notes: generateChordNotes("C#", major), type: "major" },
  { name: "D Major", notes: generateChordNotes("D", major), type: "major" },
  { name: "Eb Major", notes: generateChordNotes("Eb", major), type: "major" },
  { name: "E Major", notes: generateChordNotes("E", major), type: "major" },
  { name: "F Major", notes: generateChordNotes("F", major), type: "major" },
  { name: "F# Major", notes: generateChordNotes("F#", major), type: "major" },
  { name: "G Major", notes: generateChordNotes("G", major), type: "major" },
  { name: "G# Major", notes: generateChordNotes("G#", major), type: "major" },
  { name: "A Major", notes: generateChordNotes("A", major), type: "major" },
  { name: "Bb Major", notes: generateChordNotes("Bb", major), type: "major" },
  { name: "B Major", notes: generateChordNotes("B", major), type: "major" },

  // Minor Chords
  { name: "C Minor", notes: generateChordNotes("C", minor), type: "minor" },
  { name: "C# Minor", notes: generateChordNotes("C#", minor), type: "minor" },
  { name: "D Minor", notes: generateChordNotes("D", minor), type: "minor" },
  { name: "Eb Minor", notes: generateChordNotes("Eb", minor), type: "minor" },
  { name: "E Minor", notes: generateChordNotes("E", minor), type: "minor" },
  { name: "F Minor", notes: generateChordNotes("F", minor), type: "minor" },
  { name: "F# Minor", notes: generateChordNotes("F#", minor), type: "minor" },
  { name: "G Minor", notes: generateChordNotes("G", minor), type: "minor" },
  { name: "G# Minor", notes: generateChordNotes("G#", minor), type: "minor" },
  { name: "A Minor", notes: generateChordNotes("A", minor), type: "minor" },
  { name: "Bb Minor", notes: generateChordNotes("Bb", minor), type: "minor" },
  { name: "B Minor", notes: generateChordNotes("B", minor), type: "minor" },

  // Major 7 Chords
  {
    name: "C Major 7",
    notes: generateChordNotes("C", major7),
    type: "major-7",
  },
  {
    name: "C# Major 7",
    notes: generateChordNotes("C#", major7),
    type: "major-7",
  },
  {
    name: "D Major 7",
    notes: generateChordNotes("D", major7),
    type: "major-7",
  },
  {
    name: "Eb Major 7",
    notes: generateChordNotes("Eb", major7),
    type: "major-7",
  },
  {
    name: "E Major 7",
    notes: generateChordNotes("E", major7),
    type: "major-7",
  },
  {
    name: "F Major 7",
    notes: generateChordNotes("F", major7),
    type: "major-7",
  },
  {
    name: "F# Major 7",
    notes: generateChordNotes("F#", major7),
    type: "major-7",
  },
  {
    name: "G Major 7",
    notes: generateChordNotes("G", major7),
    type: "major-7",
  },
  {
    name: "G# Major 7",
    notes: generateChordNotes("G#", major7),
    type: "major-7",
  },
  {
    name: "A Major 7",
    notes: generateChordNotes("A", major7),
    type: "major-7",
  },
  {
    name: "Bb Major 7",
    notes: generateChordNotes("Bb", major7),
    type: "major-7",
  },
  {
    name: "B Major 7",
    notes: generateChordNotes("B", major7),
    type: "major-7",
  },

  // Minor 7 Chords
  {
    name: "C Minor 7",
    notes: generateChordNotes("C", minor7),
    type: "minor-7",
  },
  {
    name: "C# Minor 7",
    notes: generateChordNotes("C#", minor7),
    type: "minor-7",
  },
  {
    name: "D Minor 7",
    notes: generateChordNotes("D", minor7),
    type: "minor-7",
  },
  {
    name: "Eb Minor 7",
    notes: generateChordNotes("Eb", minor7),
    type: "minor-7",
  },
  {
    name: "E Minor 7",
    notes: generateChordNotes("E", minor7),
    type: "minor-7",
  },
  {
    name: "F Minor 7",
    notes: generateChordNotes("F", minor7),
    type: "minor-7",
  },
  {
    name: "F# Minor 7",
    notes: generateChordNotes("F#", minor7),
    type: "minor-7",
  },
  {
    name: "G Minor 7",
    notes: generateChordNotes("G", minor7),
    type: "minor-7",
  },
  {
    name: "G# Minor 7",
    notes: generateChordNotes("G#", minor7),
    type: "minor-7",
  },
  {
    name: "A Minor 7",
    notes: generateChordNotes("A", minor7),
    type: "minor-7",
  },
  {
    name: "Bb Minor 7",
    notes: generateChordNotes("Bb", minor7),
    type: "minor-7",
  },
  {
    name: "B Minor 7",
    notes: generateChordNotes("B", minor7),
    type: "minor-7",
  },

  // Dominant 7 Chords
  {
    name: "C Dominant 7",
    notes: generateChordNotes("C", dominant7),
    type: "dominant-7",
  },
  {
    name: "C# Dominant 7",
    notes: generateChordNotes("C#", dominant7),
    type: "dominant-7",
  },
  {
    name: "D Dominant 7",
    notes: generateChordNotes("D", dominant7),
    type: "dominant-7",
  },
  {
    name: "Eb Dominant 7",
    notes: generateChordNotes("Eb", dominant7),
    type: "dominant-7",
  },
  {
    name: "E Dominant 7",
    notes: generateChordNotes("E", dominant7),
    type: "dominant-7",
  },
  {
    name: "F Dominant 7",
    notes: generateChordNotes("F", dominant7),
    type: "dominant-7",
  },
  {
    name: "F# Dominant 7",
    notes: generateChordNotes("F#", dominant7),
    type: "dominant-7",
  },
  {
    name: "G Dominant 7",
    notes: generateChordNotes("G", dominant7),
    type: "dominant-7",
  },
  {
    name: "G# Dominant 7",
    notes: generateChordNotes("G#", dominant7),
    type: "dominant-7",
  },
  {
    name: "A Dominant 7",
    notes: generateChordNotes("A", dominant7),
    type: "dominant-7",
  },
  {
    name: "Bb Dominant 7",
    notes: generateChordNotes("Bb", dominant7),
    type: "dominant-7",
  },
  {
    name: "B Dominant 7",
    notes: generateChordNotes("B", dominant7),
    type: "dominant-7",
  },

  // Augmented Chords
  {
    name: "C Augmented",
    notes: generateChordNotes("C", augmented),
    type: "augmented",
  },
  {
    name: "C# Augmented",
    notes: generateChordNotes("C#", augmented),
    type: "augmented",
  },
  {
    name: "D Augmented",
    notes: generateChordNotes("D", augmented),
    type: "augmented",
  },
  {
    name: "Eb Augmented",
    notes: generateChordNotes("Eb", augmented),
    type: "augmented",
  },
  {
    name: "E Augmented",
    notes: generateChordNotes("E", augmented),
    type: "augmented",
  },
  {
    name: "F Augmented",
    notes: generateChordNotes("F", augmented),
    type: "augmented",
  },
  {
    name: "F# Augmented",
    notes: generateChordNotes("F#", augmented),
    type: "augmented",
  },
  {
    name: "G Augmented",
    notes: generateChordNotes("G", augmented),
    type: "augmented",
  },
  {
    name: "G# Augmented",
    notes: generateChordNotes("G#", augmented),
    type: "augmented",
  },
  {
    name: "A Augmented",
    notes: generateChordNotes("A", augmented),
    type: "augmented",
  },
  {
    name: "Bb Augmented",
    notes: generateChordNotes("Bb", augmented),
    type: "augmented",
  },
  {
    name: "B Augmented",
    notes: generateChordNotes("B", augmented),
    type: "augmented",
  },

  // Diminished Chords
  {
    name: "C Diminished",
    notes: generateChordNotes("C", diminished),
    type: "diminished",
  },
  {
    name: "C# Diminished",
    notes: generateChordNotes("C#", diminished),
    type: "diminished",
  },
  {
    name: "D Diminished",
    notes: generateChordNotes("D", diminished),
    type: "diminished",
  },
  {
    name: "Eb Diminished",
    notes: generateChordNotes("Eb", diminished),
    type: "diminished",
  },
  {
    name: "E Diminished",
    notes: generateChordNotes("E", diminished),
    type: "diminished",
  },
  {
    name: "F Diminished",
    notes: generateChordNotes("F", diminished),
    type: "diminished",
  },
  {
    name: "F# Diminished",
    notes: generateChordNotes("F#", diminished),
    type: "diminished",
  },
  {
    name: "G Diminished",
    notes: generateChordNotes("G", diminished),
    type: "diminished",
  },
  {
    name: "G# Diminished",
    notes: generateChordNotes("G#", diminished),
    type: "diminished",
  },
  {
    name: "A Diminished",
    notes: generateChordNotes("A", diminished),
    type: "diminished",
  },
  {
    name: "Bb Diminished",
    notes: generateChordNotes("Bb", diminished),
    type: "diminished",
  },
  {
    name: "B Diminished",
    notes: generateChordNotes("B", diminished),
    type: "diminished",
  },

  // Suspended 2 Chords
  {
    name: "C Suspended 2",
    notes: generateChordNotes("C", suspended2),
    type: "suspended-2",
  },
  {
    name: "C# Suspended 2",
    notes: generateChordNotes("C#", suspended2),
    type: "suspended-2",
  },
  {
    name: "D Suspended 2",
    notes: generateChordNotes("D", suspended2),
    type: "suspended-2",
  },
  {
    name: "Eb Suspended 2",
    notes: generateChordNotes("Eb", suspended2),
    type: "suspended-2",
  },
  {
    name: "E Suspended 2",
    notes: generateChordNotes("E", suspended2),
    type: "suspended-2",
  },
  {
    name: "F Suspended 2",
    notes: generateChordNotes("F", suspended2),
    type: "suspended-2",
  },
  {
    name: "F# Suspended 2",
    notes: generateChordNotes("F#", suspended2),
    type: "suspended-2",
  },
  {
    name: "G Suspended 2",
    notes: generateChordNotes("G", suspended2),
    type: "suspended-2",
  },
  {
    name: "G# Suspended 2",
    notes: generateChordNotes("G#", suspended2),
    type: "suspended-2",
  },
  {
    name: "A Suspended 2",
    notes: generateChordNotes("A", suspended2),
    type: "suspended-2",
  },
  {
    name: "Bb Suspended 2",
    notes: generateChordNotes("Bb", suspended2),
    type: "suspended-2",
  },
  {
    name: "B Suspended 2",
    notes: generateChordNotes("B", suspended2),
    type: "suspended-2",
  },

  // Suspended 4 Chords
  {
    name: "C Suspended 4",
    notes: generateChordNotes("C", suspended4),
    type: "suspended-4",
  },
  {
    name: "C# Suspended 4",
    notes: generateChordNotes("C#", suspended4),
    type: "suspended-4",
  },
  {
    name: "D Suspended 4",
    notes: generateChordNotes("D", suspended4),
    type: "suspended-4",
  },
  {
    name: "Eb Suspended 4",
    notes: generateChordNotes("Eb", suspended4),
    type: "suspended-4",
  },
  {
    name: "E Suspended 4",
    notes: generateChordNotes("E", suspended4),
    type: "suspended-4",
  },
  {
    name: "F Suspended 4",
    notes: generateChordNotes("F", suspended4),
    type: "suspended-4",
  },
  {
    name: "F# Suspended 4",
    notes: generateChordNotes("F#", suspended4),
    type: "suspended-4",
  },
  {
    name: "G Suspended 4",
    notes: generateChordNotes("G", suspended4),
    type: "suspended-4",
  },
  {
    name: "G# Suspended 4",
    notes: generateChordNotes("G#", suspended4),
    type: "suspended-4",
  },
  {
    name: "A Suspended 4",
    notes: generateChordNotes("A", suspended4),
    type: "suspended-4",
  },
  {
    name: "Bb Suspended 4",
    notes: generateChordNotes("Bb", suspended4),
    type: "suspended-4",
  },
  {
    name: "B Suspended 4",
    notes: generateChordNotes("B", suspended4),
    type: "suspended-4",
  },
];

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
