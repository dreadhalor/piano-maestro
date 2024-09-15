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
import { CHORD_TYPES, type ChordTypeKey } from "@/utils/chords";
import { midiToNoteName } from "@/utils/chord-utils";
import { Checkbox } from "@ui/checkbox";
import { Label } from "@ui/label";
import { SCALE_TYPES, type ScaleTypeKey } from "@/utils/scale-utils";

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
  } = useSettings();

  return (
    <Dialog
      onOpenChange={(isOpen) => {
        if (!isOpen) cancelSetKey(); // Reset state when dialog is closed
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="pb-4 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Edit your exercise preferences here.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            {/* Display current range */}
            <div className="col-span-4">
              <h3 className="text-lg font-bold">Keyboard Range</h3>
              <p className="text-sm text-gray-600">
                Current Range: {midiToNoteName(lowKey)} to{" "}
                {midiToNoteName(highKey)}
              </p>
              <div className="mt-2 flex gap-4">
                <Button
                  className="flex-1"
                  onClick={isSettingLowKey ? cancelSetKey : startSetLowKey} // Toggle action
                >
                  {isSettingLowKey ? "Press a key..." : "Set Lowest Key"}
                </Button>
                <Button
                  className="flex-1"
                  onClick={isSettingHighKey ? cancelSetKey : startSetHighKey} // Toggle action
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
          </div>

          {/* Scale type selection */}
          <div className="grid grid-cols-2 items-center gap-4">
            <div className="col-span-2">
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
