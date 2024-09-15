// midi-provider.tsx
import React, {
  createContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";

// Define the types for MIDIContext
interface MIDIContextType {
  onMIDIMessage: (
    callback: (message: WebMidi.MIDIMessageEvent) => void,
  ) => void;
  isMIDIDeviceConnected: boolean;
  pressedNotes: number[];
  velocities: Map<number, number>; // Store velocities of pressed notes
  allKeysReleased: boolean;
}

// Create the context
export const MIDIContext = createContext<MIDIContextType | undefined>(
  undefined,
);

export const MIDIProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isMIDIDeviceConnected, setIsMIDIDeviceConnected] =
    useState<boolean>(false);
  const midiCallbacks = useRef<
    Set<(message: WebMidi.MIDIMessageEvent) => void>
  >(new Set());

  // Processed MIDI states
  const [pressedNotes, setPressedNotes] = useState<number[]>([]);
  const [velocities, setVelocities] = useState<Map<number, number>>(new Map());
  const [allKeysReleased, setAllKeysReleased] = useState<boolean>(true);

  // Register a callback for raw MIDI messages
  const onMIDIMessage = useCallback(
    (callback: (message: WebMidi.MIDIMessageEvent) => void) => {
      midiCallbacks.current.add(callback);
    },
    [],
  );

  // Process MIDI messages and update state
  const handleMIDIMessage = useCallback((message: WebMidi.MIDIMessageEvent) => {
    midiCallbacks.current.forEach((callback) => callback(message)); // Call all registered callbacks with the MIDI message

    const [command, note, velocity] = message.data;

    switch (command) {
      case 144: // Note on
        if (velocity > 0) {
          // Handle Note On with velocity > 0
          setPressedNotes((prevNotes) =>
            prevNotes.includes(note) ? prevNotes : [...prevNotes, note],
          );
          setVelocities((prevVelocities) =>
            new Map(prevVelocities).set(note, velocity),
          ); // Store velocity
          setAllKeysReleased(false); // Keys are pressed
        } else {
          // Handle "Note On" with velocity 0 as "Note Off"
          handleNoteOff(note);
        }
        break;
      case 128: // Note off
        handleNoteOff(note);
        break;
      default:
        break;
    }
  }, []);

  // Function to handle Note Off messages
  const handleNoteOff = (note: number) => {
    setPressedNotes((prevNotes) => {
      const newNotes = prevNotes.filter((n) => n !== note);
      if (newNotes.length === 0) {
        setAllKeysReleased(true); // All keys are released
      }
      return newNotes;
    });
    setVelocities((prevVelocities) => {
      const newVelocities = new Map(prevVelocities);
      newVelocities.delete(note); // Remove velocity for the released note
      return newVelocities;
    });
  };

  useEffect(() => {
    const onMIDISuccess = (midiAccess: WebMidi.MIDIAccess) => {
      const inputs = midiAccess.inputs.values();
      let deviceConnected = false;

      for (const input of inputs) {
        input.onmidimessage = handleMIDIMessage; // Attach the handler to each input
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

    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
    } else {
      console.warn("Web MIDI API is not supported in this browser.");
      setIsMIDIDeviceConnected(false);
    }

    // Capture the current value of midiCallbacks for cleanup
    const cleanupMidiCallbacks = midiCallbacks.current;

    return () => {
      cleanupMidiCallbacks.clear(); // Clear all callbacks
      setIsMIDIDeviceConnected(false); // Reset device connection state
      setPressedNotes([]); // Reset pressed notes
      setAllKeysReleased(true); // Reset keys released state
    };
  }, [handleMIDIMessage]);

  return (
    <MIDIContext.Provider
      value={{
        onMIDIMessage,
        isMIDIDeviceConnected,
        pressedNotes,
        velocities,
        allKeysReleased,
      }}
    >
      {children}
    </MIDIContext.Provider>
  );
};
