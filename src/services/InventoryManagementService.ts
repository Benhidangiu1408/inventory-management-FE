import {
  AssignFaultOrderUsersRequest,
  CreateFaultBatchProcessOrderRequest,
  CreateFaultTaskRequest,
  CreateInventoryCheckRequest,
  FaultBatch,
  FaultBatchProcessOrder,
  FaultQuestion,
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
  AnalyzeFaultBatchProcessOrderRequest,
  ProcessOrderDecisionRequest,
  UpdateTaskStatusRequest,
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

  assignAnalyzerAndAssignee: async (
    faultOrderId: number,
    data: AssignFaultOrderUsersRequest,
  ) => {
    return apiClient.post<FaultOrderSummary>(
      `/inventory/v1/fault-orders/${faultOrderId}/assign-users`,
      data,
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

  analyzeFaultBatchProcessOrder: async (
    faultBatchProcessOrderId: number,
    data: AnalyzeFaultBatchProcessOrderRequest,
  ) => {
    return apiClient.put<FaultBatchProcessOrder>(
      `/inventory/v1/process-orders/${faultBatchProcessOrderId}/analyzed-detail`,
      data,
    );
  },
  updateFaultBatchProcessOrderQuestion: async (
    faultBatchProcessOrderId: number,
    data: FaultQuestion[],
  ) => {
    return apiClient.put<FaultBatchProcessOrder>(
      `/inventory/v1/process-orders/${faultBatchProcessOrderId}/create-question`,
      data,
    );
  },

  updateProcessOrderDecision: async (
    faultBatchProcessOrderId: number,
    data: ProcessOrderDecisionRequest,
  ) => {
    return apiClient.put<FaultBatchProcessOrder>(
      `/inventory/v1/process-orders/${faultBatchProcessOrderId}/decision`,
      data,
    );
  },

  createTaskForProcessOrder: async (
    faultBatchProcessOrderId: number,
    task: CreateFaultTaskRequest,
  ) => {
    return apiClient.post<FaultTask>(
      `/inventory/v1/process-orders/${faultBatchProcessOrderId}/task`,
      task,
    );
  },
  updateTaskStatus: async (data: UpdateTaskStatusRequest) => {
    return apiClient.put<FaultTask>("/inventory/v1/task/status", data);
  },

  markFaultBatchesFixed: async (
    data: UpdateFaultBatchHandlingStatusRequest,
  ) => {
    return apiClient.put<FaultBatch>(
      "/inventory/v1/fault-batches/handling-status",
      data,
    );
  },
  assignTaskToFaultBatch: async (faultBatchId: number, taskId?: number) => {
    const query = !taskId ? "" : `?taskId=${taskId}`;
    return apiClient.put<FaultBatch>(
      `/inventory/v1/fault-batches/${faultBatchId}/task${query}`,
      null,
    );
  },
};
