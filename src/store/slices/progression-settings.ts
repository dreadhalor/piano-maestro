import { StateCreator } from "zustand";
import { ProgressionSettingsSlice } from "../types";
import { PROGRESSION_TEMPLATES } from "@/utils/chord-progressions";
import { toggleSetItem } from "../helpers";

export const createProgressionSettingsSlice: StateCreator<
  ProgressionSettingsSlice,
  [],
  [],
  ProgressionSettingsSlice
> = (set, get) => ({
  enabledProgressions: new Set<string>(
    PROGRESSION_TEMPLATES.map((t) => t.name),
  ),
  toggleProgression: (name: string) => {
    const updatedSet = toggleSetItem(get().enabledProgressions, name);
    set({ enabledProgressions: updatedSet });
  },
});
