import { ChordPracticeContext } from "@/providers/chord-practice-provider";
import { useContext } from "react";

export const useChordPractice = () => {
  const context = useContext(ChordPracticeContext);
  if (!context) {
    throw new Error(
      "useChordPractice must be used within a ChordPracticeProvider",
    );
  }
  return context;
};
