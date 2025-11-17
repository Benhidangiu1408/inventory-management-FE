"use client";

import { ReactNode } from "react";

interface InfoBoxProps {
  icon: ReactNode;
  title: string;
  description?: string;
  children: ReactNode;
  modal?: ReactNode;
}

export default function InfoBox({
  icon,
  title,
  description = "",
  children,
  modal,
}: InfoBoxProps) {
  return (
    <div className="rounded-2xl border border-gray-200">
      <div className="border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between gap-3 text-lg font-bold">
          <div className="flex items-center gap-3">
            {icon}
            <h2>{title}</h2>
          </div>
          {modal}
        </div>
        {description && (
          <div className="mt-2 text-sm text-gray-500">{description}</div>
        )}
      </div>
      {children}
    </div>
  );
}
