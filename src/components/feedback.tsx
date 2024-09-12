import React from 'react';

interface FeedbackProps {
  message: string;
}

const Feedback: React.FC<FeedbackProps> = ({ message }) => {
  return <h3>{message}</h3>;
};

export default Feedback;
