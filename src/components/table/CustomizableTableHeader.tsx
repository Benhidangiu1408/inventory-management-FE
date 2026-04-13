"use client";

import { Column } from "@/components/table/CustomizableTable";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format, parseISO } from "date-fns";
import { faPen, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import Select from "@/default_components/form/Select";
import Badge from "@/default_components/ui/badge/Badge";
import Button from "@/default_components/ui/button/Button";
import {
  AttributeResponse,
  LocationResponse,
  UnitResponse,
  VariantAttributeResponse,
  VariantResponse,
  WarehouseGeneral,
} from "@/interfaces/warehouseManagementType";

import { Pencil, Trash2 } from "lucide-react";
import { InventoryCheckResponse } from "@/interfaces/inventoryManagementType";
import { Role, User } from "@/interfaces/userManagementType";
import { AssignRoleAction } from "@/actions/user";
import toast from "react-hot-toast";

// --- Warehouse General Header ---
export const warehouseHeaders: Column<WarehouseGeneral>[] = [
  {
    label: "Code",
    key: "code",
    sort: true,
    filter: "agTextColumnFilter",
    width: 100,
  },
  {
    label: "Warehouse Name",
    key: "name",
    width: 250,
    filter: "agTextColumnFilter",
    render: (value, row) => (
      <Link
        href={`/warehouse-management/warehouse/detail/${row.id}`}
        className="text-brand-500 dark:text-brand-500 text-sm font-normal underline transition-colors"
      >
        {value as string}
      </Link>
    ),
  },
  {
    label: "Type",
    key: "type",
    width: 100,
  },
  {
    label: "Status",
    key: "status",
    width: 100,
    render: (value) => (
      <Badge
        variant={"solid"}
        color={
          value === "ACTIVE"
            ? "success"
            : value === "UNDER_MAINTAINANCE"
              ? "light"
              : "error"
        }
      >
        {value as string}
      </Badge>
    ),
  },
  {
    label: "Description",
    key: "description",
    filter: "agTextColumnFilter",
    autoHeight: true,
    render: (val) =>
      (val as string) || (
        <span className="text-gray-400 italic">No description</span>
      ),
  },
];

// --- Location View Header ---
export const getLocationHeaders = (
  deleteHandle: (id: number) => void,
  disable: boolean,
  hasEditPerm: boolean,
): Column<LocationResponse>[] => [
  {
    label: "Code",
    key: "code",
    sort: true,
    filter: "agTextColumnFilter",
  },
  {
    label: "Location Name",
    key: "name",
    filter: "agTextColumnFilter",
  },
  {
    label: "Status",
    key: "status",
    width: 100,
    render: (value) => {
      const statusColors: Record<
        string,
        "success" | "info" | "warning" | "error" | "light"
      > = {
        EMPTY: "success", // Green
        OCCUPIED: "info", // Blue
        RESERVED: "warning", // Orange
        UNDER_MAINTENANCE: "warning", // Orange
        BLOCKED: "error", // Red
        INACTIVE: "light", // Gray
      };
      const color = statusColors[value as string] || "light";
      const label = (value as string).replace(/_/g, " ");
      return (
        <Badge variant="solid" color={color}>
          {label}
        </Badge>
      );
    },
  },
  ...(hasEditPerm
    ? [
        {
          label: "Action",
          key: "id",
          filter: false,
          width: 50,
          render: (val) => {
            return (
              <div className="flex h-full items-center justify-center gap-2">
                <button
                  onClick={() => deleteHandle(Number(val))}
                  disabled={disable}
                >
                  <Trash2 size={16} color="red" />
                </button>
              </div>
            );
          },
        } as Column<LocationResponse>,
      ]
    : []),
];

export const getUnitHeaders = (
  onEdit: (unit: UnitResponse) => void,
): Column<UnitResponse>[] => [
  {
    label: "Unit Name",
    key: "name",
    sort: true,
    width: 250,
    filter: "agTextColumnFilter",
  },
  {
    label: "Unit Abbreviation",
    key: "abb",
    width: 250,
    filter: "agTextColumnFilter",
  },
  {
    label: "Description",
    key: "description",
    autoHeight: true,
    filter: "agTextColumnFilter",
    render: (val) =>
      (val as string) || (
        <span className="text-gray-400 italic">No description</span>
      ),
  },
  {
    label: "Actions",
    key: "id",
    filter: false,
    width: 50,
    render: (_, row) => (
      <div className="flex h-full items-center justify-center gap-2">
        <button onClick={() => onEdit(row)}>
          <Pencil size={16} />
        </button>
      </div>
    ),
  },
];

export const getAttributeHeaders = (
  onEdit: (unit: AttributeResponse) => void,
): Column<AttributeResponse>[] => [
  {
    label: "Attributes Name",
    key: "name",
    width: 250,
    sort: true,
    filter: "agTextColumnFilter",
  },
  {
    label: "Description",
    key: "description",
    filter: "agTextColumnFilter",
    autoHeight: true,
    render: (val) =>
      (val as string) || (
        <span className="text-gray-400 italic">No description</span>
      ),
  },
  {
    label: "Actions",
    key: "id",
    width: 50,
    filter: false,
    render: (_, row) => (
      <div className="flex h-full items-center justify-center gap-2">
        <button onClick={() => onEdit(row)}>
          <Pencil size={16} />
        </button>
      </div>
    ),
  },
];

export const getVariantHeaders = (
  onEdit: (variant: VariantResponse) => void,
  onDelete: (id: number) => void,
  disable: boolean,
  hasEditPerm: boolean,
): Column<VariantResponse>[] => [
  {
    label: "Variant Code",
    key: "code",
    sort: true,
    filter: "agTextColumnFilter",
    width: 200,
  },
  {
    label: "Image",
    key: "image",
    filter: false,
    sortable: false,
    width: 100,
    render: (val) =>
      val ? (
        <Link href={"/"}>View Image</Link>
      ) : (
        <span className="text-gray-400 italic">No image</span>
      ),
  },
  {
    label: "Attributes",
    key: "attributes",
    filter: false,
    render: (attrs) => {
      const attributeArray = attrs as VariantAttributeResponse[];
      if (!Array.isArray(attributeArray) || attributeArray.length === 0)
        return <span className="text-gray-400 italic">Default</span>;
      return (
        <div className="flex h-full w-full flex-wrap items-center justify-center gap-1 py-1">
          {attributeArray.map((attr) => (
            <span
              key={attr.attributeId}
              className="inline-flex items-center rounded border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
            >
              <span className="mr-1 font-semibold">{attr.attributeName}:</span>{" "}
              {attr.value}
            </span>
          ))}
        </div>
      );
    },
  },
  {
    label: "Description",
    key: "description",
    filter: "agTextColumnFilter",
    autoHeight: true,
    render: (val) =>
      (val as string) || (
        <span className="text-gray-400 italic">No description</span>
      ),
  },
  ...(hasEditPerm
    ? [
        {
          label: "Actions",
          key: "id",
          filter: false,
          width: 50,
          render: (_, row) => (
            <div className="flex h-full items-center justify-center gap-2">
              <button
                onClick={() => onEdit(row)}
                disabled={disable}
                className="text-blue-500 transition-colors hover:text-blue-700"
              >
                <Pencil size={18} />
              </button>
              <button
                onClick={() => onDelete(row.id)}
                disabled={disable}
                className="text-red-500 transition-colors hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ),
        } as Column<VariantResponse>,
      ]
    : []),
];

export const inventoryCheckSheetHeaders: Column<InventoryCheckResponse>[] = [
  {
    label: "Code",
    key: "code",
    filter: "agTextColumnFilter",
    sort: true,
    width: 120,
    render: (_, row) => (
      <Link
        href={`/warehouse-management/inventory-check/detail/${row.id}`}
        className="text-brand-500 dark:text-brand-500 text-sm font-normal underline transition-colors"
      >
        {row.code}
      </Link>
    ),
  },
  {
    label: "Warehouse",
    key: "warehouseName",
    width: 300,
    render: (_, row) => {
      return <div>{`${row.warehouseName} (${row.warehouseCode})`}</div>;
    },
  },
  {
    label: "Assignee",
    key: "assigneeName",
    width: 100,
    filter: "agTextColumnFilter",
  },
  {
    label: "Planned Date",
    key: "plannedDate",
    filter: "agDateColumnFilter",
    render: (value) => {
      if (!value) return <span className="text-gray-400">-</span>;
      const safeDateString = (value as string).endsWith("Z")
        ? value
        : `${value}Z`;
      return (
        <span>
          {format(parseISO(safeDateString as string), "MMM d, yyyy h:mm a")}
        </span>
      );
    },
  },
  {
    label: "Status",
    key: "status",
    width: 50,
    render: (value) => {
      const statusColors: Record<
        string,
        "success" | "info" | "warning" | "error" | "light"
      > = {
        COMPLETED: "info", // Green
        IN_PROGRESS: "warning",
        CREATED: "light", // Gray/White
        REJECTED: "error", // Red
        APPROVED: "success", // Green
      };
      const color = statusColors[value as string] || "light";
      const label = (value as string).replace(/_/g, " ");
      return (
        <Badge variant="solid" color={color}>
          {label}
        </Badge>
      );
    },
  },
];

// User Management
export const userHeaders = (
  roles: Role[],
  onRoleUpdated: (userId: number, newRoleName: string) => void,
): Column<User>[] => [
  {
    label: "User ID",
    key: "id",
    width: 50,
    filter: "agNumberColumnFilter",
    sort: true,
  },
  {
    label: "Username",
    key: "username",
    filter: "agTextColumnFilter",
    render(_, row) {
      return (
        <Link
          href={`/other-profile/${row.id}`}
          className="text-brand-500 text-sm font-normal underline transition-colors"
        >
          {row.username}
        </Link>
      );
    },
  },
  { label: "Email", key: "email", filter: "agTextColumnFilter" },

  {
    label: "Role",
    key: "role",
    render(value, row) {
      return (
        <Select
          className="border-none !bg-transparent"
          defaultValue={roles.find((r) => r.name === value)?.id ?? ""}
          onChange={async (e) => {
            try {
              const newRoleId = Number(e.target.value);
              const newRoleName =
                roles.find((r) => r.id === newRoleId)?.name || "Default User";
              await AssignRoleAction(newRoleId, row.id);
              toast.success("Assign successfully");
              onRoleUpdated(row.id, newRoleName);
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
              toast.error(error.message ?? "An unexpected error occurred");
            }
          }}
          options={roles.map((r) => ({
            value: String(r.id),
            label: r.name,
          }))}
        />
      );
    },
  },

  {
    label: "Status",
    key: "status",
    width: 120,
    render: (value) => (
      <Badge variant={"solid"} color={value === "ACTIVE" ? "success" : "error"}>
        {value as string}
      </Badge>
    ),
  },
  {
    label: "Created Date",
    key: "createdDate",
    width: 140,
    filter: "agDateColumnFilter",
    render(value) {
      if (!value) return "";
      return new Date(value as string).toLocaleDateString();
    },
  },
];

export interface OrderRow {
  id: number;
  orderId: string;
  date: string; // formatted as DD-MM-YYYY
  warehouse: string;
  handle: "Pending" | "Completed" | "In progress";
  actions: string[]; // e.g. ["edit","check"]
}

export const orderColumns: Column<OrderRow>[] = [
  { label: "ID", key: "id" },
  { label: "Order Code", key: "orderId" },
  { label: "Date", key: "date" },
  { label: "Warehouse", key: "warehouse" },
  {
    label: "Handle",
    key: "handle",
    render: (value) => (
      <Badge
        color={
          value === "Completed"
            ? "success"
            : value === "Pending"
              ? "warning"
              : "error"
        }
        size="sm"
        variant="solid"
      >
        {value}
      </Badge>
    ),
  },
  {
    label: "Actions",
    key: "actions",
    render: (value, row) => (
      <div className="flex justify-center gap-3">
        {Array.isArray(value) && value.includes("edit") && (
          <Link href={`/fault-order/details/${row.id}`}>
            <FontAwesomeIcon
              icon={faPen}
              className="cursor-pointer hover:text-blue-500"
            />
          </Link>
        )}
        {/* {Array.isArray(value) && value.includes("check") && (
          <FontAwesomeIcon
            icon={faCheck}
            className="cursor-pointer hover:text-blue-500"
          />
        )} */}
      </div>
    ),
  },
];

// ---------- Types ----------
export type FaultBatch = {
  id: number;
  code: string;
  date: string; // DD-MM-YYYY
  status: "Pending" | "Completed" | "In progress" | "Approve";
  taskId: string;
  taskName?: string;
  checked: boolean; // represents the checkbox in Actions
};

export type AssignedFaultBatch = {
  id: number;
  code: string;
  orderId: number;
  date: string; // DD-MM-YYYY
  status: "Pending" | "Completed" | "In progress" | "Approve";
  checked: boolean; // represents the checkbox in Actions
};

export type ProcessingOrder = {
  orderId: number;
  orderType: "Returned" | "Canceled" | "Other";
  action: "";
};

// ---------- Column Definitions ----------
export const faultBatchColumns: Column<FaultBatch>[] = [
  { label: "ID", key: "id" },
  { label: "Fault Batch Code", key: "code" },
  { label: "Date", key: "date" },
  { label: "Status", key: "status" },
  {
    label: "Actions",
    key: "checked",
    render: (value) => {
      return !!value ? (
        <input defaultChecked={!!value} type="checkbox" />
      ) : (
        <FontAwesomeIcon
          icon={faTrashCan}
          className="cursor-pointer hover:text-blue-500"
        />
      );
    },
  },
];

export const assignedFaultBatchColumns: Column<AssignedFaultBatch>[] = [
  { label: "ID", key: "id" },
  { label: "Fault Batch Code", key: "code" },
  { label: "Related Order ID", key: "orderId" },
  { label: "Date", key: "date" },
  { label: "Status", key: "status" },
  {
    label: "Actions",
    key: "checked",
    render: (value) => {
      return !!value ? (
        <input defaultChecked={!!value} type="checkbox" />
      ) : (
        <FontAwesomeIcon
          icon={faTrashCan}
          className="cursor-pointer hover:text-blue-500"
        />
      );
    },
  },
];

export const processingOrderColumns: Column<ProcessingOrder>[] = [
  { label: "Order Code", key: "orderId" },
  { label: "Order Type", key: "orderType" },
  {
    label: "Action",
    key: "action",
    autoHeight: true,
    render: () => (
      <div className="grid grid-cols-2 gap-2">
        <Button className="rounded bg-blue-500 px-3 text-white">Analyze</Button>
        <Button className="rounded bg-blue-500 px-3 text-white">
          Assign Tasks
        </Button>
      </div>
    ),
  },
];

export type TaskItem = {
  task: string;
  owner: string;
  dueDate: string; // e.g. "2025-10-01"
  status: "Not Started" | "In Progress" | "Completed" | "Blocked";
};

export const taskColumns: Column<TaskItem>[] = [
  { label: "Task", key: "task" },
  { label: "Owner", key: "owner" },
  { label: "Due Date", key: "dueDate" },
  { label: "Status", key: "status" },
];
