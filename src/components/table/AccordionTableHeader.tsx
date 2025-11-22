"use client";

import { Column } from "@/components/table/CustomizableTable";
import Checkbox from "@/default_components/form/input/Checkbox";

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
