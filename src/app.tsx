import { useAppContext } from "@/hooks/use-app-context";
import { PracticeSidebar } from "./components/practice-sidebar";
import { Playground } from "@/components/modes/playground/playground";
import { NotePractice } from "@/components/modes/note-practice/note-practice";
import { ChordPractice } from "@/components/modes/chord-practice/chord-practice";
import { ScalePractice } from "@/components/modes/scale-practice/scale-practice";
import { ChordProgressionPractice } from "@/components/modes/chord-progression-practice/chord-progression-practice";
import { EarTrainingPractice } from "@/components/modes/ear-training/ear-training";
import { PianoRoll } from "@/components/piano-roll";
import { FaGear } from "react-icons/fa6";
import { SettingsDialog } from "@/components/settings-dialog";
import { Button } from "@ui/button";

export const App = () => {
  const { mode } = useAppContext(); // Get mode from context

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
      default:
        return <div>Please select a mode from the sidebar.</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 p-8">
      <PracticeSidebar />
      <div className="my-auto flex flex-1 flex-col items-center justify-center">
        {/* Header */}
        <h1 className="relative mb-6 flex w-full items-center justify-center text-center text-5xl font-extrabold text-blue-600">
          Piano Maestro
          <SettingsDialog>
            <Button
              variant="ghost"
              className="absolute right-[200px] p-0 text-4xl text-gray-400 hover:bg-transparent hover:text-gray-600"
            >
              <FaGear />
            </Button>
          </SettingsDialog>
        </h1>

        {/* Main Content Area with Distinct Background */}
        <div className="my-auto flex w-full max-w-2xl flex-col items-center justify-center rounded-lg border border-gray-300 bg-gradient-to-b from-white to-gray-50 p-8 shadow-lg">
          {renderModeComponent()}
        </div>

        {/* Piano Roll */}
        <PianoRoll />
      </div>
    </div>
  );
};
