"use client";

import { useImport } from "@/context/ImportContext";
import { SheetStatus } from "@/interfaces/inventoryManagementType";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ProcessPagination() {
  const params = useParams<{ type: string; id: string; step: string }>();
  const { type, id, step } = params;

  const { importData } = useImport();

  const processList: { label: string; value: string }[] = [
    {
      label: "Quantity Check",
      value: "quantity-check",
    },
    {
      label: "Quality Check",
      value: "quality-check",
    },
    {
      label: "Storage Location",
      value: "storage-location",
    },
  ];

  return (
    <div>
      <div className="my-3 flex w-full items-center justify-center gap-3">
        {processList.map((item) => {
          const isActive = item.value === step;
          const disabledByStatus =
            importData.status === SheetStatus.CREATED
              ? item.value !== "quantity-check"
              : importData.status === SheetStatus.IN_PROGRESS
                ? item.value === "storage-location"
                : importData.status === SheetStatus.APPROVED
                  ? false
                  : false;
          const baseClasses =
            "shadow-theme-xs flex h-10 items-center justify-center rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]";
          const stateClasses = isActive
            ? " bg-brand-500 text-white cursor-default pointer-events-none"
            : disabledByStatus
              ? " bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none"
              : " bg-white";

          if (isActive || disabledByStatus) {
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
              href={`/import/process/${type}/${id}/${item.value}`}
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
