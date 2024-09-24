import { Chord, CHORDS } from "./chords";

// Interface to define a chord progression
export interface ChordProgression {
  name: string; // Human-readable name
  chords: Chord[]; // Array of chords that make up the progression
}

// Define a function to get a chord by name for easy reference
const getChordByName = (name: string): Chord => {
  const chord = CHORDS.find((chord) => chord.name === name);
  if (!chord) {
    throw new Error(`Chord ${name} not found in the defined chords`);
  }
  return chord;
};

// Define some common chord progressions
export const CHORD_PROGRESSIONS: ChordProgression[] = [
  {
    name: "I-IV-V-I in C Major",
    chords: [
      getChordByName("C Major"),
      getChordByName("F Major"),
      getChordByName("G Major"),
      getChordByName("C Major"),
    ],
  },
  {
    name: "I-V-vi-IV in G Major",
    chords: [
      getChordByName("G Major"),
      getChordByName("D Major"),
      getChordByName("E Minor"),
      getChordByName("C Major"),
    ],
  },
  {
    name: "ii-V-I in C Major",
    chords: [
      getChordByName("D Minor"),
      getChordByName("G Minor"),
      getChordByName("C Major"),
    ],
  },
  {
    name: "I-vi-IV-V in A Major",
    chords: [
      getChordByName("A Major"),
      getChordByName("F# Minor"),
      getChordByName("D Major"),
      getChordByName("E Major"),
    ],
  },
];

// Function to get a random chord progression
export const getRandomChordProgression = (): ChordProgression => {
  const randomIndex = Math.floor(Math.random() * CHORD_PROGRESSIONS.length);
  return CHORD_PROGRESSIONS[randomIndex];
};

// Function to get a random chord progression, avoiding the current one
export const getDifferentChordProgression = (
  currentProgression?: ChordProgression,
): ChordProgression => {
  let randomProgression = getRandomChordProgression();
  if (!currentProgression) return randomProgression;
  while (randomProgression.name === currentProgression.name) {
    randomProgression = getRandomChordProgression();
  }
  return randomProgression;
};
