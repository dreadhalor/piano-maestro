import React, { createContext, useEffect, useState } from "react";
import { WebMidi, Input } from "webmidi";

interface MIDIContextType {
  inputs: Input[];
  isMIDIDeviceConnected: boolean;
}

export const MIDIContext = createContext<MIDIContextType | null>(null);

export const MIDIProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [inputs, setInputs] = useState<Input[]>([]);
  const [isMIDIDeviceConnected, setIsMIDIDeviceConnected] = useState(false);

  useEffect(() => {
    const enableWebMidi = async () => {
      try {
        await WebMidi.enable();
        console.log("WebMidi enabled!");

        const updateInputsAndConnectionStatus = () => {
          setInputs(WebMidi.inputs);
          setIsMIDIDeviceConnected(WebMidi.inputs.length > 0);
        };

        updateInputsAndConnectionStatus();

        WebMidi.addListener("connected", updateInputsAndConnectionStatus);
        WebMidi.addListener("disconnected", updateInputsAndConnectionStatus);
      } catch (err) {
        console.error("WebMidi could not be enabled.", err);
        setIsMIDIDeviceConnected(false);
      }
    };

    enableWebMidi();

    return () => {
      WebMidi.disable();
    };
  }, []);

  return (
    <MIDIContext.Provider value={{ inputs, isMIDIDeviceConnected }}>
      {children}
    </MIDIContext.Provider>
  );
};
