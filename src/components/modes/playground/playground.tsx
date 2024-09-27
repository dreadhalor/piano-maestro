import { MidiInput } from "@/components/midi-input";
import { useSettings } from "@/hooks/use-settings";
import { useEffect } from "react";

export const Playground = () => {
  const { setTab } = useSettings();

  useEffect(() => {
    setTab("general");
  }, [setTab]);

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <h2 className="mb-4 text-2xl font-bold text-purple-600">
        MIDI Playground
      </h2>
      <p className="mb-4 text-center text-lg text-gray-700">
        Play freely on your MIDI keyboard!
      </p>
      <MidiInput />
    </div>
  );
};
