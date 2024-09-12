// hooks/modes/use-single-note-practice.tsx
import { useState } from "react";
import { getRandomNote } from "@/utils/chord-utils";
import { useMIDI } from "@/hooks/use-midi";
import { useSettings } from "@/providers/settings-provider"; // Import the settings hook to access the range

export const useSingleNotePractice = () => {
  const { lowKey, highKey } = useSettings(); // Access the user-defined range from settings
  const [currentNote, setCurrentNote] = useState<number>(
    getRandomNote(lowKey, highKey),
  );
  const [feedback, setFeedback] = useState<string>("");
  const [isNoteComplete, setIsNoteComplete] = useState<boolean>(false);
  const [awaitingKeyRelease, setAwaitingKeyRelease] = useState<boolean>(false);

  const handleNotePlayed = (
    playedNotes: number[],
    allKeysReleased: boolean,
  ) => {
    if (isNoteComplete && allKeysReleased && awaitingKeyRelease) {
      skipNote(); // Use skipNote function to skip to next note
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

  const skipNote = () => {
    setCurrentNote((prev) => getRandomNote(lowKey, highKey, prev));
    setFeedback("");
    setIsNoteComplete(false);
    setAwaitingKeyRelease(false);
  };

  useMIDI({
    onNotesChange: handleNotePlayed, // Hook is used specifically for note practice
  });

  return {
    currentNote,
    feedback,
    skipNote, // Return skipNote function
  };
};
