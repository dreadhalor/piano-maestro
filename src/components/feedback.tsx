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
        "mt-4 text-xl font-bold",
        message === "Correct!" ? "text-green-600" : "text-red-600",
        className,
      )}
    >
      {message}
    </h3>
  );
};
