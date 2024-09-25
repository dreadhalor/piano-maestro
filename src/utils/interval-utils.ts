export const INTERVAL_TYPES = {
  "minor-2nd": { label: "Minor 2nd", semitones: 1 },
  "major-2nd": { label: "Major 2nd", semitones: 2 },
  "minor-3rd": { label: "Minor 3rd", semitones: 3 },
  "major-3rd": { label: "Major 3rd", semitones: 4 },
  "perfect-4th": { label: "Perfect 4th", semitones: 5 },
  tritone: { label: "Tritone", semitones: 6 },
  "perfect-5th": { label: "Perfect 5th", semitones: 7 },
  "minor-6th": { label: "Minor 6th", semitones: 8 },
  "major-6th": { label: "Major 6th", semitones: 9 },
  "minor-7th": { label: "Minor 7th", semitones: 10 },
  "major-7th": { label: "Major 7th", semitones: 11 },
  octave: { label: "Octave", semitones: 12 },
} as const;

export type IntervalKey = keyof typeof INTERVAL_TYPES;

export const INTERVAL_NAMES: Record<IntervalKey, string> = {
  "minor-2nd": "Minor 2nd",
  "major-2nd": "Major 2nd",
  "minor-3rd": "Minor 3rd",
  "major-3rd": "Major 3rd",
  "perfect-4th": "Perfect 4th",
  tritone: "Tritone",
  "perfect-5th": "Perfect 5th",
  "minor-6th": "Minor 6th",
  "major-6th": "Major 6th",
  "minor-7th": "Minor 7th",
  "major-7th": "Major 7th",
  octave: "Octave",
};
