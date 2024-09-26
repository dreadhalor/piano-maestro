import { Button } from "@ui/button";
import { Feedback } from "@/components/feedback";
import { useEarTrainingPractice } from "@/hooks/modes/use-ear-training-practice";
import { MidiInput } from "@/components/midi-input";

export const EarTrainingPractice = () => {
  const { state, start, feedback, playCurrentNote } = useEarTrainingPractice();

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold text-orange-600">Ear Training Mode</h2>

      {/* Describe the mode to the user */}
      <p className="text-lg text-gray-700">
        Listen to the note and try to play it on your keyboard.
      </p>

      {state === "initial" && (
        // Start Button
        <Button onClick={start}>Start</Button>
      )}

      {state !== "initial" && (
        <>
          <MidiInput />
          <Feedback message={feedback} className="mt-0" />

          {/* Controls */}
          <div className="flex gap-4">
            <Button onClick={playCurrentNote} disabled={state !== "playing"}>
              Replay Note
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
