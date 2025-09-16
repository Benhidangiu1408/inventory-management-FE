import { Column } from "./CustomizableTable";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faEye, faPen } from "@fortawesome/free-solid-svg-icons";

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
            {data.includes("r") && <Link href={`/warehouse/${row.warehouseCode}`}>
                <FontAwesomeIcon
                icon={faEye}
                className="cursor-pointer hover:text-blue-500"
                />
            </Link>
            }
            {data.includes("w") && <Link href={`/warehouse`}>
                <FontAwesomeIcon
                icon={faPen}
                className="cursor-pointer hover:text-blue-500"
                />
            </Link>
            }
        </div>
      )
    },
];

// types/inventory.ts
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
  { label: "Code",       key: "orderCode" },
  { label: "Warehouse",      key: "warehouse" },
  { label: "Inspector",      key: "inspector" },
  { label: "Scheduled Date", key: "scheduledDate" },
  { label: "Status",         key: "status" },
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
        {value.includes("a") && (
          <div>
            <FontAwesomeIcon
              icon={faCheck}
              className="cursor-pointer hover:text-blue-500"
            />
          </div>
        )}
      </div>
    ),
  },
];