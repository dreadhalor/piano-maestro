import { useAppContext } from "./providers/app-provider";
import { PracticeSidebar } from "./components/practice-sidebar";
import { ChordPractice } from "@/components/modes/chord-practice/chord-practice";
import { NotePractice } from "@/components/modes/note-practice/note-practice";
import { Playground } from "@/components/modes/playground/playground";
import { PianoRoll } from "./components/piano-roll";

const App = () => {
  const { mode } = useAppContext(); // Get mode from context

  // Function to render the selected practice mode component
  const renderModeComponent = () => {
    switch (mode) {
      case "chord":
        return <ChordPractice />;
      case "note":
        return <NotePractice />;
      case "playground":
        return <Playground />;
      default:
        return <div>Please select a mode from the sidebar.</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 p-8">
      {" "}
      {/* Changed background to light gray */}
      <PracticeSidebar /> {/* Sidebar remains fixed to the left */}
      <div className="flex flex-1 flex-col items-center justify-center py-[100px]">
        {/* Header */}
        <h1 className="mb-6 text-5xl font-extrabold text-blue-600">
          Piano Maestro
        </h1>

        {/* Main Content Area with Distinct Background */}
        <div className="my-auto flex h-[400px] w-full max-w-2xl flex-col items-center justify-center rounded-lg border border-gray-300 bg-gradient-to-b from-white to-gray-50 p-8 shadow-lg">
          {renderModeComponent()}{" "}
          {/* Render Mode Component directly without additional card */}
        </div>

        {/* Piano Roll */}
        <PianoRoll />
      </div>
    </div>
  );
};

export default App;
