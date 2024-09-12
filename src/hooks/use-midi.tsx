import { useEffect, useState } from "react";

export interface UseMIDIOptions {
  onChordPlayed: (notes: number[]) => void;
}

export const useMIDI = ({ onChordPlayed }: UseMIDIOptions) => {
  const [pressedNotes, setPressedNotes] = useState<number[]>([]);

  useEffect(() => {
    const onMIDISuccess = (midiAccess: WebMidi.MIDIAccess) => {
      const inputs = midiAccess.inputs.values();
      for (const input of inputs) {
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

    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
    } else {
      console.warn("Web MIDI API is not supported in this browser.");
    }

    return () => {
      // Clean up MIDI message handlers when the component is unmounted
      setPressedNotes([]);
    };
  }, []);

  useEffect(() => {
    // Call the callback when pressed notes change
    onChordPlayed(pressedNotes);
  }, [pressedNotes, onChordPlayed]);

  return { pressedNotes };
};
