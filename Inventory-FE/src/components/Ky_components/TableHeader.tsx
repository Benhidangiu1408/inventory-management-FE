import { Column } from "./CustomizableTable";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPen, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import Select from "../form/Select";
import Badge from "../ui/badge/Badge";

export interface WarehouseRow {
  warehouseCode: string;
  warehouseName: string;
  warehouseType: string;
  createdBy: string;
  status: string;
  actions: string[];
}

export const warehouseTableHeader: Column<WarehouseRow>[] = [
  {
    label: "Code",
    key: "warehouseCode",
  },
  {
    label: "Name",
    key: "warehouseName",
  },
  {
    label: "Type",
    key: "warehouseType",
  },
  {
    label: "Created By",
    key: "createdBy",
  },
  {
    label: "Status",
    key: "status",
  },
  {
    label: "Actions",
    key: "actions",
    render: (data, row) => (
      <div className="flex gap-3">
        {data.includes("r") && (
          <Link href={`/warehouse/${row.warehouseCode}`}>
            <FontAwesomeIcon
              icon={faEye}
              className="cursor-pointer hover:text-blue-500"
            />
          </Link>
        )}
        {data.includes("w") && (
          <Link href={`/warehouse`}>
            <FontAwesomeIcon
              icon={faPen}
              className="cursor-pointer hover:text-blue-500"
            />
          </Link>
        )}
      </div>
    ),
  },
];

export interface InventoryCheckOrder {
  orderCode: string;
  warehouse: string;
  inspector: string;
  scheduledDate: string;
  status: "Pending" | "Scanning" | "Completed";
  createdBy: string;
  actions: string[];
}

export const inventoryCheckOrderHeaders: Column<InventoryCheckOrder>[] = [
  { label: "Code", key: "orderCode" },
  { label: "Warehouse", key: "warehouse" },
  { label: "Inspector", key: "inspector" },
  { label: "Scheduled Date", key: "scheduledDate" },
  { label: "Status", key: "status" },
  { label: "Created By", key: "createdBy" },
  {
    label: "Actions",
    key: "actions",
    render: (value, row) => (
      <div className="flex gap-3">
        {value.includes("r") && (
          <Link href={`/inventory-check/${row.orderCode}`}>
            <FontAwesomeIcon
              icon={faEye}
              className="cursor-pointer hover:text-blue-500"
            />
          </Link>
        )}
        {value.includes("w") && (
          <Link href={`/inventory-check/`}>
            <FontAwesomeIcon
              icon={faPen}
              className="cursor-pointer hover:text-blue-500"
            />
          </Link>
        )}
        {/* {value.includes("a") && (
          <div>
            <FontAwesomeIcon
              icon={faCheck}
              className="cursor-pointer hover:text-blue-500"
            />
          </div>
        )} */}
      </div>
    ),
  },
];

export interface StoredProduct {
  productCode: string;
  productName: string;
  location: string; // rack / bin / aisle etc.
  unit: string;
  quantity: number; // current on-hand qty
  minLevel: number; // minimum reorder level
  lastUpdated: string; // ISO date or formatted date string
}

export const storedProductHeaders: Column<StoredProduct>[] = [
  { label: "Code", key: "productCode" },
  { label: "Name", key: "productName" },
  { label: "Location", key: "location" },
  { label: "Unit", key: "unit" },
  {
    label: "Quantity",
    key: "quantity",
    render: (value, row) => (
      <span className={Number(value) < row.minLevel ? "text-red-500" : ""}>
        {value}
      </span>
    ),
  },
  { label: "Min Required", key: "minLevel" },
  { label: "Last Updated", key: "lastUpdated" },
];

export interface StorageBatch {
  batchCode: string;
  location: string; // Rack/Bin/Aisle info
  quantity: number; // Current on-hand qty
  unit: string; // e.g., "kg", "pcs"
  manufactureDate: string;
  expiryDate: string;
  lastUpdated: string; // Last stock update timestamp
}

export const storageBatchColumns: Column<StorageBatch>[] = [
  { label: "Batch Code", key: "batchCode" },
  { label: "Location", key: "location" },
  { label: "Quantity", key: "quantity" },
  { label: "Unit", key: "unit" },
  { label: "Manufacture Date", key: "manufactureDate" },
  { label: "Expiry Date", key: "expiryDate" },
  { label: "Last Updated", key: "lastUpdated" },
];

