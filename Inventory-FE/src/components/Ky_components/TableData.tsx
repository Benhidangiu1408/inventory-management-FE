import { WarehouseRow,InventoryCheckOrder } from "./TableHeader";

export const inventoryCheckOrders: InventoryCheckOrder[] = [
  {
    orderCode: "INV-1001",
    warehouse: "Central Depot",
    inspector: "Alice Nguyen",
    scheduledDate: "2025-09-15",
    status: "Pending",
    actions: ["r", "w","a"],
    createdBy: "VCK",
  },
  {
    orderCode: "INV-1002",
    warehouse: "North Storage",
    inspector: "Bao Tran",
    scheduledDate: "2025-09-17",
    status: "Scanning",
    actions: ["r","w"],
    createdBy: "VCK",
  },
  {
    orderCode: "INV-1003",
    warehouse: "West Hub",
    inspector: "Linh Vo",
    scheduledDate: "2025-09-18",
    status: "Completed",
    actions: ["r"],
    createdBy: "VCK",
  },
];

export const warehouseTableData : WarehouseRow[] = [
  {
    warehouseCode: "WH-001",
    warehouseName: "Warehouse 1",
    warehouseType: "Import Storage",
    createdBy: "John Doe",
    status: "Active",
    actions: ["r","w"]
  },
  {
    warehouseCode: "WH-002",
    warehouseName: "Warehouse 2",
    warehouseType: "Import Storage",
    createdBy: "John Doe",
    status: "Active",
    actions: ["r","w"]
  },
  {
    warehouseCode: "WH-003",
    warehouseName: "Warehouse 3",
    warehouseType: "Import Storage",
    createdBy: "John Doe",
    status: "Active",
    actions: ["r"]
  },
];
