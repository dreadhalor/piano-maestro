import { useState, useEffect, useCallback } from "react";
import { useSettings } from "@/hooks/use-settings";
import { getRandomNote, midiToNoteName } from "@/utils/chord-utils";
import { useNotePressed } from "@/hooks/use-midi/midi-hooks";
import { useSound } from "@/hooks/use-sound/use-sound";

export const useEarTrainingPractice = () => {
  const { lowKey, highKey } = useSettings();
  const { playNote } = useSound();

  const [currentNote, setCurrentNote] = useState<number>(() =>
    getRandomNote(lowKey, highKey),
  );

  const [feedback, setFeedback] = useState<string>("");

  const playCurrentNote = useCallback(async () => {
    const noteName = midiToNoteName(currentNote);
    if (playNote) {
      await playNote(noteName);
    }
  }, [currentNote, playNote]);

  const generateNewNote = useCallback(() => {
    setFeedback("");
    setCurrentNote((prevNote) => getRandomNote(lowKey, highKey, prevNote));
  }, [lowKey, highKey]);

  useEffect(() => {
    playCurrentNote();
  }, [currentNote, playCurrentNote]);

  useNotePressed((noteNumber) => {
    if (noteNumber === currentNote) {
      setFeedback("Correct!");
      setTimeout(() => {
        generateNewNote();
      }, 1000);
    } else {
      setFeedback("Try Again!");
    }
  });

  return {
    currentNote,
    feedback,
    playCurrentNote,
  };
};
