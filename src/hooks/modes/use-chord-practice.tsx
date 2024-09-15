// hooks/modes/use-chord-practice.tsx
import { useState, useEffect } from "react";
import { Chord, getRandomChord } from "@/utils/chords";
import { notesMatchWithExactIntervals } from "@/utils/chord-utils";
import { useProcessedMIDI } from "@/hooks/use-midi/midi-hooks";
import { useSettings } from "@/hooks/use-settings";

export const useChordPractice = () => {
  const { enabledChordTypes } = useSettings(); // Use the enabled chord types from settings

  const [currentChord, setCurrentChord] = useState<Chord>(
    getRandomChord({ enabledChords: [...enabledChordTypes] }),
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
      setCurrentChord((prev) =>
        getRandomChord({
          currentChord: prev,
          enabledChords: [...enabledChordTypes],
        }),
      );
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
    setCurrentChord((prev) =>
      getRandomChord({
        currentChord: prev,
        enabledChords: [...enabledChordTypes],
      }),
    );
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
    skipChord,
  };
};
