import { IntervalPracticeContext } from "@/providers/interval-practice-provider";
import { useContext } from "react";

export const useIntervalPractice = () => {
  const context = useContext(IntervalPracticeContext);
  if (!context) {
    throw new Error(
      "useIntervalPractice must be used within a IntervalPracticeProvider",
    );
  }
  return context;
};
