"use client";

import { QCSheetResponse } from "@/interfaces/inboundOutboundType";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface QualityCheckContextType {
  qcData: QCSheetResponse | null;
  setQCData: React.Dispatch<React.SetStateAction<QCSheetResponse | null>>;
  isDirty: boolean;
  setIsDirty: React.Dispatch<React.SetStateAction<boolean>>;
}

const QualityCheckContext = createContext<QualityCheckContextType | undefined>(
  undefined,
);

export function QualityCheckProvider({
  children,
  initialData,
}: {
  children: ReactNode;
  initialData: QCSheetResponse | null;
}) {
  const [qcData, setQCData] = useState(initialData);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setQCData(initialData);
    setIsDirty(false);
  }, [initialData]);

  return (
    <QualityCheckContext.Provider value={{ qcData, setQCData, isDirty, setIsDirty }}>
      {children}
    </QualityCheckContext.Provider>
  );
}

export function useQualityCheck() {
  const context = useContext(QualityCheckContext);

  if (!context) {
    throw new Error(
      "useQualityCheck must be used inside QualityCheckContextProvider",
    );
  }

  return context;
}
