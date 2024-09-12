// chord-practice.tsx
import { ChordDisplay } from "./chord-display";
import { Feedback } from "../../feedback";
import { MidiInput } from "../../midi-input";
import { useGameLogic } from "@/hooks/use-game-logic"; // Import useGameLogic hook
import { Button } from "@ui/button";

export const ChordPractice = () => {
  const { currentChord, feedback, skipChord } = useGameLogic({ mode: "chord" });

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
        Skip
      </Button>
    </div>
  );
};
