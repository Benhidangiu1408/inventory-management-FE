"use client";

import { PROCESS_MAP } from "@/constants/constants";

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
  const currentOrder = PROCESS_MAP[step];

  return (
    <div className="flex gap-6 rounded-2xl border border-gray-200 bg-white px-6 py-5">
      {Object.entries(PROCESS_MAP).map(([key, value], index) => (
        <ProgressBarItem
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
