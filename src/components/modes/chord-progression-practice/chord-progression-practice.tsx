import { useChordProgressionPractice } from "@/hooks/modes/use-chord-progression-practice";
import { Feedback } from "@/components/feedback";
import { MidiInput } from "@/components/midi-input";
import { ProgressionDisplay } from "./progression-display";
import { Button } from "@ui/button";
import { useEffect, useRef } from "react";
import { useTimedChallenge } from "@/hooks/use-timed-challenge";
import { TimedChallengeBanner } from "@/components/timed-challenge/timed-challenge-banner";
import { TimedChallengeResults } from "@/components/timed-challenge/timed-challenge-results";
import { RadioGroup, RadioGroupItem } from "@ui/radio-group";
import { Label } from "@ui/label";
import { NOTES } from "@/utils/note-utils";
import type { AbstractNote } from "@/utils/note-utils";
import { Checkbox } from "@ui/checkbox";
import { useSettings } from "@/hooks/use-settings";

export const ChordProgressionPractice = () => {
  const { setTab } = useSettings();

  useEffect(() => {
    setTab("progressions");
  }, [setTab]);

  const {
    progression,
    currentChord,
    currentIndex,
    feedback,
    voicingMode,
    setVoicingMode,
    selectedKey,
    setSelectedKey,
    skipProgression,
    skipChord,
    correctCount,
    incorrectCount,
    playProgression,
    playCurrentChord,
    isPlaying,
    autoPlay,
    setAutoPlay,
    isAnchored,
  } = useChordProgressionPractice();

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

  // Track correct answers
  const prevCorrectCount = useRef(correctCount);
  useEffect(() => {
    if (correctCount > prevCorrectCount.current) {
      prevCorrectCount.current = correctCount;
      if (isTimed && challengeState === "active") {
        recordAnswer(true);
      }
    }
  }, [correctCount, isTimed, challengeState, recordAnswer]);

  // Track incorrect attempts
  const prevIncorrectCount = useRef(incorrectCount);
  useEffect(() => {
    if (incorrectCount > prevIncorrectCount.current) {
      prevIncorrectCount.current = incorrectCount;
      if (isTimed && challengeState === "active") {
        recordAnswer(false);
      }
    }
  }, [incorrectCount, isTimed, challengeState, recordAnswer]);

  const handleSkipChord = () => {
    if (isTimed && challengeState === "active") {
      recordAnswer(false);
    }
    skipChord();
  };

  const handleSkipProgression = () => {
    skipProgression();
  };

  const isActive = isTimed && challengeState === "active";

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold text-yellow-600">
        Chord Progression Practice
      </h2>

      {/* Controls row: key selector + voicing mode */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        {/* Key selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">Key:</span>
          <select
            value={selectedKey}
            onChange={(e) =>
              setSelectedKey(e.target.value as AbstractNote | "random")
            }
            className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm shadow-sm"
          >
            {NOTES.map((note) => (
              <option key={note} value={note}>
                {note}
              </option>
            ))}
            <option value="random">Random</option>
          </select>
        </div>

        {/* Voicing mode */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">Voicing:</span>
          <div className="flex gap-1">
            <Button
              variant={voicingMode === "smooth" ? "default" : "outline"}
              size="sm"
              onClick={() => setVoicingMode("smooth")}
            >
              Smooth
            </Button>
            <Button
              variant={voicingMode === "any" ? "default" : "outline"}
              size="sm"
              onClick={() => setVoicingMode("any")}
            >
              Any
            </Button>
          </div>
        </div>
      </div>

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

      {/* Timed: idle state */}
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
                htmlFor={`prog-dur-${d}`}
                className="flex items-center gap-1"
              >
                <RadioGroupItem value={String(d)} id={`prog-dur-${d}`} />
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
      {(!isTimed || challengeState === "active") && progression && currentChord && (
        <>
          <ProgressionDisplay
            progression={progression}
            currentChord={currentChord}
            currentIndex={currentIndex}
            voicingMode={voicingMode}
            isAnchored={isAnchored}
          />

          {/* Listen controls */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={playProgression}
                disabled={isPlaying}
              >
                {isPlaying ? "Playing..." : "Listen to Progression"}
              </Button>
              <Button
                variant="secondary"
                onClick={playCurrentChord}
                disabled={isPlaying}
              >
                Hear Current Chord
              </Button>
            </div>
            <Label
              htmlFor="auto-play-toggle"
              className="flex items-center gap-2 text-sm text-gray-600"
            >
              <Checkbox
                id="auto-play-toggle"
                checked={autoPlay}
                onCheckedChange={(checked) => setAutoPlay(checked === true)}
              />
              Auto-play new progressions
            </Label>
          </div>

          <MidiInput />
          <Feedback message={feedback} />

          <div className="flex gap-4">
            <Button onClick={handleSkipChord}>Skip Chord</Button>
            <Button variant="outline" onClick={handleSkipProgression}>
              New Progression
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
