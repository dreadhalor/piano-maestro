import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppProvider } from "@/providers/app-provider";
import { SettingsProvider } from "@/providers/settings-provider";
import { SoundProvider } from "./providers/sound-provider";
import { MIDIProvider } from "./providers/midi-provider";
import { App } from "./app";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MIDIProvider>
      <SoundProvider>
        <AppProvider>
          <SettingsProvider>
            <App />
          </SettingsProvider>
        </AppProvider>
      </SoundProvider>
    </MIDIProvider>
  </StrictMode>,
);
