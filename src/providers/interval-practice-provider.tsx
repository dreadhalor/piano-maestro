import { createContext, useCallback, useEffect, useState } from "react";
import { useSettings } from "@/hooks/use-settings";
import {
  AbstractInterval,
  getRandomAbstractInterval,
  INTERVAL_TYPES,
} from "@/utils/interval-utils";
import { useProcessedMIDI } from "@/hooks/use-midi/midi-hooks";
import { midiToAbstractNoteName } from "@/utils/note-utils";

interface IntervalPracticeContextType {
  interval: AbstractInterval;
  skipInterval: () => void;
  feedback: string;
  checkAnswer: () => void;
  tab: string;
  setTab: (tab: string) => void;
}

export const IntervalPracticeContext = createContext<
  IntervalPracticeContextType | undefined
>(undefined);

export const IntervalPracticeProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
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
  const [tab, setTab] = useState<string>("piano");

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
    if (tab !== "piano") return;
    checkAnswer();
  }, [currentInterval, checkAnswer, tab]);

  useEffect(() => {
    handleNotePlayed();
  }, [handleNotePlayed]);

  useEffect(() => {
    advanceInterval();
  }, [advanceInterval]);

  const value = {
    interval: currentInterval,
    skipInterval: advanceInterval,
    feedback,
    checkAnswer,
    tab,
    setTab,
  };

  return (
    <IntervalPracticeContext.Provider value={value}>
      {children}
    </IntervalPracticeContext.Provider>
  );
};
