import { useSettings } from "@/hooks/use-settings";
import { midiToNoteName } from "@/utils/chord-utils";
import { Button } from "@ui/button";

export const GeneralSettings = () => {
  const {
    lowKey,
    highKey,
    isSettingLowKey,
    isSettingHighKey,
    startSetLowKey,
    startSetHighKey,
    cancelSetKey,
  } = useSettings();
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Shared Settings</h2>
      <div className="flex flex-col gap-1">
        {/* Keyboard Range Settings */}
        <h3 className="text-lg font-bold">Keyboard Range</h3>
        <p className="text-sm text-gray-600">
          Current Range: {midiToNoteName(lowKey)} to {midiToNoteName(highKey)}
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
    </div>
  );
};
