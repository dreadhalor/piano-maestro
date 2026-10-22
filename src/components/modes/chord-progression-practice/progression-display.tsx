import React from "react";
import { RealizedProgression, VoicedChord } from "@/utils/chord-progressions";
import { cn } from "@/lib/utils";
import { VoicingMode } from "@/hooks/modes/use-chord-progression-practice";

interface ProgressionDisplayProps {
  progression: RealizedProgression;
  currentChord: VoicedChord;
  currentIndex: number;
  voicingMode: VoicingMode;
  isAnchored: boolean;
}

export const ProgressionDisplay: React.FC<ProgressionDisplayProps> = ({
  progression,
  currentChord,
  currentIndex,
  voicingMode,
  isAnchored,
}) => {
  // Determine what notes to show based on mode and anchor state
  const getDisplayNotes = (): string => {
    if (voicingMode === "any") {
      // Always show abstract note names (no octave) in any mode
      return currentChord.abstractNoteNames.join("  ");
    }

    if (!isAnchored && currentIndex === 0) {
      // Smooth mode, first chord, not yet anchored — show abstract notes
      return currentChord.abstractNoteNames.join("  ");
    }

    // Smooth mode, anchored — show exact octave-qualified notes
    return currentChord.noteNames.join("  ");
  };

  const getDetailText = (): React.ReactNode => {
    if (voicingMode === "any") {
      return (
        <>
          {currentChord.name}
          <span className="ml-1 italic"> — any voicing accepted</span>
        </>
      );
    }

    if (!isAnchored && currentIndex === 0) {
      return (
        <>
          {currentChord.name}
          <span className="ml-1 italic"> — play in any octave to start</span>
        </>
      );
    }

    return (
      <>
        {currentChord.name} · {currentChord.inversionLabel}
      </>
    );
  };

  return (
    <div className="flex w-full flex-col gap-3 rounded-lg bg-gray-100 p-4 shadow-inner dark:bg-gray-800">
      {/* Progression name and key */}
      <h2 className="text-center text-lg font-bold text-gray-800 dark:text-gray-100">
        <span className="text-yellow-600 dark:text-yellow-400">
          {progression.template.name}
        </span>
        <span className="text-gray-500 dark:text-gray-400"> in </span>
        <span className="text-yellow-600 dark:text-yellow-400">
          {progression.key}
        </span>
      </h2>

      {/* Chord chips */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {progression.chords.map((chord, i) => (
          <React.Fragment key={i}>
            {i > 0 && (
              <span className="text-gray-400 dark:text-gray-500">→</span>
            )}
            <span
              className={cn(
                "rounded-md px-3 py-1 text-sm font-semibold transition-colors",
                i < currentIndex &&
                  "bg-green-100 text-green-700 line-through opacity-60 dark:bg-green-900/40 dark:text-green-400",
                i === currentIndex &&
                  "bg-yellow-200 text-yellow-800 ring-2 ring-yellow-400 dark:bg-yellow-900/50 dark:text-yellow-200 dark:ring-yellow-500",
                i > currentIndex &&
                  "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400",
              )}
            >
              {chord.name}
            </span>
          </React.Fragment>
        ))}
      </div>

      {/* Current chord detail */}
      <div className="mt-1 flex flex-col items-center gap-1">
        <p className="text-base font-semibold text-gray-700 dark:text-gray-200">
          Play:{" "}
          <span className="font-bold text-yellow-700 dark:text-yellow-400">
            {getDisplayNotes()}
          </span>
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {getDetailText()}
        </p>
      </div>
    </div>
  );
};
