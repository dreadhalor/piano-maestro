import { useState, useCallback, useRef, useEffect } from "react";

export interface TimedChallengeScore {
  correct: number;
  incorrect: number;
}

type ChallengeState = "idle" | "active" | "results";

interface UseTimedChallengeOptions {
  onNext: () => void;
  autoAdvanceDelay?: number;
  /** Set to false for MIDI modes where the provider handles auto-advancement */
  autoAdvance?: boolean;
}

export const useTimedChallenge = ({
  onNext,
  autoAdvanceDelay = 500,
  autoAdvance = true,
}: UseTimedChallengeOptions) => {
  const [isTimed, setIsTimed] = useState(false);
  const [challengeState, setChallengeState] = useState<ChallengeState>("idle");
  const [duration, setDuration] = useState(60);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [score, setScore] = useState<TimedChallengeScore>({
    correct: 0,
    incorrect: 0,
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (advanceTimerRef.current) {
      clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
  }, []);

  const startChallenge = useCallback(() => {
    clearTimers();
    setScore({ correct: 0, incorrect: 0 });
    setTimeRemaining(duration);
    setChallengeState("active");
    onNext();

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearTimers();
          setChallengeState("results");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [duration, onNext, clearTimers]);

  const recordAnswer = useCallback(
    (correct: boolean) => {
      if (challengeState !== "active") return;

      setScore((prev) => ({
        correct: prev.correct + (correct ? 1 : 0),
        incorrect: prev.incorrect + (correct ? 0 : 1),
      }));

      if (autoAdvance) {
        advanceTimerRef.current = setTimeout(() => {
          if (challengeState === "active") {
            onNext();
          }
        }, autoAdvanceDelay);
      }
    },
    [challengeState, onNext, autoAdvanceDelay, autoAdvance],
  );

  const resetChallenge = useCallback(() => {
    clearTimers();
    setScore({ correct: 0, incorrect: 0 });
    setTimeRemaining(duration);
    setChallengeState("idle");
  }, [duration, clearTimers]);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  return {
    isTimed,
    setIsTimed,
    challengeState,
    duration,
    setDuration,
    timeRemaining,
    score,
    startChallenge,
    recordAnswer,
    resetChallenge,
  };
};
