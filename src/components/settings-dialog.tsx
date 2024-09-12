import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/dialog";
import { Button } from "@ui/button";
import { useSettings } from "@/providers/settings-provider";
import { CHORD_TYPES, ChordTypeKey } from "@/utils/chords";
import { midiToNoteName } from "@/utils/chord-utils";

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
  } = useSettings();

  return (
    <Dialog
      onOpenChange={(isOpen) => {
        if (!isOpen) cancelSetKey(); // Reset state when dialog is closed
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="pb-3 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Edit your exercise preferences here.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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
              <h3 className="text-lg font-bold">
                Select Chord Types for Practice
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(CHORD_TYPES).map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={
                        enabledChordTypes &&
                        enabledChordTypes.has(key as ChordTypeKey)
                      } // Ensure correct type
                      onChange={() => toggleChordType(key as ChordTypeKey)} // Use key for toggling
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
