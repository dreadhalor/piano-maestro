import { useState, useEffect, useRef } from "react";
import { AbstractChord, getTrueRandomAbstractChord } from "@/utils/chord-utils";
import { useProcessedMIDI } from "@/hooks/use-midi/midi-hooks";
import { useSettings } from "@/hooks/use-settings";
import { midiToAbstractNoteName } from "@/utils/note-utils";

export const useChordPractice = () => {
  const { enabledChordTypes, enabledChordPracticeRootNotes } = useSettings();

  // const [currentChord, setCurrentChord] = useState<Chord>(
  //   getRandomChord({ enabledChords: [...enabledChordTypes] }),
  // );
  const [currentChord, setCurrentChord] = useState<AbstractChord>(
    getTrueRandomAbstractChord({
      enabledRootNotes: [...enabledChordPracticeRootNotes],
      enabledChords: [...enabledChordTypes],
    }),
  );
  // We need a ref or else advanceInterval will be an infinite loop
  const chordRef = useRef<AbstractChord | null>(currentChord);

  const [feedback, setFeedback] = useState<string>("");
  const [isChordComplete, setIsChordComplete] = useState<boolean>(false);

  const { pressedNotes, allKeysReleased } = useProcessedMIDI();

  const handleChordPlayed = (
    playedNotes: number[],
    allKeysReleased: boolean,
  ) => {
    if (isChordComplete && allKeysReleased) {
      // If chord is complete and all keys are released, allow to advance
      setCurrentChord(() =>
        getTrueRandomAbstractChord({
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

  const skipChord = () => {
    setCurrentChord(() =>
      getTrueRandomAbstractChord({
        enabledRootNotes: [...enabledChordPracticeRootNotes],
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

  // Synchronize the ref with the currentChord state
  useEffect(() => {
    chordRef.current = currentChord;
  }, [currentChord]);

  return {
    currentChord,
    feedback,
    skipChord,
  };
};
