import { useEffect, useRef } from "react";
import * as Tone from "tone"; // Import Tone.js for audio synthesis
import { useMIDI } from "./use-midi"; // Import the base MIDI hook

export const useSynthSound = () => {
  // Ref to manage the PolySynth instance
  const synth = useRef<Tone.PolySynth | null>(null);
  const activeNotes = useRef<Set<string>>(new Set()); // Track active notes to avoid retriggering
  const isSynthInitialized = useRef(false); // Track if synth is initialized

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

  // Initialize the PolySynth and AudioContext only once
  useEffect(() => {
    // Initialize the PolySynth only once
    if (!isSynthInitialized.current) {
      synth.current = new Tone.PolySynth(Tone.Synth).toDestination();
      isSynthInitialized.current = true; // Mark synth as initialized
    }

    // Ensure Tone.js starts after user interaction
    const startTone = async () => {
      if (Tone.getContext().state !== "running") {
        await Tone.start();
      }
    };

    window.addEventListener("click", startTone, { once: true }); // Start on first click, only once

    return () => {
      window.removeEventListener("click", startTone);
      if (synth.current) {
        synth.current.dispose(); // Clean up the synth on unmount
        synth.current = null; // Set synth to null after disposing
        isSynthInitialized.current = false; // Mark synth as uninitialized
      }
    };
  }, []);

  // Handle MIDI notes changes and play sound
  const handleNotesChange = (notes: number[], allKeysReleased: boolean) => {
    if (!synth.current || !isSynthInitialized.current) return; // Ensure the synth is initialized and not disposed

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
        synth.current?.triggerAttack(note); // Play new note
        activeNotes.current.add(note); // Mark note as active
      }
    });

    // Find released notes
    activeNotes.current.forEach((note) => {
      if (!noteNames.includes(note)) {
        synth.current?.triggerRelease(note); // Stop playing released note
        activeNotes.current.delete(note); // Remove from active notes
      }
    });
  };

  // Use the MIDI hook to get MIDI input and handle notes change
  const { pressedNotes, isMIDIDeviceConnected } = useMIDI({
    onNotesChange: handleNotesChange, // Pass handler to update notes and play sound
  });

  return {
    pressedNotes,
    isMIDIDeviceConnected,
  };
};
