import { midiToNoteName } from "@/utils/note-utils";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getWhiteAndBlackKeys = (lowKey: number, highKey: number) => {
  // Define white and black keys dynamically based on the user-defined range
  const whiteKeys: { note: string; midiNumber: number }[] = [];
  const blackKeys = [];

  // MIDI notes that are black keys
  const blackKeyNotes = ["C#", "Eb", "F#", "G#", "Bb"];

  for (let i = lowKey; i <= highKey; i++) {
    const noteName = midiToNoteName(i);
    const isBlackKey = blackKeyNotes.includes(noteName.slice(0, -1)); // Exclude octave for comparison

    if (isBlackKey) {
      blackKeys.push({ note: noteName, midiNumber: i });
    } else {
      whiteKeys.push({ note: noteName, midiNumber: i });
    }
  }

  return { whiteKeys, blackKeys };
};
