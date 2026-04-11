import {
  AttributeRequest,
  AttributeResponse,
  Category,
  CategoryRequest,
  LocationBulkCreate,
  LocationResponse,
  LocationType,
  NewWarehouseRequest,
  ProductAddConversionRequest,
  ProductCreateRequest,
  ProductResponse,
  ProductUpdateRequest,
  UnitRequest,
  UnitResponse,
  VariantCreateRequest,
  VariantResponse,
  VariantUpdateRequest,
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
  delete: async (id: number) => {
    return apiClient.delete<void>(`/info/v1/category/delete/${id}`, null);
  },
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
  delete: async (id: number) => {
    return apiClient.delete<void>(`/info/v1/warehouse/delete/${id}`, null);
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
  delete: async (id: number) => {
    return apiClient.delete<void>(`/info/v1/location/delete/${id}`, null);
  },
};

export const unitService = {
  getAll: async () => {
    return apiClient.get<UnitResponse[]>("/info/v1/unit/all", {
      cache: "no-store",
    });
  },

  create: async (data: UnitRequest) => {
    return apiClient.post<UnitRequest>("/info/v1/unit/new", data);
  },

  update: async (id: number, data: UnitRequest) => {
    return apiClient.put<UnitRequest>(`/info/v1/unit/update/${id}`, data);
  },
};

export const attributesService = {
  getAll: async () => {
    return apiClient.get<AttributeResponse[]>("/info/v1/attributes/all", {
      cache: "no-store",
    });
  },

  create: async (data: AttributeRequest) => {
    return apiClient.post<AttributeRequest>("/info/v1/attributes/new", data);
  },

  update: async (id: number, data: AttributeRequest) => {
    return apiClient.put<AttributeRequest>(
      `/info/v1/attributes/update/${id}`,
      data,
    );
  },
};

export const productService = {
  getAll: async () => {
    return apiClient.get<ProductResponse[]>("/info/v1/product/all", {
      cache: "no-store",
    });
  },
  getById: async (id: number) => {
    return apiClient.get<ProductResponse>(`/info/v1/product/${id}`, {
      cache: "no-store",
    });
  },
  create: async (data: ProductCreateRequest) => {
    return apiClient.post<ProductCreateRequest>("/info/v1/product/new", data);
  },
  update: async (id: number, data: ProductUpdateRequest) => {
    return apiClient.put<ProductResponse>(
      `/info/v1/product/update/${id}`,
      data,
    );
  },
  createConversion: async (id: number, data: ProductAddConversionRequest) => {
    return apiClient.post<void>(`/info/v1/product/${id}/conversion/new`, data);
  },
  toggleConversion: async (id: number) => {
    return apiClient.put<void>(
      `/info/v1/product/conversion/toggle/${id}`,
      null,
    );
  },

  createVariant: async (data: VariantCreateRequest) => {
    return apiClient.post<VariantCreateRequest>(
      "/info/v1/product/variant/new",
      data,
    );
  },

  deleteProduct: async (id: number) => {
    return apiClient.delete<void>(`/info/v1/product/delete/${id}`, null);
  },
  deleteVariant: async (id: number) => {
    return apiClient.delete<void>(
      `/info/v1/product/variants/delete/${id}`,
      null,
    );
  },
  updateVariant: async (id: number, data: VariantUpdateRequest) => {
    return apiClient.put<VariantResponse>(
      `/info/v1/product/variants/update/${id}`,
      data,
    );
  },
};
