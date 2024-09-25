import { Button } from "@ui/button";
import { Feedback } from "@/components/feedback";
import { useEarTrainingPractice } from "@/hooks/modes/use-ear-training-practice";
import { MidiInput } from "@/components/midi-input";

export const EarTrainingPractice = () => {
  const { state, start, feedback, playCurrentNote } = useEarTrainingPractice();

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <h2 className="mb-4 text-2xl font-bold text-orange-600">
        Ear Training Mode
      </h2>

      {/* Describe the mode to the user */}
      <p className="mb-4 text-lg text-gray-700">
        Listen to the note and try to play it on your keyboard.
      </p>

      {state === "initial" && (
        // Start Button
        <Button onClick={start}>Start</Button>
      )}

      {state !== "initial" && (
        <>
          <MidiInput />
          <Feedback message={feedback} />

          {/* Controls */}
          <div className="mt-4 flex gap-4">
            <Button onClick={playCurrentNote} disabled={state !== "playing"}>
              Replay Note
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
