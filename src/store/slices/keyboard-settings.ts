import { StateCreator } from "zustand";
import { KeyboardSettingsSlice } from "../types";

export const createKeyboardSettingsSlice: StateCreator<
  KeyboardSettingsSlice,
  [],
  [],
  KeyboardSettingsSlice
> = (set) => ({
  lowKey: 36,
  highKey: 84,
  setLowKey: (value: number) => set({ lowKey: value }),
  setHighKey: (value: number) => set({ highKey: value }),
});
