import {
  AssignFaultOrderUsersRequest,
  CreateFaultBatchProcessOrderRequest,
  CreateFaultBatchRequest,
  CreateFaultOrderRequest,
  CreateFaultQuestionRequest,
  CreateFaultTaskRequest,
  CreateInventoryCheckRequest,
  FaultBatch,
  FaultBatchProcessOrder,
  FaultQuestion,
  FaultOrderStatus,
  FaultOrderSummary,
  FaultTask,
  InboundOutboundMonthlyPoint,
  InboundOutboundMonthlyRequest,
  InboundOutboundOrderCountResponse,
  InventoryCheckResponse,
  InventoryCheckSheetData,
  OverviewSummaryResponse,
  SubmitCheckResultRequest,
  UpdateFaultBatchHandlingStatusRequest,
  UpdateFaultBatchProcessOrderRequest,
  UpdateTasksStatusRequest,
} from "@/interfaces/inventoryManagementType";
import { apiClient } from "@/lib/api-mask";

export const inventoryCheckService = {
  getAll: async () => {
    return apiClient.get<InventoryCheckResponse[]>(
      "/inventory/v1/inventory-check/all",
      {
        cache: "no-store",
      },
    );
  },
  getDetail: async (id: number) => {
    return apiClient.get<InventoryCheckSheetData>(
      `/inventory/v1/inventory-check/${id}`,
      {
        cache: "no-cache",
      },
    );
  },
  create: async (data: CreateInventoryCheckRequest) => {
    return apiClient.post<CreateInventoryCheckRequest>(
      "/inventory/v1/inventory-check/new",
      data,
    );
  },
  start: async (id: number) => {
    return apiClient.post<void>(
      `/inventory/v1/inventory-check/${id}/start`,
      null,
    );
  },
  delete: async (id: number) => {
    return apiClient.delete<void>(
      `/inventory/v1/inventory-check/${id}/cancel`,
      null,
    );
  },
  submit: async (data: SubmitCheckResultRequest) => {
    return apiClient.post<SubmitCheckResultRequest>(
      `/inventory/v1/inventory-check/submit-results`,
      data,
    );
  },
  complete: async (id: number) => {
    return apiClient.post<void>(
      `/inventory/v1/inventory-check/${id}/complete`,
      null,
    );
  },
  approve: async (id: number) => {
    return apiClient.post<void>(
      `/inventory/v1/inventory-check/${id}/approve`,
      null,
    );
  },
  reject: async (id: number) => {
    return apiClient.post<void>(
      `/inventory/v1/inventory-check/${id}/reject`,
      null,
    );
  },
};

export const inventoryDashboardService = {
  getOverviewSummary: async () => {
    return apiClient.get<OverviewSummaryResponse>(
      "/inventory/v1/dashboard/overview",
      {
        cache: "no-store",
      },
    );
  },

  getInboundOutboundMonthlySummary: async (
    request?: InboundOutboundMonthlyRequest | null,
  ) => {
    return apiClient.post<InboundOutboundMonthlyPoint[]>(
      "/inventory/v1/dashboard/inbound-outbound/monthly",
      request ?? null,
    );
  },

  getInboundOutboundTotalSummary: async (
    request?: InboundOutboundMonthlyRequest | null,
  ) => {
    return apiClient.post<InboundOutboundOrderCountResponse>(
      "/inventory/v1/dashboard/inbound-outbound/total",
      request ?? null,
    );
  },
};

