import { useState, useEffect } from "react";
import { getRandomChord, Chord } from "../utils/chords";
import { getRandomNote } from "../utils/chord-utils";
import { useMIDI } from "./use-midi";
import { PracticeMode } from "@/providers/app-provider";

export interface UseGameLogicOptions {
  mode: PracticeMode;
}

export const useGameLogic = ({ mode }: UseGameLogicOptions) => {
  const [currentChord, setCurrentChord] = useState<Chord>(getRandomChord());
  const [currentNote, setCurrentNote] = useState<number>(getRandomNote());
  const [feedback, setFeedback] = useState<string>("");
  const [isChordComplete, setIsChordComplete] = useState<boolean>(false);
  const [isNoteComplete, setIsNoteComplete] = useState<boolean>(false);
  const [awaitingKeyRelease, setAwaitingKeyRelease] = useState<boolean>(false); // New state to wait for key release

  const handleChordPlayed = (
    playedNotes: number[],
    allKeysReleased: boolean,
  ) => {
    if (isChordComplete) {
      if (allKeysReleased) {
        setAwaitingKeyRelease(true); // Set awaiting release to switch question
      }
      return; // Do nothing if chord is already validated
    }

    if (playedNotes.length === currentChord.notes.length) {
      // Only check when the number of pressed notes matches the chord length
      const playedCorrectly =
        playedNotes.sort().toString() === currentChord.notes.sort().toString();
      if (playedCorrectly) {
        setFeedback("Correct!");
        setIsChordComplete(true); // Wait for user to release keys
      } else {
        setFeedback("Try Again!");
      }
    }
  };

  const handleNotePlayed = (
    playedNotes: number[],
    allKeysReleased: boolean,
  ) => {
    if (isNoteComplete) {
      if (allKeysReleased) {
        setAwaitingKeyRelease(true); // Set awaiting release to switch question
      }
      return; // Do nothing if note is already validated
    }

    if (playedNotes.length === 1) {
      // Only check when exactly one note is pressed
      if (playedNotes.includes(currentNote)) {
        setFeedback("Correct!");
        setIsNoteComplete(true); // Wait for user to release the key
      } else {
        setFeedback("Try Again!");
      }
    }
  };

  useEffect(() => {
    if (isChordComplete && awaitingKeyRelease) {
      // Once the keys are released after completing the chord, generate a new question
      setCurrentChord(getRandomChord());
      setFeedback("");
      setIsChordComplete(false);
      setAwaitingKeyRelease(false);
    }
  }, [isChordComplete, awaitingKeyRelease]);

  useEffect(() => {
    if (isNoteComplete && awaitingKeyRelease) {
      // Once the keys are released after completing the note, generate a new question
      setCurrentNote(getRandomNote());
      setFeedback("");
      setIsNoteComplete(false);
      setAwaitingKeyRelease(false);
    }
  }, [isNoteComplete, awaitingKeyRelease]);

  // Use the useMIDI hook and pass the correct handler based on the mode
  useMIDI({
    onChordPlayed: mode === "chord" ? handleChordPlayed : handleNotePlayed,
  });

  return {
    currentChord,
    currentNote,
    feedback,
    mode,
  };
};
