import React from "react";

interface FeedbackProps {
  message?: string;
}

export const Feedback: React.FC<FeedbackProps> = ({ message }) => {
  return <h3>{message}</h3>;
};
