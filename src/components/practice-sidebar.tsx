import { RadioGroup, RadioGroupItem } from "@ui/radio-group";
import { Label } from "@ui/label";
import { PracticeMode } from "@/providers/app-provider";
import { useAppContext } from "@/hooks/use-app-context";
import { cn } from "@/lib/utils";

const tabColors: Record<string, string> = {
  playground:
    "hover:bg-purple-100 text-purple-700 border-purple-300 dark:hover:bg-purple-950 dark:text-purple-300 dark:border-purple-800",
  note: "hover:bg-green-100 text-green-700 border-green-300 dark:hover:bg-green-950 dark:text-green-300 dark:border-green-800",
  interval:
    "hover:bg-pink-100 text-pink-700 border-pink-300 dark:hover:bg-pink-950 dark:text-pink-300 dark:border-pink-800",
  chord:
    "hover:bg-blue-100 text-blue-700 border-blue-300 dark:hover:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
  scale:
    "hover:bg-red-100 text-red-700 border-red-300 dark:hover:bg-red-950 dark:text-red-300 dark:border-red-800",
  progression:
    "hover:bg-yellow-100 text-yellow-700 border-yellow-300 dark:hover:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800",
  "ear-training":
    "hover:bg-orange-100 text-orange-700 border-orange-300 dark:hover:bg-orange-950 dark:text-orange-300 dark:border-orange-800",
  "interval-recognition":
    "hover:bg-indigo-100 text-indigo-700 border-indigo-300 dark:hover:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800",
  "chord-recognition":
    "hover:bg-teal-100 text-teal-700 border-teal-300 dark:hover:bg-teal-950 dark:text-teal-300 dark:border-teal-800",
};

export const PracticeSidebar = () => {
  const { mode, setMode } = useAppContext();

  return (
    <div className="flex w-[250px] flex-col gap-6 rounded-lg bg-white p-6 shadow-md dark:bg-gray-900">
      <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 dark:text-gray-100">
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
                ? "border-current bg-white shadow-md dark:bg-gray-800"
                : "hover:shadow-xs bg-gray-50 dark:bg-gray-900",
            )}
          >
            <RadioGroupItem
              value={value}
              id={value}
              className="sr-only" // Hide the actual radio button
            />
            {/* Capitalize first letter and replace hyphens with spaces */}
            {value.charAt(0).toUpperCase() + value.slice(1).replace("-", " ")}
          </Label>
        ))}
      </RadioGroup>
    </div>
  );
};
