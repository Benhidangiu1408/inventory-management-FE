"use client";

import Select, { Option } from "@/default_components/form/Select";
import Input from "@/default_components/form/input/InputField";
import Label from "@/default_components/form/Label";
import { CustomerStatus } from "@/interfaces/inboundOutboundType";

export type CustomerMode = "existing" | "new";

export type NewCustomerForm = {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  status: CustomerStatus;
};

type CustomerExportSectionProps = {
  customerMode: CustomerMode;
  onCustomerModeChange: (mode: CustomerMode) => void;
  selectedCustomerId: number | null;
  onSelectedCustomerIdChange: (id: number | null) => void;
  newCustomer: NewCustomerForm;
  onNewCustomerChange: (data: NewCustomerForm) => void;
  customerOptions: Option[];
  customersLoading: boolean;
};

export function CustomerExportSection({
  customerMode,
  onCustomerModeChange,
  selectedCustomerId,
  onSelectedCustomerIdChange,
  newCustomer,
  onNewCustomerChange,
  customerOptions,
  customersLoading,
}: CustomerExportSectionProps) {
  return (
    <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
      <h3 className="mb-4 font-semibold text-gray-800 dark:text-white/90">
        Customer information
      </h3>
      <div className="mb-4 flex gap-4">
        <button
          type="button"
          onClick={() => onCustomerModeChange("existing")}
          className={`rounded-lg border px-4 py-2 text-sm font-medium ${
            customerMode === "existing"
              ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
              : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
          }`}
        >
          Select existing customer
        </button>
        <button
          type="button"
          onClick={() => onCustomerModeChange("new")}
          className={`rounded-lg border px-4 py-2 text-sm font-medium ${
            customerMode === "new"
              ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
              : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
          }`}
        >
          New customer
        </button>
      </div>

      {customerMode === "existing" && (
        <div className="space-y-2">
          <Label>Customer</Label>
          <Select
            options={customerOptions}
            value={selectedCustomerId?.toString() ?? ""}
            onChange={(e) =>
              onSelectedCustomerIdChange(
                e.target.value ? Number(e.target.value) : null,
              )
            }
            placeholder="Select customer..."
            disabled={customersLoading}
          />
          {customersLoading && (
            <p className="text-xs text-gray-500">Loading list...</p>
          )}
        </div>
      )}

      {customerMode === "new" && (
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="customer-name">Customer name *</Label>
            <Input
              id="customer-name"
              value={newCustomer.name}
              onChange={(e) =>
                onNewCustomerChange({ ...newCustomer, name: e.target.value })
              }
              placeholder="Enter name"
              required
            />
          </div>
          <div>
            <Label htmlFor="customer-email">Email *</Label>
            <Input
              id="customer-email"
              type="email"
              value={newCustomer.email}
              onChange={(e) =>
                onNewCustomerChange({ ...newCustomer, email: e.target.value })
              }
              placeholder="email@example.com"
              required
            />
          </div>
          <div>
            <Label htmlFor="customer-phone">Phone number *</Label>
            <Input
              id="customer-phone"
              value={newCustomer.phoneNumber}
              onChange={(e) =>
                onNewCustomerChange({
                  ...newCustomer,
                  phoneNumber: e.target.value,
                })
              }
              placeholder="Phone number"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="customer-address">Address *</Label>
            <Input
              id="customer-address"
              value={newCustomer.address}
              onChange={(e) =>
                onNewCustomerChange({
                  ...newCustomer,
                  address: e.target.value,
                })
              }
              placeholder="Address"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="customer-status">Status</Label>
            <Select
              id="customer-status"
              options={[
                { value: CustomerStatus.ACTIVE, label: "ACTIVE" },
                { value: CustomerStatus.INACTIVE, label: "INACTIVE" },
                { value: CustomerStatus.SUSPENDED, label: "SUSPENDED" },
                { value: CustomerStatus.DELETED, label: "DELETED" },
              ]}
              value={newCustomer.status}
              onChange={(e) =>
                onNewCustomerChange({
                  ...newCustomer,
                  status: e.target.value as CustomerStatus,
                })
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
