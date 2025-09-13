import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPen } from "@fortawesome/free-solid-svg-icons";
import {
  PaginationContent,
  PaginationPrevious,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  Pagination,
} from "../ui/pagination";
import Link from "next/link";

interface ListProps {
  type: "import" | "export";
}

export default function List({ type }: ListProps) {
  interface ImportData {
    batchNumber: string;
    date: string;
    supplier: string;
    createdBy: string;
    totalQuantity: number;
    totalValue: number;
    status: string;
    actions?: ReactNode;
  }

  interface ExportData {
    batchNumber: string;
    date: string;
    warehouse: string;
    receiver: string;
    createdBy: string;
    totalQuantity: number;
    totalValue: number;
    status: string;
    actions?: ReactNode;
  }

  const tableHeaderForExport = [
    {
      label: "Batch Number",
      key: "batchNumber",
    },
    {
      label: "Date",
      key: "date",
    },
    {
      label: "Warehouse",
      key: "warehouse",
    },
    {
      label: "Receiver",
      key: "receiver",
    },
    {
      label: "Created By",
      key: "createdBy",
    },
    {
      label: "Total Quantity",
      key: "totalQuantity",
    },
    {
      label: "Total Value",
      key: "totalValue",
    },
    {
      label: "Status",
      key: "status",
    },
    {
      label: "Actions",
      key: "actions",
    },
  ];

  const tableHeaderForImport = [
    {
      label: "Batch Number",
      key: "batchNumber",
    },

    {
      label: "Date",
      key: "date",
    },
    {
      label: "Supplier",
      key: "supplier",
    },
    {
      label: "Created By",
      key: "createdBy",
    },
    {
      label: "Total Quantity",
      key: "totalQuantity",
    },
    {
      label: "Total Value",
      key: "totalValue",
    },
    {
      label: "Status",
      key: "status",
    },
    {
      label: "Actions",
      key: "actions",
    },
  ];

  const tableImportData: ImportData[] = [
    {
      batchNumber: "1234567891",
      date: "2025-01-01",
      supplier: "Supplier 1",
      createdBy: "John Doe",
      totalQuantity: 100,
      totalValue: 10000,
      status: "Active",
    },
    {
      batchNumber: "1234567892",
      date: "2025-01-01",
      supplier: "Supplier 1",
      createdBy: "John Doe",
      totalQuantity: 100,
      totalValue: 10000,
      status: "Pending",
    },
    {
      batchNumber: "1234567893",
      date: "2025-01-01",
      supplier: "Supplier 1",
      createdBy: "John Doe",
      totalQuantity: 100,
      totalValue: 10000,
      status: "Pending",
    },
  ];

  const tableExportData: ExportData[] = [
    {
      batchNumber: "1234567891",
      date: "2025-01-01",
      warehouse: "Warehouse 1",
      receiver: "Receiver 1",
      createdBy: "John Doe",
      totalQuantity: 100,
      totalValue: 10000,
      status: "Pending",
    },
    {
      batchNumber: "1234567892",
      date: "2025-01-01",
      warehouse: "Warehouse 1",
      receiver: "Receiver 1",
      createdBy: "John Doe",
      totalQuantity: 100,
      totalValue: 10000,
      status: "Pending",
    },
    {
      batchNumber: "1234567893",
      date: "2025-01-01",
      warehouse: "Warehouse 1",
      receiver: "Receiver 1",
      createdBy: "John Doe",
      totalQuantity: 100,
      totalValue: 10000,
      status: "Pending",
    },
  ];

  return (
    <div className="p-6">
      <Table className="mb-6">
        {/* Table Header */}
        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
          <TableRow>
            {type === "import"
              ? tableHeaderForImport.map((header) => (
                  <TableCell
                    isHeader
                    key={header.key}
                    className="text-theme-sm px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                  >
                    {header.label}
                  </TableCell>
                ))
              : tableHeaderForExport.map((header) => (
                  <TableCell
                    isHeader
                    key={header.key}
                    className="text-theme-sm px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                  >
                    {header.label}
                  </TableCell>
                ))}
          </TableRow>
        </TableHeader>
        {/* Table Body */}
        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
          {type === "import"
            ? tableImportData.map((order) => (
                <TableRow key={order.batchNumber}>
                  <TableCell className="px-5 py-4 text-start sm:px-6">
                    {order.batchNumber}
                  </TableCell>
                  <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                    {order.date}
                  </TableCell>
                  <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                    {order.supplier}
                  </TableCell>
                  <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                    {order.createdBy}
                  </TableCell>
                  <TableCell className="text-theme-sm px-4 py-3 text-gray-500 dark:text-gray-400">
                    {order.totalQuantity}
                  </TableCell>
                  <TableCell className="text-theme-sm px-4 py-3 text-gray-500 dark:text-gray-400">
                    {order.totalValue}
                  </TableCell>
                  <TableCell className="text-theme-sm px-4 py-3 text-gray-500 dark:text-gray-400">
                    {order.status}
                  </TableCell>
                  <TableCell className="text-theme-sm px-4 py-3 text-gray-500 dark:text-gray-400">
                    <div className="flex gap-3">
                      <Link href={`/import/${order.batchNumber}`}>
                        <FontAwesomeIcon
                          icon={faEye}
                          className="cursor-pointer hover:text-blue-500"
                        />
                      </Link>
                      <FontAwesomeIcon
                        icon={faPen}
                        className="cursor-pointer"
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            : tableExportData.map((order) => (
                <TableRow key={order.batchNumber}>
                  <TableCell className="px-5 py-4 text-start sm:px-6">
                    {order.batchNumber}
                  </TableCell>
                  <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                    {order.date}
                  </TableCell>
                  <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                    {order.warehouse}
                  </TableCell>
                  <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                    {order.receiver}
                  </TableCell>
                  <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                    {order.createdBy}
                  </TableCell>
                  <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                    {order.totalQuantity}
                  </TableCell>
                  <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                    {order.totalValue}
                  </TableCell>
                  <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                    {order.status}
                  </TableCell>
                  <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                    <div className="flex gap-3">
                      <Link href={`/export/${order.batchNumber}`}>
                        <FontAwesomeIcon
                          icon={faEye}
                          className="cursor-pointer hover:text-blue-500"
                        />
                      </Link>
                      <FontAwesomeIcon
                        icon={faPen}
                        className="cursor-pointer"
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
