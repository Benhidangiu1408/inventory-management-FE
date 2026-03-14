import { ReactNode } from "react";
import { QCSheetDetailStatus } from "./inboundOutboundType";

export interface ImportRow {
  id: number;
  status: string;
  type: string;
  createdAt: string;
  actions?: ReactNode;
}

export interface ExportRow {
  id: number;
  // code: string;
  type: string; // Loại phiếu xuất: manufacturer, purchase-order, transfer
  // requestStatus?: string; // Trạng thái yêu cầu: REQUEST, PROCESSING
  warehouse: string;
  // receiver: string;

  // totalQuantity: number;
  // totalValue: number;
  status: string; // Trạng thái active/inactive
  createdAt: string;
  // createdBy: string;
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
  id: number;
  name: string;
  description: string;
  expectedQuantity: number;
}

export interface QuantityCheckRow {
  detailId: number;
  productVariantId: number;
  name: string;
  description: string;
  expectedQuantity: number;
  actualQuantity: number;
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
  unit: string;
  pickQuantity: number | string; // can be number or string for easy input in
}

export interface ExportQuantityCheckRow {
  batchId: string;
  quantity: number;
  location: string;
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
