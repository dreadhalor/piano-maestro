import { useSingleNotePractice } from "./modes/use-single-note-practice";
import { useChordPractice } from "./modes/use-chord-practice";
import { usePlaygroundMode } from "./modes/use-playground-mode";
import { PracticeMode } from "@/providers/app-provider";

export interface UseGameLogicOptions {
  mode: PracticeMode;
}

export const useGameLogic = ({ mode }: UseGameLogicOptions) => {
  const notePractice = useSingleNotePractice();
  const chordPractice = useChordPractice();
  const playgroundMode = usePlaygroundMode();

  switch (mode) {
    case "note":
      return {
        currentNote: notePractice.currentNote,
        feedback: notePractice.feedback,
        mode,
      };
    case "chord":
      return {
        currentChord: chordPractice.currentChord,
        feedback: chordPractice.feedback,
        mode,
      };
    case "playground":
      return {
        pressedNotes: playgroundMode.pressedNotes,
        mode,
      };
    default:
      return {
        mode,
      };
  }
};
