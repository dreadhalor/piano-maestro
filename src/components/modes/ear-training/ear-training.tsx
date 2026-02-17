import { Button } from "@ui/button";
import { Feedback } from "@/components/feedback";
import { useEarTrainingPractice } from "@/hooks/modes/use-ear-training-practice";
import { MidiInput } from "@/components/midi-input";
import { useCallback, useEffect, useRef } from "react";
import { useTimedChallenge } from "@/hooks/use-timed-challenge";
import { TimedChallengeBanner } from "@/components/timed-challenge/timed-challenge-banner";
import { TimedChallengeResults } from "@/components/timed-challenge/timed-challenge-results";
import { RadioGroup, RadioGroupItem } from "@ui/radio-group";
import { Label } from "@ui/label";

export const EarTrainingPractice = () => {
  const {
    state,
    start,
    feedback,
    playCurrentNote,
    skipNote,
    correctCount,
    incorrectCount,
  } = useEarTrainingPractice();

  const onNext = useCallback(() => {
    if (state === "initial") {
      start();
    } else {
      skipNote();
    }
  }, [state, start, skipNote]);

  const {
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
  } = useTimedChallenge({
    onNext,
    autoAdvance: false,
  });

  // Track correct answers via correctCount changes
  const prevCorrectCount = useRef(correctCount);
  useEffect(() => {
    if (correctCount > prevCorrectCount.current) {
      prevCorrectCount.current = correctCount;
      if (isTimed && challengeState === "active") {
        recordAnswer(true);
      }
    }
  }, [correctCount, isTimed, challengeState, recordAnswer]);

  // Track incorrect attempts via incorrectCount changes
  const prevIncorrectCount = useRef(incorrectCount);
  useEffect(() => {
    if (incorrectCount > prevIncorrectCount.current) {
      prevIncorrectCount.current = incorrectCount;
      if (isTimed && challengeState === "active") {
        recordAnswer(false);
      }
    }
  }, [incorrectCount, isTimed, challengeState, recordAnswer]);

  const handleSkip = () => {
    if (isTimed && challengeState === "active") {
      recordAnswer(false);
    }
    skipNote();
  };

  const isActive = isTimed && challengeState === "active";
  const showPracticeUI = !isTimed || challengeState === "active";

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold text-orange-600">Ear Training Mode</h2>

      <p className="text-lg text-gray-700">
        Listen to the note and try to play it on your keyboard.
      </p>

      {/* Practice / Timed toggle */}
      <div className="flex gap-2">
        <Button
          variant={!isTimed ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setIsTimed(false);
            resetChallenge();
          }}
        >
          Practice
        </Button>
        <Button
          variant={isTimed ? "default" : "outline"}
          size="sm"
          onClick={() => setIsTimed(true)}
        >
          Timed Challenge
        </Button>
      </div>

      {/* Timed: idle state — duration picker + start */}
      {isTimed && challengeState === "idle" && (
        <div className="flex w-full flex-col items-center gap-4 rounded-lg bg-gray-100 p-4 shadow-inner">
          <h3 className="text-lg font-semibold text-gray-700">
            Choose Duration
          </h3>
          <RadioGroup
            value={String(duration)}
            onValueChange={(v) => setDuration(Number(v))}
            className="flex gap-4"
          >
            {[30, 60, 90].map((d) => (
              <Label
                key={d}
                htmlFor={`ear-dur-${d}`}
                className="flex items-center gap-1"
              >
                <RadioGroupItem value={String(d)} id={`ear-dur-${d}`} />
                <span>{d}s</span>
              </Label>
            ))}
          </RadioGroup>
          <Button onClick={startChallenge}>Start Challenge</Button>
        </div>
      )}

      {/* Timed: results state */}
      {isTimed && challengeState === "results" && (
        <TimedChallengeResults score={score} onPlayAgain={resetChallenge} />
      )}

      {/* Active challenge banner */}
      {isActive && (
        <TimedChallengeBanner
          timeRemaining={timeRemaining}
          duration={duration}
          score={score}
        />
      )}

      {/* Practice UI */}
      {showPracticeUI && (
        <>
          {/* Practice mode: initial state */}
          {!isTimed && state === "initial" && (
            <Button onClick={start}>Start</Button>
          )}

          {state !== "initial" && (
            <>
              <MidiInput />
              <Feedback message={feedback} className="mt-0" />

              <div className="flex gap-4">
                <Button
                  onClick={playCurrentNote}
                  disabled={state !== "playing"}
                >
                  Replay Note
                </Button>
                {isActive && (
                  <Button variant="outline" onClick={handleSkip}>
                    Skip Note
                  </Button>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};
