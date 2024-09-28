import React, { createContext, useState, useEffect, useCallback } from "react";
import { useSettingsStore } from "@/hooks/use-settings-store";
import { useProcessedMIDI } from "@/hooks/use-midi/midi-hooks";
import { SettingsTab } from "@/constants";
import { SettingsState } from "../store/types";

type SettingsContextType = {
  tab: SettingsTab;
  setTab: (tab: SettingsTab) => void;
  isSettingLowKey: boolean;
  isSettingHighKey: boolean;
  startSetLowKey: () => void;
  startSetHighKey: () => void;
  cancelSetKey: () => void;
} & SettingsState;

export const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const settingsStore = useSettingsStore();
  const {
    lowKey,
    highKey,
    setLowKey: storeSetLowKey,
    setHighKey: storeSetHighKey,
  } = settingsStore;

  const [isSettingLowKey, setIsSettingLowKey] = useState<boolean>(false);
  const [isSettingHighKey, setIsSettingHighKey] = useState<boolean>(false);
  const [tab, setTab] = useState<SettingsTab>("general");

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

  const value = {
    tab,
    setTab,
    isSettingLowKey,
    isSettingHighKey,
    startSetLowKey,
    startSetHighKey,
    cancelSetKey,
    ...settingsStore,
    // overriding these fxns
    setLowKey,
    setHighKey,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
