import {
  Category,
  CategoryRequest,
  LocationBulkCreate,
  LocationResponse,
  LocationType,
  NewWarehouseRequest,
  WarehouseDetail,
  WarehouseGeneral,
} from "@/interfaces/warehouseManagementType";
import { apiClient } from "@/lib/api-mask";

export const categoryService = {
  getAll: async () => {
    return apiClient.get<Category[]>("/info/v1/category/all", {
      cache: "no-store",
    });
  },

  getById: async (id: number) => {
    return apiClient.get<Category>(`/info/v1/category/${id}`, {
      cache: "no-store",
    });
  },

  create: async (data: CategoryRequest) => {
    return apiClient.post<CategoryRequest>("/info/v1/category/new", data);
  },

  update: async (id: number, data: CategoryRequest) => {
    return apiClient.put<CategoryRequest>(
      `/info/v1/category/update/${id}`,
      data,
    );
  },

  // delete: async (id: number) => {
  //   return apiClient.delete<void>(`${BASE_URL}/${id}`);
  // }
};

export const warehouseService = {
  getAll: async () => {
    return apiClient.get<WarehouseGeneral[]>("/info/v1/warehouse/all", {
      cache: "no-store",
    });
  },
  getDetail: async (id: number) => {
    return apiClient.get<WarehouseDetail>(`/info/v1/warehouse/${id}`, {
      cache: "no-cache",
    });
  },

  create: async (data: NewWarehouseRequest) => {
    return apiClient.post<NewWarehouseRequest>("/info/v1/warehouse/new", data);
  },
  update: async (id: number, data: NewWarehouseRequest) => {
    return apiClient.put<NewWarehouseRequest>(
      `/info/v1/warehouse/update/${id}`,
      data,
    );
  },
};

export const locationService = {
  create: async (data: LocationBulkCreate) => {
    return apiClient.post<LocationBulkCreate>("/info/v1/location/new", data);
  },
  getAll: async (warehouseId: number) => {
    return apiClient.get<LocationResponse[]>(
      `/info/v1/warehouse/${warehouseId}/location/all`,
      {
        cache: "no-cache",
      },
    );
  },
  getRoot: async (warehouseId: number) => {
    return apiClient.get<LocationResponse[]>(
      `/info/v1/warehouse/${warehouseId}/location/roots`,
      {
        cache: "no-cache",
      },
    );
  },
  getChildren: async (warehouseId: number, parentId: number) => {
    return apiClient.get<LocationResponse[]>(
      `/info/v1/warehouse/${warehouseId}/location/children?parentId=${parentId}`,
      {
        cache: "no-cache",
      },
    );
  },
  getByType: async (warehouseId: number, type: LocationType) => {
    return apiClient.get<LocationResponse[]>(
      `/info/v1/warehouse/${warehouseId}/location/type?type=${type}`,
      {
        cache: "no-cache",
      },
    );
  },
};
