import { useProcessedMIDI } from "@/hooks/use-midi/midi-hooks";
import { useSettings } from "@/hooks/use-settings";
import { midiToNoteName } from "@/utils/chord-utils";
import { cn } from "@/lib/utils";
import { VerticalSlider } from "@ui/slider";
import { useSynthSound } from "@/hooks/use-synth-sound";
import { Label } from "@radix-ui/react-label";
import { FaVolumeHigh } from "react-icons/fa6";

export const PianoRoll = () => {
  const { pressedNotes } = useProcessedMIDI(); // Get processed notes from hook
  const { lowKey, highKey } = useSettings(); // Access range from settings
  const { volume, changeVolume } = useSynthSound(); // Access the changeVolume function from useSynthSound

  // Define white and black keys dynamically based on the user-defined range
  const whiteKeys: { note: string; midiNumber: number }[] = [];
  const blackKeys = [];

  // MIDI notes that are black keys
  const blackKeyNotes = ["C#", "Eb", "F#", "G#", "Bb"];

  for (let i = lowKey; i <= highKey; i++) {
    const noteName = midiToNoteName(i);
    const isBlackKey = blackKeyNotes.includes(noteName.slice(0, -1)); // Exclude octave for comparison

    if (isBlackKey) {
      blackKeys.push({ note: noteName, midiNumber: i });
    } else {
      whiteKeys.push({ note: noteName, midiNumber: i });
    }
  }

  // Convert pressed MIDI notes to note names
  const pressedNoteNames = pressedNotes.map(midiToNoteName);

  // Function to determine if a key is pressed
  const isKeyPressed = (key: string) => pressedNoteNames.includes(key);

  return (
    <div className="mt-8 flex gap-4">
      <div className="flex flex-col items-center gap-1">
        <FaVolumeHigh className="h-6 w-6 text-gray-700" />
        <Label className="w-[30px] text-center">
          {volume > 0 ? volume : "0(?)"}
        </Label>
        <VerticalSlider
          defaultValue={[100]} // Default to 100% volume
          max={200} // Allow up to 200% volume
          min={0} // Allow down to 0% volume
          step={1}
          onValueChange={(value) => changeVolume(value[0])} // Call changeVolume with percentage
        />
      </div>
      <div className="flex flex-col items-center justify-center">
        {/* White Keys */}
        <div className="relative flex">
          {whiteKeys.map(({ note, midiNumber }) => (
            <div
              key={midiNumber}
              className={cn(
                "relative flex h-40 w-12 items-end justify-center border border-gray-400 bg-white shadow-md",
                isKeyPressed(note) && "bg-blue-300",
              )}
            >
              <span className="mb-2 text-sm font-semibold text-gray-700">
                {note[0]}
              </span>
            </div>
          ))}
          {/* Black Keys */}
          <div
            className="pointer-events-none absolute inset-0 grid"
            style={{ gridTemplateColumns: `repeat(${whiteKeys.length}, 1fr)` }} // Adjust grid size based on white keys
          >
            {blackKeys.map(({ note, midiNumber }) => {
              // Calculate the position of the black key relative to its surrounding white keys
              const precedingWhiteIndex = whiteKeys.findIndex(
                (w) => midiToNoteName(w.midiNumber + 1) === note,
              );
              if (precedingWhiteIndex === -1) return null; // Skip if no valid position found

              return (
                <div
                  key={midiNumber}
                  className={cn(
                    "pointer-events-auto relative h-24 w-8 -translate-x-1/2 transform bg-black shadow-lg",
                    isKeyPressed(note) && "bg-blue-700",
                  )}
                  style={{
                    gridColumnStart: precedingWhiteIndex + 2, // Place black key between appropriate white keys
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PianoRoll;
