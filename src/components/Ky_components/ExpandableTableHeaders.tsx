"use client";
import Checkbox from "../form/input/Checkbox";
import { Column } from "./CustomizableTable";

export type Batch = {
  code: string;
  scannedQty: number;
  systemQty: number;
  scannedBy: string;
  isFaulty: boolean;
  note: string;
  status: "awaiting" | "scanning" | "confirmed";
};

export type Product = {
  id: string;
  name: string;
  scannedTotalQty: number;
  systemTotalQty: number;
  unit: string;
  difference: number;
  batches: Batch[];
};

export const batchColumns: Column<Batch>[] = [
  { label: "Batch Code", key: "code" },
  { label: "Scanned Quantity", key: "scannedQty" },
  { label: "System Quantity", key: "systemQty" },
  {
    label: "Has Fault",
    key: "isFaulty",
    render(value) {
      return (
        <div className="flex justify-center">
          <Checkbox onChange={() => {}} checked={Boolean(value)} />
        </div>
      );
    },
  },
  { label: "Note", key: "note" },
  { label: "Status", key: "status" },
];

export const productColumns: Column<Product>[] = [
  { label: "Product Name", key: "name" },
  { label: "Total Scanned Quantity", key: "scannedTotalQty" },
  { label: "Total System Quantity", key: "systemTotalQty" },
  { label: "Unit", key: "unit" },
  {
    label: "Difference",
    key: "difference",
    render(value) {
      return (
        <div className={value == 0 ? "text-green-500" : "text-red-500"}>
          {String(value)}
        </div>
      );
    },
  },
];

export type LocationBatch = {
  code: string; // unique batch code
  quantity: number; // quantity stored in this batch
  unit: string; // unit of measurement
  position: string; // physical warehouse position (aisle/shelf/pallet)
  note?: string; // optional remarks (e.g., storage condition)
};

export type WarehouseProduct = {
  id: string; // product ID
  name: string; // product name
  totalQty: number; // total quantity across all batches
  unit: string; // unit of measurement
  batches: LocationBatch[];
};

// --------- Table Column Definitions ---------
export const warehouseBatchColumns: Column<LocationBatch>[] = [
  { label: "Batch Code", key: "code" },
  { label: "Quantity", key: "quantity" },
  { label: "Unit", key: "unit" },
  { label: "Position", key: "position" },
  { label: "Note", key: "note" },
];

export const warehouseProductColumns: Column<WarehouseProduct>[] = [
  { label: "Product Name", key: "name" },
  { label: "Total Quantity", key: "totalQty" },
  { label: "Unit", key: "unit" },
];
