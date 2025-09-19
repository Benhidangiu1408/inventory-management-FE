import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { ReactNode } from "react";

export interface Column<T> {
  label: string; // header text
  key: keyof T; // which field to read
  render?: (value: T[keyof T], row: T) => ReactNode; // optional custom cell renderer
}

export interface TableProps<T> {
  headers: Column<T>[];
  data: T[];
}

export default function CustomizableTable<T>({ headers, data }: TableProps<T>) {
  return (
    <div className="overflow-auto p-6">
      <Table className="mb-6">
        {/* Table Header */}
        <TableHeader className="border-y border-t border-gray-100 bg-gray-50 px-6 py-3.5 dark:border-white/[0.05] dark:bg-gray-900">
          <TableRow>
            {headers.map((h) => (
              <TableCell
                isHeader
                key={String(h.key)}
                className="text-theme-sm px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
              >
                {h.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHeader>
        {/* Table Body */}
        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
          {data.map((row, i) => (
            <TableRow key={i}>
              {headers.map((h) => (
                <TableCell
                  key={String(h.key)}
                  className="text-theme-sm px-4 py-3 text-gray-500 dark:text-gray-400"
                >
                  {h.render ? h.render(row[h.key], row) : String(row[h.key])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
