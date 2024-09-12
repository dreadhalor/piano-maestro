// hooks/modes/use-chord-practice.tsx
import { useState } from "react";
import { CHORDS, Chord } from "@/utils/chords";
import { notesMatchWithExactIntervals } from "@/utils/chord-utils";
import { useMIDI } from "@/hooks/use-midi";
import { useSettings } from "@/providers/settings-provider";

export const useChordPractice = () => {
  const { enabledChordTypes } = useSettings(); // Use the enabled chord types from settings

  // Filter chords by enabled types using exact key matching
  const filteredChords = CHORDS.filter((chord) =>
    enabledChordTypes.has(chord.type),
  );

  const getRandomChordFromEnabled = (): Chord => {
    const randomIndex = Math.floor(Math.random() * filteredChords.length);
    return filteredChords[randomIndex];
  };

  const [currentChord, setCurrentChord] = useState<Chord>(
    getRandomChordFromEnabled(),
  );

  const [feedback, setFeedback] = useState<string>("");
  const [isChordComplete, setIsChordComplete] = useState<boolean>(false);
  const [awaitingKeyRelease, setAwaitingKeyRelease] = useState<boolean>(false);

  const handleChordPlayed = (
    playedNotes: number[],
    allKeysReleased: boolean,
  ) => {
    if (isChordComplete && allKeysReleased && awaitingKeyRelease) {
      // If chord is complete and keys are released, allow to advance
      setCurrentChord(getRandomChordFromEnabled());
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

  const skipChord = () => {
    setCurrentChord(getRandomChordFromEnabled());
    setFeedback(""); // Reset feedback on skip
    setIsChordComplete(false);
    setAwaitingKeyRelease(false);
  };

  return {
    currentChord,
    feedback,
    skipChord, // Include the skipChord function to be used in the UI
  };
};
