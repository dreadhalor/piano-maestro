import { useSettings } from "@/hooks/use-settings";
import { SCALE_TYPES, ScaleTypeKey } from "@/utils/scale-utils";
import { Checkbox } from "@ui/checkbox";
import { Label } from "@ui/label";

export const ScaleSettings = () => {
  const { enabledScales, toggleScale } = useSettings();
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-bold">Select Scale Types for Practice</h3>
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(SCALE_TYPES).map(([key, { label }]) => (
          <div className="flex items-center space-x-2" key={key}>
            <Checkbox
              id={`scale-${key}`}
              checked={enabledScales && enabledScales.has(key as ScaleTypeKey)}
              onCheckedChange={() => toggleScale(key as ScaleTypeKey)}
            />
            <Label htmlFor={`scale-${key}`} className="flex items-center gap-2">
              {label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};
