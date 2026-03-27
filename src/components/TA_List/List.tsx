"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowsLeftRight,
  faEye,
  faIndustry,
  faPen,
  faTruck,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { ExportRow, ImportRow } from "@/interfaces/interface.table";
import CustomizableTable, { Column } from "../table/CustomizableTable";
import {
  ExportSheetResponse,
  ImportSheetResponse,
} from "@/interfaces/inboundOutboundType";
import { format } from "date-fns";
import { SheetStatus } from "@/interfaces/inventoryManagementType";
import Badge from "@/default_components/ui/badge/Badge";

interface ListProps {
  type: "import" | "export";
  data?: ImportSheetResponse[];
  exportData?: ExportSheetResponse[];
}

const ActionsButton = ({
  item,
  type,
  processType,
  status,
}: {
  item: ExportRow | ImportRow;
  type: "import" | "export";
  processType: string;
  status: string;
}) => {
  const getEditLink = () => {
    const identifier =
      type === "import" ? (item as ImportRow).id : (item as ExportRow).id;
    // Cả import và export đều vào bước quantity-check khi bấm Edit
    return status === SheetStatus.WAIT_FOR_MAPPING
      ? `/${type}/process/${processType.toLowerCase()}/${identifier}/product-mapping`
      : `/${type}/process/${processType.toLowerCase()}/${identifier}/quantity-check`;
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
          return (
            <Badge
              startIcon={
                <FontAwesomeIcon
                  icon={
                    value === "CUSTOMER"
                      ? faUser
                      : value === "INTERNAL"
                        ? faArrowsLeftRight
                        : faIndustry
                  }
                />
              }
            >
              {formattedValue}
            </Badge>
          );
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
      key: "createdAt",
      label: "Created At",
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row: ExportRow) => (
        <ActionsButton
          status={row.status}
          processType={row.type}
          item={row}
          type="export"
        />
      ),
    },
  ];

  const tableHeaderForImport: Column<ImportRow>[] = [
    {
      label: "Import Sheet ID",
      key: "id",
    },
    {
      label: "Type",
      key: "type",
      render: (_, row) => {
        return (
          <Badge
            startIcon={
              <FontAwesomeIcon
                icon={
                  row.type === "SUPPLIER"
                    ? faUser
                    : row.type === "INTERNAL"
                      ? faArrowsLeftRight
                      : row.type === "EXTERNAL_SUPPLIER"
                        ? faTruck
                        : faIndustry
                }
              />
            }
          >
            {row.type.replace("_", " ")}
          </Badge>
        );
      },
    },
    {
      label: "Status",
      key: "status",
      render: (_, row) => {
        switch (row.status) {
          case SheetStatus.CREATED:
            return <Badge color="light">{row.status}</Badge>;
          case SheetStatus.WAIT_FOR_MAPPING:
            return <Badge color="light">{row.status.replace(/_/g, " ")}</Badge>;
          case SheetStatus.IN_PROGRESS:
            return (
              <Badge color="warning">{row.status.replace(/_/g, " ")}</Badge>
            );
          case SheetStatus.APPROVED:
            return <Badge color="info">{row.status}</Badge>;
          case SheetStatus.COMPLETED:
            return <Badge color="success">{row.status}</Badge>;
          default:
            return row.status;
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
      render: (_, row: ImportRow) => {
        return (
          <ActionsButton
            status={row.status}
            processType={row.type}
            item={row}
            type="import"
          />
        );
      },
    },
  ];

  const fetchedImportData: ImportRow[] =
    data?.map((detaill) => {
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
