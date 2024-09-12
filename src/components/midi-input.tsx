// components/midi-input.tsx

import React, { useEffect, useState } from "react";
import { midiToNoteName } from "../utils/chord-utils";

interface MidiInputProps {
  onChordPlayed: (notes: number[]) => void;
}

const MidiInput: React.FC<MidiInputProps> = ({ onChordPlayed }) => {
  const [pressedNotes, setPressedNotes] = useState<number[]>([]);

  useEffect(() => {
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
    } else {
      console.warn("Web MIDI API is not supported in this browser.");
    }
  }, []);

  const onMIDISuccess = (midiAccess: WebMidi.MIDIAccess) => {
    const inputs = midiAccess.inputs.values();
    for (let input of inputs) {
      input.onmidimessage = handleMIDIMessage;
    }
  };

  const onMIDIFailure = () => {
    console.error("Could not access your MIDI devices.");
  };

  const handleMIDIMessage = (message: WebMidi.MIDIMessageEvent) => {
    const [command, note, velocity] = message.data;

    switch (command) {
      case 144: // Note on
        if (velocity > 0) {
          // Add note if it's not already in the array
          setPressedNotes((prevNotes) =>
            prevNotes.includes(note) ? prevNotes : [...prevNotes, note],
          );
        } else {
          // Remove note if "Note On" with zero velocity is received
          setPressedNotes((prevNotes) => prevNotes.filter((n) => n !== note));
        }
        break;
      case 128: // Note off
        // Remove note when "Note Off" message is received
        setPressedNotes((prevNotes) => prevNotes.filter((n) => n !== note));
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    // Pass the currently pressed notes to the parent component
    onChordPlayed(pressedNotes);
  }, [pressedNotes, onChordPlayed]);

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
