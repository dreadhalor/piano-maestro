import { Feedback } from "@/components/feedback";
import { MidiInput } from "@/components/midi-input";
import { Button } from "@ui/button";
import { useIntervalPractice } from "@/hooks/modes/use-interval-practice";
import { IntervalDisplay } from "./interval-display";
import { useSettings } from "@/hooks/use-settings";
import { useEffect } from "react";

export const IntervalPractice = () => {
  const { interval, skipInterval, feedback } = useIntervalPractice();
  const { setTab } = useSettings();

  useEffect(() => {
    setTab("intervals");
  }, [setTab]);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold text-pink-700">
        Interval Practice Mode
      </h2>
      <IntervalDisplay interval={interval} />
      <MidiInput />
      <Feedback message={feedback} />
      {/* Add Skip Button */}
      <Button onClick={skipInterval}>Skip Interval</Button>
    </div>
  );
};
