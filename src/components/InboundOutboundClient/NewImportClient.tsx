"use client";

import { Loading } from "@/components/TA_common/Loading";
import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import Select, { Option } from "@/default_components/form/Select";
import Button from "@/default_components/ui/button/Button";
import {
  ImportSheetType,
  WarehoseResponse,
} from "@/interfaces/inboundOutboundType";
import { SheetStatus } from "@/interfaces/inventoryManagementType";
import { inboundOutboundService } from "@/services/InboundOutboundService";
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

// const warehouses = [
//   { id: 1, name: "Warehouse 1" },
//   { id: 2, name: "Warehouse 2" },
// ];

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
    label: "Purchase Order",
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

  const [loading, setLoading] = useState<boolean>(false);

  const handleCreate = async () => {
    setLoading(true);

    const data = await inboundOutboundService.createImportSheet({
      warehouseId: selectedWarehouseId,
      type: selectedImportType ?? ImportSheetType.SUPPLIER,
      status: SheetStatus.CREATED,
    });

    setLoading(false);
    toast.success("Import Sheet Created Successfully");

    router.push("/import");
    console.log(data);
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
                onClick={() => setSelectedImportType(option.key)}
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

      <div className="mt-6 flex justify-center">
        <div className="w-[30%] max-w-xs">
          <Button
            className="w-full gap-3 p-4"
            disabled={!selectedImportType || !selectedWarehouseId}
            onClick={handleCreate}
          >
            Create
          </Button>
        </div>
      </div>
    </div>
  );
};
