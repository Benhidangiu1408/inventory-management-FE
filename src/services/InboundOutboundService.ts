import {
  BatchResponse,
  ExportSheetCreateReq,
  ExportSheetDetailCreateReq,
  ExportSheetDetailResponse,
  ExportSheetDetailUpdateReq,
  ExportSheetResponse,
  ImportSheetCreateReq,
  ImportSheetDetailCreateReq,
  ImportSheetDetailResponse,
  ImportSheetDetailUpdateReq,
  ImportSheetResponse,
  ImportSheetUpdateReq,
  LocationResponse,
  PageResponse,
  ProductVariantResponse,
  QCSheetResponse,
  QCSheetUpdateReq,
  SetBatchLocationReq,
  WarehoseResponse,
} from "@/interfaces/inboundOutboundType";
import { LocationType } from "@/interfaces/warehouseManagementType";
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

  confirmImportSheet: async (
    importSheetId: number,
    data: ImportSheetUpdateReq,
  ) => {
    return await apiClient.post<ImportSheetResponse>(
      `/inbound-outbound/v1/import-sheet/${importSheetId}/confirm`,
      data,
    );
  },

  getQCSheetByImportSheetId: async (importSheetId: string) => {
    return await apiClient.get<QCSheetResponse>(
      `/inbound-outbound/v1/qc-sheet/import-sheet/${importSheetId}`,
    );
  },

  updateQCSheet: async (qcSheetId: string | number, data: QCSheetUpdateReq) => {
    return await apiClient.patch<QCSheetResponse>(
      `/inbound-outbound/v1/qc-sheet/${qcSheetId}`,
      data,
    );
  },

  getLocationByType: async (
    warehouseId: string | number,
    locationType: LocationType,
  ) => {
    return await apiClient.get<LocationResponse[]>(
      `/inbound-outbound/v1/locations/${warehouseId}/${locationType}`,
    );
  },

  setBatchLocations: async (
    importSheetId: number | string,
    data: SetBatchLocationReq[],
  ) => {
    return await apiClient.post<ImportSheetResponse>(
      `/inbound-outbound/v1/import-sheet/${importSheetId}/batch-location`,
      data,
    );
  },

  getAllExportSheets: async () => {
    return await apiClient.get<ExportSheetResponse[]>(
      `/inbound-outbound/v1/export-sheet`,
    );
  },

  createExportSheet: async (data: ExportSheetCreateReq) => {
    return await apiClient.post<ExportSheetResponse[]>(
      `/inbound-outbound/v1/export-sheet`,
      data,
    );
  },

  getExportSheetById: async (id: string) => {
    return await apiClient.get<ExportSheetResponse>(
      `/inbound-outbound/v1/export-sheet/${id}`,
    );
  },

  createExportSheetDetail: async (
    exportSheetId: string | number,
    data: ExportSheetDetailCreateReq,
  ) => {
    return await apiClient.post<ExportSheetDetailResponse>(
      `/inbound-outbound/v1/export-sheet/${exportSheetId}/detail`,
      data,
    );
  },

  updateExportSheetDetail: async (
    exportSheetId: string | number,
    exportSheetDetailId: string | number,
    data: ExportSheetDetailUpdateReq,
  ) => {
    return await apiClient.patch<ExportSheetDetailResponse>(
      `/inbound-outbound/v1/export-sheet/${exportSheetId}/detail/${exportSheetDetailId}`,
      data,
    );
  },
};
