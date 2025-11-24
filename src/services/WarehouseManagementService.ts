import {
  Category,
  CategoryRequest,
} from "@/interfaces/warehouseManagementType";
import { apiClient } from "@/lib/api-mask";

export const categoryService = {
  getAll: async () => {
    return apiClient.get<Category[]>("/info/v1/categories", {
      cache: "no-store",
    });
  },

  getById: async (id: number) => {
    return apiClient.get<Category>(`/info/v1/categories/${id}`, {
      cache: "no-store",
    });
  },

  create: async (data: CategoryRequest) => {
    return apiClient.post<Category>("/info/v1/categories/new", data);
  },

  update: async (id: number, data: CategoryRequest) => {
    return apiClient.put<Category>(`/info/v1/categories/update/${id}`, data);
  },

  // NEW: Update Status Only
  // updateStatus: async (id: number, status: CategoryStatus) => {
  //   const payload: CategoryStatusRequest = { status };
  //   // Calls PATCH /api/v1/categories/{id}/status
  //   return apiClient.patch<void>(`${BASE_URL}/${id}/status`, payload);
  // },

  // delete: async (id: number) => {
  //   return apiClient.delete<void>(`${BASE_URL}/${id}`);
  // }
};
