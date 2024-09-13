import { useState, useEffect } from "react";
import { midiToNoteName } from "@/utils/chord-utils";
import { useProcessedMIDI } from "@/hooks/use-midi/use-processed-midi";

export const usePlaygroundMode = () => {
  const [pressedNotes, setPressedNotes] = useState<string[]>([]);

  // Destructure pressedNotes from useProcessedMIDI
  const { pressedNotes: midiPressedNotes } = useProcessedMIDI();

  useEffect(() => {
    // Convert MIDI note numbers to note names
    const noteNames = midiPressedNotes.map(midiToNoteName).sort();

    // Only update state if the note names have changed
    if (pressedNotes.join(",") !== noteNames.join(",")) {
      setPressedNotes(noteNames);
    }
  }, [midiPressedNotes]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    pressedNotes, // Return currently pressed notes
  };
};
