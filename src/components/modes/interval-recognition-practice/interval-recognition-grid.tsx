import { useSettings } from "@/hooks/use-settings";
import { INTERVAL_TYPES, IntervalKey } from "@/utils/interval-utils";
import { Button } from "@ui/button";

interface IntervalGridProps {
  submitAnswer: (intervalKey: IntervalKey) => void;
  state: "initial" | "playing" | "answered";
}

export const IntervalGrid: React.FC<IntervalGridProps> = ({
  submitAnswer,
  state,
}) => {
  const { enabledIntervalRecognitionIntervals: enabledIntervals } =
    useSettings();

  return (
    <div className="mt-8 grid grid-cols-3 gap-4">
      {Object.keys(INTERVAL_TYPES)
        .filter((key) => enabledIntervals.has(key as IntervalKey))
        .map((key) => {
          const intervalKey = key as IntervalKey;
          const interval = INTERVAL_TYPES[intervalKey];
          return (
            <Button
              key={intervalKey}
              onClick={() => submitAnswer(intervalKey)}
              disabled={state === "answered"}
            >
              {interval.label}
            </Button>
          );
        })}
    </div>
  );
};
