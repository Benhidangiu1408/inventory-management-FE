export enum FaultOrderPermission {
  ASSIGN = "ASSIGN_USER",
  CREATE = "CREATE_PROCESS_ORDER",
  // VIEW_ANALYSIS = "ANALYSIS_VIEW",
  // VIEW_TASK = "TASK_VIEW",
  // ANALYZE = "ANALYZE",
  // ASSIGN_TASK = "ASSIGN_TASK",
  // DO_TASK = "DO_TASK",
  FAULT_HANDLER = "FAULT_HANDLER",
  APPROVE = "APPROVE_PROCESS_ORDER",
  VIEW_FAULT_LIST = "VIEW_FAULT_LIST",
}

export enum SheetStatus {
  CREATED = "CREATED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  REJECTED = "REJECTED",
  APPROVED = "APPROVED",
  WAIT_FOR_MAPPING = "WAIT_FOR_MAPPING",
}

// --- CREATE REQUEST ---
export interface CreateInventoryCheckRequest {
  warehouseId: number | null;
  // If empty array or null, it implies checking the entire warehouse
  targetProductIds: number[];
  creatorId: number | null;
  assignedUserId: number | null;
  plannedDate: string;
  note: string | null;
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
  warehouseCode: string;
  warehouseName: string;
  // Assignee Info
  assigneeId: number;
  assigneeName: string;
  creatorId: number;
  creatorName: string;
  approvalName: string;
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
  description: string;
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
  unit: string; // e.g. "Piece" (Base Unit)
  secondUnit: string;
  conversionRate: number;

  draftQuantity?: number | null;
  draftFaults?: boolean;
}

// --- ACTION REQUESTS ---
export enum FaultOrderStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}
export enum FaultProcessOrderStatus {
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
  IN_PROGRESS = "IN_PROGRESS",
}
export enum FaultProcessOrderType {
  RETURNED = "RETURNED",
  CANCELLED = "CANCELLED",
  OTHER = "OTHER",
  SHORTAGE = "SHORTAGE",
  WAREHOUSE_TRANSFER = "WAREHOUSE_TRANSFER",
}
export enum FaultBatchStatus {
  REPORTED = "REPORTED",
  PROCESSING = "PROCESSING",
  RESOLVED = "RESOLVED",
}

export interface FaultOrderSummary {
  id: number;
  code: string;
  status: FaultOrderStatus;
  createdAt: string;
  warehouseCode: string;
  warehouseName: string;
  analyzerId?: number | null;
  analyzerUsername?: string | null;
  taskAssigneeId?: number | null;
  taskAssigneeUsername?: string | null;
  questionCreatorId?: number | null;
  questionCreatorUsername?: string | null;
  faultBatches?: FaultBatch[];
  processOrders?: FaultBatchProcessOrderSummary[];
}

export interface Batch {
  id: number;
  code: string;
  status?: string;
  locationCode?: number | null;
}

export interface FaultBatch extends Batch {
  handlingStatus?: FaultBatchStatus;
  createdAt?: string | null;
  faultBatchProcessOrderId?: number | null;
  taskId?: number | null;
}

export interface TaskBatchResponse extends FaultBatch {
  taskId: number;
  taskName: string;
  assignedUserId: number;
  assignedUserUsername: string;
}

export interface FaultBatchProcessOrderSummary {
  id: number;
  status: FaultProcessOrderStatus;
  type: FaultProcessOrderType;
  createdAt: string;
}

export interface CreateFaultBatchProcessOrderRequest {
  faultOrderId: number;
  creatorUserId: number;
  faultBatchIds?: number[];
}

export interface FaultBatchProcessOrder {
  id: number;
  status: FaultProcessOrderStatus;
  type: FaultProcessOrderType;
  note?: string | null;
  rootCause?: string | null;
  whatHappened?: string | null;
  impact?: string | null;
  createdAt: string;
  approveAt?: string | null;
  creatorId?: number | null;
  creatorUsername?: string | null;
  approvedById?: number | null;
  approvedByUsername?: string | null;
  faultBatches?: FaultBatch[];
  questions?: FaultQuestion[];
  tasks?: FaultTask[];
}

export interface FaultQuestion {
  id?: number;
  question: string;
  answer?: string | null;
}

export interface FaultTask {
  id?: number;
  task?: string;
  dueDate?: string | null;
  status?: TaskStatus;
  assignedUserId?: number | null;
  assignedUsername?: string | null;
}

export interface AnalyzeFaultBatchProcessOrderRequest {
  type: FaultProcessOrderType;
  rootCause?: string | null;
  whatHappened?: string | null;
  impact?: string | null;
  questions?: FaultQuestion[];
}
export interface ProcessOrderDecisionRequest {
  status: FaultProcessOrderStatus;
  note?: string;
}

export enum TaskStatus {
  COMPLETED = "COMPLETED",
  IN_PROGRESS = "IN_PROGRESS",
  CREATED = "CREATED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
}

export interface CreateFaultTaskRequest {
  task: string;
  dueDate: string;
  assignedUserId: number;
}
export interface UpdateTaskStatusRequest {
  taskId: number;
  status: TaskStatus;
}

export type UpdateFaultBatchHandlingStatusRequest = {
  batchId: number;
  status: FaultBatchStatus;
};

// Checked

export interface SubmitCheckResultRequest {
  detailId: number;
  scannedQuantity: number;
  hasFaults: boolean;
}

export interface MonthYearFilter {
  month: number;
  year: number;
}

export interface InboundOutboundMonthlyRequest {
  months: MonthYearFilter[];
}

export interface FaultStatusCount {
  handlingStatus: string;
  total: number;
}

export interface ProductQuantitySummary {
  productId: number | null;
  productCode: string;
  productName: string;
  totalQuantity: number;
}

export interface OverviewSummaryResponse {
  totalCategories: number;
  totalProducts: number;
  totalWarehouses: number;
  todayInboundOrders: number;
  todayOutboundOrders: number;
  faultCounts: FaultStatusCount[];
  productQuantities: ProductQuantitySummary[];
}

export interface InboundOutboundMonthlyPoint {
  month: string;
  inboundQuantity: number;
  outboundQuantity: number;
}

export interface InboundOutboundOrderCountPoint {
  month: string;
  inboundOrders: number;
  outboundOrders: number;
  totalOrders: number;
}

export interface InboundOutboundOrderCountResponse {
  totalInboundOrders: number;
  totalOutboundOrders: number;
  totalOrders: number;
  monthlyOrderCounts: InboundOutboundOrderCountPoint[];
}

export interface BasicSheetReference {
  id: number;
  code?: string;
  warehouseId?: number;
  warehouseName?: string;
}

export interface BasicLocationReference {
  id: number;
  code?: string;
  name?: string;
}

export interface AssignFaultOrderUsersRequest {
  analyzerUserId?: number | null;
  assigneeUserId?: number | null;
  questionCreatorUserId?: number | null;
}
