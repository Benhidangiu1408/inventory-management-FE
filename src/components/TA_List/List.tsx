"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPen } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { ExportRow, ImportRow } from "@/interfaces/interface.table";
import CustomizableTable, { Column } from "../table/CustomizableTable";
import {
  ExportSheetResponse,
  ImportSheetResponse,
  PageResponse,
} from "@/interfaces/inboundOutboundType";
import { format } from "date-fns";
import { SheetStatus } from "@/interfaces/inventoryManagementType";
import Badge from "@/default_components/ui/badge/Badge";

interface ListProps {
  type: "import" | "export";
  data?: PageResponse<ImportSheetResponse>;
  exportData?: ExportSheetResponse[];
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
  const getEditLink = () => {
    const identifier =
      type === "import" ? (item as ImportRow).id : (item as ExportRow).id;
    // Cả import và export đều vào bước quantity-check khi bấm Edit
    return `/${type}/process/${processType.toLowerCase()}/${identifier}/quantity-check`;
  };

  return (
    <div className="flex justify-center gap-3">
      <Link
        href={`/${type}/details/${
          type === "import" ? (item as ImportRow).id : (item as ExportRow).id
        }`}
      >
        <FontAwesomeIcon
          icon={faEye}
          className="cursor-pointer hover:text-blue-500"
        />
      </Link>
      <Link href={getEditLink()}>
        <FontAwesomeIcon icon={faPen} className="cursor-pointer" />
      </Link>
    </div>
  );
};

export default function List({ type, data, exportData }: ListProps) {
  const tableHeaderForExport: Column<ExportRow>[] = [
    {
      key: "id",
      label: "Export Sheet ID",
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
    // {
    //   key: "receiver",
    //   label: "Receiver",
    // },
    // {
    //   key: "createdBy",
    //   label: "Created By",
    // },
    // {
    //   key: "totalQuantity",
    //   label: "Total Quantity",
    // },
    // {
    //   key: "totalValue",
    //   label: "Total Value",
    // },
    {
      key: "status",
      label: "Status",
    },
    {
      key: "createdAt",
      label: "Created At",
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
      label: "Import Sheet ID",
      key: "id",
    },
    {
      label: "Status",
      key: "status",
      render: (value) => {
        switch (value) {
          case SheetStatus.CREATED:
            return <Badge color="light">{value}</Badge>;
          case SheetStatus.IN_PROGRESS:
            return <Badge color="warning">{value}</Badge>;
          case SheetStatus.APPROVED:
            return <Badge color="info">{value}</Badge>;
          case SheetStatus.COMPLETED:
            return <Badge color="success">{value}</Badge>;
          default:
            return value;
        }
      },
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
      label: "Created At",
      key: "createdAt",
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
      id: 89,
      status: "CREATED",
      type: "SUPPLIER",
      createdAt: "2026-03-03T14:25:18.423406",
    },
    {
      id: 90,
      status: "CREATED",
      type: "SUPPLIER",
      createdAt: "2026-03-03T15:00:00.000000",
    },
  ];

  const fetchedImportData: ImportRow[] =
    data?.content.map((detaill) => {
      return {
        id: detaill.id,
        status: detaill.status,
        type: detaill.type,
        createdAt: format(detaill.createdAt, "dd/MM/yyyy HH:mm"),
      };
    }) ?? [];

  const fetchdExportData: ExportRow[] = (exportData ?? []).map((item) => ({
    id: item.id,
    type: item.type,
    warehouse: item.warehouse.name,
    status: item.status,
    createdAt: format(item.createdAt, "dd/MM/yyyy HH:mm"),
  }));

  // const tableExportData: ExportRow[] = [
  //   {
  //     batchId: "1234567891",
  //     date: "2025-01-01",
  //     type: "manufacturer",
  //     requestStatus: "PROCESSING",
  //     warehouse: "Warehouse 1",
  //     receiver: "Receiver 1",
  //     createdBy: "John Doe",
  //     totalQuantity: 100,
  //     totalValue: 10000,
  //     status: "Pending",
  //   },
  //   {
  //     batchId: "1234567892",
  //     date: "2025-01-01",
  //     type: "manufacturer",
  //     requestStatus: "REQUEST",
  //     warehouse: "Warehouse 1",
  //     receiver: "Receiver 1",
  //     createdBy: "John Doe",
  //     totalQuantity: 100,
  //     totalValue: 10000,
  //     status: "Pending",
  //   },
  //   {
  //     batchId: "1234567893",
  //     date: "2025-01-01",
  //     type: "purchase-order",
  //     requestStatus: "PROCESSING",
  //     warehouse: "Warehouse 1",
  //     receiver: "Receiver 1",
  //     createdBy: "John Doe",
  //     totalQuantity: 100,
  //     totalValue: 10000,
  //     status: "Pending",
  //   },
  // ];

  return (
    <div className="p-6">
      {type === "import" ? (
        <CustomizableTable<ImportRow>
          headers={tableHeaderForImport}
          data={fetchedImportData}
        />
      ) : (
        <CustomizableTable<ExportRow>
          headers={tableHeaderForExport}
          data={fetchdExportData}
        />
      )}

      {/* <InfoPagination totalPages={10} /> */}
    </div>
  );
}
