"use client";

import {
  createImportSheet,
  createSupplier,
  getSuppliers,
} from "@/actions/inbound-outbound";
import { Loading } from "@/components/TA_common/Loading";
import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import Select, { Option } from "@/default_components/form/Select";
import Button from "@/default_components/ui/button/Button";
import {
  ImportSheetType,
  SupplierCreateReq,
  SupplierResponse,
  WarehoseResponse,
} from "@/interfaces/inboundOutboundType";
import { SheetStatus } from "@/interfaces/inventoryManagementType";
import {
  SupplierImportSection,
  type SupplierMode,
} from "./SupplierImportSection";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faArrowRightArrowLeft,
  faDollarSign,
  faHandPointer,
  faIndustry,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const importOptions: {
  key: ImportSheetType;
  label: string;
  icon: IconDefinition;
}[] = [
  { key: ImportSheetType.FACTORY, label: "Manufacturer", icon: faIndustry },
  {
    key: ImportSheetType.INTERNAL,
    label: "Transfer",
    icon: faArrowRightArrowLeft,
  },
  {
    key: ImportSheetType.SUPPLIER,
    label: "Supplier",
    icon: faDollarSign,
  },
];

type WarehouseSelectorProps = {
  warehouses: WarehoseResponse[];
  value: number;
  onChange: (id: number) => void;
};

const WarehouseSelector = ({
  warehouses,
  value,
  onChange,
}: WarehouseSelectorProps) => {
  const options: Option[] = warehouses.map((warehouse) => {
    return {
      value: warehouse.id.toString(),
      label: warehouse.name,
    };
  });

  return (
    <div className="mb-4 rounded-2xl border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-center gap-3">
        <span className="font-medium">Warehouse:</span>
        <Select
          options={options}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </div>
    </div>
  );
};

const emptyNewSupplier: SupplierCreateReq = {
  name: "",
  email: "",
  phone: "",
  address: "",
};

function isNewSupplierFilled(
  data: typeof emptyNewSupplier,
): data is SupplierCreateReq {
  return !!(
    data.name.trim() &&
    data.email.trim() &&
    data.phone.trim() &&
    data.address.trim()
  );
}

export const NewImportClient = ({
  warehouses,
}: {
  warehouses: WarehoseResponse[];
}) => {
  const router = useRouter();

  const [selectedWarehouseId, setSelectedWarehouseId] = useState<number>(
    warehouses[0]?.id ?? 1,
  );
  const [selectedImportType, setSelectedImportType] =
    useState<ImportSheetType | null>(null);

  // Supplier section (only when type = SUPPLIER)
  const [supplierMode, setSupplierMode] = useState<SupplierMode>("existing");
  const [suppliers, setSuppliers] = useState<SupplierResponse[]>([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(
    null,
  );
  const [newSupplier, setNewSupplier] = useState(emptyNewSupplier);
  const [suppliersLoading, setSuppliersLoading] = useState(false);

  const [loading, setLoading] = useState<boolean>(false);

  const handleSelectImportType = (type: ImportSheetType) => {
    if (type !== ImportSheetType.SUPPLIER) {
      setSupplierMode("existing");
      setSelectedSupplierId(null);
      setNewSupplier(emptyNewSupplier);
      setSuppliers([]);
    } else {
      setSuppliersLoading(true);
      getSuppliers()
        .then((list) => setSuppliers(Array.isArray(list) ? list : []))
        .catch(() => setSuppliers([]))
        .finally(() => setSuppliersLoading(false));
    }
    setSelectedImportType(type);
  };

  const supplierOptions: Option[] = [
    { value: "", label: "Select supplier..." },
    ...suppliers.map((s) => ({
      value: s.id.toString(),
      label: `${s.name} (${s.email})`,
    })),
  ];

  const isSupplierReady =
    selectedImportType !== ImportSheetType.SUPPLIER ||
    (supplierMode === "existing" && selectedSupplierId != null) ||
    (supplierMode === "new" && isNewSupplierFilled(newSupplier));

  const canCreate =
    !!selectedImportType && !!selectedWarehouseId && isSupplierReady;

  const handleCreate = async () => {
    if (!selectedImportType || !selectedWarehouseId) return;

    let supplierId: number | undefined;
    if (selectedImportType === ImportSheetType.SUPPLIER) {
      if (supplierMode === "existing" && selectedSupplierId != null) {
        supplierId = selectedSupplierId;
      } else if (supplierMode === "new" && isNewSupplierFilled(newSupplier)) {
        try {
          const created = await createSupplier({
            ...newSupplier,
            name: newSupplier.name.trim(),
            email: newSupplier.email.trim(),
            phone: newSupplier.phone.trim(),
            address: newSupplier.address.trim(),
          });
          supplierId = created.id;
        } catch (err) {
          toast.error("Failed to create new supplier.");
          return;
        }
      } else {
        toast.error(
          "Please select a supplier or fill in all new supplier details.",
        );
        return;
      }
    }

    setLoading(true);

    await createImportSheet({
      warehouseId: selectedWarehouseId,
      type: selectedImportType,
      status: SheetStatus.CREATED,
      ...(supplierId != null && { supplierId }),
    });

    setLoading(false);
    toast.success("Import Sheet Created Successfully");

    router.push("/import");
  };

  return (
    <div>
      {loading && <Loading />}
      <PageBreadcrumb pageTitle="New Import" />

      <WarehouseSelector
        warehouses={warehouses}
        value={selectedWarehouseId}
        onChange={setSelectedWarehouseId}
      />

      <div className="rounded-2xl border border-gray-200 bg-white">
        <div className="flex items-center justify-center gap-3 border-b border-gray-200 p-6 text-xl font-bold">
          <FontAwesomeIcon icon={faHandPointer} />
          <h2>Please Choose Your Type Of Import</h2>
        </div>
        <div className="flex flex-col items-center gap-3 p-6">
          {importOptions.map((option) => {
            const isActive = selectedImportType === option.key;
            return (
              <Button
                key={option.key}
                type="button"
                onClick={() => handleSelectImportType(option.key)}
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

      {selectedImportType === ImportSheetType.SUPPLIER && (
        <SupplierImportSection
          supplierMode={supplierMode}
          onSupplierModeChange={setSupplierMode}
          selectedSupplierId={selectedSupplierId}
          onSelectedSupplierIdChange={setSelectedSupplierId}
          newSupplier={newSupplier}
          onNewSupplierChange={setNewSupplier}
          supplierOptions={supplierOptions}
          suppliersLoading={suppliersLoading}
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
