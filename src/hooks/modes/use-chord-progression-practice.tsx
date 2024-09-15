// hooks/modes/use-chord-progression-practice.tsx
import { useState, useCallback, useEffect } from "react";
import {
  getDifferentChordProgression,
  ChordProgression,
} from "@/utils/chord-progressions";
import { notesMatchWithExactIntervals } from "@/utils/chord-utils";
import { useProcessedMIDI } from "@/hooks/use-midi/midi-hooks";

export const useChordProgressionPractice = () => {
  const { pressedNotes, allKeysReleased } = useProcessedMIDI();

  // Generate a random chord progression initially
  const [progression, setProgression] = useState<ChordProgression>(
    getDifferentChordProgression(),
  );
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
  const [isChordComplete, setIsChordComplete] = useState<boolean>(false);
  const [awaitingKeyRelease, setAwaitingKeyRelease] = useState<boolean>(false);

  const currentChord = progression.chords[currentIndex];
  const nextChord = progression.chords[currentIndex + 1] || null;

  const goToNextChord = useCallback(() => {
    if (currentIndex < progression.chords.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } else {
      // Automatically skip to a new random chord progression
      setProgression((prev) => getDifferentChordProgression(prev));
      setCurrentIndex(0);
    }
    setFeedback("");
    setIsChordComplete(false);
    setAwaitingKeyRelease(false);
  }, [currentIndex, progression.chords.length]);

  const handleChordPlayed = useCallback(
    (playedNotes: number[]) => {
      if (isChordComplete && allKeysReleased && awaitingKeyRelease) {
        goToNextChord();
        return;
      }

      if (isChordComplete) {
        if (allKeysReleased) {
          setAwaitingKeyRelease(true);
        }
        return;
      }

      if (playedNotes.length === currentChord.notes.length) {
        const playedCorrectly = notesMatchWithExactIntervals(
          playedNotes,
          currentChord.notes,
        );
        if (playedCorrectly) {
          setFeedback("Correct!");
          setIsChordComplete(true);
          setAwaitingKeyRelease(false);
        } else {
          setFeedback("Try Again!");
        }
      }
    },
    [
      allKeysReleased,
      awaitingKeyRelease,
      currentChord,
      isChordComplete,
      goToNextChord,
    ], // Added goToNextChord as a dependency
  );

  // Function to skip to a new random chord progression
  const skipProgression = useCallback(() => {
    setProgression((prev) => getDifferentChordProgression(prev));
    setCurrentIndex(0);
    setFeedback("");
    setIsChordComplete(false);
    setAwaitingKeyRelease(false);
  }, []);

  useEffect(() => {
    handleChordPlayed(pressedNotes);
  }, [pressedNotes, handleChordPlayed]);

  return {
    currentChord,
    nextChord,
    feedback,
    progression,
    skipProgression,
  };
};
