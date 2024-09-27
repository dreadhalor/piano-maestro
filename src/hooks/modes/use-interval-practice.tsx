import { useCallback, useEffect, useState } from "react";
import { useSettings } from "@/hooks/use-settings";
import {
  AbstractInterval,
  getRandomAbstractInterval,
  INTERVAL_TYPES,
} from "@/utils/interval-utils";
import { useProcessedMIDI } from "@/hooks/use-midi/midi-hooks";

export const useIntervalPractice = () => {
  const {
    lowKey,
    highKey,
    enabledIntervals,
    intervalDirection,
    enabledIntervalPracticeRootNotes,
  } = useSettings();
  const { pressedNotes, allKeysReleased } = useProcessedMIDI();

  const [interval, setInterval] = useState<AbstractInterval | null>(null);
  const [isIntervalComplete, setIsIntervalComplete] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>("");

  const advanceInterval = useCallback(
    () => {
      setInterval(() =>
        getRandomAbstractInterval({
          currentInterval: interval?.type,
          enabledIntervals: [...enabledIntervals],
          enabledRootNotes: [...enabledIntervalPracticeRootNotes],
          direction: intervalDirection,
        }),
      );
      setFeedback("");
      setIsIntervalComplete(false);
      // if we include interval in the dependencies, it will cause an infinite loop
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      lowKey,
      highKey,
      enabledIntervals,
      intervalDirection,
      enabledIntervalPracticeRootNotes,
    ],
  );

  const checkAnswer = useCallback(() => {
    if (!interval) return;

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
    const correct = steps === INTERVAL_TYPES[interval.type].semitones;
    if (correct) {
      setFeedback("Correct!");
      setIsIntervalComplete(true);
    } else {
      setFeedback("Incorrect. Try again!");
    }
  }, [
    interval,
    isIntervalComplete,
    allKeysReleased,
    pressedNotes,
    advanceInterval,
  ]);

  const handleNotePlayed = useCallback(() => {
    if (!interval) return;
    checkAnswer();
  }, [interval, checkAnswer]);

  useEffect(() => {
    handleNotePlayed();
  }, [handleNotePlayed]);

  useEffect(() => {
    advanceInterval();
  }, [advanceInterval]);

  return {
    interval,
    skipInterval: advanceInterval,
    feedback,
    checkAnswer,
  };
};
