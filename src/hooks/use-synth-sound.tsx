import { useEffect, useRef } from "react";
import * as Tone from "tone"; // Import Tone.js for audio synthesis
import { useMIDI } from "./use-midi"; // Import the base MIDI hook

export const useSynthSound = () => {
  // Ref to manage the Sampler instance
  const sampler = useRef<Tone.Sampler | null>(null);
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

  // Initialize the Sampler and AudioContext only once
  useEffect(() => {
    if (!isSynthInitialized.current) {
      // Load piano samples for different octaves
      sampler.current = new Tone.Sampler(
        {
          C3: "https://tonejs.github.io/audio/salamander/C3.mp3",
          "D#3": "https://tonejs.github.io/audio/salamander/Ds3.mp3",
          "F#3": "https://tonejs.github.io/audio/salamander/Fs3.mp3",
          A3: "https://tonejs.github.io/audio/salamander/A3.mp3",
          C4: "https://tonejs.github.io/audio/salamander/C4.mp3",
          "D#4": "https://tonejs.github.io/audio/salamander/Ds4.mp3",
          "F#4": "https://tonejs.github.io/audio/salamander/Fs4.mp3",
          A4: "https://tonejs.github.io/audio/salamander/A4.mp3",
        },
        () => {
          console.log("Sampler loaded!");
        },
      ).toDestination();

      // Set the envelope release time to 2 seconds for a natural fade-out
      sampler.current.set({
        release: 2,
      });

      isSynthInitialized.current = true; // Mark sampler as initialized
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
      if (sampler.current) {
        sampler.current.dispose(); // Clean up the sampler on unmount
        sampler.current = null; // Set sampler to null after disposing
        isSynthInitialized.current = false; // Mark synth as uninitialized
      }
    };
  }, []);

  // Handle MIDI notes changes and play sound
  const handleNotesChange = (notes: number[], allKeysReleased: boolean) => {
    if (!sampler.current || !isSynthInitialized.current) return; // Ensure the sampler is initialized and not disposed

    if (allKeysReleased) {
      // If all keys are released, stop all sounds
      sampler.current.releaseAll();
      activeNotes.current.clear(); // Clear all active notes
      return;
    }

    const noteNames = notes.map(midiToToneNote); // Convert MIDI notes to Tone.js note names

    // Find newly pressed notes
    noteNames.forEach((note) => {
      if (!activeNotes.current.has(note)) {
        sampler.current?.triggerAttack(note); // Play new note
        activeNotes.current.add(note); // Mark note as active
      }
    });

    // Find released notes
    activeNotes.current.forEach((note) => {
      if (!noteNames.includes(note)) {
        sampler.current?.triggerRelease(note); // Stop playing released note
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
