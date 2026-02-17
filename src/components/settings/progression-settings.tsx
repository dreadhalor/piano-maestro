import { PROGRESSION_TEMPLATES } from "@/utils/chord-progressions";
import { Checkbox } from "@ui/checkbox";
import { useSettings } from "@/hooks/use-settings";
import { Label } from "@ui/label";

export const ProgressionSettings = () => {
  const { enabledProgressions, toggleProgression } = useSettings();

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Progression Settings</h2>

      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-bold">Enabled Progressions</h3>
        <p className="text-sm text-gray-500">
          Select which chord progressions to practice. At least one must be
          enabled.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {PROGRESSION_TEMPLATES.map((template) => (
            <div
              className="flex items-center space-x-2"
              key={template.name}
            >
              <Checkbox
                id={`prog-${template.name}`}
                checked={enabledProgressions.has(template.name)}
                onCheckedChange={() => toggleProgression(template.name)}
                disabled={
                  enabledProgressions.has(template.name) &&
                  enabledProgressions.size <= 1
                }
              />
              <Label
                htmlFor={`prog-${template.name}`}
                className="flex items-center gap-2"
              >
                {template.name}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
