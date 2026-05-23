"use client";

import { Column } from "@/components/table/CustomizableTable";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import Select from "@/default_components/form/Select";
import Badge from "@/default_components/ui/badge/Badge";
import {
  AttributeResponse,
  LocationBatch,
  LocationResponse,
  UnitResponse,
  VariantAttributeResponse,
  VariantResponse,
  WarehouseGeneral,
} from "@/interfaces/warehouseManagementType";

import { Pencil, Trash2 } from "lucide-react";
import {
  FaultBatch,
  FaultBatchProcessOrderSummary,
  FaultBatchStatus,
  FaultOrderSummary,
  FaultTask,
  InventoryCheckResponse,
  TaskBatchResponse,
  TaskStatus,
} from "@/interfaces/inventoryManagementType";
import { Role, User } from "@/interfaces/userManagementType";
import { AssignRoleAction } from "@/actions/user";
import toast from "react-hot-toast";
import Image from "next/image";
import CircleProgressBar from "@/default_components/ui/CircleProgressBar";

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
    label: "Capacity",
    key: "totalBins",
    render(_, row) {
      const total = row.totalBins ?? 0;
      const occupied = row.occupiedBins ?? 0;
      return (
        <div className="flex w-full items-center justify-center gap-2">
          <CircleProgressBar
            percent={total > 0 ? Math.round((occupied / total) * 100) : 0}
            size={30}
          />
          <div className="text-gray-500">
            {occupied} / {total} Bins
          </div>
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
    label: "Status/Capacity",
    key: "status",
    width: 200,
    render: (value, row) => {
      if (row.type == "BIN") {
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
      } else {
        const total = row.totalBins ?? 0;
        const occupied = row.occupiedBins ?? 0;
        return (
          <div className="flex w-full items-center justify-center gap-2">
            <CircleProgressBar
              percent={total > 0 ? Math.round((occupied / total) * 100) : 0}
              size={30}
            />
            <div className="text-gray-500">
              {occupied} / {total} Bins
            </div>
          </div>
        );
      }
    },
  },
  {
    label: "Max Size",
    key: "maxVolume",
    width: 200,
    filter: "agTextColumnFilter",
    valueGetter: (row) =>
      row.type === "BIN"
        ? `${row.maxLength}x${row.maxWidth}x${row.maxHeight}cm | ${row.maxWeight}kg`
        : "",
    render: (_, row) => {
      if (row.type === "BIN") {
        return (
          <span className="text-sm text-gray-400">
            {row.maxLength}x{row.maxWidth}x{row.maxHeight}cm | {row.maxWeight}kg
          </span>
        );
      } else {
        return null;
      }
    },
  },
  {
    label: "Inventory",
    key: "batch",
    filter: "agTextColumnFilter",
    valueGetter: (row) =>
      row.batch ? `${row.batch.productName} ${row.batch.code}` : "",
    sortable: false,
    width: 250,
    render: (_, row) => {
      if (row.type !== "BIN") {
        return null;
      }
      const batch = row.batch as LocationBatch | null | undefined;

      // If the location is empty, show a soft placeholder
      if (!batch) {
        return (
          <span className="text-sm text-gray-400 italic">No inventory</span>
        );
      }

      // If occupied, stack the Product Name and the Quantity/Code details
      return (
        <div className="flex h-full flex-col justify-center leading-tight">
          <span className="truncate font-medium text-gray-900 dark:text-white">
            {batch.productName}
          </span>
          <span className="truncate text-xs text-gray-500 dark:text-gray-400">
            Qty:{" "}
            <span className="text-brand-600 dark:text-brand-400 font-semibold">
              {batch.currentQty}
            </span>{" "}
            {batch.unitName} &bull; {batch.code}
          </span>
        </div>
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
  onImageClick: (imageUrl: string) => void,
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
        <button
          type="button"
          className="relative aspect-square h-full overflow-hidden rounded border border-gray-200 transition-opacity hover:opacity-80 dark:border-gray-700"
          onClick={() => onImageClick(val as string)}
        >
          <Image
            src={val as string}
            fill
            alt="Variant thumbnail"
            className="object-cover"
          />
        </button>
      ) : (
        <span className="text-xs text-gray-400 italic">No image</span>
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
          {format(parseISO(safeDateString as string), "MMM d, yyyy h:mm:ss a")}
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
          className="border-none !bg-transparent !ring-0"
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
      return new Date(value as string).toLocaleDateString("en-GB");
    },
  },
];

export const faultOrderHeader: Column<FaultOrderSummary>[] = [
  {
    label: "Order Code",
    key: "code",
    sort: true,
    filter: "agTextColumnFilter",
    width: 80,
    render: (value, row) => (
      <Link
        href={`/fault-order/details/${row.id}`}
        className="text-brand-500 text-sm font-normal underline transition-colors"
      >
        {value as string}
      </Link>
    ),
  },
  {
    label: "Warehouse",
    key: "warehouseCode",
    width: 250,
    filter: "agTextColumnFilter",
    render: (value, row) => `${row.warehouseName} (${value})`,
  },
  {
    label: "Date",
    key: "createdAt",
    filter: "agDateColumnFilter",
    width: 100,
    render(value) {
      if (!value) return "";
      return new Date(value as string).toLocaleDateString("en-GB");
    },
  },
  {
    label: "Analyzer",
    key: "analyzerUsername",
    filter: "agTextColumnFilter",
    render: (value) =>
      value ? (
        <span className="text-gray-800 dark:text-white/90">
          {value as string}
        </span>
      ) : (
        <span className="text-xs text-gray-400 italic">Unassigned</span>
      ),
  },
  {
    label: "Assignee",
    key: "taskAssigneeUsername",
    filter: "agTextColumnFilter",
    render: (value) =>
      value ? (
        <span className="text-gray-800 dark:text-white/90">
          {value as string}
        </span>
      ) : (
        <span className="text-xs text-gray-400 italic">Unassigned</span>
      ),
  },
  {
    label: "Questioner",
    key: "questionCreatorUsername",
    filter: "agTextColumnFilter",
    render: (value) =>
      value ? (
        <span className="text-gray-800 dark:text-white/90">
          {value as string}
        </span>
      ) : (
        <span className="text-xs text-gray-400 italic">Unassigned</span>
      ),
  },
  {
    label: "Status",
    key: "status",
    filter: "agSetColumnFilter",
    width: 50,
    render: (value) => {
      if (!value) return null;

      const statusStr = value as string;
      // const formattedLabel = statusStr
      //   .toLowerCase()
      //   .replace(/_/g, " ")
      //   .replace(/^\w/, (c) => c.toUpperCase());

      return (
        <Badge
          color={
            statusStr === "COMPLETED"
              ? "success"
              : statusStr === "PENDING"
                ? "light"
                : "warning"
          }
          variant="solid"
        >
          {statusStr}
        </Badge>
      );
    },
  },
];

// ------------------------------------------------------
// 1. Pending Fault Batches
// ------------------------------------------------------
export const detailFaultBatchColumns: Column<FaultBatch>[] = [
  {
    label: "Fault Batch Code",
    key: "code",
    sort: true,
    width: 250,
    filter: "agTextColumnFilter",
  },
  {
    label: "Location",
    key: "locationCode",
    width: 250,
    filter: "agTextColumnFilter",
  },
  {
    label: "Date",
    key: "createdAt",
    filter: "agDateColumnFilter",
    render: (value) =>
      value ? new Date(value as string).toLocaleDateString("en-GB") : "-",
  },
  {
    label: "Status",
    key: "handlingStatus",
    filter: "agSetColumnFilter",
    render: (value) => {
      const label =
        value === "RESOLVED"
          ? "Completed"
          : value === "PROCESSING"
            ? "In progress"
            : "Pending";
      const badgeColor =
        value === "RESOLVED"
          ? "success"
          : value === "PROCESSING"
            ? "warning"
            : "light";

      return (
        <Badge variant="solid" color={badgeColor}>
          {label}
        </Badge>
      );
    },
  },
];

// ------------------------------------------------------
// 2. Assigned Fault Batches
// ------------------------------------------------------
export const detailAssignedFaultBatchColumns: Column<FaultBatch>[] = [
  {
    label: "Fault Batch Code",
    key: "code",
    filter: "agTextColumnFilter",
    sort: true,
    width: 300,
  },
  {
    label: "Location",
    key: "locationCode",
    width: 250,
    filter: "agTextColumnFilter",
  },
  {
    label: "Process Order ID",
    key: "faultBatchProcessOrderId",
    filter: "agTextColumnFilter",
    render: (_, row) => {
      const processId = row.faultBatchProcessOrderId;
      return processId ? String(processId) : "-";
    },
  },
  {
    label: "Date",
    key: "createdAt",
    filter: "agDateColumnFilter",
    render: (value) =>
      value ? new Date(value as string).toLocaleDateString("en-GB") : "-",
  },
  {
    label: "Status",
    key: "handlingStatus",
    filter: "agSetColumnFilter",
    render: (value) => {
      const label =
        value === "RESOLVED"
          ? "Completed"
          : value === "PROCESSING"
            ? "In progress"
            : "Pending";

      return (
        <Badge
          variant="solid"
          color={label === "Completed" ? "success" : "warning"}
        >
          {label}
        </Badge>
      );
    },
  },
];

// ------------------------------------------------------
// 3. Processing Orders
// ------------------------------------------------------
export const detailProcessingOrderColumns: Column<FaultBatchProcessOrderSummary>[] =
  [
    {
      label: "Order ID",
      key: "id",
      width: 120,
      sort: true,
      filter: "agTextColumnFilter",
    },
    {
      label: "Type",
      key: "type",
      filter: "agSetColumnFilter",
      render: (value) => {
        const label =
          value === "RETURNED"
            ? "Returned"
            : value === "CANCELLED"
              ? "Canceled"
              : "Other";

        return (
          <span className="font-medium text-gray-800 dark:text-white/90">
            {label}
          </span>
        );
      },
    },
    {
      label: "Date",
      key: "createdAt",
      filter: "agDateColumnFilter",
      render: (value) =>
        value ? new Date(value as string).toLocaleDateString("en-GB") : "-",
    },
    {
      label: "Status",
      key: "status",
      filter: "agSetColumnFilter",
      render: (value) => {
        const statusStr = String(value || "PENDING");
        let badgeColor: "error" | "warning" | "success" | "light" = "light";

        if (statusStr === "COMPLETED" || statusStr === "APPROVED")
          badgeColor = "success";
        if (statusStr === "IN_PROGRESS") badgeColor = "warning";
        if (
          statusStr === "FAILED" ||
          statusStr === "REJECTED" ||
          statusStr === "CANCELLED"
        )
          badgeColor = "error";

        return (
          <Badge variant="solid" color={badgeColor} size="sm">
            {statusStr.replace(/_/g, " ")}
          </Badge>
        );
      },
    },
  ];

const getTaskStatusColor = (status: string) => {
  switch (status) {
    case TaskStatus.COMPLETED:
      return "!text-green-700 dark:!text-green-400";
    case TaskStatus.IN_PROGRESS:
      return "!text-yellow-700 dark:!text-yellow-400";
    case TaskStatus.FAILED:
      return "!text-red-700 dark:!text-red-400";
    case TaskStatus.CREATED:
    default:
      return "!text-gray-700 dark:!text-gray-400";
  }
};
export const getTaskColumns = (
  currentUserId: number,
  isUpdatingTask: boolean,
  canAssignTask: boolean,
  isApprove: boolean,
  handleTaskStatusChange: (id: number, status: TaskStatus) => void,
): Column<FaultTask>[] => [
  { label: "Task", key: "task", filter: "agTextColumnFilter" },
  {
    label: "Assigned To",
    key: "assignedUsername",
    filter: "agTextColumnFilter",
    render: (val) => val || "Not assigned",
  },
  {
    label: "Due Date",
    key: "dueDate",
    filter: "agDateColumnFilter",
    render: (val) =>
      val ? new Date(val as string).toLocaleString("en-GB") : "-",
  },
  {
    label: "Status",
    key: "status",
    valueGetter: (params) => {
      switch (params.status) {
        case TaskStatus.IN_PROGRESS:
          return "In Progress";
        case TaskStatus.COMPLETED:
          return "Completed";
        case TaskStatus.CREATED:
          return "Not Started";
        case TaskStatus.FAILED:
          return "Blocked";
      }
    },
    render: (_, row) => {
      return (
        <Select
          className={`border-none font-medium !ring-0 ${getTaskStatusColor(row.status as string)}`}
          options={[
            { value: TaskStatus.CREATED, label: "Not Started" },
            { value: TaskStatus.IN_PROGRESS, label: "In Progress" },
            { value: TaskStatus.COMPLETED, label: "Completed" },
            { value: TaskStatus.FAILED, label: "Blocked" },
          ]}
          value={row.status as string}
          onChange={(e) =>
            handleTaskStatusChange(Number(row.id), e.target.value as TaskStatus)
          }
          disabled={
            isUpdatingTask ||
            (!canAssignTask &&
              !(currentUserId == row.assignedUserId && isApprove))
          }
        />
      );
    },
  },
];

const getBatchStatusColor = (status: string) => {
  switch (status) {
    case FaultBatchStatus.RESOLVED:
      return "!text-green-700 dark:!text-green-400";
    case FaultBatchStatus.PROCESSING:
      return "!text-blue-700 dark:!text-yellow-400";
    case FaultBatchStatus.REPORTED:
    default:
      return "!text-gray-700 dark:!text-gray-400";
  }
};
export const getTaskFaultBatchColumns = (
  currentUserId: number,
  canAssignTask: boolean,
  isApprove: boolean,
  taskData: FaultTask[],
  handleTaskAssign: (batchId: number, taskId: number) => void,
  handleBatchStatusChange: (id: number, status: FaultBatchStatus) => void,
  isUpdating: boolean,
): Column<TaskBatchResponse>[] => [
  {
    label: "Fault Batch Code",
    key: "code",
    sort: true,
    width: 250,
    filter: "agTextColumnFilter",
  },
  {
    label: "Location",
    key: "locationCode",
    width: 250,
    filter: "agTextColumnFilter",
  },
  {
    label: "Assigned To Task",
    key: "taskId",
    render: (val, row) => (
      <Select
        className="border-none !bg-transparent !ring-0"
        options={taskData.map((task) => ({
          value: String(task.id),
          label: task.task as string,
        }))}
        disablePlaceholderOpt={false}
        placeholder="Select task"
        value={String(val)}
        onChange={(e) => handleTaskAssign(row.id, Number(e.target.value))}
        disabled={isUpdating || !canAssignTask}
      />
    ),
  },
  {
    label: "Handle By",
    key: "assignedUserUsername",
    filter: "agTextColumnFilter",
  },
  {
    label: "Handling Status",
    key: "handlingStatus",
    width: 200,
    valueGetter: (params) => {
      switch (params.handlingStatus) {
        case FaultBatchStatus.RESOLVED:
          return "Completed";
        case FaultBatchStatus.PROCESSING:
          return "In progress";
        case FaultBatchStatus.REPORTED:
          return "Pending";
      }
    },
    render: (_, row) => (
      <Select
        className={`border-none font-medium !ring-0 ${getBatchStatusColor(row.handlingStatus as string)}`}
        options={[
          { value: FaultBatchStatus.REPORTED, label: "Pending" },
          { value: FaultBatchStatus.PROCESSING, label: "In Progress" },
          { value: FaultBatchStatus.RESOLVED, label: "Completed" },
        ]}
        placeholder="Select status"
        value={row.handlingStatus as string}
        onChange={(e) =>
          handleBatchStatusChange(row.id, e.target.value as FaultBatchStatus)
        }
        disabled={
          isUpdating || currentUserId != row.assignedUserId || !isApprove
        }
      />
    ),
  },
];
