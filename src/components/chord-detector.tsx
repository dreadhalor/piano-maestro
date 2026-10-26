import { useProcessedMIDI } from "@/hooks/use-midi/midi-hooks";
import { detectChord } from "@/utils/chord-detection";

export const ChordDetector = () => {
  const { pressedNotes, isMIDIDeviceConnected } = useProcessedMIDI();
  if (!isMIDIDeviceConnected) return null;

  const chord = detectChord(pressedNotes);

  return (
    <div className="mt-4 flex min-h-24 flex-col items-center justify-center text-center">
      <p className="text-sm text-gray-500 dark:text-gray-400">Chord</p>
      <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">
        {chord?.name ?? "—"}
      </p>
      {chord && chord.alternatives.length > 0 && (
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          also {chord.alternatives.join(" · ")}
        </p>
      )}
    </div>
  );
};
