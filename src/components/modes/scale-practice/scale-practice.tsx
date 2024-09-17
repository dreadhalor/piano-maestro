// components/scale-practice.tsx
import { useScalePractice } from "@/hooks/modes/use-scale-practice";
import { ScaleDisplay } from "./scale-display";
import { Feedback } from "@/components/feedback";
import { MidiInput } from "@/components/midi-input";
import { Button } from "@ui/button";

export const ScalePractice = () => {
  const {
    currentNote,
    highlightedIndex,
    feedback,
    scale,
    skipScale,
    isScaleComplete,
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
      <Button className="mt-4" onClick={skipScale}>
        Skip Scale
      </Button>
    </div>
  );
};
