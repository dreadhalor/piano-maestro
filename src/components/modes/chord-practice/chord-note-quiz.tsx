import { CardBox, CardBoxTitle } from "@/components/card-box";
import { Feedback } from "@/components/feedback";
import { Input } from "@/components/ui/input";
import { useChordPractice } from "@/hooks/modes/use-chord-practice";
import { FormEvent, useCallback, useState } from "react";

export const ChordNoteQuiz = () => {
  const { currentChord, skipChord } = useChordPractice();

  const [input, setInput] = useState<string>("");
  const [wrong, setWrong] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>("");

  const handleAnswer = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (feedback === "Correct!") {
        skipChord();
        setInput("");
        setFeedback("");
        return;
      }
      if (wrong) {
        setWrong(false);
        skipChord();
        setInput("");
        setFeedback("");
        return;
      }
      if (
        input.toLowerCase().trim() ===
        currentChord?.notes.join(" ").toLowerCase()
      ) {
        setFeedback("Correct!");
      } else {
        setFeedback(`Incorrect! Notes: ${currentChord?.notes.join(" ")}`);
        setWrong(true);
      }
    },
    [currentChord, feedback, input, skipChord, wrong],
  );

  return (
    <div className="flex flex-col items-center gap-2">
      <CardBox>
        <CardBoxTitle>
          {currentChord && (
            <>
              Chord name:&nbsp;
              <span className="text-blue-500">{currentChord.name}</span>
            </>
          )}
        </CardBoxTitle>
      </CardBox>
      <Feedback message={feedback} />
      <form onSubmit={handleAnswer}>
        <Input
          className="w-[300px]"
          placeholder={
            wrong
              ? "Continue to next question..."
              : "Enter space-separated chord notes here..."
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </form>
    </div>
  );
};
