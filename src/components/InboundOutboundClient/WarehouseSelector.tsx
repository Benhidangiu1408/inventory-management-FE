"use client";

import Select, { Option } from "@/default_components/form/Select";
import { WarehoseResponse } from "@/interfaces/inboundOutboundType";

export type WarehouseSelectorProps = {
  warehouses: WarehoseResponse[];
  value: number;
  onChange: (id: number) => void;
  label?: string;
};

export const WarehouseSelector = ({
  warehouses,
  value,
  onChange,
  label = "Warehouse:",
}: WarehouseSelectorProps) => {
  const options: Option[] = warehouses.map((warehouse) => {
    return {
      value: warehouse.id.toString(),
      label: warehouse.name,
    };
  });

  const selectedWarehouse = warehouses.find((w) => w.id === value);

  return (
    <div className="mb-4 space-y-4">
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-center gap-3">
          <span className="font-medium">{label}</span>
          <Select
            options={options}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
          />
        </div>
      </div>

      {selectedWarehouse && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Selected warehouse information
          </h3>
          <div className="grid w-full grid-cols-2 gap-6">
            <div className="w-full min-w-0">
              <span className="text-md text-gray-500">Warehouse ID</span>
              <p className="font-medium text-gray-900">
                #{selectedWarehouse.id}
              </p>
            </div>
            <div className="w-full min-w-0">
              <span className="text-md text-gray-500">Warehouse name</span>
              <p className="font-medium text-gray-900">
                {selectedWarehouse.name}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
