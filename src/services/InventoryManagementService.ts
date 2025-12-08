import {
  CreateInventoryCheckRequest,
  InventoryCheckResponse,
  InventoryCheckSheetData,
  SubmitCheckResultRequest,
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
