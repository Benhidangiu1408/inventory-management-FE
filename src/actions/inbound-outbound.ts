"use server";

import {
  CustomerCreateReq,
  ExportSheetCreateReq,
  ExportSheetDetailCreateReq,
  ExportSheetDetailUpdateReq,
  ExportSheetUpdateReq,
  ImportSheetCreateReq,
  ImportSheetDetailCreateReq,
  ImportSheetDetailUpdateReq,
  ImportSheetUpdateReq,
  QCSheetUpdateReq,
  SetBatchLocationReq,
  SetSingleBatchLocationReq,
  SupplierCreateReq,
} from "@/interfaces/inboundOutboundType";
import {
  LocationType,
  WarehouseType,
} from "@/interfaces/warehouseManagementType";
import { inboundOutboundService } from "@/services/InboundOutboundService";
import { cookies } from "next/headers";

export async function getWarehouses(
  warehouseType: WarehouseType = WarehouseType.STORAGE,
) {
  return await inboundOutboundService.getWarehouses(warehouseType);
}

export async function createImportSheet(data: ImportSheetCreateReq) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  data.userId = Number(userId);
  return await inboundOutboundService.createImportSheet(data);
}

export async function createImportSheetDetail(
  importSheetId: string | number,
  data: ImportSheetDetailCreateReq,
) {
  return await inboundOutboundService.createImportSheetDetail(
    importSheetId,
    data,
  );
}

export async function deleteImportSheetDetail(
  importSheetId: string | number,
  importSheetDetailId: string | number,
) {
  return await inboundOutboundService.deleteImportSheetDetail(
    importSheetId,
    importSheetDetailId,
  );
}

export async function updateImportSheetDetail(
  importSheetId: string | number,
  importSheetDetailId: string | number,
  data: ImportSheetDetailUpdateReq,
) {
  return await inboundOutboundService.updateImportSheetDetail(
    importSheetId,
    importSheetDetailId,
    data,
  );
}

export async function updateImportSheet(
  importSheetId: string | number,
  data: ImportSheetUpdateReq,
) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  data.userId = Number(userId);
  return await inboundOutboundService.updateImportSheet(
    Number(importSheetId),
    data,
  );
}

export async function confirmImportSheet(
  importSheetId: number,
  data: ImportSheetUpdateReq,
) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  data.userId = Number(userId);
  return await inboundOutboundService.confirmImportSheet(importSheetId, data);
}

export async function confirmQuantityCheck(
  importSheetId: number,
  data: ImportSheetUpdateReq,
) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  data.userId = Number(userId);
  return await inboundOutboundService.confirmQuantityCheck(importSheetId, data);
}

export async function updateQCSheet(
  qcSheetId: string | number,
  data: QCSheetUpdateReq,
) {
  return await inboundOutboundService.updateQCSheet(qcSheetId, data);
}

export async function setBatchLocations(
  importSheetId: number | string,
  data: SetBatchLocationReq[],
) {
  return await inboundOutboundService.setBatchLocations(importSheetId, data);
}

export async function setBatchLocationSingle(
  importSheetId: number | string,
  data: SetSingleBatchLocationReq,
) {
  return await inboundOutboundService.setBatchLocationSingle(importSheetId, data);
}

export async function finalizeImportSheet(importSheetId: number | string) {
  return await inboundOutboundService.finalizeImportSheet(importSheetId);
}

export async function getLocationByType(
  warehouseId: string | number,
  locationType: LocationType,
) {
  return await inboundOutboundService.getLocationByType(
    warehouseId,
    locationType,
  );
}

export async function getLocationsByBatch(
  batchId: number | string,
  warehouseId?: number | string,
) {
  return await inboundOutboundService.getLocationsByBatch(batchId, warehouseId);
}

export async function createExportSheet(data: ExportSheetCreateReq) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  data.userId = Number(userId);
  return await inboundOutboundService.createExportSheet(data);
}

export async function createExportSheetDetail(
  exportSheetId: string | number,
  data: ExportSheetDetailCreateReq,
) {
  return await inboundOutboundService.createExportSheetDetail(
    exportSheetId,
    data,
  );
}

export async function updateExportSheet(
  exportSheetId: string | number,
  data: ExportSheetUpdateReq,
) {
  return await inboundOutboundService.updateExportSheet(exportSheetId, data);
}

export async function deleteExportSheetDetail(
  exportSheetId: string | number,
  exportSheetDetailId: string | number,
) {
  return await inboundOutboundService.deleteExportSheetDetail(
    exportSheetId,
    exportSheetDetailId,
  );
}

export async function updateExportSheetDetail(
  exportSheetId: string | number,
  exportSheetDetailId: string | number,
  data: ExportSheetDetailUpdateReq,
) {
  return await inboundOutboundService.updateExportSheetDetail(
    exportSheetId,
    exportSheetDetailId,
    data,
  );
}

export async function getExportedItemsByBatchId(
  batchId: number,
  detailId: number,
) {
  return await inboundOutboundService.getExportedItemsByBatchId(
    batchId,
    detailId,
  );
}

export async function getCustomers() {
  return await inboundOutboundService.getCustomers();
}

export async function createCustomer(data: CustomerCreateReq) {
  return await inboundOutboundService.createCustomer(data);
}

export async function getSuppliers() {
  return await inboundOutboundService.getSuppliers();
}

export async function createSupplier(data: SupplierCreateReq) {
  return await inboundOutboundService.createSupplier(data);
}

export async function confirmExportSheet(
  exportSheetId: number | string,
  data: ExportSheetUpdateReq,
) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  data.userId = Number(userId);
  return await inboundOutboundService.confirmExportSheet(exportSheetId, data);
}

export async function getProductVariantsInStock() {
  return await inboundOutboundService.getProductVariantsInStock();
}

export async function getItemsByProductVariantInExportSheet(
  productVariantId: number,
  exportSheetId: number,
) {
  return await inboundOutboundService.getItemsByProductVariantInExportSheet(
    productVariantId,
    exportSheetId,
  );
}

export async function getBatchesByProductVariantId(productVariantId: number) {
  return await inboundOutboundService.getBatchesByProductVariantId(
    productVariantId,
  );
}

export async function deleteExportSheetItem(exportSheetItemId: number) {
  return await inboundOutboundService.deleteExportSheetItem(exportSheetItemId);
}

export async function getBarcodeFromActiveBatchWithLocation(
  productVariantId: number,
) {
  return await inboundOutboundService.getBarcodeFromActiveBatchWithLocation(
    productVariantId,
  );
}
