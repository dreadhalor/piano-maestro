import { ChordDisplay } from "./chord-display";
import { Feedback } from "@/components/feedback";
import { MidiInput } from "@/components/midi-input";
import { Button } from "@ui/button";
import { useChordPractice } from "@/hooks/modes/use-chord-practice";
import { useSettings } from "@/hooks/use-settings";
import { useEffect } from "react";

export const ChordPractice = () => {
  const { currentChord, feedback, skipChord } = useChordPractice();
  const { setTab } = useSettings();

  useEffect(() => {
    setTab("chords");
  }, [setTab]);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold text-blue-600">Chord Practice Mode</h2>
      <ChordDisplay chord={currentChord} />
      <MidiInput />
      <Feedback message={feedback} />
      {/* Add Skip Button */}
      <Button onClick={skipChord}>Skip Chord</Button>
    </div>
  );
};
