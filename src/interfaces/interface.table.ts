import { ReactNode } from "react";
import {
  ImportSheetDetailMappingStatus,
  QCSheetDetailStatus,
  UnitConversionResponse,
  UnitResponse,
} from "./inboundOutboundType";

export interface ImportRow {
  id: number;
  status: string;
  type: string;
  createdAt: string;
  actions?: ReactNode;
}

export interface ExportRow {
  id: number;
  type: string; // Loại phiếu xuất: manufacturer, purchase-order, transfer
  warehouse: string;
  status: string; // Trạng thái active/inactive
  createdAt: string;
  actions?: ReactNode;
}

export interface ProductRow {
  batchId: string;
  productName: string;
  expectedQuantity: number;
  actualQuantity: number;
  totalValue: number;
  qcResult: string;
  reason: string;
}

export interface StorageLocationRow {
  batchId: string;
  productName: string;
  expectedQuantity: number;
  actualQuantity: number;
  storageLocation: string;
}

export interface ProductTempRow {
  detailId: number;
  id: number;
  name: string;
  description: string;
  expectedQuantity: number;
  unit: UnitResponse;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
}

export interface QuantityCheckRow {
  detailId: number;
  productVariantId: number;
  name: string;
  description: string;
  expectedQuantity: number;
  actualQuantity: number;
  unit: string;
  variance: number;
  reason: string;
}

export interface QualityCheckRow {
  detailId: number;
  batchCode: string;
  name: string;
  description: string;
  quantity: number;
  qualityStatus: QCSheetDetailStatus;
  unit: string;
  reason: string;
  notes: string;
}

export interface StorageLocationCheckRow {
  detailId: number;
  batchCode: string;
  name: string;
  description: string;
  quantity: number;
  storageLocation: string;
  notes: string;
}

export interface ExportConfirmRow {
  batchId: string;
  productName: string;
  currentStock: number;
  actualQuantity: number;
  location: string;
  totalValue: number;
  reason: string;
}

export interface ImportCreateRow {
  checkBox: boolean;
  productId: string;
  name: string;
  description: string;
  unit: UnitResponse;
  /** Unit selected for creating import detail */
  unitId: number;
  unitConversions: UnitConversionResponse[];
  pickQuantity: number | string; // can be number or string for easy input in
  unitSelect?: ReactNode;
  weight?: number | string;
  length?: number | string;
  width?: number | string;
  height?: number | string;
}

export interface ExportQuantityCheckRow {
  detailId: number;
  batchId: number;
  batchCode: string;
  quantity: number;
  location: string;
  actions?: ReactNode;
}

export interface ProductMappingRow {
  detailId: number;
  index: number;
  rawProductName: string;
  rawSku: string;
  rawUnit: string;
  expectedQuantity: number;
  systemProductId: string;
  systemUnitId: string;
  mappingStatus: ImportSheetDetailMappingStatus;
}

export interface ThirdPartyRequestProduct {
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
}

export interface ThirdPartyRequest {
  requestId: string;
  thirdPartyName: string;
  thirdPartyContact: string;
  date: string;
  products: ThirdPartyRequestProduct[];
}

/** Row type cho bảng items trong modal xem chi tiết */
export interface ExportItemModalRow {
  id: number;
  itemId: number;
  barcode: string;
  serialNumber: string;
}

export interface ItemRow {
  id: number;
  barcode: string;
  serialNumber: string;
}

export interface QuantityCheckParentRow extends QuantityCheckRow {
  items: ItemRow[];
}

/** Parent row: one per product, with expandable location/quantity sub-table */
export interface ExportQuantityCheckParentRow {
  detailId: number;
  productVariantId: number;
  productName: string;
  description: string;
  expectedQuantity: number;
  expectedBaseQuantity: number;
  scannedBaseQuantity: number;
  scannedQuantity: number;
  locations: ExportQuantityCheckRow[];
  unit: UnitResponse;
  baseUnit: UnitResponse;
  conversionRate: number;
  variance: number;
  /** Chỉ dùng cho cột nút Scan Item, không lưu trong data */
  scanItem?: never;
}
