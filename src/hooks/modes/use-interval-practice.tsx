import { useCallback, useEffect, useState } from "react";
import { useSettings } from "@/hooks/use-settings";
import { getRandomInterval, Interval } from "@/utils/interval-utils";
import { useProcessedMIDI } from "@/hooks/use-midi/midi-hooks";

export const useIntervalPractice = () => {
  const { lowKey, highKey } = useSettings();
  const { pressedNotes, allKeysReleased } = useProcessedMIDI();

  const [interval, setInterval] = useState<Interval | null>(null);
  const [isIntervalComplete, setIsIntervalComplete] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>("");

  const randomizeInterval = useCallback(() => {
    const randomInterval = getRandomInterval({ lowKey, highKey });
    setInterval(randomInterval);
  }, [lowKey, highKey]);

  const nextInterval = useCallback(() => {
    randomizeInterval();
    setFeedback("");
    setIsIntervalComplete(false);
  }, [randomizeInterval]);

  const checkAnswer = useCallback(() => {
    if (!interval) return;

    if (isIntervalComplete && allKeysReleased) {
      // If interval is complete and all keys are released, allow to advance
      return nextInterval();
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
    nextInterval,
  ]);

  const handleNotePlayed = useCallback(() => {
    if (!interval) return;
    checkAnswer();
  }, [interval, checkAnswer]);

  useEffect(() => {
    handleNotePlayed();
  }, [handleNotePlayed]);

  useEffect(() => {
    randomizeInterval();
  }, [randomizeInterval]);

  return {
    interval,
    setInterval,
    skipInterval: randomizeInterval,
    feedback,
    checkAnswer,
  };
};
