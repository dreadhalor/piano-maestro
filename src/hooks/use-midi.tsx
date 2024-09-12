import { useEffect, useState } from "react";

export interface UseMIDIOptions {
  onChordPlayed: (notes: number[], allKeysReleased: boolean) => void;
}

export const useMIDI = ({ onChordPlayed }: UseMIDIOptions) => {
  const [pressedNotes, setPressedNotes] = useState<number[]>([]);
  const [allKeysReleased, setAllKeysReleased] = useState<boolean>(true); // State for all keys released
  const [isMIDIDeviceConnected, setIsMIDIDeviceConnected] =
    useState<boolean>(false);

  useEffect(() => {
    const onMIDISuccess = (midiAccess: WebMidi.MIDIAccess) => {
      const inputs = midiAccess.inputs.values();
      let deviceConnected = false;

      for (const input of inputs) {
        input.onmidimessage = handleMIDIMessage;
        deviceConnected = true; // A MIDI device is connected
      }

      setIsMIDIDeviceConnected(deviceConnected); // Update state based on connection status

      // Listen for device connection/disconnection
      midiAccess.onstatechange = (event) => {
        if (event.port.type === "input") {
          setIsMIDIDeviceConnected(event.port.state === "connected");
        }
      };
    };

    const onMIDIFailure = () => {
      console.error("Could not access your MIDI devices.");
      setIsMIDIDeviceConnected(false); // No MIDI device available
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
            setAllKeysReleased(false); // Keys are pressed
          } else {
            // Remove note if "Note On" with zero velocity is received
            setPressedNotes((prevNotes) => prevNotes.filter((n) => n !== note));
          }
          break;
        case 128: // Note off
          // Remove note when "Note Off" message is received
          setPressedNotes((prevNotes) => {
            const newNotes = prevNotes.filter((n) => n !== note);
            if (newNotes.length === 0) {
              setAllKeysReleased(true); // All keys are released
            }
            return newNotes;
          });
          break;
        default:
          break;
      }
    };

    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
    } else {
      console.warn("Web MIDI API is not supported in this browser.");
      setIsMIDIDeviceConnected(false);
    }

    return () => {
      // Clean up MIDI message handlers when the component is unmounted
      setPressedNotes([]);
      setAllKeysReleased(true); // Reset keys released state on cleanup
      setIsMIDIDeviceConnected(false); // Reset device connection state
    };
  }, []);

  useEffect(() => {
    // Only trigger the callback when the exact number of notes are pressed
    onChordPlayed(pressedNotes, allKeysReleased);
  }, [pressedNotes, allKeysReleased, onChordPlayed]);

  return { pressedNotes, allKeysReleased, isMIDIDeviceConnected }; // Return the new state
};
