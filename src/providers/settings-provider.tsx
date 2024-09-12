// settings-context.tsx
import React, { createContext, useContext, useState } from "react";
import { useMIDI } from "@/hooks/use-midi";

// Define the type for the context value
interface SettingsContextType {
  lowKey: number;
  highKey: number;
  setLowKey: (value: number) => void;
  setHighKey: (value: number) => void;
  isSettingLowKey: boolean;
  isSettingHighKey: boolean;
  startSetLowKey: () => void;
  startSetHighKey: () => void;
  midiToNoteName: (midiNumber: number) => string;
}

// Create the context
const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

// Provide the context
export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [lowKey, setLowKey] = useState<number>(36); // MIDI for C2
  const [highKey, setHighKey] = useState<number>(84); // MIDI for C6
  const [isSettingLowKey, setIsSettingLowKey] = useState<boolean>(false);
  const [isSettingHighKey, setIsSettingHighKey] = useState<boolean>(false);

  const midiToNoteName = (midiNumber: number): string => {
    const note = [
      "C",
      "C#",
      "D",
      "D#",
      "E",
      "F",
      "F#",
      "G",
      "G#",
      "A",
      "A#",
      "B",
    ][midiNumber % 12];
    const octave = Math.floor(midiNumber / 12) - 1; // MIDI note 0 is C-1
    return `${note}${octave}`;
  };

  // Use the MIDI hook to detect key presses
  useMIDI({
    onNotesChange: (notes) => {
      if (notes.length === 0) return;

      const midiValue = notes[0]; // Get the MIDI value of the first pressed note

      if (isSettingLowKey) {
        if (midiValue > highKey) {
          setLowKey(highKey);
          setHighKey(midiValue);
        } else {
          setLowKey(midiValue);
        }
        setIsSettingLowKey(false);
      } else if (isSettingHighKey) {
        if (midiValue < lowKey) {
          setHighKey(lowKey);
          setLowKey(midiValue);
        } else {
          setHighKey(midiValue);
        }
        setIsSettingHighKey(false);
      }
    },
  });

  const startSetLowKey = () => {
    setIsSettingLowKey(true);
    setIsSettingHighKey(false);
  };

  const startSetHighKey = () => {
    setIsSettingHighKey(true);
    setIsSettingLowKey(false);
  };

  return (
    <SettingsContext.Provider
      value={{
        lowKey,
        highKey,
        setLowKey,
        setHighKey,
        isSettingLowKey,
        isSettingHighKey,
        startSetLowKey,
        startSetHighKey,
        midiToNoteName,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

// Custom hook to use the Settings context
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
