import { createContext, useContext, useState } from "react";

export type PracticeMode = "chord" | "note" | "playground";

type AppContextType = {
  mode: PracticeMode;
  setMode: (mode: PracticeMode) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<PracticeMode>("chord");

  return (
    <AppContext.Provider value={{ mode, setMode }}>
      {children}
    </AppContext.Provider>
  );
};
