import React from "react";
import { midiToNoteName } from "../utils/chord-utils";

interface KeyDisplayProps {
  note: number;
}

const KeyDisplay: React.FC<KeyDisplayProps> = ({ note }) => {
  return (
    <div className="text-center">
      <h2 className="mb-4 text-2xl font-bold text-gray-800">
        Press this key: {midiToNoteName(note)}
      </h2>
    </div>
  );
};

export default KeyDisplay;
