import {
  ImportSheetCreateReq,
  ImportSheetResponse,
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
};
