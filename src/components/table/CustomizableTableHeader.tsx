"use client";

import { Column } from "@/components/table/CustomizableTable";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format, parseISO } from "date-fns";
import {
  faCheck,
  faEye,
  faPen,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import Select from "@/default_components/form/Select";
import Badge from "@/default_components/ui/badge/Badge";
import Button from "@/default_components/ui/button/Button";
import {
  AttributeResponse,
  LocationResponse,
  UnitResponse,
  WarehouseGeneral,
} from "@/interfaces/warehouseManagementType";

import { Eye, Pencil } from "lucide-react";
import { InventoryCheckResponse } from "@/interfaces/inventoryManagementType";
import { Role, UserStatus } from "@/interfaces/userManagementType";
import { userManagementService } from "@/services/UserManagementService";


// --- Warehouse General Header ---
export const warehouseHeaders: Column<WarehouseGeneral>[] = [
  {
    label: "Code",
    key: "code",
  },
  {
    label: "Warehouse Name",
    key: "name",
    width: 250,
  },
  {
    label: "Type",
    key: "type",
  },
  {
    label: "Status",
    key: "status",
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
    render: (val) =>
      (val as string) || (
        <span className="text-gray-400 italic">No description</span>
      ),
  },
  {
    label: "Actions",
    key: "id",
    render: (_, row) => (
      <div className="flex h-full items-center justify-center gap-2">
        <Link href={`/warehouse-management/warehouse/detail/${row.id}`}>
          <Eye size={16} />
        </Link>
      </div>
    ),
  },
];

// --- Location View Header ---
export const LocationHeaders: Column<LocationResponse>[] = [
  {
    label: "Code",
    key: "code",
  },
  {
    label: "Location Name",
    key: "name",
  },
  {
    label: "Status",
    key: "status",
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
  // {
  //   label: "Actions",
  //   key: "id",
  //   render: (_, row) => (
  //     <div className="flex h-full items-center justify-center gap-2">
  //       <Link href={`/warehouse-management/warehouse/detail/${row.id}`}>
  //         <Pencil size={16} />
  //       </Link>
  //     </div>
  //   ),
  // },
];

export const getUnitHeaders = (
  onEdit: (unit: UnitResponse) => void,
): Column<UnitResponse>[] => [
  {
    label: "Unit Name",
    key: "name",
  },
  {
    label: "Unit Abbreviation",
    key: "abb",
  },
  {
    label: "Description",
    key: "description",
    render: (val) =>
      (val as string) || (
        <span className="text-gray-400 italic">No description</span>
      ),
  },
  {
    label: "Actions",
    key: "id",
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
  },
  {
    label: "Description",
    key: "description",
    render: (val) =>
      (val as string) || (
        <span className="text-gray-400 italic">No description</span>
      ),
  },
  {
    label: "Actions",
    key: "id",
    render: (_, row) => (
      <div className="flex h-full items-center justify-center gap-2">
        <button onClick={() => onEdit(row)}>
          <Pencil size={16} />
        </button>
      </div>
    ),
  },
];

export const inventoryCheckSheetHeaders: Column<InventoryCheckResponse>[] = [
  {
    label: "Code",
    key: "code",
  },
  {
    label: "Warehouse",
    key: "warehouseName",
  },
  // {
  //   label: "Assignee",
  //   key: "assigneeName",
  // },
  {
    label: "Planned Date",
    key: "plannedDate",
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
  {
    label: "Actions",
    key: "id",
    render: (_, row) => (
      <div className="flex h-full items-center justify-center gap-2">
        <Link
          href={`/warehouse-management/inventory-check/detail/${row.id}`}
          className="hover:text-brand-600 rounded-md p-1 text-gray-500 transition-colors hover:bg-gray-100"
          title="View Worksheet"
        >
          <Eye size={18} />
        </Link>
      </div>
    ),
  },
];

// Nho dem vo interface cua serivce nha!!
export interface UserRow {
  id: string;
  username: string;
  email: string;
  role: string;
  status: UserStatus;
  createdDate: string; // formatted date/time
  actions: string[]; // e.g. ["r","w"] for read/edit
}

function UserActionsCell({ row }: { row: UserRow }) {
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click event

    if (!confirm("Delete this user?")) return;

    try {
      await userManagementService.deleteAccount(row.username);
      alert("Deleted!");

      // Optional: refresh page
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Delete failed");
    }
  };

  return (
    <div className="flex justify-end gap-3">
      <Link href={`/admin/user-management/${row.id}`}>
        <FontAwesomeIcon
          icon={faEye}
          className="cursor-pointer hover:text-blue-500"
        />
      </Link>

      <button onClick={handleDelete}>
        <FontAwesomeIcon
          icon={faTrashCan}
          className="cursor-pointer hover:text-red-500"
        />
      </button>
    </div>
  );
}

export default UserActionsCell;

// export const userColumns: Column<UserRow>[] = [
//   { label: "User ID", key: "id" },
//   { label: "Username", key: "username" },
//   { label: "Email", key: "email" },
//   {
//     label: "Role",
//     key: "role",
//     render(value) {
//       return (
//         <Select
//           defaultValue={String(value)}
//           onChange={() => {
//             // userManagementService.assignRole(
//             //   Number(value),
//             //   Number(sessionStorage.getItem("userId")),
//             //   Number(id)
//             // );
//           }}
//           options={[
//             { value: "Admin", label: "Admin" },
//             { value: "Manager", label: "Manager" },
//             { value: "Staff", label: "Staff" },
//           ]}
//         />
//       );
//     },
//   },
//   {
//     label: "Status",
//     key: "status",
//     render: (value) => (
//       <div className="m-3 flex w-full justify-center">
//         <Badge
//           color={
//             value === "Active"
//               ? "success"
//               : value === "Suspended"
//                 ? "warning"
//                 : "error"
//           }
//           size="sm"
//           variant="solid"
//         >
//           {value}
//         </Badge>
//       </div>
//     ),
//   },
//   { label: "Created Date", key: "createdDate" },
//   // {
//   //   label: "Actions",
//   //   key: "actions",
//   //   // render: (value) => (
//   //   //   <div className="flex justify-end gap-3">
//   //   //     {value.includes("r") && (
//   //   //       <Link href={`/admin/user-management`}>
//   //   //         <FontAwesomeIcon
//   //   //           icon={faEye}
//   //   //           className="cursor-pointer hover:text-blue-500"
//   //   //         />
//   //   //       </Link>
//   //   //     )}
//   //   //     {value.includes("d") && (
//   //   //       <Link href={`/admin/user-management`}>
//   //   //         <FontAwesomeIcon
//   //   //           icon={faTrashCan}
//   //   //           className="cursor-pointer hover:text-blue-500"
//   //   //         />
//   //   //       </Link>
//   //   //     )}
//   //   //   </div>
//   //   // ),
//   //   render: (_, row) => <UserActionsCell row={row} />,
//   // },
// ];
export const userColumns = (roles: Role[]): Column<UserRow>[] => [
  { label: "User ID", key: "id" },
  { label: "Username", key: "username" },
  { label: "Email", key: "email" },

  {
    label: "Role",
    key: "role",
    render(value, row) {
      return (
        <Select
          defaultValue={String(roles.find((r) => r.name === value)?.id ?? "")}
          onChange={(e) => {
            userManagementService.assignRole(
              Number(e.target.value),                     // roleId mới
              Number(sessionStorage.getItem("userId")),   // assigningUser
              Number(row.id)                              // assignedUser
            );
          }}
          onClick={(e) => e.stopPropagation()}
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
  },
  {
    label: "Created Date",
    key: "createdDate",
  },
];

export interface OrderRow {
  orderId: string;
  date: string; // formatted as DD-MM-YYYY
  warehouse: string;
  priority: "High" | "Medium" | "Low";
  handle: "Pending" | "Completed" | "In progress";
  actions: string[]; // e.g. ["edit","check"]
}

export const orderColumns: Column<OrderRow>[] = [
  { label: "Order Code", key: "orderId" },
  { label: "Date", key: "date" },
  { label: "Warehouse", key: "warehouse" },
  {
    label: "Priority",
    key: "priority",
    render(value) {
      return (
        <Select
          defaultValue={String(value)}
          onChange={() => {}}
          options={[
            { value: "High", label: "High" },
            { value: "Medium", label: "Medium" },
            { value: "Low", label: "Low" },
          ]}
        />
      );
    },
  },
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
        {value.includes("edit") && (
          <Link href={`/fault-order/details/${row.orderId}`}>
            <FontAwesomeIcon
              icon={faPen}
              className="cursor-pointer hover:text-blue-500"
            />
          </Link>
        )}
        {value.includes("check") && (
          <FontAwesomeIcon
            icon={faCheck}
            className="cursor-pointer hover:text-blue-500"
          />
        )}
      </div>
    ),
  },
];

// ---------- Types ----------
export type FaultBatch = {
  id: string;
  date: string; // DD-MM-YYYY
  status: "Pending" | "Completed" | "In progress" | "Approve";
  priority: "High" | "Medium" | "Low";
  checked: boolean; // represents the checkbox in Actions
};

export type ProcessingOrder = {
  orderId: string;
  orderType: "Returned" | "Canceled" | "Other";
  action: "";
};

// ---------- Column Definitions ----------
export const faultBatchColumns: Column<FaultBatch>[] = [
  { label: "Fault Batch Code", key: "id" },
  { label: "Date", key: "date" },
  { label: "Status", key: "status" },
  {
    label: "Priority",
    key: "priority",
    render(value) {
      return (
        <select defaultValue={String(value)}>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      );
    },
  },
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
    render: () => (
      <Button className="rounded bg-blue-500 px-3 py-1 text-white">
        Handle
      </Button>
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
