import React from "react";
import MidiInput from "./components/midi-input";
import ChordDisplay from "./components/chord-display";
import Feedback from "./components/feedback";
import KeyDisplay from "./components/key-display";

import { useAppContext } from "./providers/app-provider";
import { PracticeSidebar } from "./components/practice-sidebar";
import { useGameLogic } from "./hooks/use-game-logic";

const App: React.FC = () => {
  const { mode } = useAppContext(); // Get mode from context
  const { currentChord, currentNote, feedback } = useGameLogic({ mode }); // Use the hook

  return (
    <div className="flex min-h-screen bg-gray-100 p-4">
      <PracticeSidebar />
      <div className="flex flex-1 flex-col items-center justify-center border-4 border-red-400">
        <h1 className="mb-6 text-4xl font-bold text-blue-600">
          Piano Learning Game
        </h1>

        {mode === "chord" ? (
          <>
            <ChordDisplay chord={currentChord} />
            <MidiInput onChordPlayed={() => {}} />{" "}
            {/* No longer need to pass handlers here */}
          </>
        ) : (
          <>
            <KeyDisplay note={currentNote} />
            <MidiInput onChordPlayed={() => {}} />{" "}
            {/* No longer need to pass handlers here */}
          </>
        )}
        <Feedback message={feedback} />
      </div>
    </div>
  );
};

export default App;
