import { SoundContext } from "@/providers/sound-provider";
import { useContext } from "react";

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error("useSound must be used within a SoundProvider");
  }
  return context;
};