export const faultOrderService = {
  createFaultBatch: async (data: CreateFaultBatchRequest) => {
    const query = new URLSearchParams({
      batchId: String(data.batchId),
      handlingStatus: data.handlingStatus,
      referenceSheetId: String(data.referenceSheetId),
    }).toString();

    return apiClient.post<FaultBatch>(
      `/inventory/v1/fault-batches?${query}`,
      null,
    );
  },

  createFaultOrder: async (data: CreateFaultOrderRequest) => {
    const query = new URLSearchParams({
      referenceSheetId: String(data.referenceSheetId),
    }).toString();

    return apiClient.post<FaultOrderSummary>(
      `/inventory/v1/fault-orders?${query}`,
      null,
    );
  },

  assignAnalyzerAndAssignee: async (
    faultOrderId: number,
    data: AssignFaultOrderUsersRequest,
  ) => {
    return apiClient.post<FaultOrderSummary>(
      `/inventory/v1/fault-orders/${faultOrderId}/assign-users`,
      data,
    );
  },

  updateFaultOrderStatus: async (
    faultOrderId: number,
    status: FaultOrderStatus,
  ) => {
    const query = new URLSearchParams({
      status,
    }).toString();

    return apiClient.put<FaultOrderSummary>(
      `/inventory/v1/fault-orders/${faultOrderId}/status?${query}`,
      null,
    );
  },

  updateFaultOrderPriority: async (
    faultOrderId: number,
    priorityId?: number | null,
  ) => {
    const query =
      priorityId === null || priorityId === undefined
        ? ""
        : `?${new URLSearchParams({ priorityId: String(priorityId) }).toString()}`;

    return apiClient.put<FaultOrderSummary>(
      `/inventory/v1/fault-orders/${faultOrderId}/priority${query}`,
      null,
    );
  },

  getFaultOrder: async (faultOrderId: number) => {
    return apiClient.get<FaultOrderSummary>(
      `/inventory/v1/fault-orders/${faultOrderId}`,
      {
        cache: "no-cache",
      },
    );
  },

  getFaultOrdersByWarehouse: async (warehouseId?: number | null) => {
    const query = warehouseId ? `?warehouseId=${warehouseId}` : "";

    return apiClient.get<FaultOrderSummary[]>(
      `/inventory/v1/fault-orders${query}`,
      {
        cache: "no-store",
      },
    );
  },

  getFaultBatchProcessOrderWithDetails: async (
    faultBatchProcessOrderId: number,
  ) => {
    return apiClient.get<FaultBatchProcessOrder>(
      `/inventory/v1/process-orders/${faultBatchProcessOrderId}`,
      {
        cache: "no-cache",
      },
    );
  },

  getFaultBatchProcessOrdersByFaultOrderId: async (faultOrderId: number) => {
    return apiClient.get<FaultBatchProcessOrder[]>(
      `/inventory/v1/fault-orders/${faultOrderId}/process-orders`,
      {
        cache: "no-cache",
      },
    );
  },

  createFaultBatchProcessOrder: async (
    data: CreateFaultBatchProcessOrderRequest,
  ) => {
    return apiClient.post<FaultBatchProcessOrder>(
      "/inventory/v1/process-orders",
      data,
    );
  },

  updateFaultBatchProcessOrder: async (
    faultBatchProcessOrderId: number,
    data: UpdateFaultBatchProcessOrderRequest,
  ) => {
    return apiClient.put<FaultBatchProcessOrder>(
      `/inventory/v1/process-orders/${faultBatchProcessOrderId}`,
      data,
    );
  },

  updateProcessOrderApproval: async (faultBatchProcessOrderId: number) => {
    return apiClient.put<FaultBatchProcessOrder>(
      `/inventory/v1/process-orders/${faultBatchProcessOrderId}/approval`,
      null,
    );
  },

  createTasksForProcessOrder: async (
    faultBatchProcessOrderId: number,
    tasks: CreateFaultTaskRequest[],
  ) => {
    return apiClient.post<FaultTask[]>(
      `/inventory/v1/process-orders/${faultBatchProcessOrderId}/tasks`,
      tasks,
    );
  },

  addQuestionsToProcessOrder: async (
    faultBatchProcessOrderId: number,
    questions: CreateFaultQuestionRequest[],
  ) => {
    return apiClient.post<FaultQuestion[]>(
      `/inventory/v1/process-orders/${faultBatchProcessOrderId}/questions`,
      questions,
    );
  },

  updateTasksStatus: async (data: UpdateTasksStatusRequest) => {
    return apiClient.put<FaultTask[]>("/inventory/v1/tasks/status", data);
  },

  markFaultBatchesFixed: async (
    data: UpdateFaultBatchHandlingStatusRequest[],
  ) => {
    return apiClient.put<FaultBatch[]>(
      "/inventory/v1/fault-batches/handling-status",
      data,
    );
  },
  assignTaskToFaultBatch: async (
    faultBatchId: number,
    taskId?: number | null,
  ) => {
    const query =
      taskId === null || taskId === undefined ? "" : `?taskId=${taskId}`;
    return apiClient.put<FaultBatch>(
      `/inventory/v1/fault-batches/${faultBatchId}/task${query}`,
      null,
    );
  },
};
