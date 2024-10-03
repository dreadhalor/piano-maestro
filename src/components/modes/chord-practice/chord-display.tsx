import React from "react";
import { AbstractChord } from "@/utils/chord-utils";

interface ChordDisplayProps {
  chord?: AbstractChord;
}

export const ChordDisplay: React.FC<ChordDisplayProps> = ({ chord }) => {
  if (!chord) {
    return null;
  }

  return (
    <div className="flex w-full flex-col gap-2 rounded-lg bg-gray-100 p-4 text-center shadow-inner">
      <h2 className="text-xl font-bold text-gray-800">
        Play this chord: <span className="text-blue-500">{chord.name}</span>
      </h2>
      <p className="text-sm text-gray-600">
        Notes: <span className="font-semibold">{chord.notes.join(" ")}</span>
      </p>
    </div>
  );
};
