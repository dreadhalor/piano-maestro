import { ChordDisplay } from "./chord-display";
import { Feedback } from "@/components/feedback";
import { MidiInput } from "@/components/midi-input";
import { Button } from "@ui/button";
import { useChordPractice } from "@/hooks/modes/use-chord-practice";
import { useSettings } from "@/hooks/use-settings";
import { useEffect } from "react";
import { ChordNameQuiz } from "./chord-name-quiz";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChordNoteQuiz } from "./chord-note-quiz";

export const ChordPractice = () => {
  const { currentChord, feedback, skipChord, tab, setTab } = useChordPractice();
  const { setTab: settingsSetTab } = useSettings();

  useEffect(() => {
    settingsSetTab("chords");
  }, [settingsSetTab]);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold text-blue-600">Chord Practice Mode</h2>
      <Tabs value={tab} onValueChange={setTab} className="flex w-full flex-col">
        <TabsList className="mx-auto flex justify-center">
          <TabsTrigger value="piano">Piano</TabsTrigger>
          <TabsTrigger value="name-quiz">Name</TabsTrigger>
          <TabsTrigger value="notes-quiz">Notes</TabsTrigger>
        </TabsList>
        <TabsContent value="piano">
          <div className="flex flex-col items-center justify-center gap-4">
            <ChordDisplay chord={currentChord} />
            <MidiInput />
            <Feedback message={feedback} />
            {/* Add Skip Button */}
            <Button onClick={skipChord}>Skip Chord</Button>{" "}
          </div>
        </TabsContent>
        <TabsContent value="name-quiz">
          <ChordNameQuiz />
        </TabsContent>
        <TabsContent value="notes-quiz">
          <ChordNoteQuiz />
        </TabsContent>
      </Tabs>
    </div>
  );
};
