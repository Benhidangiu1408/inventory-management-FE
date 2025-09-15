import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { TableProps } from "@/interfaces/interface.table";

export default function CustomTable<T>({ columns, data }: TableProps<T>) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column, index) => (
            <TableCell
              isHeader
              className="text-theme-sm px-5 py-3 text-start font-medium dark:text-gray-400"
              key={index}
            >
              {column.header}
            </TableCell>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
        {data.map((item, index) => (
          <TableRow key={index}>
            {columns.map((column, index) => (
              <TableCell
                key={index}
                className="text-theme-sm px-5 py-3 text-start text-gray-500 dark:text-gray-400"
              >
                {column.render
                  ? column.render(item[column.key], item)
                  : String(item[column.key])}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
