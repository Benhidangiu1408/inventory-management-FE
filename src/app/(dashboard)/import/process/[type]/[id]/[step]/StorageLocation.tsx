"use client";

import Select, { Option } from "@/default_components/form/Select"; // kept for defect warehouse dropdown
import CustomizableTable, {
  Column,
} from "@/components/table/CustomizableTable";
import InfoBox from "@/components/TA_create_page/InfoBox";
import { StorageLocationCheckRow } from "@/interfaces/interface.table";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faBoxOpen,
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { WarehoseResponse } from "@/interfaces/inboundOutboundType";
import { BatchStatus } from "@/interfaces/warehouseManagementType";
import { useCallback, useEffect, useState } from "react";
import { useImport } from "@/context/ImportContext";
import { WarehouseType } from "@/interfaces/warehouseManagementType";
import Button from "@/default_components/ui/button/Button";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loading } from "@/components/TA_common/Loading";
import { useConfirmModal } from "@/hooks/useConfirmModal";
import { SheetStatus } from "@/interfaces/inventoryManagementType";
import {
  finalizeImportSheet,
  getLocationsByBatch,
  getWarehouses,
  setBatchLocationSingle,
} from "@/actions/inbound-outbound";
import { useAuth } from "@/context/AuthContext";
import { UserPermissions } from "@/interfaces/userManagementType";
import ChooseLocationModal from "@/components/modal/ChooseLocationModal";

const Title = ({
  icon,
  title,
  quantity,
}: {
  icon: IconProp;
  title: string;
  quantity: number;
}) => {
  return (
    <div className="mb-4 flex items-center gap-3">
      <FontAwesomeIcon icon={icon} />
      <h3>{title}</h3>
      <div className="rounded-lg bg-gray-300 p-1 text-sm">{quantity} items</div>
    </div>
  );
};

