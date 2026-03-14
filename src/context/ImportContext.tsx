"use client";

import { ImportSheetResponse } from "@/interfaces/inboundOutboundType";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface ImportContextType {
  importData: ImportSheetResponse;
  setImportData: React.Dispatch<React.SetStateAction<ImportSheetResponse>>;
}

const ImportContext = createContext<ImportContextType | undefined>(undefined);

export function ImportProvider({
  children,
  initialData,
}: {
  children: ReactNode;
  initialData: ImportSheetResponse;
}) {
  const [importData, setImportData] = useState(initialData);

  useEffect(() => {
    setImportData(initialData);
  }, [initialData]);

  return (
    <ImportContext.Provider value={{ importData, setImportData }}>
      {children}
    </ImportContext.Provider>
  );
}

export function useImport() {
  const context = useContext(ImportContext);

  if (!context) {
    throw new Error("useImport must be used inside ImportContextProvider");
  }

  return context;
}
