import { useProcessedMIDI } from "@/hooks/use-midi/midi-hooks";
import { useSettings } from "@/hooks/use-settings";
import { midiToNoteName } from "@/utils/note-utils";
import { cn, getWhiteAndBlackKeys } from "@/lib/utils";
import { VerticalSlider } from "@ui/slider";
import { Label } from "@radix-ui/react-label";
import { FaVolumeHigh } from "react-icons/fa6";
import { useSound } from "@/hooks/use-sound/use-sound";

export const PianoRoll = () => {
  const { pressedNotes } = useProcessedMIDI();
  const { lowKey, highKey } = useSettings();
  const { volume, changeVolume, playNote } = useSound();

  const { whiteKeys, blackKeys } = getWhiteAndBlackKeys(lowKey, highKey);

  // Convert pressed MIDI notes to note names
  const pressedNoteNames = pressedNotes.map(midiToNoteName);

  // Function to determine if a key is pressed
  const isKeyPressed = (key: string) => pressedNoteNames.includes(key);

  return (
    <div className="mt-8 flex gap-4">
      <div className="flex flex-col items-center gap-1">
        <FaVolumeHigh className="h-6 w-6 text-gray-700" />
        <Label className="w-[30px] text-center">{volume}</Label>
        <VerticalSlider
          defaultValue={[volume]} // Use current volume as default
          max={200} // Allow up to 200% volume
          min={0} // Allow down to 0% volume
          step={1}
          onValueChange={(value) => changeVolume(value[0])} // Call changeVolume with percentage
        />
      </div>
      <div className="flex flex-col items-center justify-center">
        {/* Set desired width here */}
        {/* White Keys */}
        <div className="relative flex">
          {whiteKeys.map(({ note, midiNumber }) => (
            <div
              key={midiNumber}
              className={cn(
                "relative flex h-40 w-12 cursor-pointer items-end justify-center border border-gray-400 bg-white shadow-md",
                isKeyPressed(note) && "bg-blue-300",
                "hover:bg-blue-200",
              )}
              onMouseDown={() => playNote(note)}
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
                    "pointer-events-auto relative h-24 w-8 -translate-x-1/2 transform cursor-pointer bg-black shadow-lg",
                    isKeyPressed(note) && "bg-blue-700",
                    "hover:bg-blue-800",
                  )}
                  onMouseDown={() => playNote(note)}
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
