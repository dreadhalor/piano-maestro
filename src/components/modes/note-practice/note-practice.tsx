import { KeyDisplay } from "./key-display";
import { Feedback } from "@/components/feedback";
import { MidiInput } from "@/components/midi-input";
import { Button } from "@ui/button";
import { useSingleNotePractice } from "@/hooks/modes/use-single-note-practice";

export const NotePractice = () => {
  const { currentNote, feedback, skipNote } = useSingleNotePractice();

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold text-green-600">Note Practice Mode</h2>
      <KeyDisplay note={currentNote} />
      <MidiInput />
      <Feedback message={feedback} />
      {/* Add Skip Button */}
      <Button onClick={skipNote}>Skip Note</Button>
    </div>
  );
};
