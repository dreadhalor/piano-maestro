import { midiToNoteName } from "@/utils/chord-utils";
import { useMIDI } from "@/hooks/use-midi";

export const MidiInput = () => {
  const { pressedNotes, isMIDIDeviceConnected } = useMIDI({
    onNotesChange: () => {}, // No-op function for the hook
  }); // Use the hook

  return (
    <div className="mt-4 w-full text-center">
      {" "}
      {/* Removed bg-white and shadow-md */}
      {isMIDIDeviceConnected ? (
        <>
          <p className="text-sm text-green-600">
            MIDI device connected! Start playing.
          </p>
          <h3 className="mt-2 text-lg font-semibold text-gray-800">
            {" "}
            {/* Added text color for emphasis */}
            Currently Pressed Notes:{" "}
            {pressedNotes
              .slice() // Make a copy of the array to avoid mutating state
              .sort((a, b) => a - b) // Sort notes from lowest to highest
              .map(midiToNoteName)
              .join(", ")}
          </h3>
        </>
      ) : (
        <p className="text-sm text-red-600">
          No MIDI device detected. Please connect a MIDI device.
        </p>
      )}
    </div>
  );
};
