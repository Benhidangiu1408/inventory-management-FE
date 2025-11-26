"use client";

import CustomizableTable, {
  TableProps,
} from "../../components/table/CustomizableTable";

export default function TableBox<T extends object>({
  title,
  table,
}: {
  title: string;
  table: TableProps<T>;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <h2 className="mb-3 font-medium">{title}</h2>
      <CustomizableTable<T> {...table} />
    </div>
  );
}
