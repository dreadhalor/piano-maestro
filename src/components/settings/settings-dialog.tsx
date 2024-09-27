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
import { SETTINGS_TABS, SettingsTab } from "@/constants";

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
          onValueChange={(_tab) => setTab(_tab as SettingsTab)}
        >
          <TabsList className="mb-auto flex flex-col gap-1 p-1.5">
            {SETTINGS_TABS.map(({ key, label }) => (
              <TabsTrigger key={key} value={key}>
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="flex-1 p-2">
            {SETTINGS_TABS.map(({ key, component }) => (
              <TabsContent key={key} value={key}>
                {component}
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
