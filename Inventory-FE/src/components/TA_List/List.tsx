import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPen } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { Column, ExportRow, ImportRow } from "@/interfaces/interface.table";
import CustomTable from "@/components/TA_common/CustomTable";
import InfoPagination from "@/components/TA_create_page/InfoPagination";

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
    <div className="flex gap-3">
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
      header: "Batch Number",
    },
    {
      key: "date",
      header: "Date",
    },
    {
      key: "type",
      header: "Type",
      render: (value: ExportRow[keyof ExportRow]) => {
        if (typeof value === "string") {
          const formattedValue = value.replace("-", " ");
          return <span className="capitalize">{formattedValue}</span>;
        }
      },
    },
    {
      key: "warehouse",
      header: "Warehouse",
    },
    {
      header: "Receiver",
      key: "receiver",
    },
    {
      header: "Created By",
      key: "createdBy",
    },
    {
      header: "Total Quantity",
      key: "totalQuantity",
    },
    {
      header: "Total Value",
      key: "totalValue",
    },
    {
      header: "Status",
      key: "status",
    },
    {
      header: "Actions",
      key: "actions",
      render: (value: ExportRow[keyof ExportRow], row: ExportRow) => (
        <ActionsButton processType={row.type} item={row} type="export" />
      ),
    },
  ];

  const tableHeaderForImport: Column<ImportRow>[] = [
    {
      header: "Batch Number",
      key: "batchId",
    },

    {
      header: "Date",
      key: "date",
    },
    {
      header: "Type",
      key: "type",
      render: (value: ImportRow[keyof ImportRow]) => {
        if (typeof value === "string") {
          const formattedValue = value.replace("-", " ");

          return <span className="capitalize">{formattedValue}</span>;
        }
      },
    },
    {
      header: "Created By",
      key: "createdBy",
    },
    {
      header: "Total Quantity",
      key: "totalQuantity",
    },
    {
      header: "Total Value",
      key: "totalValue",
    },
    {
      header: "Status",
      key: "status",
    },
    {
      header: "Actions",
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
        <CustomTable<ImportRow>
          columns={tableHeaderForImport}
          data={tableImportData}
        />
      ) : (
        <CustomTable<ExportRow>
          columns={tableHeaderForExport}
          data={tableExportData}
        />
      )}

      <InfoPagination totalPages={10} />
    </div>
  );
}
