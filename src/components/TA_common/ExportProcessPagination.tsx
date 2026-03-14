"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function ExportProcessPagination() {
  const params = useParams<{ type: string; id: string; step: string }>();
  const { type, id, step } = params;

  const processList: { label: string; value: string }[] = [
    {
      label: "Quantity Check",
      value: "quantity-check",
    },
    {
      label: "Confirm",
      value: "confirm",
    },
  ];

  return (
    <div>
      <div className="my-3 flex w-full items-center justify-center gap-3">
        {processList.map((item) => {
          const isActive = item.value === step;
          const baseClasses =
            "shadow-theme-xs flex h-10 items-center justify-center rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]";
          const stateClasses = isActive
            ? " bg-brand-500 text-white cursor-default pointer-events-none"
            : " bg-white";

          if (isActive) {
            return (
              <span
                key={item.value}
                aria-disabled
                className={baseClasses + stateClasses}
              >
                {item.label}
              </span>
            );
          }

          return (
            <Link
              key={item.value}
              href={`/export/process/${type}/${id}/${item.value}`}
              className={baseClasses + stateClasses}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
