import React from "react";
import { midiToNoteName } from "@/utils/chord-utils";

interface KeyDisplayProps {
  note?: number;
}

export const KeyDisplay: React.FC<KeyDisplayProps> = ({ note }) => {
  if (!note) {
    return null;
  }

  return (
    <div className="mb-6 w-full rounded-lg bg-gray-100 p-4 text-center shadow-inner">
      <h2 className="text-xl font-bold text-gray-800">
        Press this key:{" "}
        <span className="text-green-500">{midiToNoteName(note)}</span>
      </h2>
    </div>
  );
};
