"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPen } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExportRow, ImportRow } from "@/interfaces/interface.table";
import CustomizableTable, { Column } from "../table/CustomizableTable";
import {
  ImportSheetResponse,
  PageResponse,
} from "@/interfaces/inboundOutboundType";
import { format } from "date-fns";

interface ListProps {
  type: "import" | "export";
  data?: PageResponse<ImportSheetResponse>;
}

const ActionsButton = ({
  item,
  type,
  processType,
  requestStatus,
}: {
  item: ExportRow | ImportRow;
  type: "import" | "export";
  processType: string;
  requestStatus?: string;
}) => {
  const getEditLink = () => {
    // For import, use id; for export, use batchId
    const identifier =
      type === "import" ? (item as ImportRow).id : (item as ExportRow).batchId;

    // Check requestStatus for both import and export
    if (requestStatus && type === "export") {
      console.log("Hello");
      // if (requestStatus === "REQUEST") {
      //   return `/${type}/request/${identifier}`;
      // } else if (requestStatus === "PROCESSING") {
      //   if (type === "import") {
      //     return `/${type}/process/${processType}/${identifier}/quantity-check`;
      //   } else {
      //     return `/${type}/process/${processType}/${identifier}/confirm`;
      //   }
      // }
    }
    // Default behavior
    return `/${type}/process/${processType.toLowerCase()}/${identifier}/${type === "import" ? "quantity-check" : "confirm"}`;
  };

  return (
    <div className="flex justify-center gap-3">
      <Link
        href={`/${type}/details/${
          type === "import"
            ? (item as ImportRow).id
            : (item as ExportRow).batchId
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

const RequestStatusCell = ({
  requestStatus,
  batchId,
  importType,
  listType,
}: {
  requestStatus: string;
  batchId: string;
  importType: string;
  listType: "import" | "export";
}) => {
  const router = useRouter();

  const handleRequestStatusClick = () => {
    if (requestStatus === "REQUEST") {
      router.push(`/${listType}/request/${batchId}`);
    } else if (requestStatus === "PROCESSING") {
      if (listType === "import") {
        router.push(
          `/${listType}/process/${importType.toLowerCase()}/${batchId}/quantity-check`,
        );
      } else {
        router.push(
          `/${listType}/process/${importType.toLowerCase()}/${batchId}/confirm`,
        );
      }
    }
  };

  const getRequestStatusColor = () => {
    if (requestStatus === "REQUEST") {
      return "text-blue-600 hover:text-blue-800 cursor-pointer underline";
    } else if (requestStatus === "PROCESSING") {
      return "text-orange-600 hover:text-orange-800 cursor-pointer underline";
    }
    return "";
  };

  const isClickable =
    requestStatus === "REQUEST" || requestStatus === "PROCESSING";

  return (
    <span
      className={isClickable ? getRequestStatusColor() : ""}
      onClick={isClickable ? handleRequestStatusClick : undefined}
    >
      {requestStatus}
    </span>
  );
};

export default function List({ type, data }: ListProps) {
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
      key: "requestStatus",
      label: "Request Status",
      render: (value: ExportRow[keyof ExportRow], row: ExportRow) => {
        if (value && typeof value === "string") {
          return (
            <RequestStatusCell
              requestStatus={value}
              batchId={row.batchId}
              importType={row.type}
              listType="export"
            />
          );
        }
        return <span>-</span>;
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
        <ActionsButton
          processType={row.type}
          item={row}
          type="export"
          requestStatus={row.requestStatus}
        />
      ),
    },
  ];

  const tableHeaderForImport: Column<ImportRow>[] = [
    {
      label: "ID",
      key: "id",
    },
    {
      label: "Status",
      key: "status",
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

  // const tableImportData: ImportRow[] = [
  //   {
  //     batchId: "1234567891",
  //     date: "2025-01-01",
  //     type: "manufacturer",
  //     requestStatus: "PROCESSING",
  //     createdBy: "John Doe",
  //     totalQuantity: 100,
  //     totalValue: 10000,
  //     status: "Active",
  //   },
  //   {
  //     batchId: "1234567892",
  //     date: "2025-01-01",
  //     type: "purchase-order",
  //     requestStatus: "REQUEST",
  //     createdBy: "John Doe",
  //     totalQuantity: 100,
  //     totalValue: 10000,
  //     status: "Active",
  //   },
  //   {
  //     batchId: "1234567893",
  //     date: "2025-01-01",
  //     type: "purchase-order",
  //     requestStatus: "PROCESSING",
  //     createdBy: "John Doe",
  //     totalQuantity: 100,
  //     totalValue: 10000,
  //     status: "Active",
  //   },
  //   {
  //     batchId: "1234567894",
  //     date: "2025-01-02",
  //     type: "transfer",
  //     requestStatus: "REQUEST",
  //     createdBy: "Jane Smith",
  //     totalQuantity: 150,
  //     totalValue: 15000,
  //     status: "Inactive",
  //   },
  //   {
  //     batchId: "1234567895",
  //     date: "2025-01-03",
  //     type: "purchase-order",
  //     requestStatus: "PROCESSING",
  //     createdBy: "Jane Smith",
  //     totalQuantity: 200,
  //     totalValue: 20000,
  //     status: "Active",
  //   },
  // ];

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

  const tableExportData: ExportRow[] = [
    {
      batchId: "1234567891",
      date: "2025-01-01",
      type: "manufacturer",
      requestStatus: "PROCESSING",
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
      requestStatus: "REQUEST",
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
      requestStatus: "PROCESSING",
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
          data={fetchedImportData}
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
