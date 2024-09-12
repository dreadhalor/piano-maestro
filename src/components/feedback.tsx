import React from "react";

interface FeedbackProps {
  message?: string;
}

export const Feedback: React.FC<FeedbackProps> = ({ message }) => {
  if (!message) return null;

  return (
    <h3
      className={`mt-4 text-xl font-bold ${message === "Correct!" ? "text-green-600" : "text-red-600"}`}
    >
      {message}
    </h3>
  );
};
