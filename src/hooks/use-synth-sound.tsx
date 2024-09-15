// use-synth-sound.tsx
import { useEffect, useRef, useCallback, useState } from "react";
import * as Tone from "tone"; // Import Tone.js for audio synthesis
import { useRawMIDI } from "@/hooks/use-midi/use-raw-midi";

export const useSynthSound = () => {
  // Ref to manage the Sampler instance
  const sampler = useRef<Tone.Sampler | null>(null);
  const volumeNode = useRef<Tone.Volume | null>(null); // Volume node to control volume
  const activeNotes = useRef<Set<string>>(new Set()); // Track active notes to avoid retriggering
  const isSynthInitialized = useRef(false); // Track if synth is initialized

  // State for volume control
  const [volume, setVolume] = useState(100); // Default volume is 100%

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

  // Initialize the Sampler, Volume, and AudioContext only once
  useEffect(() => {
    if (!isSynthInitialized.current) {
      // Create a new volume node
      volumeNode.current = new Tone.Volume(0).toDestination(); // Start with neutral volume (0 dB)

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
      ).connect(volumeNode.current); // Connect the sampler to the volume node

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
      if (volumeNode.current) {
        volumeNode.current.dispose(); // Clean up the volume node on unmount
        volumeNode.current = null;
      }
    };
  }, []);

  // Function to map percentage to dB and handle changing volume
  const changeVolume = useCallback((percent: number) => {
    setVolume(percent);
    if (volumeNode.current) {
      // Convert percentage to dB
      let dbValue: number;
      if (percent === 0)
        dbValue = -Infinity; // Mute
      else dbValue = 20 * Math.log10(percent / 100); // Above 0 dB

      volumeNode.current.volume.value = dbValue; // Set volume using Tone.js' Volume class
    }
  }, []);

  // Handle raw MIDI messages
  const handleMIDIMessage = useCallback((message: WebMidi.MIDIMessageEvent) => {
    if (!sampler.current || !isSynthInitialized.current) return; // Ensure the sampler is initialized and not disposed

    const [command, note, velocity] = message.data;
    const noteName = midiToToneNote(note);

    switch (command) {
      case 144: // Note on
        if (velocity > 0) {
          // Handle Note On
          if (!activeNotes.current.has(noteName)) {
            sampler.current?.triggerAttack(noteName, undefined, velocity / 127); // Use velocity to control volume
            activeNotes.current.add(noteName);
          }
        } else {
          // If "Note On" with velocity 0, treat as Note Off
          if (activeNotes.current.has(noteName)) {
            sampler.current?.triggerRelease(noteName);
            activeNotes.current.delete(noteName);
          }
        }
        break;
      case 128: // Note off
        // Handle Note Off
        if (activeNotes.current.has(noteName)) {
          sampler.current?.triggerRelease(noteName);
          activeNotes.current.delete(noteName);
        }
        break;
      default:
        break;
    }
  }, []);

  // Use the raw MIDI hook to register the handler
  const { onMIDIMessage, isMIDIDeviceConnected } = useRawMIDI();

  useEffect(() => {
    onMIDIMessage(handleMIDIMessage); // Register the MIDI handler

    return () => {
      // Optionally clean up if needed
    };
  }, [handleMIDIMessage, onMIDIMessage]);

  return {
    isMIDIDeviceConnected,
    volume,
    changeVolume, // Provide function to change volume
  };
};
