import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/dialog";
import { useSettings } from "@/hooks/use-settings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/tabs";
import { GeneralSettings } from "./general-settings";
import { ChordSettings } from "./chord-settings";
import { ScaleSettings } from "./scale-settings";
import { IntervalRecognitionSettings } from "./interval-recognition-settings";
import { IntervalSettings } from "./interval-settings";

export const SettingsDialog: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { tab, setTab, cancelSetKey } = useSettings();

  return (
    <Dialog
      onOpenChange={(isOpen) => {
        if (!isOpen) cancelSetKey(); // Reset state when dialog is closed
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex h-[90%] max-h-[70%] flex-col overflow-auto pb-4 sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Edit your exercise preferences here.
          </DialogDescription>
        </DialogHeader>
        <Tabs
          orientation="vertical"
          className="flex flex-1 gap-4"
          value={tab}
          onValueChange={setTab}
        >
          <TabsList className="mb-auto flex flex-col gap-1 p-1.5">
            <TabsTrigger value="general">Shared</TabsTrigger>
            <TabsTrigger value="intervals">Intervals</TabsTrigger>
            <TabsTrigger value="chords">Chords</TabsTrigger>
            <TabsTrigger value="scales">Scales</TabsTrigger>
            <TabsTrigger value="interval-recognition">
              Interval
              <br />
              recognition
            </TabsTrigger>
          </TabsList>
          <div className="flex-1 p-2">
            <TabsContent value="general">
              <GeneralSettings />
            </TabsContent>
            <TabsContent value="intervals">
              <IntervalSettings />
            </TabsContent>
            <TabsContent value="chords">
              <ChordSettings />
            </TabsContent>
            <TabsContent value="scales">
              <ScaleSettings />
            </TabsContent>
            <TabsContent value="interval-recognition">
              <IntervalRecognitionSettings />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
