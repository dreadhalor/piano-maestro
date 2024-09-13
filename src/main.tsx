import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app.tsx";
import { AppProvider } from "@/providers/app-provider.tsx";
import { SettingsProvider } from "@/providers/settings-provider.tsx";
import { SoundProvider } from "./providers/sound-provider.tsx";
import "./index.css";
import { MIDIProvider } from "./providers/midi-provider.tsx";

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
