"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPen } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { ExportRow, ImportRow } from "@/interfaces/interface.table";
import CustomizableTable, {
  Column,
} from "../../components/table/CustomizableTable";

interface ListProps {
  type: "import" | "export";
}

const ActionsButton = ({
  item,
  type,
  processType,
}: {
  item: ExportRow | ImportRow;
  type: "import" | "export";
  processType: string;
}) => {
  return (
    <div className="flex justify-center gap-3">
      <Link href={`/${type}/details/${item.batchId}`}>
        <FontAwesomeIcon
          icon={faEye}
          className="cursor-pointer hover:text-blue-500"
        />
      </Link>
      <Link
        href={`/${type}/process/${processType}/${item.batchId}/${type === "import" ? "quantity-check" : "confirm"}`}
      >
        <FontAwesomeIcon icon={faPen} className="cursor-pointer" />
      </Link>
    </div>
  );
};

export default function List({ type }: ListProps) {
  const tableHeaderForExport: Column<ExportRow>[] = [
    {
      key: "batchId",
      label: "Batch Number",
    },
    {
      key: "date",
      label: "Date",
    },
    {
      key: "type",
      label: "Type",
      render: (value: ExportRow[keyof ExportRow]) => {
        if (typeof value === "string") {
          const formattedValue = value.replace("-", " ");
          return <span className="capitalize">{formattedValue}</span>;
        }
      },
    },
    {
      key: "warehouse",
      label: "Warehouse",
    },
    {
      key: "receiver",
      label: "Receiver",
    },
    {
      key: "createdBy",
      label: "Created By",
    },
    {
      key: "totalQuantity",
      label: "Total Quantity",
    },
    {
      key: "totalValue",
      label: "Total Value",
    },
    {
      key: "status",
      label: "Status",
    },
    {
      key: "actions",
      label: "Actions",
      render: (value: ExportRow[keyof ExportRow], row: ExportRow) => (
        <ActionsButton processType={row.type} item={row} type="export" />
      ),
    },
  ];

  const tableHeaderForImport: Column<ImportRow>[] = [
    {
      label: "Batch Number",
      key: "batchId",
    },

    {
      label: "Date",
      key: "date",
    },
    {
      label: "Type",
      key: "type",
      render: (value: ImportRow[keyof ImportRow]) => {
        if (typeof value === "string") {
          const formattedValue = value.replace("-", " ");

          return <span className="capitalize">{formattedValue}</span>;
        }
      },
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
      render: (value: ImportRow[keyof ImportRow], row: ImportRow) => (
        <ActionsButton processType={row.type} item={row} type="import" />
      ),
    },
  ];

  const tableImportData: ImportRow[] = [
    {
      batchId: "1234567891",
      date: "2025-01-01",
      type: "manufacturer",
      createdBy: "John Doe",
      totalQuantity: 100,
      totalValue: 10000,
      status: "Active",
    },
    {
      batchId: "1234567892",
      date: "2025-01-01",
      type: "manufacturer",
      createdBy: "John Doe",
      totalQuantity: 100,
      totalValue: 10000,
      status: "Pending",
    },
    {
      batchId: "1234567893",
      date: "2025-01-01",
      type: "purchase-order",
      createdBy: "John Doe",
      totalQuantity: 100,
      totalValue: 10000,
      status: "Pending",
    },
  ];

  const tableExportData: ExportRow[] = [
    {
      batchId: "1234567891",
      date: "2025-01-01",
      type: "manufacturer",
      warehouse: "Warehouse 1",
      receiver: "Receiver 1",
      createdBy: "John Doe",
      totalQuantity: 100,
      totalValue: 10000,
      status: "Pending",
    },
    {
      batchId: "1234567892",
      date: "2025-01-01",
      type: "manufacturer",
      warehouse: "Warehouse 1",
      receiver: "Receiver 1",
      createdBy: "John Doe",
      totalQuantity: 100,
      totalValue: 10000,
      status: "Pending",
    },
    {
      batchId: "1234567893",
      date: "2025-01-01",
      type: "purchase-order",
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
      {type === "import" ? (
        <CustomizableTable<ImportRow>
          headers={tableHeaderForImport}
          data={tableImportData}
        />
      ) : (
        <CustomizableTable<ExportRow>
          headers={tableHeaderForExport}
          data={tableExportData}
        />
      )}

      {/* <InfoPagination totalPages={10} /> */}
    </div>
  );
}
