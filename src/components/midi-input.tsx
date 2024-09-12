import React from "react";
import { midiToNoteName } from "../utils/chord-utils";
import { useMIDI } from "../hooks/use-midi";

interface MidiInputProps {
  onChordPlayed: (notes: number[], allKeysReleased: boolean) => void;
}

const MidiInput: React.FC<MidiInputProps> = ({ onChordPlayed }) => {
  const { pressedNotes } = useMIDI({ onChordPlayed }); // Use the hook

  return (
    <div>
      <p>Connect your MIDI device and start playing!</p>
      <h3>
        Currently Pressed Notes:{" "}
        {pressedNotes
          .slice() // Make a copy of the array to avoid mutating state
          .sort((a, b) => a - b) // Sort notes from lowest to highest
          .map(midiToNoteName)
          .join(", ")}
      </h3>
    </div>
  );
};

export default MidiInput;
