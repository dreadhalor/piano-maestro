import { useSynthSound } from "@/hooks/use-synth-sound";
import { useSettings } from "@/providers/settings-provider";
import { midiToNoteName } from "@/utils/chord-utils";
import { cn } from "@/lib/utils";

export const PianoRoll = () => {
  const { pressedNotes } = useSynthSound(); // Get pressed notes from hook
  const { lowKey, highKey } = useSettings(); // Access range from settings

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
    <div className="mt-8 flex flex-col items-center justify-center">
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
  );
};

export default PianoRoll;
