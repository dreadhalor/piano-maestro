import { cn } from "@/lib/utils";
import {
  AbstractNote,
  BLACK_KEYS,
  NOTES,
  WHITE_KEYS,
} from "@/utils/note-utils";
import { useState } from "react";

interface KeyProps {
  note: AbstractNote;
  enabled: Set<AbstractNote>;
  onClick: (note: AbstractNote) => void;
}
const WhiteKey = ({ note, enabled, onClick }: KeyProps) => (
  <div
    key={note}
    className={cn(
      "relative flex h-40 w-12 cursor-pointer items-end justify-center border border-gray-400 bg-white shadow-md",
      "hover:bg-gray-200",
      !enabled.has(note) ? "bg-gray-200" : "",
    )}
    onClick={() => onClick(note)}
  >
    <span className="mb-2 text-sm font-semibold text-gray-700">{note[0]}</span>
  </div>
);

const BlackKey = ({ note, enabled, onClick }: KeyProps) => {
  // Calculate the position of the black key relative to its surrounding white keys
  const previousIndex = NOTES.indexOf(note) - 1;
  const precedingWhiteNote = NOTES[previousIndex];
  const precedingWhiteIndex = WHITE_KEYS.indexOf(
    // it'll always be a white key
    precedingWhiteNote as (typeof WHITE_KEYS)[number],
  );
  if (precedingWhiteIndex === -1) return null; // Skip if no valid position found

  return (
    <div
      key={note}
      className={cn(
        "pointer-events-auto relative h-24 w-8 -translate-x-1/2 transform cursor-pointer border border-black bg-black shadow-lg",
        "hover:bg-gray-700",
        !enabled.has(note) ? "bg-gray-200" : "",
      )}
      style={{
        gridColumnStart: precedingWhiteIndex + 2, // Place black key between appropriate white keys
      }}
      onClick={() => onClick(note)}
    />
  );
};

interface PianoRollInputProps {
  enabledNotes?: Set<AbstractNote>;
}
export const PianoRollInput = ({ enabledNotes }: PianoRollInputProps) => {
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
  };

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center justify-center">
        {/* Set desired width here */}
        {/* White Keys */}
        <div className="relative flex">
          {WHITE_KEYS.map((note) =>
            WhiteKey({ note, enabled, onClick: toggleNote }),
          )}
          {/* Black Keys */}
          <div
            className="pointer-events-none absolute inset-0 grid"
            style={{ gridTemplateColumns: `repeat(${WHITE_KEYS.length}, 1fr)` }} // Adjust grid size based on white keys
          >
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
      </div>
    </div>
  );
};
