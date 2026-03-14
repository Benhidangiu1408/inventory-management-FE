"use client";

import { createExportSheet } from "@/actions/inbound-outbound";
import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import Select, { Option } from "@/default_components/form/Select";
import Button from "@/default_components/ui/button/Button";
import {
  ExportSheetCreateReq,
  ExportSheetType,
  WarehoseResponse,
} from "@/interfaces/inboundOutboundType";
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

  const handleCreate = async () => {
    if (!selectedExportType) return;

    const data: ExportSheetCreateReq = {
      warehouseId: selectedWarehouseId,
      status: SheetStatus.CREATED,
      type: selectedExportType,
    };

    const res = await createExportSheet(data);

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

      <div className="rounded-2xl border border-gray-200 bg-white">
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
                onClick={() => setSelectedExportType(option.path)}
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
            disabled={!selectedExportType || !selectedWarehouseId}
            onClick={handleCreate}
          >
            Create
          </Button>
        </div>
      </div>
    </div>
  );
};
