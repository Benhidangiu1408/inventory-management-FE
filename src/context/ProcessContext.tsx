"use client";

import { PROCESS_MAP } from "@/constants/constants";
import { usePathname } from "next/navigation";
import { createContext, useContext, useState } from "react";

export type ProcessContextType = {
  process: string;
  setProcess: (process: string) => void;
  processOrder: number;
  setProcessOrder: (processOrder: number) => void;
};

export const ProcessContext = createContext<ProcessContextType | undefined>(
  undefined,
);

export function ProcessProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const initialProcess = segments[segments.length - 1];

  const [process, setProcess] = useState(initialProcess ?? "quantity-check");
  const [processOrder, setProcessOrder] = useState(
    PROCESS_MAP[initialProcess as keyof typeof PROCESS_MAP] ?? 1,
  );

  return (
    <ProcessContext.Provider
      value={{ process, setProcess, processOrder, setProcessOrder }}
    >
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
