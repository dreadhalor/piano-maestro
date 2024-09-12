import React, { useState, useEffect } from "react";
import MidiInput from "./components/midi-input";
import ChordDisplay from "./components/chord-display";
import Feedback from "./components/feedback";
import { getRandomChord, Chord } from "./utils/chords"; // Import from chords.ts
import { getRandomNote } from "./utils/chord-utils"; // Import utility for random note
import KeyDisplay from "./components/key-display"; // New component for basic mode

const App: React.FC = () => {
  const [currentChord, setCurrentChord] = useState<Chord>(getRandomChord());
  const [currentNote, setCurrentNote] = useState<number>(getRandomNote());
  const [feedback, setFeedback] = useState<string>("");
  const [isChordComplete, setIsChordComplete] = useState<boolean>(false);
  const [isNoteComplete, setIsNoteComplete] = useState<boolean>(false);
  const [mode, setMode] = useState<"chord" | "basic">("chord"); // Mode state

  useEffect(() => {
    if (isChordComplete) {
      const timer = setTimeout(() => {
        setCurrentChord(getRandomChord()); // Get a new random chord
        setFeedback("");
        setIsChordComplete(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isChordComplete]);

  useEffect(() => {
    if (isNoteComplete) {
      const timer = setTimeout(() => {
        setCurrentNote(getRandomNote()); // Get a new random note
        setFeedback("");
        setIsNoteComplete(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isNoteComplete]);

  const handleChordPlayed = (playedNotes: number[]) => {
    if (isChordComplete) return; // Do nothing if chord is already validated

    const playedCorrectly =
      playedNotes.sort().toString() === currentChord.notes.sort().toString();
    if (playedCorrectly) {
      setFeedback("Correct!");
      setIsChordComplete(true); // Wait for user to release keys
    } else {
      setFeedback("Try Again!");
    }
  };

  const handleNotePlayed = (playedNotes: number[]) => {
    if (isNoteComplete) return; // Do nothing if note is already validated

    if (playedNotes.includes(currentNote)) {
      setFeedback("Correct!");
      setIsNoteComplete(true); // Wait for user to release the key
    } else {
      setFeedback("Try Again!");
    }
  };

  const switchMode = () => {
    setMode((prevMode) => (prevMode === "chord" ? "basic" : "chord"));
    setFeedback(""); // Reset feedback when switching modes
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="mb-6 text-4xl font-bold text-blue-600">
        Piano Learning Game
      </h1>
      <button
        onClick={switchMode}
        className="mb-4 rounded bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
      >
        Switch to{" "}
        {mode === "chord" ? "Basic Key Learning Mode" : "Chord Learning Mode"}
      </button>
      {mode === "chord" ? (
        <>
          <ChordDisplay chord={currentChord} />
          <MidiInput onChordPlayed={handleChordPlayed} />
        </>
      ) : (
        <>
          <KeyDisplay note={currentNote} />
          <MidiInput onChordPlayed={handleNotePlayed} />
        </>
      )}
      <Feedback message={feedback} />
    </div>
  );
};

export default App;
