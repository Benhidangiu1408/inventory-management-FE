import {
  CustomerCreateReq,
  CustomerResponse,
  ExportedItemResponse,
  ExportSheetCreateReq,
  ExportSheetDetailCreateReq,
  ExportSheetDetailResponse,
  ExportSheetDetailUpdateReq,
  ExportSheetResponse,
  ExportSheetUpdateReq,
  ImportSheetCreateReq,
  ImportSheetDetailCreateReq,
  ImportSheetDetailResponse,
  ImportSheetDetailUpdateReq,
  ImportSheetResponse,
  ImportSheetUpdateReq,
  ItemResponse,
  LocationResponse,
  ProductVariantResponse,
  QCSheetResponse,
  QCSheetUpdateReq,
  SetBatchLocationReq,
  SupplierCreateReq,
  SupplierResponse,
  WarehoseResponse,
} from "@/interfaces/inboundOutboundType";
import {
  LocationType,
  WarehouseType,
} from "@/interfaces/warehouseManagementType";
import { apiClient } from "@/lib/api-mask";

export const inboundOutboundService = {
  getAll: async () => {
    return await apiClient.get<ImportSheetResponse[]>(
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

  getWarehouses: async (
    warehouseType: WarehouseType = WarehouseType.STORAGE,
  ) => {
    return await apiClient.get<WarehoseResponse[]>(
      `/inbound-outbound/v1/warehouses?warehouseType=${warehouseType}`,
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

  deleteImportSheetDetail: async (
    importSheetId: string | number,
    importSheetDetailId: string | number,
  ) => {
    return await apiClient.delete<{ message: string }>(
      `/inbound-outbound/v1/import-sheet/${importSheetId}/detail/${importSheetDetailId}`,
      {},
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
    return await apiClient.post<ExportSheetResponse>(
      `/inbound-outbound/v1/export-sheet`,
      data,
    );
  },

  getExportSheetById: async (id: string) => {
    return await apiClient.get<ExportSheetResponse>(
      `/inbound-outbound/v1/export-sheet/${id}`,
    );
  },

  updateExportSheet: async (
    id: string | number,
    data: ExportSheetUpdateReq,
  ) => {
    return await apiClient.patch<ExportSheetResponse>(
      `/inbound-outbound/v1/export-sheet/${id}`,
      data,
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

  deleteExportSheetDetail: async (
    exportSheetId: string | number,
    exportSheetDetailId: string | number,
  ) => {
    return await apiClient.delete<{ message: string }>(
      `/inbound-outbound/v1/export-sheet/${exportSheetId}/detail/${exportSheetDetailId}`,
      {},
    );
  },

  getExportedItemsByBatchId: async (batchId: number, detailId: number) => {
    return await apiClient.get<ExportedItemResponse[]>(
      `/inbound-outbound/v1/export-sheet/detail/${detailId}/${batchId}/items`,
    );
  },

  confirmExportSheet: async (
    exportSheetId: number | string,
    data: ExportSheetUpdateReq,
  ) => {
    return await apiClient.post<ExportSheetResponse>(
      `/inbound-outbound/v1/export-sheet/${exportSheetId}/confirm`,
      data,
    );
  },

  getCustomers: async () => {
    return await apiClient.get<CustomerResponse[]>(
      "/inbound-outbound/v1/customers",
      { cache: "no-cache" },
    );
  },

  createCustomer: async (data: CustomerCreateReq) => {
    return await apiClient.post<CustomerResponse>(
      "/inbound-outbound/v1/customers",
      data,
    );
  },

  getSuppliers: async () => {
    return await apiClient.get<SupplierResponse[]>(
      "/inbound-outbound/v1/suppliers",
      { cache: "no-cache" },
    );
  },

  createSupplier: async (data: SupplierCreateReq) => {
    return await apiClient.post<SupplierResponse>(
      "/inbound-outbound/v1/suppliers",
      data,
    );
  },

  getItemsByProductVariantInExportSheet: async (
    productVariantId: number,
    exportSheetId: number,
  ) => {
    return await apiClient.get<ItemResponse>(
      `/inbound-outbound/v1/items/${exportSheetId}/${productVariantId}`,
    );
  },
};
