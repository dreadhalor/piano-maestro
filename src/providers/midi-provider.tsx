import React, {
  createContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { WebMidi, Input, NoteMessageEvent } from "webmidi";

// Define the types for MIDIContext
interface MIDIContextType {
  onMIDIMessage: (callback: (message: NoteMessageEvent) => void) => void;
  isMIDIDeviceConnected: boolean;
  pressedNotes: number[];
  velocities: Map<number, number>;
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
  const midiCallbacks = useRef<Set<(message: NoteMessageEvent) => void>>(
    new Set(),
  );

  // Processed MIDI states
  const [pressedNotes, setPressedNotes] = useState<number[]>([]);
  const [velocities, setVelocities] = useState<Map<number, number>>(new Map());
  const [allKeysReleased, setAllKeysReleased] = useState<boolean>(true);

  // Register a callback for raw MIDI messages
  const onMIDIMessage = useCallback(
    (callback: (message: NoteMessageEvent) => void) => {
      midiCallbacks.current.add(callback);
    },
    [],
  );

  // Process MIDI messages and update state
  const handleNoteOn = useCallback((event: NoteMessageEvent) => {
    midiCallbacks.current.forEach((callback) => callback(event));

    const { note } = event;

    setPressedNotes((prevNotes) =>
      prevNotes.includes(note.number) ? prevNotes : [...prevNotes, note.number],
    );
    setVelocities((prevVelocities) =>
      new Map(prevVelocities).set(note.number, note.rawAttack),
    );
    setAllKeysReleased(false);
  }, []);

  const handleNoteOff = useCallback((event: NoteMessageEvent) => {
    midiCallbacks.current.forEach((callback) => callback(event));

    const { note } = event;

    setPressedNotes((prevNotes) => {
      const newNotes = prevNotes.filter((n) => n !== note.number);
      if (newNotes.length === 0) {
        setAllKeysReleased(true);
      }
      return newNotes;
    });
    setVelocities((prevVelocities) => {
      const newVelocities = new Map(prevVelocities);
      newVelocities.delete(note.number);
      return newVelocities;
    });
  }, []);

  useEffect(() => {
    const initWebMidi = async () => {
      try {
        await WebMidi.enable();
        console.log("WebMidi enabled!");

        const updateConnectionStatus = () => {
          setIsMIDIDeviceConnected(WebMidi.inputs.length > 0);
        };

        updateConnectionStatus();

        WebMidi.addListener("connected", updateConnectionStatus);
        WebMidi.addListener("disconnected", updateConnectionStatus);

        const setupInputListeners = (input: Input) => {
          input.addListener("noteon", handleNoteOn);
          input.addListener("noteoff", handleNoteOff);
        };

        WebMidi.inputs.forEach(setupInputListeners);

        WebMidi.addListener("portschanged", () => {
          WebMidi.inputs.forEach(setupInputListeners);
        });
      } catch (err) {
        console.error("WebMidi could not be enabled.", err);
        setIsMIDIDeviceConnected(false);
      }
    };

    initWebMidi();

    // Capture the current callbacks for cleanup
    const currentCallbacks = midiCallbacks.current;

    return () => {
      WebMidi.disable();
      currentCallbacks.clear();
      setIsMIDIDeviceConnected(false);
      setPressedNotes([]);
      setAllKeysReleased(true);
    };
  }, [handleNoteOn, handleNoteOff]);

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
