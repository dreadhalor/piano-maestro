import React from "react";
import { Chord } from "../utils/chords";
import { midiToNoteNameWithoutOctave } from "../utils/chord-utils"; // Import the utility function

interface ChordDisplayProps {
  chord: Chord;
}

const ChordDisplay: React.FC<ChordDisplayProps> = ({ chord }) => {
  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-gray-800">
        Play this chord: {chord.name}
      </h2>
      <p className="text-lg text-gray-600">
        Notes: {chord.notes.map(midiToNoteNameWithoutOctave).join(", ")}
      </p>
    </div>
  );
};

export default ChordDisplay;
