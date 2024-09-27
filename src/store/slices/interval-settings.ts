import { StateCreator } from "zustand";
import { IntervalSettingsSlice } from "../types";
import {
  IntervalKey,
  INTERVAL_TYPES,
  IntervalDirections,
} from "@/utils/interval-utils";
import { toggleSetItem } from "../helpers";

export const createIntervalSettingsSlice: StateCreator<
  IntervalSettingsSlice,
  [],
  [],
  IntervalSettingsSlice
> = (set, get) => ({
  enabledIntervals: new Set<IntervalKey>(
    Object.keys(INTERVAL_TYPES) as IntervalKey[],
  ),
  intervalDirection: "both",
  toggleInterval: (interval: IntervalKey) => {
    const updatedSet = toggleSetItem(get().enabledIntervals, interval);
    set({ enabledIntervals: updatedSet });
  },
  setIntervalDirection: (direction: IntervalDirections) =>
    set({ intervalDirection: direction }),
});
