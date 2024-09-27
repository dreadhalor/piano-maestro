import { StateCreator } from "zustand";
import { IntervalRecognitionSettingsSlice } from "../types";
import { IntervalKey, INTERVAL_TYPES } from "@/utils/interval-utils";
import { IntervalDirections } from "@/utils/interval-utils";
import { toggleSetItem } from "../helpers";

export const createIntervalRecognitionSettingsSlice: StateCreator<
  IntervalRecognitionSettingsSlice,
  [],
  [],
  IntervalRecognitionSettingsSlice
> = (set, get) => ({
  enabledIntervalRecognitionIntervals: new Set<IntervalKey>(
    Object.keys(INTERVAL_TYPES) as IntervalKey[],
  ),
  intervalRecognitionDirection: "both",
  toggleIntervalRecognitionInterval: (interval: IntervalKey) => {
    const updatedSet = toggleSetItem(
      get().enabledIntervalRecognitionIntervals,
      interval,
    );
    set({ enabledIntervalRecognitionIntervals: updatedSet });
  },
  setIntervalRecognitionDirection: (direction: IntervalDirections) =>
    set({ intervalRecognitionDirection: direction }),
});
