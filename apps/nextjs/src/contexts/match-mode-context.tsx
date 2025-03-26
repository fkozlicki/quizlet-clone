"use client";

import type { PropsWithChildren } from "react";
import { createContext, useContext } from "react";

import { useMatchMode } from "~/hooks/use-match-mode";

type MatchModeContextType = ReturnType<typeof useMatchMode>;

const MatchModeContext = createContext<MatchModeContextType | undefined>(
  undefined,
);

const MatchModeProvider = ({
  children,
  id,
}: PropsWithChildren & { id: string }) => {
  const value = useMatchMode(id);

  return (
    <MatchModeContext.Provider value={value}>
      {children}
    </MatchModeContext.Provider>
  );
};

export default MatchModeProvider;

export const useMatchModeContext = () => {
  const context = useContext(MatchModeContext);

  if (!context) {
    throw new Error("Missing MatchModeContext");
  }

  return context;
};
