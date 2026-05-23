"use client";

import Select, { Option } from "@/default_components/form/Select";
import { WarehoseResponse } from "@/interfaces/inboundOutboundType";

export type DestinationWarehouseSectionProps = {
  warehouses: WarehoseResponse[];
  excludeWarehouseId: number;
  value: number | null;
  onChange: (id: number | null) => void;
};

export const DestinationWarehouseSection = ({
  warehouses,
  excludeWarehouseId,
  value,
  onChange,
}: DestinationWarehouseSectionProps) => {
  const availableWarehouses = warehouses.filter(
    (w) => w.id !== excludeWarehouseId,
  );
  const options: Option[] = [
    { value: "", label: "Select destination warehouse..." },
    ...availableWarehouses.map((w) => ({
      value: w.id.toString(),
      label: w.name,
    })),
  ];
  const selectedWarehouse =
    value != null ? availableWarehouses.find((w) => w.id === value) : null;

  return (
    <div className="mb-4 space-y-4">
      <div className="default-card p-6">
        <div className="flex items-center justify-center gap-3">
          <span className="font-medium">Destination warehouse:</span>
          <Select
            options={options}
            value={value ?? ""}
            onChange={(e) =>
              onChange(e.target.value === "" ? null : Number(e.target.value))
            }
          />
        </div>
      </div>

      {selectedWarehouse && (
        <div className="default-card p-6">
          <h3 className="mb-4 text-sm font-semibold tracking-wide text-gray-500 uppercase">
            Destination warehouse information
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
