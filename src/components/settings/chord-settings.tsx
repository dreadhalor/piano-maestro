import { CHORD_TYPES, ChordTypeKey } from "@/utils/chords";
import { Checkbox } from "@ui/checkbox";
import { useSettings } from "@/hooks/use-settings";
import { Label } from "@ui/label";
import { PianoRollInput } from "../piano-roll-input";

export const ChordSettings = () => {
  const {
    enabledChordTypes,
    toggleChordType,
    enabledChordPracticeRootNotes,
    toggleChordPracticeRootNote,
  } = useSettings();

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Chord Practice Settings</h2>

      {/* Enabled Root Notes */}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-bold">Enabled Root Notes</h3>
        <PianoRollInput
          enabledNotes={enabledChordPracticeRootNotes}
          onClick={toggleChordPracticeRootNote}
        />
      </div>

      {/* Chord Type Selection */}
      <h3 className="text-lg font-bold">Select Chord Types for Practice</h3>
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(CHORD_TYPES).map(([key, { label }]) => (
          <div className="flex items-center space-x-2" key={key}>
            <Checkbox
              id={`chord-${key}`}
              checked={
                enabledChordTypes && enabledChordTypes.has(key as ChordTypeKey)
              }
              onCheckedChange={() => toggleChordType(key as ChordTypeKey)}
            />
            <Label htmlFor={`chord-${key}`} className="flex items-center gap-2">
              {label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};
