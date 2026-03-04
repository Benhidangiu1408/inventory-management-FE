import {
  ImportSheetCreateReq,
  ImportSheetDetailCreateReq,
  ImportSheetDetailResponse,
  ImportSheetDetailUpdateReq,
  ImportSheetResponse,
  ImportSheetUpdateReq,
  PageResponse,
  ProductVariantResponse,
  WarehoseResponse,
} from "@/interfaces/inboundOutboundType";
import { apiClient } from "@/lib/api-mask";

export const inboundOutboundService = {
  getAll: async () => {
    return await apiClient.get<PageResponse<ImportSheetResponse>>(
      "/inbound-outbound/v1/import-sheet",
      {
        cache: "no-cache",
      },
    );
  },

  getImportSheetDetail: async (id: string) => {
    return await apiClient.get<ImportSheetResponse>(
      `/inbound-outbound/v1/import-sheet/${id}`,
      {
        cache: "no-cache",
      },
    );
  },

  getWarehouses: async () => {
    return await apiClient.get<WarehoseResponse[]>(
      "/inbound-outbound/v1/warehouses",
      {
        cache: "no-cache",
      },
    );
  },

  getProductVariants: async () => {
    return await apiClient.get<ProductVariantResponse[]>(
      "/inbound-outbound/v1/product-variants",
      {
        cache: "no-cache",
      },
    );
  },

  createImportSheet: async (data: ImportSheetCreateReq) => {
    return await apiClient.post<ImportSheetResponse>(
      "/inbound-outbound/v1/import-sheet",
      data,
    );
  },

  createImportSheetDetail: async (
    importSheetId: string | number,
    data: ImportSheetDetailCreateReq,
  ) => {
    return await apiClient.post<ImportSheetDetailResponse>(
      `/inbound-outbound/v1/import-sheet/${importSheetId}/detail`,
      data,
    );
  },

  updateImportSheetDetail: async (
    importSheetId: string | number,
    importSheetDetailId: string | number,
    data: ImportSheetDetailUpdateReq,
  ) => {
    return await apiClient.patch<ImportSheetDetailResponse>(
      `/inbound-outbound/v1/import-sheet/${importSheetId}/detail/${importSheetDetailId}`,
      data,
    );
  },

  updateImportSheet: async (
    importSheetId: number,
    data: ImportSheetUpdateReq,
  ) => {
    return await apiClient.patch<ImportSheetResponse>(
      `/inbound-outbound/v1/import-sheet/${importSheetId}`,
      data,
    );
  },
};
