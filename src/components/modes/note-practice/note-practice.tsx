import { KeyDisplay } from "./key-display";
import { Feedback } from "@/components/feedback";
import { MidiInput } from "@/components/midi-input";
import { Button } from "@ui/button";
import { useSingleNotePractice } from "@/hooks/modes/use-single-note-practice";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IndexQuiz } from "./index-quiz";
import { NoteQuiz } from "./note-quiz";
import { useEffect, useRef } from "react";
import { useTimedChallenge } from "@/hooks/use-timed-challenge";
import { TimedChallengeBanner } from "@/components/timed-challenge/timed-challenge-banner";
import { TimedChallengeResults } from "@/components/timed-challenge/timed-challenge-results";
import { RadioGroup, RadioGroupItem } from "@ui/radio-group";
import { Label } from "@ui/label";

export const NotePractice = () => {
  const {
    currentNote,
    feedback,
    skipNote,
    tab,
    setTab,
    correctCount,
    incorrectCount,
  } = useSingleNotePractice();

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
    onNext: skipNote,
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

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold text-green-600">Note Practice Mode</h2>

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
                htmlFor={`note-dur-${d}`}
                className="flex items-center gap-1"
              >
                <RadioGroupItem value={String(d)} id={`note-dur-${d}`} />
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

      {/* Main practice area */}
      {(!isTimed || challengeState === "active") && (
        <>
          {/* Hide tabs during timed challenge — MIDI only */}
          {isActive ? (
            <div className="flex w-full flex-col items-center justify-center gap-4">
              <KeyDisplay note={currentNote} />
              <MidiInput />
              <Feedback message={feedback} />
              <Button onClick={handleSkip}>Skip Note</Button>
            </div>
          ) : (
            <Tabs
              className="flex w-full flex-col"
              value={tab}
              onValueChange={setTab}
            >
              <TabsList className="mx-auto flex justify-center">
                <TabsTrigger value="piano">Piano</TabsTrigger>
                <TabsTrigger value="note-quiz">Names</TabsTrigger>
                <TabsTrigger value="index-quiz">Numbers</TabsTrigger>
              </TabsList>
              <TabsContent value="piano">
                <div className="flex w-full flex-col items-center justify-center gap-4">
                  <KeyDisplay note={currentNote} />
                  <MidiInput />
                  <Feedback message={feedback} />
                  <Button onClick={skipNote}>Skip Note</Button>
                </div>
              </TabsContent>
              <TabsContent value="note-quiz">
                <NoteQuiz />
              </TabsContent>
              <TabsContent value="index-quiz">
                <IndexQuiz />
              </TabsContent>
            </Tabs>
          )}
        </>
      )}
    </div>
  );
};
