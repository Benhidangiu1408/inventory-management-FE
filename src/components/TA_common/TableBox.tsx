"use client";

import CustomizableTable, { TableProps } from "../table/CustomizableTable";

export default function TableBox<T extends object>({
  title,
  table,
}: {
  title: string;
  table: TableProps<T>;
}) {
  return (
    <div className="default-card p-6">
      <h2 className="mb-3 font-medium">{title}</h2>
      <CustomizableTable<T> {...table} />
    </div>
  );
}
