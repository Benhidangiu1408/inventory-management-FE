import { TableProps } from "@/interfaces/interface.table";
import CustomTable from "./CustomTable";

export default function TableBox<T>({
  title,
  table,
}: {
  title: string;
  table: TableProps<T>;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 p-6">
      <h2 className="mb-3 font-medium">{title}</h2>
      <CustomTable<T> {...table} />
    </div>
  );
}
