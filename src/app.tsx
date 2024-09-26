import { useAppContext } from "@/hooks/use-app-context";
import { PracticeSidebar } from "./components/practice-sidebar";
import { Playground } from "@/components/modes/playground/playground";
import { NotePractice } from "@/components/modes/note-practice/note-practice";
import { ChordPractice } from "@/components/modes/chord-practice/chord-practice";
import { ScalePractice } from "@/components/modes/scale-practice/scale-practice";
import { ChordProgressionPractice } from "@/components/modes/chord-progression-practice/chord-progression-practice";
import { EarTrainingPractice } from "@/components/modes/ear-training/ear-training";
import { IntervalPractice } from "@/components/modes/interval-practice/interval-practice"; // Import IntervalPractice
import { PianoRoll } from "@/components/piano-roll";
import { FaGear } from "react-icons/fa6";
import { SettingsDialog } from "@/components/settings/settings-dialog";
import { Button } from "@ui/button";
import { ResponsiveScalingDiv } from "@/components/responsive-scaling-div";
import { getWhiteAndBlackKeys } from "@/lib/utils";
import { useSettings } from "@/hooks/use-settings";

export const App = () => {
  const { mode } = useAppContext();
  const { lowKey, highKey } = useSettings();

  // Function to render the selected practice mode component
  const renderModeComponent = () => {
    switch (mode) {
      case "playground":
        return <Playground />;
      case "note":
        return <NotePractice />;
      case "chord":
        return <ChordPractice />;
      case "scale":
        return <ScalePractice />;
      case "progression":
        return <ChordProgressionPractice />;
      case "ear-training":
        return <EarTrainingPractice />;
      case "interval-training":
        return <IntervalPractice />;
      default:
        return <div>Please select a mode from the sidebar.</div>;
    }
  };

  return (
    <div className="flex min-h-screen gap-8 bg-gray-100 p-8">
      <PracticeSidebar />
      <div className="my-auto flex min-w-0 flex-1 flex-col items-center justify-center">
        {/* Header */}
        <h1 className="relative mb-6 flex w-full items-center justify-center text-center text-5xl font-extrabold text-blue-600">
          Piano Maestro
          <SettingsDialog>
            <Button
              variant="ghost"
              className="absolute right-[20px] p-0 text-4xl text-gray-400 hover:bg-transparent hover:text-gray-600"
            >
              <FaGear />
            </Button>
          </SettingsDialog>
        </h1>

        {/* Main Content Area with Distinct Background */}
        <div className="my-auto flex w-full max-w-2xl flex-col items-center justify-center rounded-lg border border-gray-300 bg-gradient-to-b from-white to-gray-50 p-8 shadow-lg">
          {renderModeComponent()}
        </div>

        {/* Gotta make they keyboard scale-down-able for laptops */}
        <ResponsiveScalingDiv
          desiredWidth={
            // white keys = 48px, volume slider = 30px, gap = 16px
            getWhiteAndBlackKeys(lowKey, highKey).whiteKeys.length * 48 + 46
          }
        >
          <PianoRoll />
        </ResponsiveScalingDiv>
      </div>
    </div>
  );
};
