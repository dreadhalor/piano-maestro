import { ChordDisplay } from "./chord-display";
import { Feedback } from "@/components/feedback";
import { MidiInput } from "@/components/midi-input";
import { Button } from "@ui/button";
import { useChordPractice } from "@/hooks/modes/use-chord-practice";
import { useSettings } from "@/hooks/use-settings";
import { useEffect, useRef } from "react";
import { ChordNameQuiz } from "./chord-name-quiz";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChordNoteQuiz } from "./chord-note-quiz";
import { useTimedChallenge } from "@/hooks/use-timed-challenge";
import { TimedChallengeBanner } from "@/components/timed-challenge/timed-challenge-banner";
import { TimedChallengeResults } from "@/components/timed-challenge/timed-challenge-results";
import { RadioGroup, RadioGroupItem } from "@ui/radio-group";
import { Label } from "@ui/label";

export const ChordPractice = () => {
  const {
    currentChord,
    feedback,
    skipChord,
    tab,
    setTab,
    correctCount,
    incorrectCount,
  } = useChordPractice();
  const { setTab: settingsSetTab } = useSettings();

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
    onNext: skipChord,
    autoAdvance: false,
  });

  useEffect(() => {
    settingsSetTab("chords");
  }, [settingsSetTab]);

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
    skipChord();
  };

  const isActive = isTimed && challengeState === "active";

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold text-blue-600">Chord Practice Mode</h2>

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
                htmlFor={`chord-prac-dur-${d}`}
                className="flex items-center gap-1"
              >
                <RadioGroupItem
                  value={String(d)}
                  id={`chord-prac-dur-${d}`}
                />
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
            <div className="flex flex-col items-center justify-center gap-4">
              <ChordDisplay chord={currentChord} />
              <MidiInput />
              <Feedback message={feedback} />
              <Button onClick={handleSkip}>Skip Chord</Button>
            </div>
          ) : (
            <Tabs
              value={tab}
              onValueChange={setTab}
              className="flex w-full flex-col"
            >
              <TabsList className="mx-auto flex justify-center">
                <TabsTrigger value="piano">Piano</TabsTrigger>
                <TabsTrigger value="name-quiz">Name</TabsTrigger>
                <TabsTrigger value="notes-quiz">Notes</TabsTrigger>
              </TabsList>
              <TabsContent value="piano">
                <div className="flex flex-col items-center justify-center gap-4">
                  <ChordDisplay chord={currentChord} />
                  <MidiInput />
                  <Feedback message={feedback} />
                  <Button onClick={skipChord}>Skip Chord</Button>
                </div>
              </TabsContent>
              <TabsContent value="name-quiz">
                <ChordNameQuiz />
              </TabsContent>
              <TabsContent value="notes-quiz">
                <ChordNoteQuiz />
              </TabsContent>
            </Tabs>
          )}
        </>
      )}
    </div>
  );
};
