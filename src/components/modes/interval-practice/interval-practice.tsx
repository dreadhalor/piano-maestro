import { Feedback } from "@/components/feedback";
import { MidiInput } from "@/components/midi-input";
import { Button } from "@ui/button";
import { useIntervalPractice } from "@/hooks/modes/use-interval-practice";
import { IntervalDisplay } from "./interval-display";
import { useSettings } from "@/hooks/use-settings";
import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IntervalNoteQuiz } from "./interval-note-quiz";
import { IntervalStepQuiz } from "./interval-step-quiz";

export const IntervalPractice = () => {
  const { interval, skipInterval, feedback, tab, setTab } =
    useIntervalPractice();
  const { setTab: settingsSetTab } = useSettings();

  useEffect(() => {
    settingsSetTab("intervals");
  }, [settingsSetTab]);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold text-pink-700">
        Interval Practice Mode
      </h2>
      <Tabs className="flex w-full flex-col" value={tab} onValueChange={setTab}>
        <TabsList className="mx-auto flex justify-center">
          <TabsTrigger value="piano">Piano</TabsTrigger>
          <TabsTrigger value="notes-quiz">Notes</TabsTrigger>
          <TabsTrigger value="steps-quiz">Steps</TabsTrigger>
        </TabsList>
        <TabsContent value="piano">
          <div className="flex w-full flex-col items-center justify-center gap-4">
            <IntervalDisplay interval={interval} />
            <MidiInput />
            <Feedback message={feedback} />
            {/* Add Skip Button */}
            <Button onClick={skipInterval}>Skip Interval</Button>
          </div>
        </TabsContent>
        <TabsContent value="notes-quiz">
          <IntervalNoteQuiz />
        </TabsContent>
        <TabsContent value="steps-quiz">
          <IntervalStepQuiz />
        </TabsContent>
      </Tabs>
    </div>
  );
};
