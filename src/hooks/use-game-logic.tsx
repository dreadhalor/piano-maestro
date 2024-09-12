import { useState } from "react";
import { getRandomChord, Chord } from "../utils/chords";
import {
  getRandomNote,
  notesMatchWithExactIntervals,
} from "../utils/chord-utils";
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
  const [awaitingKeyRelease, setAwaitingKeyRelease] = useState<boolean>(false);

  const handleChordPlayed = (
    playedNotes: number[],
    allKeysReleased: boolean,
  ) => {
    if (isChordComplete && allKeysReleased && awaitingKeyRelease) {
      // If chord is complete and keys are released, allow to advance
      setCurrentChord((prev) => getRandomChord(prev));
      setFeedback("");
      setIsChordComplete(false);
      setAwaitingKeyRelease(false);
      return;
    }

    if (isChordComplete) {
      if (allKeysReleased) {
        setAwaitingKeyRelease(true); // Set awaiting release to switch question
      }
      return; // Do nothing if chord is already validated
    }

    if (playedNotes.length === currentChord.notes.length) {
      const playedCorrectly = notesMatchWithExactIntervals(
        playedNotes,
        currentChord.notes,
      );
      if (playedCorrectly) {
        setFeedback("Correct!");
        setIsChordComplete(true);
        setAwaitingKeyRelease(false); // Wait for user to release keys
      } else {
        setFeedback("Try Again!");
      }
    }
  };

  const handleNotePlayed = (
    playedNotes: number[],
    allKeysReleased: boolean,
  ) => {
    if (isNoteComplete && allKeysReleased && awaitingKeyRelease) {
      // If note is complete and keys are released, allow to advance
      setCurrentNote((prev) => getRandomNote(prev));
      setFeedback("");
      setIsNoteComplete(false);
      setAwaitingKeyRelease(false);
      return;
    }

    if (isNoteComplete) {
      if (allKeysReleased) {
        setAwaitingKeyRelease(true); // Set awaiting release to switch question
      }
      return; // Do nothing if note is already validated
    }

    if (playedNotes.length === 1) {
      if (playedNotes.includes(currentNote)) {
        setFeedback("Correct!");
        setIsNoteComplete(true);
        setAwaitingKeyRelease(false); // Wait for user to release the key
      } else {
        setFeedback("Try Again!");
      }
    }
  };

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
