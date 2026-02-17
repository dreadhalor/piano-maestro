import { useChordRecognitionPractice } from "@/hooks/modes/use-chord-recognition-practice";
import { Feedback } from "@/components/feedback";
import { Button } from "@ui/button";
import { ChordRecognitionGrid } from "./chord-recognition-grid";
import { Separator } from "@/components/ui/separator";
import { useSettings } from "@/hooks/use-settings";
import { useEffect } from "react";

export const ChordRecognitionPractice = () => {
  const {
    state,
    start,
    feedback,
    nextChord,
    replayChord,
    currentChord,
    submitAnswer,
  } = useChordRecognitionPractice();
  const { setTab } = useSettings();

  useEffect(() => {
    setTab("chord-recognition");
  }, [setTab]);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold text-teal-600">
        Chord Recognition Mode
      </h2>

      <p className="text-lg text-gray-700">
        Listen to the chord and identify its type.
      </p>

      {state === "initial" && <Button onClick={start}>Start</Button>}

      {state !== "initial" && (
        <>
          <div className="w-full rounded-lg bg-gray-100 p-4 text-center shadow-inner">
            <h3 className="text-lg font-semibold text-gray-700">
              {currentChord ? (
                state === "answered" ? (
                  currentChord.label
                ) : (
                  <>?</>
                )
              ) : (
                "No chord selected"
              )}
            </h3>
          </div>

          <Feedback message={feedback} />

          <div className="flex gap-4">
            <Button onClick={replayChord} disabled={!currentChord}>
              Replay Chord
            </Button>
            <Button onClick={nextChord}>Next Chord</Button>
          </div>

          <Separator />
          <ChordRecognitionGrid submitAnswer={submitAnswer} state={state} />
        </>
      )}
    </div>
  );
};
