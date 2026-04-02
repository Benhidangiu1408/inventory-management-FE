"use client";

import {
  PROCESS_MAP,
  PROCESS_MAP_WITHOUT_MAPPING,
} from "@/constants/constants";
import { useImport } from "@/context/ImportContext";
import { ImportSheetType } from "@/interfaces/inboundOutboundType";

export const ProgressBarItem = ({
  process,
  value,
  order,
  currentOrder,
}: {
  process: string;
  value: string;
  order: number;
  currentOrder: number;
}) => {
  return (
    <div
      className={`flex-1 rounded-2xl py-2 text-center text-base text-white capitalize ${order < currentOrder ? "bg-green-500" : process === value ? "bg-brand-500" : "bg-gray-500"}`}
    >
      {value.replaceAll("-", " ")}
    </div>
  );
};

export default function ProgressBar({
  step,
}: {
  step:
    | "product-mapping"
    | "quantity-check"
    | "quality-check"
    | "storage-location";
}) {
  const { importData } = useImport();

  const currentOrder =
    importData.type !== ImportSheetType.EXTERNAL_SUPPLIER
      ? PROCESS_MAP_WITHOUT_MAPPING[
          step as "quantity-check" | "quality-check" | "storage-location"
        ]
      : PROCESS_MAP[step];

  let PROCESS = {};

  if (importData.type !== ImportSheetType.EXTERNAL_SUPPLIER) {
    PROCESS = PROCESS_MAP_WITHOUT_MAPPING;
  } else {
    PROCESS = PROCESS_MAP;
  }

  return (
    <div className="flex gap-6 rounded-2xl border border-gray-200 bg-white px-6 py-5">
      {Object.entries(PROCESS).map(([key, value], index) => (
        <ProgressBarItem
          key={index}
          process={step}
          value={key}
          order={value as number}
          currentOrder={currentOrder}
        />
      ))}
    </div>
  );
}
