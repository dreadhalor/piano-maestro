import { RadioGroup, RadioGroupItem } from "@ui/radio-group";
import { Label } from "@ui/label";
import { PracticeMode } from "@/providers/app-provider";
import { useAppContext } from "@/hooks/use-app-context";
import { cn } from "@/lib/utils";

const tabColors: Record<string, string> = {
  playground: "hover:bg-purple-100 text-purple-700 border-purple-300",
  note: "hover:bg-green-100 text-green-700 border-green-300",
  chord: "hover:bg-blue-100 text-blue-700 border-blue-300",
  scale: "hover:bg-red-100 text-red-700 border-red-300",
  progression: "hover:bg-yellow-100 text-yellow-700 border-yellow-300",
  "ear-training": "hover:bg-orange-100 text-orange-700 border-orange-300",
  "interval-training": "hover:bg-indigo-100 text-indigo-700 border-indigo-300", // Added 'interval-training' colors
};

export const PracticeSidebar = () => {
  const { mode, setMode } = useAppContext();

  return (
    <div className="flex w-[250px] flex-col gap-6 rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-center text-2xl font-bold text-gray-800">
        Practice Mode
      </h2>
      <RadioGroup
        value={mode}
        onValueChange={(value) => setMode(value as PracticeMode)}
        className="flex flex-col gap-2"
      >
        {Object.keys(tabColors).map((value) => (
          <Label
            key={value}
            htmlFor={value}
            className={cn(
              "flex cursor-pointer items-center justify-center rounded-lg border-2 p-3 text-lg font-medium transition-colors duration-200",
              tabColors[value], // Add color based on value
              mode === value
                ? "border-current bg-white shadow-md"
                : "bg-gray-50 hover:shadow-sm",
            )}
          >
            <RadioGroupItem
              value={value}
              id={value}
              className="sr-only" // Hide the actual radio button
            />
            {/* Capitalize first letter and replace hyphens with spaces */}
            {value.charAt(0).toUpperCase() +
              value.slice(1).replace("-", " ")}{" "}
          </Label>
        ))}
      </RadioGroup>
    </div>
  );
};
