import React from "react";
import { KeyDisplay } from "./key-display";
import { Feedback } from "../../feedback";
import { MidiInput } from "../../midi-input";
import { useGameLogic } from "@/hooks/use-game-logic"; // Import useGameLogic hook

export const NotePractice: React.FC = () => {
  const { currentNote, feedback } = useGameLogic({ mode: "note" });

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="mb-4 text-2xl font-bold">Note Practice Mode</h2>
      <KeyDisplay note={currentNote} />
      <MidiInput />
      <Feedback message={feedback} />
    </div>
  );
};
