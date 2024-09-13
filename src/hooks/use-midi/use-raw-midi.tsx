import { useContext } from "react";
import { MIDIContext } from "@/providers/midi-provider";

export const useRawMIDI = () => {
  const context = useContext(MIDIContext);
  if (!context) {
    throw new Error("useRawMIDI must be used within a MIDIProvider");
  }
  return {
    onMIDIMessage: context.onMIDIMessage,
    isMIDIDeviceConnected: context.isMIDIDeviceConnected,
  };
};
