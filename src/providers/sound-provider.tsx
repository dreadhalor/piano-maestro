import { useSynthSound } from "@/hooks/use-sound/use-synth-sound";
import { createContext } from "react";

type SoundContextType = {
  isMIDIDeviceConnected: boolean;
  volume: number;
  changeVolume: (volume: number) => void;
  playNote: (noteName: string) => Promise<void>;
};

export const SoundContext = createContext<SoundContextType | undefined>(
  undefined,
);

export const SoundProvider = ({ children }: { children: React.ReactNode }) => {
  const { isMIDIDeviceConnected, playNote, volume, changeVolume } =
    useSynthSound();

  const value = {
    isMIDIDeviceConnected,
    volume,
    changeVolume,
    playNote,
  };

  return (
    <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
  );
};
