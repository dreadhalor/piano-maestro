// components/progression-display.tsx
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
    <div className="mb-6 w-full rounded-lg bg-gray-100 p-4 text-center shadow-inner">
      <h2 className="mb-4 text-xl font-bold text-gray-800">
        Progression: <span className="text-blue-500">{progression.name}</span>
      </h2>
      <div className="mt-4 text-center">
        <h2 className="text-lg font-semibold">
          Current Chord: {currentChord.name}
        </h2>
        {nextChord && <p className="text-sm">Next Chord: {nextChord.name}</p>}
      </div>
      {/* {nextChord && (
        <p className="text-lg text-gray-600">
          Next Chord: <span className="font-semibold">{nextChord.name}</span>
        </p>
      )} */}
    </div>
  );
};
