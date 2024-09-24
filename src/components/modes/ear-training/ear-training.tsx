import { Button } from "@ui/button";
import { Feedback } from "@/components/feedback";
import { useEarTrainingPractice } from "@/hooks/modes/use-ear-training-practice";
import { MidiInput } from "@/components/midi-input";

export const EarTrainingPractice = () => {
  const { feedback, playCurrentNote } = useEarTrainingPractice();

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <h2 className="mb-4 text-2xl font-bold text-orange-600">
        Ear Training Mode
      </h2>

      {/* Main Practice Interface */}
      <>
        <p className="mb-4 text-lg text-gray-700">
          Listen to the note and try to play it on your keyboard.
        </p>
        <MidiInput />
        <Feedback message={feedback} />
        <Button className="mt-4" onClick={playCurrentNote}>
          Replay Note
        </Button>
      </>
    </div>
  );
};
