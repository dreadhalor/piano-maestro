import { useState } from "react";
import { getRandomChord, Chord } from "@/utils/chords";
import { notesMatchWithExactIntervals } from "@/utils/chord-utils";
import { useMIDI } from "@/hooks/use-midi";

export const useChordPractice = () => {
  const [currentChord, setCurrentChord] = useState<Chord>(getRandomChord());
  const [feedback, setFeedback] = useState<string>("");
  const [isChordComplete, setIsChordComplete] = useState<boolean>(false);
  const [awaitingKeyRelease, setAwaitingKeyRelease] = useState<boolean>(false);

  const handleChordPlayed = (
    playedNotes: number[],
    allKeysReleased: boolean,
  ) => {
    if (isChordComplete && allKeysReleased && awaitingKeyRelease) {
      // If chord is complete and keys are released, allow to advance
      setCurrentChord((prev) => getRandomChord(prev));
      setFeedback("");
      setIsChordComplete(false);
      setAwaitingKeyRelease(false);
      return;
    }

    if (isChordComplete) {
      if (allKeysReleased) {
        setAwaitingKeyRelease(true); // Set awaiting release to switch question
      }
      return; // Do nothing if chord is already validated
    }

    if (playedNotes.length === currentChord.notes.length) {
      const playedCorrectly = notesMatchWithExactIntervals(
        playedNotes,
        currentChord.notes,
      );
      if (playedCorrectly) {
        setFeedback("Correct!");
        setIsChordComplete(true);
        setAwaitingKeyRelease(false); // Wait for user to release keys
      } else {
        setFeedback("Try Again!");
      }
    }
  };

  useMIDI({
    onNotesChange: handleChordPlayed, // Hook is used specifically for chord practice
  });

  return {
    currentChord,
    feedback,
  };
};
