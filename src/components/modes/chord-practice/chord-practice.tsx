// chord-practice.tsx
import { ChordDisplay } from "./chord-display";
import { Feedback } from "@/components/feedback";
import { MidiInput } from "@/components/midi-input";
import { Button } from "@ui/button";
import { useChordPractice } from "@/hooks/modes/use-chord-practice";

export const ChordPractice = () => {
  const { currentChord, feedback, skipChord } = useChordPractice();

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <h2 className="mb-4 text-2xl font-bold text-blue-600">
        Chord Practice Mode
      </h2>
      <ChordDisplay chord={currentChord} />
      <MidiInput />
      <Feedback message={feedback} />
      {/* Add Skip Button */}
      <Button className="mt-4" onClick={skipChord}>
        Skip Chord
      </Button>
    </div>
  );
};
