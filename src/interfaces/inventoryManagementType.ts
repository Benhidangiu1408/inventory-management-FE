export enum SheetStatus {
  CREATED = "CREATED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  REJECTED = "REJECTED",
  APPROVED = "APPROVED",
}

// --- CREATE REQUEST ---
export interface CreateInventoryCheckRequest {
  warehouseId: number | null;
  // If empty array or null, it implies checking the entire warehouse
  targetProductIds: number[];
  assigneeId: number | null;
  plannedDate: string;
  note?: string;
  // Cycle Counting
  isCycleCheck: boolean;
  cycleIntervalDays?: number;
}

// --- SUMMARY RESPONSE (List View) ---
export interface InventoryCheckResponse {
  id: number;
  code: string;
  status: SheetStatus;
  plannedDate: string; // ISO Date
  note?: string;
  // Warehouse Info
  warehouseId: number;
  warehouseName: string;
  // Assignee Info
  assigneeId: number;
  assigneeName: string;
  // Config
  isCycleCheck: boolean;
  cycleIntervalDays?: number;
  // Display Info
  targetProductNames: string[]; // e.g. ["Coke", "Pepsi"] or ["Entire Warehouse"]
}

// --- WORKSHEET RESPONSE (Detail View) ---
export interface InventoryCheckSheetData {
  header: InventoryCheckResponse;
  products: InventoryCheckProductGroup[];
}

export interface InventoryCheckProductGroup {
  productSku: string;
  productName: string; // e.g. "T-Shirt (Red, XL)"
  unitName: string; // e.g. "Piece" (Base Unit)
  batches: InventoryCheckBatchRow[]; // List of specific batches for this product
}

// 2. Leaf node (Batch level)
export interface InventoryCheckBatchRow {
  detailId: number; // Use this ID to submit results
  batchCode: string;
  locationCode: string; // e.g. "A.01.05"
  storedQuantity: number; // System Snapshot
  scannedQuantity: number | null; // User Input (starts as null)
  hasFaults: boolean; // <--- Added flag (default false in Java mapper)
}

// --- ACTION REQUESTS ---
export interface SubmitCheckResultRequest {
  detailId: number;
  scannedQuantity: number;
  hasFaults: boolean;
}
