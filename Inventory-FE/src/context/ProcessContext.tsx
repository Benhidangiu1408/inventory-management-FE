"use client";

import { createContext, useContext, useState } from "react";

export type ProcessContextType = {
  process: string;
  setProcess: (process: string) => void;
};

export const ProcessContext = createContext<ProcessContextType | undefined>(
  undefined,
);

export function ProcessProvider({ children }: { children: React.ReactNode }) {
  const [process, setProcess] = useState("quantity-check");

  return (
    <ProcessContext.Provider value={{ process, setProcess }}>
      {children}
    </ProcessContext.Provider>
  );
}

export function useProcessContext() {
  const ctx = useContext(ProcessContext);
  if (!ctx) {
    throw new Error("useProcess must be used inside <ProcessProvider>");
  }
  return ctx;
}
