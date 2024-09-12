import { useState } from "react";
import { getRandomNote } from "@/utils/chord-utils";
import { useMIDI } from "@/hooks/use-midi";

export const useSingleNotePractice = () => {
  const [currentNote, setCurrentNote] = useState<number>(getRandomNote());
  const [feedback, setFeedback] = useState<string>("");
  const [isNoteComplete, setIsNoteComplete] = useState<boolean>(false);
  const [awaitingKeyRelease, setAwaitingKeyRelease] = useState<boolean>(false);

  const handleNotePlayed = (
    playedNotes: number[],
    allKeysReleased: boolean,
  ) => {
    if (isNoteComplete && allKeysReleased && awaitingKeyRelease) {
      // If note is complete and keys are released, allow to advance
      setCurrentNote(getRandomNote());
      setFeedback("");
      setIsNoteComplete(false);
      setAwaitingKeyRelease(false);
      return;
    }

    if (isNoteComplete) {
      if (allKeysReleased) {
        setAwaitingKeyRelease(true); // Set awaiting release to switch question
      }
      return; // Do nothing if note is already validated
    }

    if (playedNotes.length === 1) {
      if (playedNotes.includes(currentNote)) {
        setFeedback("Correct!");
        setIsNoteComplete(true);
        setAwaitingKeyRelease(false); // Wait for user to release the key
      } else {
        setFeedback("Try Again!");
      }
    }
  };

  useMIDI({
    onChordPlayed: handleNotePlayed, // Hook is used specifically for note practice
  });

  return {
    currentNote,
    feedback,
  };
};
