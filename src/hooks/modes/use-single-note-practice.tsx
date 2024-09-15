import { useState, useEffect } from "react";
import { getRandomNote } from "@/utils/chord-utils";
import { useSettings } from "@/hooks/use-settings";
import { useProcessedMIDI } from "@/hooks/use-midi/midi-hooks";

export const useSingleNotePractice = () => {
  const { lowKey, highKey } = useSettings(); // Access the user-defined range from settings
  const [currentNote, setCurrentNote] = useState<number>(
    getRandomNote(lowKey, highKey),
  );
  const [feedback, setFeedback] = useState<string>("");
  const [isNoteComplete, setIsNoteComplete] = useState<boolean>(false);

  const { pressedNotes, allKeysReleased } = useProcessedMIDI();

  const handleNotePlayed = (
    playedNotes: number[],
    allKeysReleased: boolean,
  ) => {
    if (isNoteComplete && allKeysReleased) {
      // If note is complete and all keys are released, advance to the next question
      skipNote();
      return;
    }

    if (isNoteComplete) {
      return; // Do nothing if note is already validated and waiting for release
    }

    if (playedNotes.length === 1) {
      if (playedNotes.includes(currentNote)) {
        setFeedback("Correct!");
        setIsNoteComplete(true);
      } else {
        setFeedback("Try Again!");
      }
    }
  };

  const skipNote = () => {
    setCurrentNote((prev) => getRandomNote(lowKey, highKey, prev));
    setFeedback("");
    setIsNoteComplete(false);
  };

  // Use useEffect to call handleNotePlayed only when necessary
  useEffect(() => {
    handleNotePlayed(pressedNotes, allKeysReleased);
  }, [pressedNotes, allKeysReleased]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    currentNote,
    feedback,
    skipNote,
  };
};
