// hooks/modes/use-chord-practice.tsx
import { useState, useEffect } from "react";
import { CHORDS, Chord } from "@/utils/chords";
import { notesMatchWithExactIntervals } from "@/utils/chord-utils";
import { useProcessedMIDI } from "@/hooks/use-midi/use-processed-midi";
import { useSettings } from "@/hooks/use-settings";

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

  const { pressedNotes, allKeysReleased } = useProcessedMIDI(); // Use the new processed MIDI hook

  const handleChordPlayed = (
    playedNotes: number[],
    allKeysReleased: boolean,
  ) => {
    if (isChordComplete && allKeysReleased) {
      // If chord is complete and all keys are released, allow to advance
      setCurrentChord(getRandomChordFromEnabled());
      setFeedback("");
      setIsChordComplete(false);
      return;
    }

    if (isChordComplete) {
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
      } else {
        setFeedback("Try Again!");
      }
    }
  };

  const skipChord = () => {
    setCurrentChord(getRandomChordFromEnabled());
    setFeedback(""); // Reset feedback on skip
    setIsChordComplete(false);
  };

  // Use useEffect to call handleChordPlayed only when necessary
  useEffect(() => {
    handleChordPlayed(pressedNotes, allKeysReleased);
  }, [pressedNotes, allKeysReleased]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    currentChord,
    feedback,
    skipChord, // Include the skipChord function to be used in the UI
  };
};
