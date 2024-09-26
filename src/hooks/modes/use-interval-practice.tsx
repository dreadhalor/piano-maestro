import { useCallback, useEffect, useState } from "react";
import { useSettings } from "@/hooks/use-settings";
import { getRandomInterval, Interval } from "@/utils/interval-utils";

export const useIntervalPractice = () => {
  const { lowKey, highKey } = useSettings();
  const [interval, setInterval] = useState<Interval | null>(null);
  const [feedback, setFeedback] = useState<string>("");

  const randomizeInterval = useCallback(() => {
    const randomInterval = getRandomInterval({ lowKey, highKey });
    setInterval(randomInterval);
  }, [lowKey, highKey]);

  const checkAnswer = useCallback(
    (note: number) => {
      if (!interval) return;
      const correct = interval.notes.includes(note);
      setFeedback(correct ? "Correct!" : "Incorrect");
    },
    [interval],
  );

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
