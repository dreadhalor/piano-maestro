import React from "react";
import { Chord } from "@/utils/chords";
import { midiToNoteNameWithoutOctave } from "@/utils/chord-utils"; // Import the utility function

interface ChordDisplayProps {
  chord?: Chord;
}

export const ChordDisplay: React.FC<ChordDisplayProps> = ({ chord }) => {
  if (!chord) {
    return null;
  }

  return (
    <div className="mb-6 w-full rounded-lg bg-gray-100 p-4 text-center shadow-inner">
      <h2 className="mb-4 text-xl font-bold text-gray-800">
        Play this chord: <span className="text-blue-500">{chord.name}</span>
      </h2>
      <p className="text-lg text-gray-600">
        Notes:{" "}
        <span className="font-semibold">
          {chord.notes.map(midiToNoteNameWithoutOctave).join(", ")}
        </span>
      </p>
    </div>
  );
};
