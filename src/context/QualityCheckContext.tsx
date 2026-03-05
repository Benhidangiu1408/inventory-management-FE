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

  useEffect(() => {
    setQCData(initialData);
  }, [initialData]);

  return (
    <QualityCheckContext.Provider value={{ qcData, setQCData }}>
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
