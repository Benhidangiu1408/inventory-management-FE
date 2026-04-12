export enum FaultOrderPermission {
  ASSIGN = "ASSIGN_USER",
  CREATE = "CREATE_PROCESS_ORDER",
  VIEW_ANALYSIS = "ANALYSIS_VIEW",
  VIEW_TASK = "TASK_VIEW",
  ANALYZE = "ANALYZE",
  ASSIGN_TASK = "ASSIGN_TASK",
  DO_TASK = "DO_TASK",
}

export enum Analyze {
  APPROVE = "APPROVE_PROCESS_ORDER",
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

export enum FaultBatchStatus {
  REPORTED = "REPORTED",
  PROCESSING = "PROCESSING",
  RESOLVED = "RESOLVED",
}

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

export enum TaskStatus {
  COMPLETED = "COMPLETED",
  IN_PROGRESS = "IN_PROGRESS",
  CREATED = "CREATED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
}

export enum PriorityLevel {
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
}

export interface BasicUserReference {
  id: number;
  username?: string;
  fullName?: string;
}

export interface BasicSheetReference {
  id: number;
  code?: string;
  warehouseId?: number;
  warehouseName?: string;
}

export interface BasicPriorityReference {
  id: number;
  name?: string;
  description?: string;
  level?: PriorityLevel;
}

export interface BasicProductVariantReference {
  id: number;
  sku?: string;
  name?: string;
}

export interface BasicSupplierReference {
  id: number;
  name?: string;
}

export interface BasicLocationReference {
  id: number;
  code?: string;
  name?: string;
}

export interface FaultBatchProcessOrderSummary {
  id: number;
  status: FaultProcessOrderStatus;
  type: FaultProcessOrderType;
  createdAt: string;
}

export interface FaultOrderSummary {
  id: number;
  code: string;
  status: FaultOrderStatus;
  createdAt: string;
  priorityId?: number | null;
  priorityName?: string | null;
  referenceSheetId?: number | null;
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
  initialQuantity?: number;
  productionDate?: string | null;
  productVariantId?: number | null;
  supplierId?: number | null;
  locationId?: number | null;
}

export interface FaultBatch extends Batch {
  handlingStatus?: FaultBatchStatus;
  createdAt?: string | null;
  faultOrder?: FaultOrderSummary | null;
  faultBatchProcessOrder?: FaultBatchProcessOrderSummary | null;
  faultBatchProcessOrderId?: number | null;
  taskId?: number | null;
}

export interface FaultOrderDetail extends FaultOrderSummary {
  faultBatches?: FaultBatch[];
  processOrders?: FaultBatchProcessOrderSummary[];
}

export interface FaultQuestion {
  id?: number;
  question: string;
  answer?: string | null;
}

export interface FaultTask {
  id?: number;
  task?: string;
  result?: string | null;
  dueDate?: string | null;
  status?: TaskStatus;
  assignedUserId?: number | null;
  assignedUsername?: string | null;
}

export interface FaultBatchProcessOrder {
  id: number;
  faultOrderId: number;
  status: FaultProcessOrderStatus;
  type: FaultProcessOrderType;
  note?: string | null;
  rootCause?: string | null;
  whatHappened?: string | null;
  impact?: string | null;
  createdAt: string;
  approveAt?: string | null;
  processedAt?: string | null;
  creatorId?: number | null;
  creatorUsername?: string | null;
  approvedById?: number | null;
  approvedByUsername?: string | null;
  faultBatches?: FaultBatch[];
  questions?: FaultQuestion[];
  tasks?: FaultTask[];
}

export interface CreateFaultBatchRequest {
  batchId: number;
  handlingStatus: FaultBatchStatus;
  referenceSheetId: number;
}

export interface CreateFaultOrderRequest {
  referenceSheetId: number;
}

export interface AssignFaultOrderUsersRequest {
  analyzerUserId?: number | null;
  assigneeUserId?: number | null;
  questionCreatorUserId?: number | null;
}

export interface UpdateFaultOrderStatusRequest {
  status: FaultOrderStatus;
}

export interface UpdateFaultOrderPriorityRequest {
  priorityId: number | null;
}

export interface CreateFaultQuestionRequest {
  question: string;
  answer?: string | null;
}

export interface CreateFaultTaskRequest {
  task?: string;
  result?: string | null;
  due_date?: string | null;
  status?: TaskStatus;
  assignedUser?: { id: number } | null;
}

export interface CreateFaultBatchProcessOrderRequest {
  faultOrderId: number;
  creatorUserId: number;
  status: FaultProcessOrderStatus;
  type: FaultProcessOrderType;
  note?: string | null;
  rootCause?: string | null;
  whatHappened?: string | null;
  impact?: string | null;
  faultBatchIds?: number[];
  questions?: CreateFaultQuestionRequest[];
}

export interface UpdateFaultBatchProcessOrderRequest {
  status: FaultProcessOrderStatus;
  type: FaultProcessOrderType;
  note?: string;
  rootCause?: string | null;
  whatHappened?: string | null;
  impact?: string | null;
  questions?: CreateFaultQuestionRequest[];
}

export interface UpdateTasksStatusRequest {
  taskIds: number[];
  status: TaskStatus;
}

export type UpdateFaultBatchHandlingStatusRequest = Pick<
  FaultBatch,
  "id" | "handlingStatus"
>;
