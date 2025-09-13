import { ReactNode } from "react";

export type Column<T> = {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T], row: T) => ReactNode;
};

export interface TableProps<T extends Record<string, unknown>> {
  title: string;
  columns: Column<T>[];
  data: T[];
}

export interface TableBoxProps {
  title: string;
  headers: string[];
  data: ProductRow[] | StorageLocationRow[];
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
