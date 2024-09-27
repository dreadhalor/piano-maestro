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
