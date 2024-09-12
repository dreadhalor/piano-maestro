import { RadioGroup, RadioGroupItem } from "@ui/radio-group";
import { Label } from "@ui/label";
import { PracticeMode, useAppContext } from "@/providers/app-provider";

export const PracticeSidebar = () => {
  const { mode, setMode } = useAppContext();

  return (
    <div className="flex w-[200px] flex-col gap-4 border-2">
      <h2 className="text-center text-xl font-bold text-gray-800">
        Practice Mode
      </h2>
      <RadioGroup
        value={mode}
        onValueChange={(value) => setMode(value as PracticeMode)}
        className="gap-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="note" id="note" />
          <Label htmlFor="note">Note</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="chord" id="chord" />
          <Label htmlFor="chord">Chord</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="playground" id="playground" />
          <Label htmlFor="playground">Playground</Label>
        </div>
      </RadioGroup>
    </div>
  );
};
