import React from "react";
import { midiToNoteName } from "@/utils/chord-utils";
import { Interval } from "@/utils/interval-utils";

interface KeyDisplayProps {
  interval?: Interval | null;
}

export const IntervalDisplay: React.FC<KeyDisplayProps> = ({ interval }) => {
  if (!interval) {
    return null;
  }

  return (
    <div className="flex w-full flex-col gap-2 rounded-lg bg-gray-100 p-4 text-center shadow-inner">
      <h2 className="text-xl font-bold text-gray-800">
        Play this interval:{" "}
        <span className="text-pink-600">
          {midiToNoteName(interval.notes[0])}{" "}
          {interval.direction === "ascending" ? "+" : "-"} {interval.shorthand}
        </span>
      </h2>{" "}
      <p className="text-sm text-gray-600">
        Notes:{" "}
        <span className="font-semibold">
          {interval.notes.map(midiToNoteName).join(", ")}
        </span>
      </p>
    </div>
  );
};
