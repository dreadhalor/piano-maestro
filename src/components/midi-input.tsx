import { midiToNoteName } from "@/utils/note-utils";
import { useProcessedMIDI } from "@/hooks/use-midi/midi-hooks";

export const MidiInput = () => {
  const { pressedNotes, isMIDIDeviceConnected } = useProcessedMIDI();

  return (
    <div className="w-full text-center">
      {isMIDIDeviceConnected ? (
        <>
          <p className="text-sm text-green-600">
            MIDI device connected! Start playing.
          </p>
          <h3 className="mt-2 text-lg font-semibold text-gray-800">
            Currently Pressed Notes:{" "}
            {pressedNotes
              .slice()
              .sort((a, b) => a - b)
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
