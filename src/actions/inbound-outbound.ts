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
  SupplierCreateReq,
} from "@/interfaces/inboundOutboundType";
import { LocationType } from "@/interfaces/warehouseManagementType";
import { inboundOutboundService } from "@/services/InboundOutboundService";

export async function createImportSheet(data: ImportSheetCreateReq) {
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
  return await inboundOutboundService.updateImportSheet(
    Number(importSheetId),
    data,
  );
}

export async function confirmImportSheet(
  importSheetId: number,
  data: ImportSheetUpdateReq,
) {
  return await inboundOutboundService.confirmImportSheet(importSheetId, data);
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

export async function getLocationByType(
  warehouseId: string | number,
  locationType: LocationType,
) {
  return await inboundOutboundService.getLocationByType(
    warehouseId,
    locationType,
  );
}

export async function createExportSheet(data: ExportSheetCreateReq) {
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
  return await inboundOutboundService.confirmExportSheet(exportSheetId, data);
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
