import { useCallback, useEffect, useState } from "react";
import { useSettings } from "@/hooks/use-settings";
import { getRandomInterval, Interval } from "@/utils/interval-utils";
import { useProcessedMIDI } from "@/hooks/use-midi/midi-hooks";

export const useIntervalPractice = () => {
  const { lowKey, highKey, enabledIntervals, intervalDirection } =
    useSettings();
  const { pressedNotes, allKeysReleased } = useProcessedMIDI();

  const [interval, setInterval] = useState<Interval | null>(null);
  const [isIntervalComplete, setIsIntervalComplete] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>("");

  const advanceInterval = useCallback(() => {
    setInterval(() =>
      getRandomInterval({
        lowKey,
        highKey,
        currentInterval: interval?.type,
        enabledIntervals: [...enabledIntervals],
        direction: intervalDirection,
      }),
    );
    setFeedback("");
    setIsIntervalComplete(false);
    // if we include interval in the dependencies, it will cause an infinite loop
  }, [lowKey, highKey, enabledIntervals]); // eslint-disable-line react-hooks/exhaustive-deps

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
    const sortedInterval = [interval.notes[0], interval.notes[1]].sort(
      (a, b) => a - b,
    );

    const correct =
      sortedInput[0] === sortedInterval[0] &&
      sortedInput[1] === sortedInterval[1];
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
