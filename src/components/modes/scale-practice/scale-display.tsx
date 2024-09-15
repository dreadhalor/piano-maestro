// components/scale-display.tsx
import React from "react";
import { Scale } from "@/utils/scale-utils";
import { midiToNoteName } from "@/utils/chord-utils";
import { FaDotCircle } from "react-icons/fa";

interface ScaleDisplayProps {
  scale: Scale;
  currentNote: number;
  previousIndex: number;
}

export const ScaleDisplay: React.FC<ScaleDisplayProps> = ({
  scale,
  currentNote,
  previousIndex,
}) => {
  return (
    <div className="mb-6 w-full rounded-lg bg-gray-100 p-4 text-center shadow-inner">
      <h2 className="mb-4 text-xl font-bold text-gray-800">
        Scale: <span className="text-red-500">{scale.name}</span>
      </h2>
      <div className="mt-4 text-center">
        <h2 className="mb-4 text-xl font-bold text-gray-800">
          {currentNote ? (
            <>
              Press this key:{" "}
              <span className="text-red-500">
                {midiToNoteName(currentNote)}
              </span>
            </>
          ) : (
            "Scale Complete!"
          )}
        </h2>
        <div className="flex justify-center">
          <div className="grid grid-cols-7 grid-rows-[1fr_auto] items-center justify-center gap-x-2">
            {scale.notes.map((note, index) => (
              <div
                className="row-span-2 row-start-1 grid grid-rows-subgrid"
                key={index}
              >
                {index === previousIndex && (
                  <div className="flex h-2 items-center justify-center">
                    <FaDotCircle className="h-2 w-2" />
                  </div>
                )}

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
