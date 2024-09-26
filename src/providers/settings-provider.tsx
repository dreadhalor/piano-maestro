import React, { createContext, useState, useEffect, useCallback } from "react";
import { useSettingsStore } from "@/hooks/use-settings-store";
import { ChordTypeKey } from "@/utils/chords";
import { ScaleTypeKey } from "@/utils/scale-utils";
import { IntervalKey } from "@/utils/interval-utils";
import { useProcessedMIDI } from "@/hooks/use-midi/midi-hooks";

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
  enabledChordTypes: Set<ChordTypeKey>;
  toggleChordType: (type: ChordTypeKey) => void;
  enabledScales: Set<ScaleTypeKey>;
  toggleScale: (mode: ScaleTypeKey) => void;
  enabledIntervalRecognitionIntervals: Set<IntervalKey>;
  toggleIntervalRecognitionInterval: (interval: IntervalKey) => void;
  intervalRecognitionDirection: "ascending" | "descending" | "both";
  setIntervalRecognitionDirection: (
    direction: "ascending" | "descending" | "both",
  ) => void;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(
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
    enabledChordTypes,
    toggleChordType,
    enabledScales,
    toggleScale,
    enabledIntervalRecognitionIntervals: enabledIntervalRecognitionIntervals,
    toggleIntervalRecognitionInterval: toggleIntervalRecognitionInterval,
    intervalRecognitionDirection: intervalRecognitionDirection,
    setIntervalRecognitionDirection: setIntervalRecognitionDirection,
  } = useSettingsStore();

  const [isSettingLowKey, setIsSettingLowKey] = useState<boolean>(false);
  const [isSettingHighKey, setIsSettingHighKey] = useState<boolean>(false);

  // Get processed MIDI data from the new hook
  const { pressedNotes } = useProcessedMIDI();

  // Wrap setLowKey and setHighKey in useCallback to ensure stable references
  const setLowKey = useCallback(
    (value: number) => {
      if (value !== lowKey) {
        storeSetLowKey(value);
      }
    },
    [lowKey, storeSetLowKey],
  );

  const setHighKey = useCallback(
    (value: number) => {
      if (value !== highKey) {
        storeSetHighKey(value);
      }
    },
    [highKey, storeSetHighKey],
  );

  useEffect(() => {
    if (pressedNotes.length === 0) return;

    const midiValue = pressedNotes[0]; // Get the MIDI value of the first pressed note

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
  }, [
    pressedNotes,
    isSettingLowKey,
    isSettingHighKey,
    lowKey,
    highKey,
    setLowKey,
    setHighKey,
  ]);

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
        enabledChordTypes,
        toggleChordType,
        enabledScales,
        toggleScale,
        enabledIntervalRecognitionIntervals,
        toggleIntervalRecognitionInterval,
        intervalRecognitionDirection,
        setIntervalRecognitionDirection,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
