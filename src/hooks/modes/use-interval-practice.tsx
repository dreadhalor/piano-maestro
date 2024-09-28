import { useCallback, useEffect, useState } from "react";
import { useSettings } from "@/hooks/use-settings";
import {
  AbstractInterval,
  getRandomAbstractInterval,
  INTERVAL_TYPES,
} from "@/utils/interval-utils";
import { useProcessedMIDI } from "@/hooks/use-midi/midi-hooks";
import { midiToAbstractNoteName } from "@/utils/note-utils";

export const useIntervalPractice = () => {
  const {
    enabledIntervals,
    intervalDirection,
    enabledIntervalPracticeRootNotes,
  } = useSettings();
  const { pressedNotes, allKeysReleased } = useProcessedMIDI();

  const [currentInterval, setCurrentInterval] = useState<AbstractInterval>(
    getRandomAbstractInterval({
      enabledIntervals: [...enabledIntervals],
      enabledRootNotes: [...enabledIntervalPracticeRootNotes],
      direction: intervalDirection,
    }) || null,
  );

  const [isIntervalComplete, setIsIntervalComplete] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>("");

  const advanceInterval = useCallback(() => {
    setCurrentInterval(
      (prev) =>
        getRandomAbstractInterval({
          currentInterval: prev || undefined,
          enabledIntervals: [...enabledIntervals],
          enabledRootNotes: [...enabledIntervalPracticeRootNotes],
          direction: intervalDirection,
        }) || null,
    );
    setFeedback("");
    setIsIntervalComplete(false);
  }, [enabledIntervals, intervalDirection, enabledIntervalPracticeRootNotes]);

  const checkAnswer = useCallback(() => {
    if (!currentInterval) return;

    if (isIntervalComplete && allKeysReleased) {
      // If interval is complete and all keys are released, allow to advance
      return advanceInterval();
    }

    if (isIntervalComplete) {
      return; // Do nothing if interval is already validated
    }

    if (pressedNotes.length !== 2) return;

    const sortedInput = [...pressedNotes].sort((a, b) => a - b);

    const steps = sortedInput[1] - sortedInput[0];
    const correctSteps =
      steps === INTERVAL_TYPES[currentInterval.type].semitones;
    const correctNotes = sortedInput
      .map(midiToAbstractNoteName)
      .every((note) => currentInterval.notes.includes(note));
    if (correctSteps && correctNotes) {
      setFeedback("Correct!");
      setIsIntervalComplete(true);
    } else {
      setFeedback("Incorrect. Try again!");
    }
  }, [
    currentInterval,
    isIntervalComplete,
    allKeysReleased,
    pressedNotes,
    advanceInterval,
  ]);

  const handleNotePlayed = useCallback(() => {
    if (!currentInterval) return;
    checkAnswer();
  }, [currentInterval, checkAnswer]);

  useEffect(() => {
    handleNotePlayed();
  }, [handleNotePlayed]);

  useEffect(() => {
    advanceInterval();
  }, [advanceInterval]);

  return {
    interval: currentInterval,
    skipInterval: advanceInterval,
    feedback,
    checkAnswer,
  };
};
