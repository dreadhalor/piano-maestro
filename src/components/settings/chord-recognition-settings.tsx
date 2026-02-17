import { CHORD_TYPES, ChordTypeKey } from "@/utils/chords";
import { Checkbox } from "@ui/checkbox";
import { useSettings } from "@/hooks/use-settings";
import { Label } from "@ui/label";
import { RadioGroup, RadioGroupItem } from "@ui/radio-group";
import { ChordRecognitionPlaybackStyle } from "@/store/slices/chord-recognition-settings";

export const ChordRecognitionSettings = () => {
  const {
    enabledChordRecognitionTypes,
    toggleChordRecognitionType,
    chordRecognitionInversionsEnabled,
    setChordRecognitionInversionsEnabled,
    chordRecognitionPlaybackStyle,
    setChordRecognitionPlaybackStyle,
  } = useSettings();

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Chord Recognition Settings</h2>

      {/* Chord Type Selection */}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-bold">Select Chord Types for Practice</h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(CHORD_TYPES).map(([key, { label }]) => (
            <div className="flex items-center space-x-2" key={key}>
              <Checkbox
                id={`chord-rec-${key}`}
                checked={enabledChordRecognitionTypes.has(key as ChordTypeKey)}
                onCheckedChange={() =>
                  toggleChordRecognitionType(key as ChordTypeKey)
                }
              />
              <Label
                htmlFor={`chord-rec-${key}`}
                className="flex items-center gap-2"
              >
                {label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Playback Style Selection */}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-bold">Playback Style</h3>
        <RadioGroup
          value={chordRecognitionPlaybackStyle}
          onValueChange={(value) =>
            setChordRecognitionPlaybackStyle(
              value as ChordRecognitionPlaybackStyle,
            )
          }
          className="flex flex-col gap-2"
        >
          <Label htmlFor="playback-block" className="flex items-center">
            <RadioGroupItem value="block" id="playback-block" />
            <span className="ml-2">Block (all notes at once)</span>
          </Label>
          <Label htmlFor="playback-arpeggiated" className="flex items-center">
            <RadioGroupItem value="arpeggiated" id="playback-arpeggiated" />
            <span className="ml-2">Arpeggiated (notes one at a time)</span>
          </Label>
        </RadioGroup>
      </div>

      {/* Inversions Toggle */}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-bold">Inversions</h3>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="chord-rec-inversions"
            checked={chordRecognitionInversionsEnabled}
            onCheckedChange={(checked) =>
              setChordRecognitionInversionsEnabled(checked === true)
            }
          />
          <Label htmlFor="chord-rec-inversions">
            Include chord inversions
          </Label>
        </div>
      </div>
    </div>
  );
};
