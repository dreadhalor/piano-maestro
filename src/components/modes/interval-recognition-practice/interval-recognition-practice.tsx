import { useIntervalRecognitionPractice } from "@/hooks/modes/use-interval-recognition-practice";
import { Feedback } from "@/components/feedback";
import { Button } from "@ui/button";
import { IntervalGrid } from "./interval-recognition-grid";
import { Separator } from "@/components/ui/separator";
import { useSettings } from "@/hooks/use-settings";
import { useCallback, useEffect } from "react";
import { useTimedChallenge } from "@/hooks/use-timed-challenge";
import { TimedChallengeBanner } from "@/components/timed-challenge/timed-challenge-banner";
import { TimedChallengeResults } from "@/components/timed-challenge/timed-challenge-results";
import { RadioGroup, RadioGroupItem } from "@ui/radio-group";
import { Label } from "@ui/label";
import { IntervalKey } from "@/utils/interval-utils";

export const IntervalRecognitionPractice = () => {
  const {
    state,
    start,
    feedback,
    nextInterval,
    replayInterval,
    currentInterval,
    submitAnswer,
  } = useIntervalRecognitionPractice();
  const { setTab } = useSettings();

  const onNext = useCallback(() => {
    if (state === "initial") {
      start();
    } else {
      nextInterval();
    }
  }, [state, start, nextInterval]);

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
  } = useTimedChallenge({ onNext });

  useEffect(() => {
    setTab("interval-recognition");
  }, [setTab]);

  const handleSubmit = useCallback(
    (key: IntervalKey) => {
      const correct = submitAnswer(key);
      if (isTimed && challengeState === "active") {
        recordAnswer(correct);
      }
    },
    [submitAnswer, isTimed, challengeState, recordAnswer],
  );

  const isActive = isTimed && challengeState === "active";
  const showPracticeUI = !isTimed || challengeState === "active";

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold text-indigo-600">
        Interval Practice Mode
      </h2>

      <p className="text-lg text-gray-700">
        Practice identifying intervals by ear.
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
                htmlFor={`interval-dur-${d}`}
                className="flex items-center gap-1"
              >
                <RadioGroupItem value={String(d)} id={`interval-dur-${d}`} />
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

      {/* Practice UI (shown in practice mode always, or during active timed challenge) */}
      {showPracticeUI && (
        <>
          {/* Practice mode: initial state */}
          {!isTimed && state === "initial" && (
            <Button onClick={start}>Start</Button>
          )}

          {/* Question area */}
          {state !== "initial" && (
            <>
              <div className="w-full rounded-lg bg-gray-100 p-4 text-center shadow-inner">
                <h3 className="text-lg font-semibold text-gray-700">
                  {currentInterval ? (
                    state === "answered" && !isActive ? (
                      <>
                        {currentInterval.direction === "ascending" ? "↑" : "↓"}{" "}
                        {currentInterval.name.charAt(0).toUpperCase() +
                          currentInterval.name.slice(1).replace("-", " ")}
                      </>
                    ) : (
                      <>?</>
                    )
                  ) : (
                    "No interval selected"
                  )}
                </h3>
              </div>

              <Feedback message={feedback} />

              {/* Controls — hidden during timed challenge */}
              {!isActive && (
                <div className="flex gap-4">
                  <Button
                    onClick={replayInterval}
                    disabled={!currentInterval}
                  >
                    Replay Interval
                  </Button>
                  <Button onClick={nextInterval}>Next Interval</Button>
                </div>
              )}

              <Separator />
              <IntervalGrid submitAnswer={handleSubmit} state={state} />
            </>
          )}
        </>
      )}
    </div>
  );
};