export default function StorageLocationPage() {
  const { id } = useParams();
  const router = useRouter();

  const { user } = useAuth();
  const hasStockInPermission = user?.permissions.includes(
    UserPermissions.STOCK_IN,
  );

  const { importData, setImportData } = useImport();

  const [defectWarehouses, setDefectWarehouses] = useState<WarehoseResponse[]>(
    [],
  );

  const [selectedDefectWarehouseId, setSelectedDefectWarehouseId] = useState<
    number | null
  >(null);

  const [loading, setLoading] = useState(false);
  const { confirm, ConfirmationModal } = useConfirmModal();

  const isCompleted = importData.status === SheetStatus.COMPLETED;
  const isRejected = importData.status === SheetStatus.REJECTED;

  const defectWarehouseOptions: Option[] = defectWarehouses.map((w) => ({
    value: String(w.id),
    label: w.name,
  }));

  const handleSaveLocation = async (
    detailId: number,
    location: import("@/interfaces/inboundOutboundType").LocationResponse,
  ) => {
    await setBatchLocationSingle(id as string, {
      importSheetDetailId: detailId,
      locationId: location.id,
    });
    setImportData((prev) => ({
      ...prev,
      details: prev.details.map((detail) => {
        if (detail.id !== detailId || !detail.batch) return detail;
        return { ...detail, batch: { ...detail.batch, location } };
      }),
    }));
    toast.success("Location saved");
  };

  const buildStorageData = (
    batchStatuses: BatchStatus[],
  ): StorageLocationCheckRow[] =>
    importData.details
      .filter((detail) =>
        batchStatuses.includes(detail.batch?.status as BatchStatus),
      )
      .map((detail) => ({
        detailId: detail.id,
        batchCode: detail.batch?.code ?? "",
        name: detail.batch?.productVariant.product.name ?? "",
        description: detail.batch?.productVariant.description ?? "",
        quantity: detail.batch?.initialQuantity ?? 0,
        storageLocation: detail.batch?.location?.id?.toString() ?? "",
        notes: "",
      }));

  const storageLocationColumn: Column<StorageLocationCheckRow>[] = [
    {
      key: "batchCode",
      label: "Batch Code",
    },
    {
      key: "name",
      label: "Name",
    },
    {
      key: "description",
      label: "Description",
    },
    {
      key: "quantity",
      label: "Quantity",
    },
    {
      key: "storageLocation",
      label: "Storage Location",
      autoHeight: true,
      render: (_, row) => {
        const foundDetail = importData.details.find(
          (detail) => detail.id === row.detailId,
        );
        const location = foundDetail?.batch?.location;

        if (isCompleted) {
          return location ? (
            <span>{`${location.code} - ${location.name}`}</span>
          ) : (
            <span className="text-gray-400 italic">
              This batch has been moved to Fault Handle section
            </span>
          );
        }
        return (
          <ChooseLocationModal
            fetchLocations={() => {
              const batchId = foundDetail?.batch?.id;
              if (!batchId) return Promise.resolve([]);
              return getLocationsByBatch(batchId, importData.warehouse.id);
            }}
            currentLocation={location}
            disabled={!hasStockInPermission || isRejected}
            onSave={(loc) => handleSaveLocation(row.detailId, loc)}
          />
        );
      },
      width: 400,
    },
  ];

  const storageFailLocationColumn: Column<StorageLocationCheckRow>[] = [
    {
      key: "batchCode",
      label: "Batch Code",
    },
    {
      key: "name",
      label: "Name",
    },
    {
      key: "description",
      label: "Description",
    },
    {
      key: "quantity",
      label: "Quantity",
    },
    {
      key: "storageLocation",
      label: "Storage Location",
      autoHeight: true,
      render: (_, row) => {
        const foundDetail = importData.details.find(
          (detail) => detail.id === row.detailId,
        );
        const location = foundDetail?.batch?.location;

        if (isCompleted) {
          return location ? (
            <span>{`${location.code} - ${location.name}`}</span>
          ) : (
            <span className="text-gray-400 italic">
              This batch has been moved to Fault Handle section
            </span>
          );
        }
        return (
          <ChooseLocationModal
            fetchLocations={() => {
              const batchId = foundDetail?.batch?.id;
              if (!batchId) return Promise.resolve([]);
              return getLocationsByBatch(batchId, selectedDefectWarehouseId ?? undefined);
            }}
            currentLocation={location}
            disabled={!hasStockInPermission || isRejected}
            onSave={(loc) => handleSaveLocation(row.detailId, loc)}
          />
        );
      },
      width: 400,
    },
  ];

  const storagePassData: StorageLocationCheckRow[] = buildStorageData([
    BatchStatus.ACTIVE,
  ]);

  const storageFailData: StorageLocationCheckRow[] = buildStorageData([
    BatchStatus.FAULT,
  ]);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await finalizeImportSheet(id as string);
      toast.success("Import sheet finalized successfully");
      router.refresh();
    } catch {
      toast.error("Failed to finalize import sheet");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenConfirmModal = async () => {
    if (storagePassData.length === 0 && storageFailData.length === 0) {
      toast.error("Nothing to save");
      return;
    }

    const hasUnassigned = importData.details.some(
      (detail) => detail.batch && !detail.batch.location,
    );
    if (hasUnassigned) {
      toast.error("Please assign a storage location to all batches before confirming");
      return;
    }

    const isConfirmed = await confirm({
      title: "Confirm Storage Location",
      message:
        "Are you sure you want to confirm the storage location for all these batches?",
    });

    if (!isConfirmed) return;

    await handleConfirm();
  };

  const fetchDefectWarehouses = useCallback(async () => {
    const res = await getWarehouses(WarehouseType.DEFECT);
    setDefectWarehouses(res);
    if (res.length > 0) {
      setSelectedDefectWarehouseId(res[0].id);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDefectWarehouses().catch(console.error);
  }, [fetchDefectWarehouses]);

  return (
    <div>
      {loading && <Loading />}
      {ConfirmationModal}
      <InfoBox
        icon={<FontAwesomeIcon icon={faBoxOpen} />}
        title="Storage Location"
      >
        <div className="flex flex-col gap-6 p-6">
          <div>
            <Title
              icon={faCircleCheck}
              title="Passed Batches"
              quantity={storagePassData.length}
            />
            <CustomizableTable<StorageLocationCheckRow>
              headers={storageLocationColumn}
              data={storagePassData}
              getRowId={(params) => String(params.data.detailId)}
            />
          </div>
          <div>
            <Title
              icon={faCircleXmark}
              title="Failed Batches"
              quantity={storageFailData.length}
            />
            <div className="mb-4 flex items-center gap-3">
              <label className="text-sm font-medium whitespace-nowrap">
                Defect Warehouse
              </label>
              <Select
                className="h-[38px] w-[300px]"
                disabled={!hasStockInPermission || isCompleted || isRejected}
                value={String(selectedDefectWarehouseId ?? "")}
                options={defectWarehouseOptions}
                onChange={(e) =>
                  setSelectedDefectWarehouseId(Number(e.target.value))
                }
              />
            </div>
            <CustomizableTable<StorageLocationCheckRow>
              headers={storageFailLocationColumn}
              data={storageFailData}
              getRowId={(params) => String(params.data.detailId)}
            />
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleOpenConfirmModal}
              disabled={!hasStockInPermission || isCompleted || isRejected}
            >
              Confirm Storage Location
            </Button>
          </div>
        </div>
      </InfoBox>
    </div>
  );
}
