import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/dialog";
import { Button } from "@ui/button";
import { useSettings } from "@/hooks/use-settings";
import { INTERVAL_TYPES, IntervalKey } from "@/utils/interval-utils"; // Import interval types
import { Checkbox } from "@ui/checkbox";
import { Label } from "@ui/label";
import { RadioGroup, RadioGroupItem } from "@ui/radio-group";
import { midiToNoteName } from "@/utils/chord-utils";
import { CHORD_TYPES, ChordTypeKey } from "@/utils/chords";
import { SCALE_TYPES, ScaleTypeKey } from "@/utils/scale-utils";

export const SettingsDialog: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const {
    lowKey,
    highKey,
    isSettingLowKey,
    isSettingHighKey,
    startSetLowKey,
    startSetHighKey,
    cancelSetKey,
    enabledChordTypes,
    toggleChordType,
    enabledScales,
    toggleScale,
    enabledIntervals,
    toggleInterval,
    intervalDirection,
    setIntervalDirection,
  } = useSettings();

  return (
    <Dialog
      onOpenChange={(isOpen) => {
        if (!isOpen) cancelSetKey(); // Reset state when dialog is closed
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[90%] overflow-auto pb-4 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Edit your exercise preferences here.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            {/* Keyboard Range Settings */}
            <div className="col-span-4">
              <h3 className="text-lg font-bold">Keyboard Range</h3>
              <p className="text-sm text-gray-600">
                Current Range: {midiToNoteName(lowKey)} to{" "}
                {midiToNoteName(highKey)}
              </p>
              <div className="mt-2 flex gap-4">
                <Button
                  className="flex-1"
                  onClick={isSettingLowKey ? cancelSetKey : startSetLowKey}
                >
                  {isSettingLowKey ? "Press a key..." : "Set Lowest Key"}
                </Button>
                <Button
                  className="flex-1"
                  onClick={isSettingHighKey ? cancelSetKey : startSetHighKey}
                >
                  {isSettingHighKey ? "Press a key..." : "Set Highest Key"}
                </Button>
              </div>
            </div>

            {/* Chord Type Selection */}
            <div className="col-span-4 mt-4">
              <h3 className="mb-4 text-lg font-bold">
                Select Chord Types for Practice
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(CHORD_TYPES).map(([key, { label }]) => (
                  <div className="flex items-center space-x-2" key={key}>
                    <Checkbox
                      id={`chord-${key}`}
                      checked={
                        enabledChordTypes &&
                        enabledChordTypes.has(key as ChordTypeKey)
                      }
                      onCheckedChange={() =>
                        toggleChordType(key as ChordTypeKey)
                      }
                    />
                    <Label
                      htmlFor={`chord-${key}`}
                      className="flex items-center gap-2"
                    >
                      {label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Scale Type Selection */}
            <div className="col-span-4">
              <h3 className="mb-4 text-lg font-bold">
                Select Scale Types for Practice
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(SCALE_TYPES).map(([key, { label }]) => (
                  <div className="flex items-center space-x-2" key={key}>
                    <Checkbox
                      id={`scale-${key}`}
                      checked={
                        enabledScales && enabledScales.has(key as ScaleTypeKey)
                      }
                      onCheckedChange={() => toggleScale(key as ScaleTypeKey)}
                    />
                    <Label
                      htmlFor={`scale-${key}`}
                      className="flex items-center gap-2"
                    >
                      {label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Interval Type Selection */}
            <div className="col-span-4 mt-4">
              <h3 className="mb-4 text-lg font-bold">
                Select Intervals for Practice
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(INTERVAL_TYPES).map(
                  ([key, { label, semitones }]) =>
                    // Only include intervals between minor 2nd and octave
                    semitones >= 1 && semitones <= 12 ? (
                      <div className="flex items-center space-x-2" key={key}>
                        <Checkbox
                          id={`interval-${key}`}
                          checked={
                            enabledIntervals &&
                            enabledIntervals.has(key as IntervalKey)
                          }
                          onCheckedChange={() =>
                            toggleInterval(key as IntervalKey)
                          }
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
            <div className="col-span-4 mt-4">
              <h3 className="mb-4 text-lg font-bold">Interval Direction</h3>
              <RadioGroup
                value={intervalDirection}
                onValueChange={(value) =>
                  setIntervalDirection(
                    value as "ascending" | "descending" | "both",
                  )
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
        </div>
      </DialogContent>
    </Dialog>
  );
};
