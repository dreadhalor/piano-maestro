import { SingleNotePracticeContext } from "@/providers/single-note-practice-provider";
import { useContext } from "react";

export const useSingleNotePractice = () => {
  const context = useContext(SingleNotePracticeContext);
  if (!context) {
    throw new Error(
      "useSingleNotePractice must be used within a SingleNotePracticeProvider",
    );
  }
  return context;
};
