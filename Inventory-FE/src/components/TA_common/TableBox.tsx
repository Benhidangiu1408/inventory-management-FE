import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { TableBoxProps } from "@/interfaces/interface.table";
import Badge from "../ui/badge/Badge";

export default function TableBox({ title, headers, data }: TableBoxProps) {
  return (
    <div className="rounded-2xl border border-gray-200 p-6">
      <h2 className="mb-3 font-medium">{title}</h2>
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((header) => (
              <TableCell
                isHeader
                className="text-theme-sm px-5 py-3 text-start font-medium dark:text-gray-400"
                key={header}
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
          {data.map((item) => (
            <TableRow key={item.batchId}>
              {Object.entries(item).map(([key, value]) => {
                if (key === "qcResult")
                  return (
                    <TableCell
                      key={key}
                      className="text-theme-sm px-5 py-3 text-start text-gray-500 dark:text-gray-400"
                    >
                      <Badge color={value === "Pass" ? "success" : "error"}>
                        {value}
                      </Badge>
                    </TableCell>
                  );
                return (
                  <TableCell
                    className="text-theme-sm px-5 py-3 text-start text-gray-500 dark:text-gray-400"
                    key={key}
                  >
                    {value}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
