import { KeyDisplay } from "./key-display";
import { Feedback } from "@/components/feedback";
import { MidiInput } from "@/components/midi-input";
import { Button } from "@ui/button";
import { useSingleNotePractice } from "@/hooks/modes/use-single-note-practice";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IndexQuiz } from "./index-quiz";
import { NoteQuiz } from "./note-quiz";

export const NotePractice = () => {
  const { currentNote, feedback, skipNote, tab, setTab } =
    useSingleNotePractice();

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold text-green-600">Note Practice Mode</h2>
      <Tabs className="flex w-full flex-col" value={tab} onValueChange={setTab}>
        <TabsList className="mx-auto flex justify-center">
          <TabsTrigger value="piano">Piano</TabsTrigger>
          <TabsTrigger value="note-quiz">Names</TabsTrigger>
          <TabsTrigger value="index-quiz">Numbers</TabsTrigger>
        </TabsList>
        <TabsContent value="piano">
          <div className="flex w-full flex-col items-center justify-center gap-4">
            <KeyDisplay note={currentNote} />
            <MidiInput />
            <Feedback message={feedback} />
            {/* Add Skip Button */}
            <Button onClick={skipNote}>Skip Note</Button>
          </div>
        </TabsContent>
        <TabsContent value="note-quiz">
          <NoteQuiz />
        </TabsContent>
        <TabsContent value="index-quiz">
          <IndexQuiz />
        </TabsContent>
      </Tabs>
    </div>
  );
};
