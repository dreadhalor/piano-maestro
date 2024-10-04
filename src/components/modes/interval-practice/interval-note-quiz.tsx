import { CardBox, CardBoxTitle } from "@/components/card-box";
import { Feedback } from "@/components/feedback";
import { Input } from "@/components/ui/input";
import { useIntervalPractice } from "@/hooks/modes/use-interval-practice";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { checkIntervalEquality } from "@/utils/interval-utils";

export const IntervalNoteQuiz = () => {
  const { interval, skipInterval } = useIntervalPractice();
  const [input, setInput] = useState<string>("");
  const [wrong, setWrong] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>("");

  const handleAnswer = useCallback(() => {
    if (feedback === "Correct!") {
      skipInterval();
      setInput("");
      setFeedback("");
      return;
    }
    if (wrong) {
      setWrong(false);
      skipInterval();
      setInput("");
      setFeedback("");
      return;
    }
    if (checkIntervalEquality(input, interval)) {
      setFeedback("Correct!");
    } else {
      const notes = [...interval.notes];
      if (interval.direction === "descending") notes.reverse();
      setFeedback(`Incorrect! Notes: ${notes.join(" ")}`);
      setWrong(true);
    }
  }, [interval, feedback, input, skipInterval, wrong]);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      handleAnswer();
    },
    [handleAnswer],
  );

  useEffect(() => {
    if (checkIntervalEquality(input, interval)) {
      handleAnswer();
    }
  }, [interval, input]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex w-full flex-col items-center justify-center gap-2">
      <CardBox>
        <CardBoxTitle>
          {interval && (
            <>
              Interval:&nbsp;
              <span className="text-pink-600">
                {interval.notes[0]}{" "}
                {interval.direction === "ascending" ? "+" : "-"}{" "}
                {interval.shorthand}
              </span>
            </>
          )}
        </CardBoxTitle>
      </CardBox>
      <form onSubmit={handleSubmit}>
        <Input
          className="w-[300px]"
          placeholder={
            wrong
              ? "Continue to next question..."
              : "Enter space-separated interval notes here..."
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </form>
      <Feedback message={feedback} />
    </div>
  );
};
