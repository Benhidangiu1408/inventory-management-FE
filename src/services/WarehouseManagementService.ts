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

  // delete: async (id: number) => {
  //   return apiClient.delete<void>(`${BASE_URL}/${id}`);
  // }
};
