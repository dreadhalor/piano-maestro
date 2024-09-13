import { midiToNoteName } from "@/utils/chord-utils";
import { useProcessedMIDI } from "@/hooks/use-midi/use-processed-midi";

export const MidiInput = () => {
  const { pressedNotes, isMIDIDeviceConnected } = useProcessedMIDI(); // Use the processed MIDI hook

  return (
    <div className="mt-4 w-full text-center">
      {isMIDIDeviceConnected ? (
        <>
          <p className="text-sm text-green-600">
            MIDI device connected! Start playing.
          </p>
          <h3 className="mt-2 text-lg font-semibold text-gray-800">
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
