import { cn } from "@/lib/utils";
import React from "react";

interface FeedbackProps {
  message?: string;
  className?: string;
}

export const Feedback: React.FC<FeedbackProps> = ({ message, className }) => {
  if (!message) return null;

  return (
    <h3
      className={cn(
        "text-xl font-bold",
        message === "Correct!"
          ? "text-green-600 dark:text-green-400"
          : "text-red-600 dark:text-red-400",
        className,
      )}
    >
      {message}
    </h3>
  );
};
