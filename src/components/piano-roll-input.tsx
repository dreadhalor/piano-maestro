import { cn } from "@/lib/utils";
import {
  AbstractNote,
  BLACK_KEYS,
  NOTES,
  WHITE_KEYS,
} from "@/utils/note-utils";
import { useEffect, useState } from "react";

interface KeyProps {
  note: AbstractNote;
  enabled: Set<AbstractNote>;
  onClick: (note: AbstractNote) => void;
}

const WhiteKey = ({ note, enabled, onClick }: KeyProps) => {
  const isEnabled = enabled.has(note);

  return (
    <button
      key={note}
      className={cn(
        "relative flex h-40 w-12 origin-top cursor-pointer items-end justify-center border border-gray-400 bg-white shadow-md transition-transform duration-200",
        isEnabled
          ? "scale-105 transform bg-white shadow-lg"
          : "bg-gray-300 opacity-50 shadow-sm",
      )}
      onClick={() => onClick(note)}
      aria-pressed={isEnabled}
      aria-label={`${note} ${isEnabled ? "enabled" : "disabled"}`}
      data-tip={`${note} ${isEnabled ? "Enabled" : "Disabled"}`}
    >
      <span className="mb-2 select-none text-sm font-semibold text-gray-700">
        {note[0]}
      </span>
    </button>
  );
};

const BlackKey = ({ note, enabled, onClick }: KeyProps) => {
  const isEnabled = enabled.has(note);

  // Calculate the position of the black key relative to its surrounding white keys
  const previousIndex = NOTES.indexOf(note) - 1;
  const precedingWhiteNote = NOTES[previousIndex];
  const precedingWhiteIndex = WHITE_KEYS.indexOf(
    // it'll always be a white key
    precedingWhiteNote as (typeof WHITE_KEYS)[number],
  );
  if (precedingWhiteIndex === -1) return null; // Skip if no valid position found

  return (
    <button
      key={note}
      className={cn(
        "pointer-events-auto absolute h-24 w-8 origin-top -translate-x-1/2 transform cursor-pointer bg-black shadow-lg transition-transform duration-200",
        isEnabled
          ? "scale-105 transform bg-black shadow-xl"
          : "bg-gray-400 shadow-sm",
      )}
      style={{
        left: `${((precedingWhiteIndex + 1) * 100) / WHITE_KEYS.length}%`, // Adjust positioning based on white keys
        zIndex: 10,
      }}
      onClick={() => onClick(note)}
      aria-pressed={isEnabled}
      aria-label={`${note} ${isEnabled ? "enabled" : "disabled"}`}
      data-tip={`${note} ${isEnabled ? "Enabled" : "Disabled"}`}
    ></button>
  );
};

interface PianoRollInputProps {
  enabledNotes?: Set<AbstractNote>;
  onClick?: (note: AbstractNote) => void;
}

export const PianoRollInput = ({
  enabledNotes,
  onClick,
}: PianoRollInputProps) => {
  const [enabled, setEnabled] = useState<Set<AbstractNote>>(
    enabledNotes ?? new Set(NOTES),
  );

  const toggleNote = (note: AbstractNote) => {
    const newEnabled = new Set(enabled);
    if (newEnabled.has(note)) {
      newEnabled.delete(note);
    } else {
      newEnabled.add(note);
    }
    setEnabled(newEnabled);
    onClick?.(note);
  };

  useEffect(() => {
    if (enabledNotes) {
      setEnabled(enabledNotes);
    }
  }, [enabledNotes]);

  return (
    <div className="flex flex-col items-center justify-center rounded-lg bg-gray-100 p-4 pt-6 shadow-md">
      <div className="relative flex pb-2">
        {/* White Keys */}
        <div className="flex space-x-0">
          {WHITE_KEYS.map((note) => (
            <WhiteKey
              key={note}
              note={note}
              enabled={enabled}
              onClick={toggleNote}
            />
          ))}
        </div>
        {/* Black Keys */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 top-0">
          {BLACK_KEYS.map((note) => (
            <BlackKey
              key={note}
              note={note}
              enabled={enabled}
              onClick={toggleNote}
            />
          ))}
        </div>
      </div>
      {/* Legend */}
      <div className="mt-4 flex space-x-4">
        <div className="flex items-center space-x-2">
          <span className="inline-block h-6 w-6 border border-gray-400 bg-white shadow-md"></span>
          <span className="inline-block h-6 w-6 border border-gray-400 bg-black shadow-md"></span>
          <span className="text-gray-700">Enabled</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="inline-block h-6 w-6 border border-gray-400 bg-gray-300 shadow-sm"></span>
          <span className="text-gray-700">Disabled</span>
        </div>
      </div>
    </div>
  );
};
