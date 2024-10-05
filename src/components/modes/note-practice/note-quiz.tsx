import { CardBox, CardBoxTitle } from "@/components/card-box";
import { Feedback } from "@/components/feedback";
import { Input } from "@/components/ui/input";
import { useSingleNotePractice } from "@/hooks/modes/use-single-note-practice";
import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  mapStringToAbstractNote,
  midiToAbstractNoteIndex,
  midiToAbstractNoteName,
} from "@/utils/note-utils";

export const NoteQuiz = () => {
  const { currentNote, skipNote } = useSingleNotePractice();

  const [input, setInput] = useState<string>("");
  const [wrong, setWrong] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>("");

  const handleAnswer = useCallback(() => {
    if (feedback === "Correct!") {
      skipNote();
      setInput("");
      setFeedback("");
      return;
    }
    if (wrong) {
      setWrong(false);
      skipNote();
      setInput("");
      setFeedback("");
      return;
    }
    if (
      midiToAbstractNoteName(currentNote) ===
      mapStringToAbstractNote(input.trim())
    ) {
      setFeedback("Correct!");
    } else {
      setFeedback(`Incorrect! Note: ${midiToAbstractNoteName(currentNote)}`);
      setWrong(true);
    }
  }, [currentNote, feedback, input, skipNote, wrong]);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      handleAnswer();
    },
    [handleAnswer],
  );

  useEffect(() => {
    if (
      midiToAbstractNoteName(currentNote) ===
      mapStringToAbstractNote(input.trim())
    ) {
      handleAnswer();
    }
  }, [currentNote, input]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex w-full flex-col items-center justify-center gap-2">
      <CardBox>
        <CardBoxTitle>
          {currentNote && (
            <>
              Note index:&nbsp;
              <span className="text-green-500">
                {midiToAbstractNoteIndex(currentNote)}
              </span>
            </>
          )}
        </CardBoxTitle>
      </CardBox>
      <form onSubmit={handleSubmit}>
        <Input
          className="w-[300px]"
          placeholder={
            wrong ? "Continue to next question..." : "Enter note name here..."
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </form>
      <Feedback message={feedback} />
    </div>
  );
};
