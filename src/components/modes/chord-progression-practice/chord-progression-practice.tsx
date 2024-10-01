import { useChordProgressionPractice } from "@/hooks/modes/use-chord-progression-practice";
// import { ChordDisplay } from "../chord-practice/chord-display";
import { Feedback } from "@/components/feedback";
import { MidiInput } from "@/components/midi-input";
import { ProgressionDisplay } from "./progression-display";
import { Button } from "@ui/button";

export const ChordProgressionPractice = () => {
  const { currentChord, nextChord, feedback, progression, skipProgression } =
    useChordProgressionPractice();

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold text-blue-600">
        Chord Progression Practice Mode
      </h2>

      {/* Display the chord progression details */}
      <ProgressionDisplay
        progression={progression}
        currentChord={currentChord}
        nextChord={nextChord}
      />

      {/* Display the current chord */}
      {/* <ChordDisplay chord={currentChord} /> */}

      {/* MIDI input and feedback */}
      <MidiInput />
      <Feedback message={feedback} />

      {/* Add Skip Button */}
      <Button onClick={skipProgression}>Skip Progression</Button>
    </div>
  );
};
