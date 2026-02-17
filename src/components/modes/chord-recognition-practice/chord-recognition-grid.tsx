import { useSettings } from "@/hooks/use-settings";
import { CHORD_TYPES, ChordTypeKey } from "@/utils/chords";
import { Button } from "@ui/button";

interface ChordRecognitionGridProps {
  submitAnswer: (chordType: ChordTypeKey) => void;
  state: "initial" | "playing" | "answered";
}

export const ChordRecognitionGrid: React.FC<ChordRecognitionGridProps> = ({
  submitAnswer,
  state,
}) => {
  const { enabledChordRecognitionTypes: enabledTypes } = useSettings();

  return (
    <div className="grid grid-cols-3 gap-4">
      {Object.keys(CHORD_TYPES)
        .filter((key) => enabledTypes.has(key as ChordTypeKey))
        .map((key) => {
          const chordType = CHORD_TYPES[key as ChordTypeKey];
          return (
            <Button
              key={key}
              onClick={() => submitAnswer(key as ChordTypeKey)}
              disabled={state === "answered"}
            >
              {chordType.label}
            </Button>
          );
        })}
    </div>
  );
};
