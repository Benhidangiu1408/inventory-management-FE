"use client";

import { ExportSheetResponse } from "@/interfaces/inboundOutboundType";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface ExportContextType {
  exportData: ExportSheetResponse;
  setExportData: React.Dispatch<React.SetStateAction<ExportSheetResponse>>;
}

const ExportContext = createContext<ExportContextType | undefined>(undefined);

export function ExportProvider({
  children,
  initialData,
}: {
  children: ReactNode;
  initialData: ExportSheetResponse;
}) {
  const [exportData, setExportData] = useState(initialData);

  useEffect(() => {
    setExportData(initialData);
  }, [initialData]);

  return (
    <ExportContext.Provider value={{ exportData, setExportData }}>
      {children}
    </ExportContext.Provider>
  );
}

export function useExport() {
  const context = useContext(ExportContext);

  if (!context) {
    throw new Error("useExport must be used inside ExportProvider");
  }

  return context;
}
