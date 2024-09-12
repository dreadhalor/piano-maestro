import React from "react";
import { ChordDisplay } from "./chord-display";
import { Feedback } from "../../feedback";
import { MidiInput } from "../../midi-input";
import { useGameLogic } from "@/hooks/use-game-logic"; // Import useGameLogic hook

export const ChordPractice: React.FC = () => {
  const { currentChord, feedback } = useGameLogic({ mode: "chord" });

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="mb-4 text-2xl font-bold">Chord Practice Mode</h2>
      <ChordDisplay chord={currentChord} />
      <MidiInput />
      <Feedback message={feedback} />
    </div>
  );
};
