import React, { createContext, useEffect, useMemo, useRef, useState } from "react";
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
  const prevInputsRef = useRef<Input[]>([]);

  useEffect(() => {
    const enableWebMidi = async () => {
      try {
        await WebMidi.enable();
        console.log("WebMidi enabled!");

        const updateInputsAndConnectionStatus = () => {
          // Remove all user-facing listeners from previous inputs to prevent
          // accumulation across reconnection cycles. The hooks will re-add
          // their listeners when the new inputs trigger their effects.
          prevInputsRef.current.forEach((input) => {
            input.removeListener();
          });

          const currentInputs = [...WebMidi.inputs];
          prevInputsRef.current = currentInputs;
          setInputs(currentInputs);
          setIsMIDIDeviceConnected(currentInputs.length > 0);
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
      prevInputsRef.current.forEach((input) => {
        input.removeListener();
      });
      prevInputsRef.current = [];
      WebMidi.disable();
    };
  }, []);

  const value = useMemo(
    () => ({ inputs, isMIDIDeviceConnected }),
    [inputs, isMIDIDeviceConnected],
  );

  return (
    <MIDIContext.Provider value={value}>
      {children}
    </MIDIContext.Provider>
  );
};
