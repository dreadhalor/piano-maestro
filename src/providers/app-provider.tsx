import { createContext, useState } from "react";

export type PracticeMode = "playground" | "chord" | "note" | "progression";

type AppContextType = {
  mode: PracticeMode;
  setMode: (mode: PracticeMode) => void;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<PracticeMode>("playground");

  return (
    <AppContext.Provider value={{ mode, setMode }}>
      {children}
    </AppContext.Provider>
  );
};
