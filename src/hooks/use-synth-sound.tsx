import { useEffect, useRef } from "react";
import * as Tone from "tone"; // Import Tone.js for audio synthesis
import { useMIDI } from "./use-midi"; // Import the base MIDI hook
// Maybe this is bad to be built on top of useMIDI but it works okay

export const useSynthSound = () => {
  const handleNotesChange = (notes: number[], allKeysReleased: boolean) => {
    if (allKeysReleased) {
      // If all keys are released, stop all sounds
      synth.current.releaseAll();
      activeNotes.current.clear(); // Clear all active notes
      return;
    }

    const noteNames = notes.map(midiToToneNote); // Convert MIDI notes to Tone.js note names

    // Find newly pressed notes
    noteNames.forEach((note) => {
      if (!activeNotes.current.has(note)) {
        synth.current.triggerAttack(note); // Play new note
        activeNotes.current.add(note); // Mark note as active
      }
    });

    // Find released notes
    activeNotes.current.forEach((note) => {
      if (!noteNames.includes(note)) {
        synth.current.triggerRelease(note); // Stop playing released note
        activeNotes.current.delete(note); // Remove from active notes
      }
    });
  };

  const { pressedNotes, isMIDIDeviceConnected } = useMIDI({
    onNotesChange: handleNotesChange, // Pass handler to update notes and play sound
  });

  const synth = useRef(new Tone.PolySynth(Tone.Synth).toDestination()); // Polyphonic synth
  const activeNotes = useRef<Set<string>>(new Set()); // Track active notes to avoid retriggering

  // Function to convert MIDI note number to Tone.js note format
  const midiToToneNote = (midiNumber: number): string => {
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

  useEffect(() => {
    // Make sure Tone.js is started when the user interacts with the page
    const startTone = async () => {
      await Tone.start();
    };
    window.addEventListener("click", startTone); // Start on first click
    return () => window.removeEventListener("click", startTone);
  }, []);

  return {
    pressedNotes,
    isMIDIDeviceConnected,
  };
};
