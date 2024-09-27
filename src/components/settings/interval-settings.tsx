import {
  INTERVAL_TYPES,
  IntervalDirections,
  IntervalKey,
} from "@/utils/interval-utils";
import { Checkbox } from "@ui/checkbox";
import { useSettings } from "@/hooks/use-settings";
import { Label } from "@ui/label";
import { RadioGroup, RadioGroupItem } from "@ui/radio-group";

export const IntervalSettings = () => {
  const {
    enabledIntervals,
    toggleInterval,
    intervalDirection,
    setIntervalDirection,
  } = useSettings();
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Interval Practice Settings</h2>
      {/* Interval Selection */}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-bold">Select Intervals for Practice</h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(INTERVAL_TYPES).map(([key, { label, semitones }]) =>
            // Only include intervals between minor 2nd and octave
            semitones >= 1 && semitones <= 12 ? (
              <div className="flex items-center space-x-2" key={key}>
                <Checkbox
                  id={`interval-${key}`}
                  checked={
                    enabledIntervals && enabledIntervals.has(key as IntervalKey)
                  }
                  onCheckedChange={() => toggleInterval(key as IntervalKey)}
                />
                <Label
                  htmlFor={`interval-${key}`}
                  className="flex items-center gap-2"
                >
                  {label}
                </Label>
              </div>
            ) : null,
          )}
        </div>
      </div>

      {/* Interval Direction Selection */}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-bold">Interval Direction</h3>
        <RadioGroup
          value={intervalDirection}
          onValueChange={(value) =>
            setIntervalDirection(value as IntervalDirections)
          }
          className="flex flex-col gap-2"
        >
          <Label htmlFor="ascending" className="flex items-center">
            <RadioGroupItem value="ascending" id="ascending" />
            <span className="ml-2">Ascending</span>
          </Label>
          <Label htmlFor="descending" className="flex items-center">
            <RadioGroupItem value="descending" id="descending" />
            <span className="ml-2">Descending</span>
          </Label>
          <Label htmlFor="both" className="flex items-center">
            <RadioGroupItem value="both" id="both" />
            <span className="ml-2">Both</span>
          </Label>
        </RadioGroup>
      </div>
    </div>
  );
};