export interface ProductMaster {
  id: string;
  sku: string;
  name: string;
  category: string;
  description: string;
  unit: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  actions: string[];
}
export const productMasterColumns: Column<ProductMaster>[] = [
  { label: "Code", key: "sku" },
  { label: "Name", key: "name" },
  { label: "Category", key: "category" },
  { label: "Description", key: "description" },
  { label: "Unit", key: "unit" },
  {
    label: "Status",
    key: "isActive",
    render: (v) => (
      <span className={v ? "text-green-600" : "text-red-500"}>
        {v ? "Active" : "Inactive"}
      </span>
    ),
  },
  { label: "Created", key: "createdAt" },
  { label: "Updated", key: "updatedAt" },
  {
    label: "Actions",
    key: "actions",
    render: (data, row) => (
      <div className="flex gap-3">
        {Array.isArray(data) && data.includes("r") && (
          <Link href={`/product/${row.sku}`}>
            <FontAwesomeIcon
              icon={faEye}
              className="cursor-pointer hover:text-blue-500"
            />
          </Link>
        )}
        {Array.isArray(data) && data.includes("w") && (
          <Link href={`/product`}>
            <FontAwesomeIcon
              icon={faPen}
              className="cursor-pointer hover:text-blue-500"
            />
          </Link>
        )}
      </div>
    ),
  },
];

export interface CategoryRow {
  id: string;
  name: string;
  description: string;
  productCount: number;
  createdBy: string;
  lastUpdated: string;
  actions: string[];
}

export const categoryColumns: Column<CategoryRow>[] = [
  { label: "Category ID", key: "id" },
  { label: "Name", key: "name" },
  { label: "Description", key: "description" },
  { label: "Products", key: "productCount" },
  { label: "Created By", key: "createdBy" },
  { label: "Last Updated", key: "lastUpdated" },
  {
    label: "Actions",
    key: "actions",
    render: (data, row) => (
      <div className="flex gap-3">
        {Array.isArray(data) && data.includes("r") && (
          <Link href={`/category/${row.id}`}>
            <FontAwesomeIcon
              icon={faEye}
              className="cursor-pointer hover:text-blue-500"
            />
          </Link>
        )}
        {Array.isArray(data) && data.includes("w") && (
          <Link href={`/category`}>
            <FontAwesomeIcon
              icon={faPen}
              className="cursor-pointer hover:text-blue-500"
            />
          </Link>
        )}
      </div>
    ),
  },
];

export interface CategoryProductRow {
  productCode: string;
  productName: string;
  unit: string;
  lastUpdated: string;
}

export const categoryProductColumns: Column<CategoryProductRow>[] = [
  { label: "Product Code", key: "productCode" },
  { label: "Name", key: "productName" },
  { label: "Unit", key: "unit" },
  { label: "Last Updated", key: "lastUpdated" },
];

export interface UserRow {
  id: string;
  username: string;
  email: string;
  role: "Admin" | "Manager" | "Staff";
  status: "Active" | "Inactive" | "Suspended";
  lastLogin: string; // formatted date/time
  actions: string[]; // e.g. ["r","w"] for read/edit
}

export const userColumns: Column<UserRow>[] = [
  { label: "User ID", key: "id" },
  { label: "Username", key: "username" },
  { label: "Email", key: "email" },
  {
    label: "Role",
    key: "role",
    render(value) {
      return (
        <Select
          defaultValue={String(value)}
          onChange={() => {}}
          options={[
            { value: "Admin", label: "Admin" },
            { value: "Manager", label: "Manager" },
            { value: "Staff", label: "Staff" },
          ]}
        />
      );
    },
  },
  {
    label: "Status",
    key: "status",
    render: (value) => (
      <Badge
        color={
          value === "Active"
            ? "success"
            : value === "Suspended"
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
  { label: "Last Login", key: "lastLogin" },
  {
    label: "Actions",
    key: "actions",
    render: (value) => (
      <div className="flex justify-end gap-3">
        {value.includes("r") && (
          <Link href={`/admin/user-management`}>
            <FontAwesomeIcon
              icon={faEye}
              className="cursor-pointer hover:text-blue-500"
            />
          </Link>
        )}
        {value.includes("d") && (
          <Link href={`/admin/user-management`}>
            <FontAwesomeIcon
              icon={faTrashCan}
              className="cursor-pointer hover:text-blue-500"
            />
          </Link>
        )}
      </div>
    ),
  },
];
