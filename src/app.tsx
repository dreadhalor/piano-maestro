import React from "react";
import { useAppContext } from "./providers/app-provider";
import { PracticeSidebar } from "./components/practice-sidebar";
import { ChordPractice } from "@/components/modes/chord-practice/chord-practice";
import { NotePractice } from "@/components/modes/note-practice/note-practice";
import { Playground } from "@/components/modes/playground/playground";

const App: React.FC = () => {
  const { mode } = useAppContext(); // Get mode from context

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
    <div className="flex min-h-screen bg-gray-100 p-4">
      <PracticeSidebar />
      <div className="flex flex-1 flex-col items-center justify-center border-4 border-red-400">
        <h1 className="mb-6 text-4xl font-bold text-blue-600">
          Piano Learning Game
        </h1>
        {renderModeComponent()} {/* Render the component based on the mode */}
      </div>
    </div>
  );
};

export default App;
