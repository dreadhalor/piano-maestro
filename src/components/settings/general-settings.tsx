import { useSettings } from "@/hooks/use-settings";
import { midiToNoteName } from "@/utils/note-utils";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { Label } from "@ui/label";
import { useState } from "react";

export const GeneralSettings = () => {
  const {
    lowKey,
    highKey,
    setLowKey,
    setHighKey,
    isSettingLowKey,
    isSettingHighKey,
    startSetLowKey,
    startSetHighKey,
    cancelSetKey,
  } = useSettings();

  const [lowKeyInput, setLowKeyInput] = useState(String(lowKey));
  const [highKeyInput, setHighKeyInput] = useState(String(highKey));

  const handleLowKeyChange = (value: string) => {
    setLowKeyInput(value);
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 0 && num <= 127 && num <= highKey) {
      setLowKey(num);
    }
  };

  const handleHighKeyChange = (value: string) => {
    setHighKeyInput(value);
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 0 && num <= 127 && num >= lowKey) {
      setHighKey(num);
    }
  };

  const handleLowKeyBlur = () => {
    setLowKeyInput(String(lowKey));
  };

  const handleHighKeyBlur = () => {
    setHighKeyInput(String(highKey));
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Shared Settings</h2>
      <div className="flex flex-col gap-1">
        {/* Keyboard Range Settings */}
        <h3 className="text-lg font-bold">Keyboard Range</h3>
        <p className="text-sm text-gray-600">
          Current Range: {midiToNoteName(lowKey)} to {midiToNoteName(highKey)}
        </p>

        {/* Manual MIDI input */}
        <div className="mt-2 grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="low-key-input" className="text-sm font-medium">
              Low Key (MIDI {lowKey} = {midiToNoteName(lowKey)})
            </Label>
            <Input
              id="low-key-input"
              type="number"
              min={0}
              max={highKey}
              value={lowKeyInput}
              onChange={(e) => handleLowKeyChange(e.target.value)}
              onBlur={handleLowKeyBlur}
              className="w-full"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="high-key-input" className="text-sm font-medium">
              High Key (MIDI {highKey} = {midiToNoteName(highKey)})
            </Label>
            <Input
              id="high-key-input"
              type="number"
              min={lowKey}
              max={127}
              value={highKeyInput}
              onChange={(e) => handleHighKeyChange(e.target.value)}
              onBlur={handleHighKeyBlur}
              className="w-full"
            />
          </div>
        </div>

        {/* MIDI key press buttons */}
        <div className="mt-2 flex gap-4">
          <Button
            className="flex-1"
            onClick={isSettingLowKey ? cancelSetKey : startSetLowKey}
          >
            {isSettingLowKey ? "Press a key..." : "Set Lowest Key via MIDI"}
          </Button>
          <Button
            className="flex-1"
            onClick={isSettingHighKey ? cancelSetKey : startSetHighKey}
          >
            {isSettingHighKey ? "Press a key..." : "Set Highest Key via MIDI"}
          </Button>
        </div>
      </div>
    </div>
  );
};
