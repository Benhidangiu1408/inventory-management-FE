import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPen } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { Column, ExportRow, ImportRow } from "@/interfaces/interface.table";
import CustomTable from "../TA_common/CustomTable";
import InfoPagination from "../TA_create_page/InfoPagination";

interface ListProps {
  type: "import" | "export";
}

const ActionsButton = ({
  item,
  type,
}: {
  item: ExportRow | ImportRow;
  type: "import" | "export";
}) => {
  return (
    <div className="flex gap-3">
      <Link href={`/${type}/details/${item.batchId}`}>
        <FontAwesomeIcon
          icon={faEye}
          className="cursor-pointer hover:text-blue-500"
        />
      </Link>
      <FontAwesomeIcon icon={faPen} className="cursor-pointer" />
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
        <ActionsButton item={row} type="export" />
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
      header: "Supplier",
      key: "supplier",
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
        <ActionsButton item={row} type="import" />
      ),
    },
  ];

  const tableImportData: ImportRow[] = [
    {
      batchId: "1234567891",
      date: "2025-01-01",
      supplier: "Supplier 1",
      createdBy: "John Doe",
      totalQuantity: 100,
      totalValue: 10000,
      status: "Active",
    },
    {
      batchId: "1234567892",
      date: "2025-01-01",
      supplier: "Supplier 1",
      createdBy: "John Doe",
      totalQuantity: 100,
      totalValue: 10000,
      status: "Pending",
    },
    {
      batchId: "1234567893",
      date: "2025-01-01",
      supplier: "Supplier 1",
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
