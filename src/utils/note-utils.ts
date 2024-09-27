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

export const getRandomAbstractNote = (): AbstractNote => {
  return NOTES[Math.floor(Math.random() * 12)] satisfies AbstractNote;
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
