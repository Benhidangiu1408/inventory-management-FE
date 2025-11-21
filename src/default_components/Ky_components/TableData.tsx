import { Product } from "./ExpandableTableHeaders";
import {
  UserRow,
  OrderRow,
  FaultBatch,
  ProcessingOrder,
} from "@/components/table/TableHeader";

export const productData: Product[] = [
  {
    id: "P-001",
    name: "Widget AOne item is dentOne item is dentOne item is dentOne item is dentOne item is dent",
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
        isFaulty: false,
        note: "One item is dent",
        status: "confirmed",
      },
      {
        code: "A-BATCH-02",
        scannedQty: 45,
        systemQty: 50,
        scannedBy: "Bob",
        isFaulty: false,
        note: "Filing for investigation",
        status: "confirmed",
      },
      {
        code: "A-BATCH-03",
        scannedQty: 50,
        systemQty: 50,
        isFaulty: false,
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
        isFaulty: false,
        note: "1 extra, return to supplier",
        status: "confirmed",
      },
      {
        code: "B-BATCH-02",
        scannedQty: 40,
        systemQty: 39,
        scannedBy: "Evan",
        isFaulty: false,
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
        isFaulty: false,
        note: "",
        status: "confirmed",
      },
      {
        code: "C-BATCH-02",
        scannedQty: 0,
        systemQty: 100,
        scannedBy: "N/A",
        isFaulty: false,
        note: "",
        status: "awaiting",
      },
    ],
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

export const orderData: OrderRow[] = [
  {
    orderId: "ER-2025-001",
    date: "01-01-2025",
    warehouse: "Warehouse 1",
    priority: "High",
    handle: "Pending",
    actions: ["edit", "check"],
  },
  {
    orderId: "ER-2025-002",
    date: "02-02-2025",
    warehouse: "Warehouse 1",
    priority: "Low",
    handle: "Completed",
    actions: ["edit", "check"],
  },
  {
    orderId: "ER-2025-003",
    date: "03-03-2025",
    warehouse: "Warehouse 2",
    priority: "High",
    handle: "In progress",
    actions: ["edit", "check"],
  },
  {
    orderId: "ER-2025-004",
    date: "04-04-2025",
    warehouse: "Warehouse 3",
    priority: "Medium",
    handle: "Pending",
    actions: ["edit", "check"],
  },
];

export const faultBatchData: FaultBatch[] = [
  {
    id: "SI-2025-001",
    date: "01-01-2025",
    status: "Pending",
    priority: "High",
    checked: true,
  },
  {
    id: "SI-2025-002",
    date: "02-02-2025",
    status: "Completed",
    priority: "Low",
    checked: true,
  },
  {
    id: "SI-2025-003",
    date: "03-03-2025",
    status: "In progress",
    priority: "High",
    checked: true,
  },
  {
    id: "SI-2025-004",
    date: "04-04-2025",
    status: "Approve",
    priority: "Medium",
    checked: true,
  },
];
export const faultBatchData2: FaultBatch[] = [
  {
    id: "SI-2025-001",
    date: "01-01-2025",
    status: "Pending",
    priority: "High",
    checked: false,
  },
  {
    id: "SI-2025-002",
    date: "02-02-2025",
    status: "Completed",
    priority: "Low",
    checked: false,
  },
  {
    id: "SI-2025-003",
    date: "03-03-2025",
    status: "In progress",
    priority: "High",
    checked: false,
  },
  {
    id: "SI-2025-004",
    date: "04-04-2025",
    status: "Approve",
    priority: "Medium",
    checked: false,
  },
];
export const processingOrderData: ProcessingOrder[] = [
  {
    orderId: "SI-2025-001",
    orderType: "Returned",
    action: "",
  },
  {
    orderId: "SI-2025-002",
    orderType: "Canceled",
    action: "",
  },
  {
    orderId: "SI-2025-003",
    orderType: "Other",
    action: "",
  },
  {
    orderId: "SI-2025-004",
    orderType: "Canceled",
    action: "",
  },
];
