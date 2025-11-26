"use client";

import { PROCESS_MAP } from "@/constants/constants";
import { useProcessContext } from "@/context/ProcessContext";

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

export default function ProgressBar() {
  const { process, processOrder } = useProcessContext();

  // const processList = [
  //   {
  //     label: "Quantity Check",
  //     value: "quantity-check",
  //     order: 1,
  //   },
  //   {
  //     label: "Quality Check",
  //     value: "quality-check",
  //     order: 2,
  //   },
  //   {
  //     label: "Storage Location",
  //     value: "storage-location",
  //     order: 3,
  //   },
  // ];

  return (
    <div className="flex gap-6 rounded-2xl border border-gray-200 px-6 py-5">
      {Object.entries(PROCESS_MAP).map(([key, value], index) => (
        <ProgressBarItem
          key={index}
          process={process}
          value={key}
          order={value}
          currentOrder={processOrder}
        />
      ))}
      {/* {processList.map((item) => (
        <ProgressBarItem
          key={item.value}
          process={process}
          label={item.label}
          value={item.value}
          order={item.order}
          currentOrder={processOrder}
        />
      ))} */}
    </div>
  );
}
