import { useCallback, useEffect, useState, useRef } from "react";
import { useSettings } from "@/hooks/use-settings";
import {
  AbstractInterval,
  getRandomAbstractInterval,
  INTERVAL_TYPES,
} from "@/utils/interval-utils";
import { useProcessedMIDI } from "@/hooks/use-midi/midi-hooks";
import { midiToAbstractNoteName } from "@/utils/chord-utils";

export const useIntervalPractice = () => {
  const {
    enabledIntervals,
    intervalDirection,
    enabledIntervalPracticeRootNotes,
  } = useSettings();
  const { pressedNotes, allKeysReleased } = useProcessedMIDI();

  const [currentInterval, setCurrentInterval] =
    useState<AbstractInterval | null>(null);

  // We need a ref or else advanceInterval will be an infinite loop
  const intervalRef = useRef<AbstractInterval | null>(currentInterval);

  const [isIntervalComplete, setIsIntervalComplete] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>("");

  // 3. Synchronize the ref with the currentInterval state
  useEffect(() => {
    intervalRef.current = currentInterval;
  }, [currentInterval]);

  const advanceInterval = useCallback(() => {
    console.log("enabledRoots", enabledIntervalPracticeRootNotes);
    setCurrentInterval(
      getRandomAbstractInterval({
        currentInterval: intervalRef.current || undefined,
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

  // 6. Update handleNotePlayed to use currentInterval
  const handleNotePlayed = useCallback(() => {
    if (!currentInterval) return;
    checkAnswer();
  }, [currentInterval, checkAnswer]);

  // 7. useEffect to handle note played
  useEffect(() => {
    handleNotePlayed();
  }, [handleNotePlayed]);

  // 8. useEffect to initialize the first interval
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
