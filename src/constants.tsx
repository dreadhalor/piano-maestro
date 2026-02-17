import { GeneralSettings } from "@/components/settings/general-settings";
import { IntervalSettings } from "@/components/settings/interval-settings";
import { ChordSettings } from "@/components/settings/chord-settings";
import { ScaleSettings } from "@/components/settings/scale-settings";
import { IntervalRecognitionSettings } from "@/components/settings/interval-recognition-settings";
import { ChordRecognitionSettings } from "@/components/settings/chord-recognition-settings";

export const SETTINGS_TABS = [
  {
    key: "general",
    label: "Shared",
    component: <GeneralSettings />,
  },
  {
    key: "intervals",
    label: "Intervals",
    component: <IntervalSettings />,
  },
  {
    key: "chords",
    label: "Chords",
    component: <ChordSettings />,
  },
  {
    key: "scales",
    label: "Scales",
    component: <ScaleSettings />,
  },
  {
    key: "interval-recognition",
    label: (
      <>
        Interval
        <br />
        recognition
      </>
    ),
    component: <IntervalRecognitionSettings />,
  },
  {
    key: "chord-recognition",
    label: (
      <>
        Chord
        <br />
        recognition
      </>
    ),
    component: <ChordRecognitionSettings />,
  },
] as const;
export type SettingsTab = (typeof SETTINGS_TABS)[number]["key"];
