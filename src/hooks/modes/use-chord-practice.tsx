import { useState, useEffect, useCallback } from "react";
import { AbstractChord, getRandomAbstractChord } from "@/utils/chord-utils";
import { useProcessedMIDI } from "@/hooks/use-midi/midi-hooks";
import { useSettings } from "@/hooks/use-settings";
import { midiToAbstractNoteName } from "@/utils/note-utils";

export const useChordPractice = () => {
  const { enabledChordTypes, enabledChordPracticeRootNotes } = useSettings();

  const [currentChord, setCurrentChord] = useState<AbstractChord>(
    getRandomAbstractChord({
      enabledRootNotes: [...enabledChordPracticeRootNotes],
      enabledChords: [...enabledChordTypes],
    }),
  );

  const [feedback, setFeedback] = useState<string>("");
  const [isChordComplete, setIsChordComplete] = useState<boolean>(false);

  const { pressedNotes, allKeysReleased } = useProcessedMIDI();

  const handleChordPlayed = (
    playedNotes: number[],
    allKeysReleased: boolean,
  ) => {
    if (isChordComplete && allKeysReleased) {
      // If chord is complete and all keys are released, allow to advance
      setCurrentChord((prev) =>
        getRandomAbstractChord({
          currentChord: prev || undefined,
          enabledRootNotes: [...enabledChordPracticeRootNotes],
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
      const sortedInput = [...pressedNotes].sort((a, b) => a - b);

      const steps = sortedInput.map((note) => note - sortedInput[0]);

      const allStepsMatch = steps.every((step, index) => {
        return step === currentChord.steps[index];
      });

      const correctNotes = sortedInput
        .map(midiToAbstractNoteName)
        .every((note) => currentChord.notes.includes(note));

      const playedCorrectly = allStepsMatch && correctNotes;

      if (playedCorrectly) {
        setFeedback("Correct!");
        setIsChordComplete(true);
      } else {
        setFeedback("Try Again!");
      }
    }
  };

  const advanceChord = useCallback(() => {
    setCurrentChord(
      (prev) =>
        getRandomAbstractChord({
          currentChord: prev,
          enabledChords: [...enabledChordTypes],
          enabledRootNotes: [...enabledChordPracticeRootNotes],
        }) || null,
    );
    setFeedback("");
    setIsChordComplete(false);
  }, [enabledChordTypes, enabledChordPracticeRootNotes]);

  // Use useEffect to call handleChordPlayed only when necessary
  useEffect(() => {
    handleChordPlayed(pressedNotes, allKeysReleased);
  }, [pressedNotes, allKeysReleased]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    advanceChord();
  }, [advanceChord]);

  return {
    currentChord,
    feedback,
    skipChord: advanceChord,
  };
};
