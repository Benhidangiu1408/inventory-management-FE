"use client";

import { useProcessContext } from "@/context/ProcessContext";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ProcessPagination() {
  const params = useParams<{ type: string; id: string }>();
  const { type, id } = params;
  const { process, setProcess } = useProcessContext();
  const pathname = usePathname();

  useEffect(() => {
    const segments = pathname.split("/").filter(Boolean);
    const currentStep = segments[segments.length - 1];
    if (currentStep && currentStep !== process) {
      setProcess(currentStep);
    }
  }, [pathname, process, setProcess]);

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
          const isActive = item.value === process;
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
