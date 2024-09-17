// components/scale-practice.tsx
import { useScalePractice } from "@/hooks/modes/use-scale-practice";
import { ScaleDisplay } from "./scale-display";
import { Feedback } from "@/components/feedback";
import { MidiInput } from "@/components/midi-input";
import { Button } from "@ui/button";
import { Toggle } from "@ui/toggle";
import { FaRepeat } from "react-icons/fa6";

export const ScalePractice = () => {
  const {
    currentNote,
    highlightedIndex,
    feedback,
    scale,
    skipScale,
    isScaleComplete,
    repeat,
    setRepeat,
  } = useScalePractice();

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <h2 className="mb-4 text-2xl font-bold text-red-600">
        Scale Practice Mode
      </h2>

      {/* Display the scale details */}
      <ScaleDisplay
        scale={scale}
        currentNote={currentNote}
        highlightedIndex={highlightedIndex}
        isScaleComplete={isScaleComplete}
      />

      {/* MIDI input and feedback */}
      <MidiInput />
      <Feedback message={feedback} />

      {/* Add Skip Button */}
      <div className="mt-2 flex items-center gap-2">
        <Toggle variant="outline" pressed={repeat} onPressedChange={setRepeat}>
          <FaRepeat />
        </Toggle>
        <Button onClick={skipScale}>Skip Scale</Button>
      </div>
    </div>
  );
};
