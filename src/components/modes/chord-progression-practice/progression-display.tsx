import React from "react";
import { ChordProgression } from "@/utils/chord-progressions";
import { type Chord } from "@/utils/chords";

interface ProgressionDisplayProps {
  progression: ChordProgression;
  currentChord: Chord;
  nextChord: Chord | null;
}

export const ProgressionDisplay: React.FC<ProgressionDisplayProps> = ({
  progression,
  currentChord,
  nextChord,
}) => {
  return (
    <div className="flex w-full flex-col gap-4 rounded-lg bg-gray-100 p-4 text-center shadow-inner">
      <h2 className="text-xl font-bold text-gray-800">
        Progression: <span className="text-blue-500">{progression.name}</span>
      </h2>
      <div className="text-center">
        <h2 className="text-lg font-semibold">
          Current Chord: {currentChord.name}
        </h2>
        {nextChord && <p className="text-sm">Next Chord: {nextChord.name}</p>}
      </div>
    </div>
  );
};
