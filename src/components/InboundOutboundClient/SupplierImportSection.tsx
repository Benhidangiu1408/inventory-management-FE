"use client";

import Select, { Option } from "@/default_components/form/Select";
import Input from "@/default_components/form/input/InputField";
import Label from "@/default_components/form/Label";
import { SupplierCreateReq } from "@/interfaces/inboundOutboundType";

export type SupplierMode = "existing" | "new";

export type NewSupplierForm = Omit<SupplierCreateReq, never>;

type SupplierImportSectionProps = {
  supplierMode: SupplierMode;
  onSupplierModeChange: (mode: SupplierMode) => void;
  selectedSupplierId: number | null;
  onSelectedSupplierIdChange: (id: number | null) => void;
  newSupplier: NewSupplierForm;
  onNewSupplierChange: (data: NewSupplierForm) => void;
  supplierOptions: Option[];
  suppliersLoading: boolean;
};

export function SupplierImportSection({
  supplierMode,
  onSupplierModeChange,
  selectedSupplierId,
  onSelectedSupplierIdChange,
  newSupplier,
  onNewSupplierChange,
  supplierOptions,
  suppliersLoading,
}: SupplierImportSectionProps) {
  return (
    <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
      <h3 className="mb-4 font-semibold text-gray-800 dark:text-white/90">
        Supplier information
      </h3>
      <div className="mb-4 flex gap-4">
        <button
          type="button"
          onClick={() => onSupplierModeChange("existing")}
          className={`rounded-lg border px-4 py-2 text-sm font-medium ${
            supplierMode === "existing"
              ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
              : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
          }`}
        >
          Select existing supplier
        </button>
        <button
          type="button"
          onClick={() => onSupplierModeChange("new")}
          className={`rounded-lg border px-4 py-2 text-sm font-medium ${
            supplierMode === "new"
              ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
              : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
          }`}
        >
          New supplier
        </button>
      </div>

      {supplierMode === "existing" && (
        <div className="space-y-2">
          <Label>Supplier</Label>
          <Select
            options={supplierOptions}
            value={selectedSupplierId?.toString() ?? ""}
            onChange={(e) =>
              onSelectedSupplierIdChange(
                e.target.value ? Number(e.target.value) : null,
              )
            }
            placeholder="Select supplier..."
            disabled={suppliersLoading}
          />
          {suppliersLoading && (
            <p className="text-xs text-gray-500">Loading list...</p>
          )}
        </div>
      )}

      {supplierMode === "new" && (
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="supplier-name">Supplier name *</Label>
            <Input
              id="supplier-name"
              value={newSupplier.name}
              onChange={(e) =>
                onNewSupplierChange({ ...newSupplier, name: e.target.value })
              }
              placeholder="Enter name"
              required
            />
          </div>
          <div>
            <Label htmlFor="supplier-email">Email *</Label>
            <Input
              id="supplier-email"
              type="email"
              value={newSupplier.email}
              onChange={(e) =>
                onNewSupplierChange({ ...newSupplier, email: e.target.value })
              }
              placeholder="email@example.com"
              required
            />
          </div>
          <div>
            <Label htmlFor="supplier-phone">Phone number *</Label>
            <Input
              id="supplier-phone"
              value={newSupplier.phone}
              onChange={(e) =>
                onNewSupplierChange({ ...newSupplier, phone: e.target.value })
              }
              placeholder="Phone number"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="supplier-address">Address *</Label>
            <Input
              id="supplier-address"
              value={newSupplier.address}
              onChange={(e) =>
                onNewSupplierChange({
                  ...newSupplier,
                  address: e.target.value,
                })
              }
              placeholder="Address"
              required
            />
          </div>
        </div>
      )}
    </div>
  );
}
