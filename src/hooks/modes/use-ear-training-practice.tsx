import { useState, useEffect, useCallback } from "react";
import { useSettings } from "@/hooks/use-settings";
import { getRandomNote, midiToNoteName } from "@/utils/chord-utils";
import { useNotePressed } from "@/hooks/use-midi/midi-hooks";
import { useSound } from "@/hooks/use-sound/use-sound";

type State = "initial" | "playing" | "answered";

export const useEarTrainingPractice = () => {
  const { lowKey, highKey } = useSettings();
  const { playNote } = useSound();

  const [currentNote, setCurrentNote] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [state, setState] = useState<State>("initial");

  // Function to generate a new random note
  const generateNewNote = useCallback(() => {
    const newNote = getRandomNote(lowKey, highKey, currentNote || undefined);
    setCurrentNote(newNote);
    setFeedback("");
  }, [lowKey, highKey, currentNote]);

  // Function to play the current note
  const playCurrentNote = useCallback(async () => {
    if (currentNote === null) return;
    const noteName = midiToNoteName(currentNote);
    if (playNote) {
      await playNote(noteName);
    }
  }, [currentNote, playNote]);

  // Start the practice
  const start = useCallback(() => {
    generateNewNote();
    setState("playing");
  }, [generateNewNote]);

  // Handle user playing a note
  const handleUserNote = useCallback(
    (playedNote: number) => {
      if (state !== "playing" || currentNote === null) return;

      if (playedNote === currentNote) {
        setFeedback("Correct!");
        setState("answered");
        setTimeout(() => {
          generateNewNote();
          setState("playing");
          // Removed the direct call to playCurrentNote here
        }, 1000); // Wait for 1 second before next note
      } else {
        setFeedback("Try Again!");
      }
    },
    [state, currentNote, generateNewNote],
  );

  // Listen for note presses
  useNotePressed(handleUserNote);

  // Play the note when in 'playing' state and a new note is generated
  useEffect(() => {
    if (state === "playing") {
      playCurrentNote();
    }
  }, [currentNote, state, playCurrentNote]);

  return {
    state,
    start,
    feedback,
    currentNote,
    playCurrentNote,
  };
};
