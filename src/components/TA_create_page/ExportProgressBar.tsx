"use client";

import { EXPORT_PROCESS_MAP } from "@/constants/constants";

export const ExportProgressBarItem = ({
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

export default function ExportProgressBar({
  step,
}: {
  step: "quantity-check" | "confirm";
}) {
  const currentOrder = EXPORT_PROCESS_MAP[step];

  return (
    <div className="flex gap-6 rounded-2xl border border-gray-200 bg-white px-6 py-5">
      {Object.entries(EXPORT_PROCESS_MAP).map(([key, value], index) => (
        <ExportProgressBarItem
          key={index}
          process={step}
          value={key}
          order={value}
          currentOrder={currentOrder}
        />
      ))}
    </div>
  );
}
