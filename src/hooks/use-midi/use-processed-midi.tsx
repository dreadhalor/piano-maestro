import { useContext } from "react";
import { MIDIContext } from "@/providers/midi-provider";

export const useProcessedMIDI = () => {
  const context = useContext(MIDIContext);
  if (!context) {
    throw new Error("useProcessedMIDI must be used within a MIDIProvider");
  }
  return {
    pressedNotes: context.pressedNotes,
    velocities: context.velocities,
    allKeysReleased: context.allKeysReleased,
    isMIDIDeviceConnected: context.isMIDIDeviceConnected,
  };
};
