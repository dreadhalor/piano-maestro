import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/dialog";
import { Button } from "@ui/button";
import { useSettings } from "@/providers/settings-provider";

export const SettingsDialog: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const {
    lowKey,
    highKey,
    isSettingLowKey,
    isSettingHighKey,
    startSetLowKey,
    startSetHighKey,
    midiToNoteName,
  } = useSettings();

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="pb-3 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Edit your exercise preferences here.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            {/* Display current range */}
            <div className="col-span-4">
              <h3 className="text-lg font-bold">Keyboard Range</h3>
              <p className="text-sm text-gray-600">
                Current Range: {midiToNoteName(lowKey)} to{" "}
                {midiToNoteName(highKey)}
              </p>
              <div className="mt-2 flex gap-4">
                <Button
                  className={`flex-1 ${isSettingLowKey ? "bg-green-500 text-white" : ""}`}
                  onClick={startSetLowKey}
                >
                  {isSettingLowKey ? "Press a key..." : "Set Lowest Key"}
                </Button>
                <Button
                  className={`flex-1 ${isSettingHighKey ? "bg-blue-500 text-white" : ""}`}
                  onClick={startSetHighKey}
                >
                  {isSettingHighKey ? "Press a key..." : "Set Highest Key"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
