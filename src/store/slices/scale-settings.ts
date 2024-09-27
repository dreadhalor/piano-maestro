import { StateCreator } from "zustand";
import { ScaleSettingsSlice } from "../types";
import { ScaleTypeKey, SCALE_TYPES } from "@/utils/scale-utils";
import { toggleSetItem } from "../helpers";

export const createScaleSettingsSlice: StateCreator<
  ScaleSettingsSlice,
  [],
  [],
  ScaleSettingsSlice
> = (set, get) => ({
  enabledScales: new Set<ScaleTypeKey>(
    Object.keys(SCALE_TYPES) as ScaleTypeKey[],
  ),
  toggleScale: (mode: ScaleTypeKey) => {
    const updatedSet = toggleSetItem(get().enabledScales, mode);
    set({ enabledScales: updatedSet });
  },
});
