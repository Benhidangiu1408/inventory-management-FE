"use client";

import {
  createExportSheet,
  createCustomer,
  getCustomers,
} from "@/actions/inbound-outbound";
import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import { Option } from "@/default_components/form/Select";
import Button from "@/default_components/ui/button/Button";
import {
  CustomerCreateReq,
  CustomerResponse,
  CustomerStatus,
  ExportSheetCreateReq,
  ExportSheetType,
  WarehoseResponse,
} from "@/interfaces/inboundOutboundType";
import {
  CustomerExportSection,
  type CustomerMode,
} from "./CustomerExportSection";
import { DestinationWarehouseSection } from "./DestinationWarehouseSection";
import { WarehouseSelector } from "./WarehouseSelector";
import { SheetStatus } from "@/interfaces/inventoryManagementType";
import {
  faArrowRightArrowLeft,
  faHandPointer,
  faIndustry,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const exportOptions: {
  key: string;
  label: string;
  path: ExportSheetType;
  icon: typeof faIndustry;
}[] = [
  {
    key: "manufacturer",
    label: "Manufacturer",
    path: ExportSheetType.FACTORY,
    icon: faIndustry,
  },
  {
    key: "transfer",
    label: "Transfer",
    path: ExportSheetType.INTERNAL,
    icon: faArrowRightArrowLeft,
  },
  {
    key: "customer",
    label: "Customer",
    path: ExportSheetType.CUSTOMER,
    icon: faUser,
  },
];

const emptyNewCustomer = {
  name: "",
  email: "",
  phoneNumber: "",
  address: "",
  status: CustomerStatus.ACTIVE,
};

function isNewCustomerFilled(
  data: typeof emptyNewCustomer,
): data is CustomerCreateReq {
  return !!(
    data.name.trim() &&
    data.email.trim() &&
    data.phoneNumber.trim() &&
    data.address.trim()
  );
}

export const NewExportClient = ({
  warehouses,
}: {
  warehouses: WarehoseResponse[];
}) => {
  const router = useRouter();
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<number>(
    warehouses[0]?.id ?? 1,
  );
  const [selectedExportType, setSelectedExportType] =
    useState<ExportSheetType | null>(null);
  const [destinationWarehouseId, setDestinationWarehouseId] = useState<
    number | null
  >(null);

  // Customer section (only when type = CUSTOMER)
  const [customerMode, setCustomerMode] = useState<CustomerMode>("existing");
  const [customers, setCustomers] = useState<CustomerResponse[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(
    null,
  );
  const [newCustomer, setNewCustomer] = useState(emptyNewCustomer);
  const [customersLoading, setCustomersLoading] = useState(false);

  const handleSelectExportType = (path: ExportSheetType) => {
    if (path !== ExportSheetType.CUSTOMER) {
      setCustomerMode("existing");
      setSelectedCustomerId(null);
      setNewCustomer(emptyNewCustomer);
      setCustomers([]);
    } else {
      setCustomersLoading(true);
      getCustomers()
        .then((list) => setCustomers(Array.isArray(list) ? list : []))
        .catch(() => setCustomers([]))
        .finally(() => setCustomersLoading(false));
    }
    if (path !== ExportSheetType.INTERNAL) {
      setDestinationWarehouseId(null);
    }
    setSelectedExportType(path);
  };

  const customerOptions: Option[] = [
    { value: "", label: "Select customer..." },
    ...customers.map((c) => ({
      value: c.id.toString(),
      label: `${c.name} (${c.email})`,
    })),
  ];

  const isCustomerReady =
    selectedExportType !== ExportSheetType.CUSTOMER ||
    (customerMode === "existing" && selectedCustomerId != null) ||
    (customerMode === "new" && isNewCustomerFilled(newCustomer));

  const isInternalDestinationReady =
    selectedExportType !== ExportSheetType.INTERNAL ||
    destinationWarehouseId != null;

  const canCreate =
    !!selectedExportType &&
    !!selectedWarehouseId &&
    isCustomerReady &&
    isInternalDestinationReady;

  const handleCreate = async () => {
    if (!selectedExportType || !selectedWarehouseId) return;

    let customerId: number | undefined;
    if (selectedExportType === ExportSheetType.CUSTOMER) {
      if (customerMode === "existing" && selectedCustomerId != null) {
        customerId = selectedCustomerId;
      } else if (customerMode === "new" && isNewCustomerFilled(newCustomer)) {
        try {
          const created = await createCustomer({
            ...newCustomer,
            name: newCustomer.name.trim(),
            email: newCustomer.email.trim(),
            phoneNumber: newCustomer.phoneNumber.trim(),
            address: newCustomer.address.trim(),
          });
          customerId = created.id;
        } catch {
          toast.error("Failed to create new customer.");
          return;
        }
      } else {
        toast.error(
          "Please select a customer or fill in all new customer details.",
        );
        return;
      }
    }

    const data: ExportSheetCreateReq = {
      warehouseId: selectedWarehouseId,
      status: SheetStatus.CREATED,
      type: selectedExportType,
      ...(customerId != null && { customerId }),
      ...(selectedExportType === ExportSheetType.INTERNAL &&
        destinationWarehouseId != null && {
          destinationWarehouseId,
        }),
    };

    await createExportSheet(data);

    toast.success("Create Export Sheet Successfully");

    router.push(`/export`);
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="New Export" />

      <WarehouseSelector
        warehouses={warehouses}
        value={selectedWarehouseId}
        onChange={setSelectedWarehouseId}
      />

      <div className="mb-6 rounded-2xl border border-gray-200 bg-white">
        <div className="flex items-center justify-center gap-3 border-b border-gray-200 p-6 text-xl font-bold">
          <FontAwesomeIcon icon={faHandPointer} />
          <h2>Please Choose Your Type Of Export</h2>
        </div>
        <div className="flex flex-col items-center gap-3 p-6">
          {exportOptions.map((option) => {
            const isActive = selectedExportType === option.path;
            return (
              <Button
                key={option.key}
                type="button"
                onClick={() => handleSelectExportType(option.path)}
                className={`w-1/2 gap-3 p-6 ${
                  isActive
                    ? "border border-blue-500 !bg-blue-800 ring-2 ring-blue-200"
                    : ""
                }`}
              >
                <FontAwesomeIcon icon={option.icon} />
                <h3>{option.label}</h3>
              </Button>
            );
          })}
        </div>
      </div>

      {selectedExportType === ExportSheetType.INTERNAL && (
        <DestinationWarehouseSection
          warehouses={warehouses}
          excludeWarehouseId={selectedWarehouseId}
          value={destinationWarehouseId}
          onChange={setDestinationWarehouseId}
        />
      )}

      {selectedExportType === ExportSheetType.CUSTOMER && (
        <CustomerExportSection
          customerMode={customerMode}
          onCustomerModeChange={setCustomerMode}
          selectedCustomerId={selectedCustomerId}
          onSelectedCustomerIdChange={setSelectedCustomerId}
          newCustomer={newCustomer}
          onNewCustomerChange={setNewCustomer}
          customerOptions={customerOptions}
          customersLoading={customersLoading}
        />
      )}

      <div className="mt-6 flex justify-center">
        <div className="w-[30%] max-w-xs">
          <Button
            className="w-full gap-3 p-4"
            disabled={!canCreate}
            onClick={handleCreate}
          >
            Create
          </Button>
        </div>
      </div>
    </div>
  );
};
