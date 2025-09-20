import { Product } from "./ExpandableTableHeaders";
import {
  WarehouseRow,
  InventoryCheckOrder,
  StoredProduct,
  StorageBatch,
  ProductMaster,
  CategoryRow,
  CategoryProductRow,
  UserRow,
} from "./TableHeader";

export const inventoryCheckOrders: InventoryCheckOrder[] = [
  {
    orderCode: "INV-1001",
    warehouse: "Central Depot",
    inspector: "Alice Nguyen",
    scheduledDate: "2025-09-15",
    status: "Pending",
    actions: ["r", "w"],
    createdBy: "VCK",
  },
  {
    orderCode: "INV-1002",
    warehouse: "North Storage",
    inspector: "Bao Tran",
    scheduledDate: "2025-09-17",
    status: "Scanning",
    actions: ["r", "w"],
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

export const warehouseTableData: WarehouseRow[] = [
  {
    warehouseCode: "WH-001",
    warehouseName: "Warehouse 1",
    warehouseType: "Import Storage",
    createdBy: "John Doe",
    status: "Active",
    actions: ["r", "w"],
  },
  {
    warehouseCode: "WH-002",
    warehouseName: "Warehouse 2",
    warehouseType: "Import Storage",
    createdBy: "John Doe",
    status: "Active",
    actions: ["r", "w"],
  },
  {
    warehouseCode: "WH-003",
    warehouseName: "Warehouse 3",
    warehouseType: "Import Storage",
    createdBy: "John Doe",
    status: "Active",
    actions: ["r"],
  },
];

export const productData: Product[] = [
  {
    id: "P-001",
    name: "Widget A",
    scannedTotalQty: 145,
    systemTotalQty: 150,
    unit: "pcs",
    difference: -5,
    batches: [
      {
        code: "A-BATCH-01",
        scannedQty: 50,
        systemQty: 50,
        scannedBy: "Alice",
        note: "One item is dent",
        status: "confirmed",
      },
      {
        code: "A-BATCH-02",
        scannedQty: 45,
        systemQty: 50,
        scannedBy: "Bob",
        note: "Filing for investigation",
        status: "confirmed",
      },
      {
        code: "A-BATCH-03",
        scannedQty: 50,
        systemQty: 50,
        scannedBy: "Charlie",
        note: "",
        status: "scanning",
      },
    ],
  },
  {
    id: "P-002",
    name: "Gadget B",
    scannedTotalQty: 80,
    systemTotalQty: 78,
    unit: "boxes",
    difference: 2,
    batches: [
      {
        code: "B-BATCH-01",
        scannedQty: 40,
        systemQty: 39,
        scannedBy: "Diana",
        note: "1 extra, return to supplier",
        status: "confirmed",
      },
      {
        code: "B-BATCH-02",
        scannedQty: 40,
        systemQty: 39,
        scannedBy: "Evan",
        note: "1 extra, move to error warehouse",
        status: "confirmed",
      },
    ],
  },
  {
    id: "P-003",
    name: "Component C",
    scannedTotalQty: 100,
    systemTotalQty: 200,
    unit: "kg",
    difference: -100,
    batches: [
      {
        code: "C-BATCH-01",
        scannedQty: 100,
        systemQty: 100,
        scannedBy: "Fiona",
        note: "",
        status: "confirmed",
      },
      {
        code: "C-BATCH-02",
        scannedQty: 0,
        systemQty: 100,
        scannedBy: "N/A",
        note: "",
        status: "awaiting",
      },
    ],
  },
];

export const storedProductData: StoredProduct[] = [
  {
    productCode: "PRD-001",
    productName: "Steel Bolt M6",
    location: "Aisle 1 / Bin B3",
    unit: "pcs",
    quantity: 1200,
    minLevel: 500,
    lastUpdated: "2025-09-10",
  },
  {
    productCode: "PRD-002",
    productName: "Copper Wire 1mm",
    location: "Aisle 2 / Bin C1",
    unit: "m",
    quantity: 80,
    minLevel: 100,
    lastUpdated: "2025-09-09",
  },
  {
    productCode: "PRD-003",
    productName: "Plastic Crate Large",
    location: "Rack 5 / Shelf D",
    unit: "pcs",
    quantity: 15,
    minLevel: 20,
    lastUpdated: "2025-09-08",
  },
];

export const storageBatchData: StorageBatch[] = [
  {
    batchCode: "ST-B001",
    location: "Rack A1 - Bin 03",
    quantity: 240,
    unit: "pcs",
    manufactureDate: "2025-02-10",
    expiryDate: "2026-02-10",
    lastUpdated: "2025-09-11 09:30",
  },
  {
    batchCode: "ST-B002",
    location: "Rack B2 - Bin 07",
    quantity: 120,
    unit: "pcs",
    manufactureDate: "2025-03-15",
    expiryDate: "2026-03-15",
    lastUpdated: "2025-09-10 15:45",
  },
  {
    batchCode: "ST-B003",
    location: "Rack C3 - Bin 02",
    quantity: 500,
    unit: "kg",
    manufactureDate: "2025-01-20",
    expiryDate: "2025-12-20",
    lastUpdated: "2025-09-11 10:15",
  },
];

export const productMasterData: ProductMaster[] = [
  {
    id: "1",
    sku: "PRD-1001",
    name: "Widget A",
    category: "Hardware",
    description: "High-quality steel widget",
    unit: "pcs",
    isActive: true,
    createdAt: "2025-01-05 10:30",
    updatedAt: "2025-09-10 15:12",
    actions: ["r", "w"],
  },
  {
    id: "2",
    sku: "PRD-1002",
    name: "Widget B",
    category: "Hardware",
    description: "Lightweight aluminum widget",
    unit: "pcs",
    isActive: true,
    createdAt: "2025-02-12 14:05",
    updatedAt: "2025-08-25 11:00",
    actions: ["r", "w"],
  },
  {
    id: "3",
    sku: "PRD-2001",
    name: "Chemical X",
    category: "Chemicals",
    description: "Industrial cleaning agent",
    unit: "liters",
    isActive: false,
    createdAt: "2025-03-22 09:40",
    updatedAt: "2025-07-19 08:30",
    actions: ["r", "w"],
  },
];

export const categoryData: CategoryRow[] = [
  {
    id: "CAT-001",
    name: "Beverages",
    description: "Soft drinks, coffees, teas, beers",
    productCount: 42,
    createdBy: "Alice",
    lastUpdated: "2025-09-10",
    actions: ["r", "w"],
  },
  {
    id: "CAT-002",
    name: "Snacks",
    description: "Chips, nuts, and crackers",
    productCount: 18,
    createdBy: "Bob",
    lastUpdated: "2025-09-05",
    actions: ["r", "w"],
  },
];

export const categoryProductData: CategoryProductRow[] = [
  {
    productCode: "P-1001",
    productName: "Green Tea",
    unit: "Box",
    lastUpdated: "2025-09-09",
  },
  {
    productCode: "P-1002",
    productName: "Cola 330ml",
    unit: "Can",
    lastUpdated: "2025-09-08",
  },
];

export const userData: UserRow[] = [
  {
    id: "U001",
    username: "alice",
    email: "alice@example.com",
    role: "Admin",
    status: "Active",
    lastLogin: "2025-09-10 14:32",
    actions: ["d", "r"],
  },
  {
    id: "U002",
    username: "bob",
    email: "bob@example.com",
    role: "Manager",
    status: "Inactive",
    lastLogin: "2025-09-05 09:12",
    actions: ["d"],
  },
  {
    id: "U003",
    username: "carol",
    email: "carol@example.com",
    role: "Staff",
    status: "Suspended",
    lastLogin: "2025-08-30 18:47",
    actions: ["d", "r"],
  },
];
