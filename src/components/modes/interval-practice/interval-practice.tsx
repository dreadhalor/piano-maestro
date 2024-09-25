import { useIntervalPractice } from "@/hooks/modes/use-interval-practice";
import { Feedback } from "@/components/feedback";
import { Button } from "@ui/button";
import { IntervalGrid } from "./interval-grid"; // Import IntervalGrid

export const IntervalPractice = () => {
  const {
    state,
    start,
    feedback,
    nextInterval,
    replayInterval,
    currentInterval,
    submitAnswer,
  } = useIntervalPractice();

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <h2 className="mb-4 text-2xl font-bold text-indigo-600">
        Interval Practice Mode
      </h2>

      {/* Describe the mode to the user */}
      <p className="mb-4 text-lg text-gray-700">
        Practice identifying intervals by ear.
      </p>

      {state === "initial" && (
        // start button
        <Button onClick={start}>Start</Button>
      )}

      {/* Current Interval Display */}
      {state !== "initial" && (
        <>
          <div className="w-full rounded-lg bg-gray-100 p-4 text-center shadow-inner">
            <h3 className="text-lg font-semibold text-gray-700">
              {currentInterval ? (
                state === "answered" ? (
                  <>
                    {/* Display direction and interval name */}
                    {currentInterval.direction === "ascending" ? "↑" : "↓"}{" "}
                    {currentInterval.name.charAt(0).toUpperCase() +
                      currentInterval.name.slice(1).replace("-", " ")}
                  </>
                ) : (
                  <>?</>
                )
              ) : (
                "No interval selected"
              )}
            </h3>
          </div>

          {/* Feedback */}
          <Feedback message={feedback} />

          {/* Interval Controls */}
          <div className="mt-4 flex gap-4">
            <Button onClick={replayInterval} disabled={!currentInterval}>
              Replay Interval
            </Button>
            <Button onClick={nextInterval}>Next Interval</Button>
          </div>

          {/* Interval Grid for User Selection */}
          <IntervalGrid submitAnswer={submitAnswer} state={state} />
        </>
      )}
    </div>
  );
};
