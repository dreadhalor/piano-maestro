import { CardBox, CardBoxTitle } from "@/components/card-box";
import { Feedback } from "@/components/feedback";
import { Input } from "@/components/ui/input";
import { useIntervalPractice } from "@/hooks/modes/use-interval-practice";
import { checkStepEquality } from "@/utils/interval-utils";
import { FormEvent, useCallback, useEffect, useState } from "react";

export const IntervalStepQuiz = () => {
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
    if (checkStepEquality(input, interval)) {
      setFeedback("Correct!");
    } else {
      const notes = [...interval.notes];
      if (interval.direction === "descending") notes.reverse();
      setFeedback(`Incorrect! Steps: ${interval.steps}`);
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
    if (checkStepEquality(input, interval)) {
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
                {interval.direction === "ascending" ? (
                  <>&#8599;</>
                ) : (
                  <>&#8600;</>
                )}{" "}
                {interval.notes[1]}
              </span>
            </>
          )}
        </CardBoxTitle>
      </CardBox>
      <form onSubmit={handleSubmit}>
        <Input
          className="w-[300px]"
          placeholder={
            wrong ? "Continue to next question..." : "Enter # of steps here..."
          }
          type="number"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </form>
      <Feedback message={feedback} />
    </div>
  );
};
