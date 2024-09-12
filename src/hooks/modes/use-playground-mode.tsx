import { useState } from "react";
import { midiToNoteName } from "@/utils/chord-utils";
import { useMIDI } from "@/hooks/use-midi";

export const usePlaygroundMode = () => {
  const [pressedNotes, setPressedNotes] = useState<string[]>([]);

  const handleNotesPlayed = (notes: number[]) => {
    // Convert MIDI note numbers to note names
    const noteNames = notes.map(midiToNoteName).sort();

    // Only update state if the note names have changed
    if (pressedNotes.join(",") !== noteNames.join(",")) {
      setPressedNotes(noteNames);
    }
  };

  useMIDI({
    onNotesChange: (notes) => handleNotesPlayed(notes), // Pass handler to update notes
  });

  return {
    pressedNotes, // Return currently pressed notes
  };
};
