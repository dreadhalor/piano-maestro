// settings-context.tsx
import React, { createContext, useContext, useState } from "react";
import { useMIDI } from "@/hooks/use-midi";
import { useSettingsStore } from "@/hooks/use-settings-store";

interface SettingsContextType {
  lowKey: number;
  highKey: number;
  setLowKey: (value: number) => void;
  setHighKey: (value: number) => void;
  isSettingLowKey: boolean;
  isSettingHighKey: boolean;
  startSetLowKey: () => void;
  startSetHighKey: () => void;
  cancelSetKey: () => void;
  midiToNoteName: (midiNumber: number) => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const {
    lowKey,
    highKey,
    setLowKey: storeSetLowKey,
    setHighKey: storeSetHighKey,
  } = useSettingsStore(); // Use Zustand store
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

  const setLowKey = (value: number) => {
    if (value !== lowKey) {
      storeSetLowKey(value);
    }
  };

  const setHighKey = (value: number) => {
    if (value !== highKey) {
      storeSetHighKey(value);
    }
  };

  useMIDI({
    onNotesChange: (notes) => {
      if (notes.length === 0) return;

      const midiValue = notes[0]; // Get the MIDI value of the first pressed note

      if (isSettingLowKey) {
        if (midiValue > highKey) {
          setLowKey(highKey); // Swap if necessary
          setHighKey(midiValue);
        } else {
          setLowKey(midiValue);
        }
        setIsSettingLowKey(false);
      } else if (isSettingHighKey) {
        if (midiValue < lowKey) {
          setHighKey(lowKey); // Swap if necessary
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

  const cancelSetKey = () => {
    setIsSettingLowKey(false);
    setIsSettingHighKey(false);
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
        cancelSetKey,
        midiToNoteName,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
