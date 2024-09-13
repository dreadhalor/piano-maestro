// use-game-logic.tsx
import { useSingleNotePractice } from "./modes/use-single-note-practice";
import { useChordPractice } from "./modes/use-chord-practice";
import { usePlaygroundMode } from "./modes/use-playground-mode";
import { PracticeMode } from "@/providers/app-provider";

export interface UseGameLogicOptions {
  mode: PracticeMode;
}

export const useGameLogic = ({ mode }: UseGameLogicOptions) => {
  const playgroundMode = usePlaygroundMode();
  const notePractice = useSingleNotePractice();
  const chordPractice = useChordPractice();

  switch (mode) {
    case "playground":
      return {
        pressedNotes: playgroundMode.pressedNotes,
        mode,
      };
    case "note":
      return {
        currentNote: notePractice.currentNote,
        feedback: notePractice.feedback,
        skipNote: notePractice.skipNote,
        mode,
      };
    case "chord":
      return {
        currentChord: chordPractice.currentChord,
        feedback: chordPractice.feedback,
        skipChord: chordPractice.skipChord,
        mode,
      };

    default:
      return {
        mode,
      };
  }
};
