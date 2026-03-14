"use server";

import {
  ExportSheetCreateReq,
  ExportSheetDetailCreateReq,
  ExportSheetDetailUpdateReq,
  ImportSheetCreateReq,
  ImportSheetDetailCreateReq,
  ImportSheetDetailUpdateReq,
  ImportSheetUpdateReq,
  QCSheetUpdateReq,
  SetBatchLocationReq,
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
