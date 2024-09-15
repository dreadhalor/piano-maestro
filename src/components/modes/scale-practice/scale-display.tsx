// components/scale-display.tsx
import React from "react";
import { Scale } from "@/utils/scale-utils";
import { midiToNoteName } from "@/utils/chord-utils";
import { FaDotCircle } from "react-icons/fa";
import { cn } from "@/lib/utils";

interface ScaleDisplayProps {
  scale: Scale;
  currentNote: number;
  previousIndex: number;
  isScaleComplete: boolean;
}

export const ScaleDisplay: React.FC<ScaleDisplayProps> = ({
  scale,
  currentNote,
  previousIndex,
  isScaleComplete,
}) => {
  return (
    <div className="mb-6 w-full rounded-lg bg-gray-100 p-4 text-center shadow-inner">
      <h2 className="mb-4 text-xl font-bold text-gray-800">
        Scale: <span className="text-red-500">{scale.name}</span>
      </h2>
      <div className="mt-4 text-center">
        <h2 className="mb-4 text-xl font-bold text-gray-800">
          {currentNote && !isScaleComplete ? (
            <>
              Press this key:{" "}
              <span className="text-red-500">
                {midiToNoteName(currentNote)}
              </span>
            </>
          ) : (
            <span className="text-red-500">Scale complete!</span>
          )}
        </h2>
        <div className="flex justify-center">
          <div className="grid grid-cols-7 grid-rows-[1fr_auto] items-center justify-center gap-x-2">
            {scale.notes.map((note, index) => (
              <div
                className="row-span-2 row-start-1 grid grid-rows-subgrid"
                key={index}
              >
                <div className="flex h-2 items-center justify-center">
                  <FaDotCircle
                    className={cn(
                      "invisible h-2 w-2",
                      index === previousIndex && "visible",
                    )}
                  />
                </div>

                <span
                  key={note}
                  className="row-start-2 text-sm font-semibold text-gray-600"
                >
                  {midiToNoteName(note)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
