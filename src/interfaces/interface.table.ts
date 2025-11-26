import { ReactNode } from "react";

export interface ImportRow {
  batchId: string;
  date: string;
  type: string;
  createdBy: string;
  totalQuantity: number;
  totalValue: number;
  status: string;
  actions?: ReactNode;
}

export interface ExportRow {
  batchId: string;
  date: string;
  type: string;
  warehouse: string;
  receiver: string;
  createdBy: string;
  totalQuantity: number;
  totalValue: number;
  status: string;
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
  name: string;
  expectedQuantity: number;
}

export interface QuantityCheckRow {
  name: string;
  expectedQuantity: number;
  actualQuantity: number;
  variance: number;
  reason: string;
}

export interface QualityCheckRow {
  name: string;
  quantity: number;
  qualityStatus: "Pass" | "Fail" | "Skip" | "Exempt";
  reason: string;
  notes: string;
}

export interface StorageLocationCheckRow {
  name: string;
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
  stock: number;
  unit: string;
  quantity: number | string; // can be number or string for easy input in
  pickQuantity: number | string; // can be number or string for easy input in
}

export interface ExportQuantityCheckRow {
  quantity: number;
  location: string;
}