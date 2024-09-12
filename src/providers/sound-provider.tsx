import { useSynthSound } from "@/hooks/use-synth-sound";
import { createContext } from "react";

type SoundContextType = {
  value: string;
};

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider = ({ children }: { children: React.ReactNode }) => {
  useSynthSound();

  return (
    <SoundContext.Provider value={{ value: "random-non-null-string" }}>
      {children}
    </SoundContext.Provider>
  );
};
