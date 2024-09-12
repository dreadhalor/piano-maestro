import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app.tsx";
import { AppProvider } from "@/providers/app-provider.tsx";
import { SettingsProvider } from "@/providers/settings-provider.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProvider>
      <SettingsProvider>
        <App />
      </SettingsProvider>
    </AppProvider>
  </StrictMode>,
);
