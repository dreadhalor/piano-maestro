import { IntervalDirection } from "./interval-utils";

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
] as const;
export type AbstractNote = (typeof NOTES)[number];

export const WHITE_KEYS = [
  NOTES[0],
  NOTES[2],
  NOTES[4],
  NOTES[5],
  NOTES[7],
  NOTES[9],
  NOTES[11],
] as const;
export const BLACK_KEYS = [
  NOTES[1],
  NOTES[3],
  NOTES[6],
  NOTES[8],
  NOTES[10],
] as const;

export const midiToAbstractNoteName = (midiNumber: number) => {
  return NOTES[midiNumber % 12] satisfies AbstractNote;
};
export const midiToNoteName = (midiNumber: number): string => {
  const note = NOTES[midiNumber % 12];
  const octave = Math.floor(midiNumber / 12) - 1; // MIDI note 0 is C-1
  return `${note}${octave}`;
};

export const getRandomAbstractNote = (opts?: {
  currentNote?: AbstractNote;
  enabledNotes?: AbstractNote[];
}) => {
  const { enabledNotes, currentNote } = opts || {};
  let randomNote: AbstractNote;
  // If no enabled notes, return the first note
  if (enabledNotes && enabledNotes.length === 0) return NOTES[0];
  if (enabledNotes && enabledNotes.length === 1) return enabledNotes[0];
  do {
    randomNote = NOTES[Math.floor(Math.random() * 12)];
  } while (
    randomNote === currentNote ||
    (enabledNotes && !enabledNotes.includes(randomNote))
  );
  return randomNote;
};

export const stepFromAbstractNote = (
  note: AbstractNote,
  steps: number,
  direction: IntervalDirection = "ascending",
): AbstractNote => {
  const index = NOTES.indexOf(note);
  const newIndex =
    (direction === "ascending" ? index + steps : index - steps + 12) % 12;
  return NOTES[newIndex] satisfies AbstractNote;
};

export const checkNoteEquality = (
  noteA: string,
  noteB: AbstractNote,
): boolean => {
  // replace any # with s
  const noteAWithoutSharp = noteA.replace("#", "s");
  const noteBWithoutSharp = noteB.replace("#", "s");
  return noteAWithoutSharp.toLowerCase() === noteBWithoutSharp.toLowerCase();
};
