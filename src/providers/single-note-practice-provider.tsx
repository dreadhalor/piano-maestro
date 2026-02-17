import { useState, useEffect, createContext } from "react";
import { getRandomNote } from "@/utils/chord-utils";
import { useSettings } from "@/hooks/use-settings";
import { useProcessedMIDI } from "@/hooks/use-midi/midi-hooks";

interface SingleNotePracticeContextType {
  currentNote: number;
  feedback: string;
  skipNote: () => void;
  tab: string;
  setTab: (tab: string) => void;
  correctCount: number;
  incorrectCount: number;
}

export const SingleNotePracticeContext = createContext<
  SingleNotePracticeContextType | undefined
>(undefined);

export const SingleNotePracticeProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { lowKey, highKey } = useSettings(); // Access the user-defined range from settings
  const [currentNote, setCurrentNote] = useState<number>(
    getRandomNote(lowKey, highKey),
  );
  const [feedback, setFeedback] = useState<string>("");
  const [isNoteComplete, setIsNoteComplete] = useState<boolean>(false);
  const [tab, setTab] = useState<string>("piano");
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);

  const { pressedNotes, allKeysReleased } = useProcessedMIDI();

  const handleNotePlayed = (
    playedNotes: number[],
    allKeysReleased: boolean,
  ) => {
    if (tab !== "piano") return;
    if (isNoteComplete && allKeysReleased) {
      // If note is complete and all keys are released, advance to the next question
      skipNote();
      return;
    }

    if (isNoteComplete) {
      return; // Do nothing if note is already validated and waiting for release
    }

    if (playedNotes.length === 1) {
      if (playedNotes.includes(currentNote)) {
        setFeedback("Correct!");
        setIsNoteComplete(true);
        setCorrectCount((prev) => prev + 1);
      } else {
        setFeedback("Try Again!");
        setIncorrectCount((prev) => prev + 1);
      }
    }
  };

  const skipNote = () => {
    setCurrentNote((prev) => getRandomNote(lowKey, highKey, prev));
    setFeedback("");
    setIsNoteComplete(false);
  };

  // Use useEffect to call handleNotePlayed only when necessary
  useEffect(() => {
    handleNotePlayed(pressedNotes, allKeysReleased);
  }, [pressedNotes, allKeysReleased]); // eslint-disable-line react-hooks/exhaustive-deps

  const value = {
    currentNote,
    feedback,
    skipNote,
    tab,
    setTab,
    correctCount,
    incorrectCount,
  };

  return (
    <SingleNotePracticeContext.Provider value={value}>
      {children}
    </SingleNotePracticeContext.Provider>
  );
};
