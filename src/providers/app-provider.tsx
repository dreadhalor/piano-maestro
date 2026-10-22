import { createContext, useCallback, useEffect, useState } from "react";

const PRACTICE_MODES = [
  "playground",
  "note",
  "interval",
  "chord",
  "scale",
  "progression",
  "ear-training",
  "interval-recognition",
  "chord-recognition",
] as const;

export type PracticeMode = (typeof PRACTICE_MODES)[number];

const DEFAULT_MODE: PracticeMode = "playground";

type AppContextType = {
  mode: PracticeMode;
  setMode: (mode: PracticeMode) => void;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

// Each mode lives at its own subroute (e.g. /piano-maestro/chord) so a refresh
// or a shared link lands on the same mode. GitHub Pages serves 404.html (a copy
// of index.html, see the deploy script) for these paths.
const BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, "");

const pathForMode = (mode: PracticeMode) => `${BASE_PATH}/${mode}`;

const isPracticeMode = (value: string): value is PracticeMode =>
  (PRACTICE_MODES as readonly string[]).includes(value);

const modeFromPath = (): PracticeMode | null => {
  const route = window.location.pathname
    .slice(BASE_PATH.length)
    .replace(/^\/|\/$/g, "");
  return isPracticeMode(route) ? route : null;
};

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setModeState] = useState<PracticeMode>(
    () => modeFromPath() ?? DEFAULT_MODE,
  );

  // Normalize the root (or an unknown route) to the current mode's subroute
  useEffect(() => {
    if (!modeFromPath()) {
      window.history.replaceState(null, "", pathForMode(mode));
    }
    // Only on first load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Back/forward buttons move between modes
  useEffect(() => {
    const onPopState = () => setModeState(modeFromPath() ?? DEFAULT_MODE);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const setMode = useCallback((next: PracticeMode) => {
    setModeState(next);
    if (modeFromPath() !== next) {
      window.history.pushState(null, "", pathForMode(next));
    }
  }, []);

  return (
    <AppContext.Provider value={{ mode, setMode }}>
      {children}
    </AppContext.Provider>
  );
};
