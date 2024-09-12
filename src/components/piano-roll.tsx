import { useSynthSound } from "@/hooks/use-synth-sound";
import { cn } from "@/lib/utils";

export const PianoRoll = () => {
  const { pressedNotes } = useSynthSound(); // Get pressed notes from hook

  // Define the keys for the piano roll
  const whiteKeys = [
    "C2",
    "D2",
    "E2",
    "F2",
    "G2",
    "A2",
    "B2",
    "C3",
    "D3",
    "E3",
    "F3",
    "G3",
    "A3",
    "B3",
    "C4",
    "D4",
    "E4",
    "F4",
    "G4",
    "A4",
    "B4",
    "C5",
    "D5",
    "E5",
    "F5",
    "G5",
    "A5",
    "B5",
    "C6",
  ];

  const blackKeys = [
    { note: "C#2", position: 1 },
    { note: "D#2", position: 2 },
    { note: "F#2", position: 4 },
    { note: "G#2", position: 5 },
    { note: "A#2", position: 6 },
    { note: "C#3", position: 8 },
    { note: "D#3", position: 9 },
    { note: "F#3", position: 11 },
    { note: "G#3", position: 12 },
    { note: "A#3", position: 13 },
    { note: "C#4", position: 15 },
    { note: "D#4", position: 16 },
    { note: "F#4", position: 18 },
    { note: "G#4", position: 19 },
    { note: "A#4", position: 20 },
    { note: "C#5", position: 22 },
    { note: "D#5", position: 23 },
    { note: "F#5", position: 25 },
    { note: "G#5", position: 26 },
    { note: "A#5", position: 27 },
  ];

  // Function to convert MIDI note number to note name (e.g., 60 -> "C4")
  const midiToNoteName = (midiNumber: number): string => {
    const note = [
      "C",
      "C#",
      "D",
      "D#",
      "E",
      "F",
      "F#",
      "G",
      "G#",
      "A",
      "A#",
      "B",
    ][midiNumber % 12];
    const octave = Math.floor(midiNumber / 12) - 1; // MIDI note 0 is C-1
    return `${note}${octave}`;
  };

  // Convert pressed MIDI notes to note names
  const pressedNoteNames = pressedNotes.map(midiToNoteName);

  // Function to determine if a key is pressed
  const isKeyPressed = (key: string) => pressedNoteNames.includes(key);

  return (
    <div className="mt-8 flex flex-col items-center justify-center">
      {/* White Keys */}
      <div className="relative flex">
        {whiteKeys.map((key) => (
          <div
            key={key}
            className={cn(
              "relative flex h-40 w-12 items-end justify-center border border-gray-400 bg-white",
              "shadow-md hover:bg-gray-200 active:bg-blue-200",
              isKeyPressed(key) && "bg-blue-300",
            )}
          >
            <span className="mb-2 text-sm font-semibold text-gray-700">
              {key[0]}
            </span>
          </div>
        ))}
        {/* Black Keys */}
        <div
          className="pointer-events-none absolute inset-0 grid"
          style={{ gridTemplateColumns: "repeat(29, 1fr)" }}
        >
          {blackKeys.map(({ note, position }) => (
            <div
              key={note}
              className={cn(
                "pointer-events-auto relative h-24 w-8 translate-x-full transform bg-black shadow-lg",
                isKeyPressed(note) && "bg-blue-700",
              )}
              style={{
                gridColumnStart: position,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PianoRoll;
