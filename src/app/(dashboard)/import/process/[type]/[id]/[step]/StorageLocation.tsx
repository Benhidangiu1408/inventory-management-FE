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
import {
  LocationResponse,
  WarehoseResponse,
} from "@/interfaces/inboundOutboundType";
import { BatchStatus } from "@/interfaces/warehouseManagementType";
import { useCallback, useEffect, useState } from "react";
import { useImport } from "@/context/ImportContext";
import {
  LocationType,
  WarehouseType,
} from "@/interfaces/warehouseManagementType";
import Button from "@/default_components/ui/button/Button";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loading } from "@/components/TA_common/Loading";
import { useConfirmModal } from "@/hooks/useConfirmModal";
import { SheetStatus } from "@/interfaces/inventoryManagementType";
import {
  finalizeImportSheet,
  getLocationByType,
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

  const [locations, setLocations] = useState<LocationResponse[]>([]);
  const [defectWarehouses, setDefectWarehouses] = useState<WarehoseResponse[]>(
    [],
  );

  const [selectedDefectWarehouseId, setSelectedDefectWarehouseId] = useState<
    number | null
  >(null);
  const [defectLocations, setDefectLocations] = useState<LocationResponse[]>(
    [],
  );

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
    locationId: number,
    locationList: LocationResponse[] = locations,
  ) => {
    await setBatchLocationSingle(id as string, {
      importSheetDetailId: detailId,
      locationId,
    });
    const newLocation = locationList.find((l) => l.id === locationId);
    if (!newLocation) return;
    setImportData((prev) => ({
      ...prev,
      details: prev.details.map((detail) => {
        if (detail.id !== detailId || !detail.batch) return detail;
        return { ...detail, batch: { ...detail.batch, location: newLocation } };
      }),
    }));
    toast.success("Location saved");

    const isDefect = locationList === defectLocations;
    if (isDefect && selectedDefectWarehouseId) {
      getLocationByType(selectedDefectWarehouseId, LocationType.BIN)
        .then(setDefectLocations)
        .catch(console.error);
    } else {
      getLocationByType(importData.warehouse.id, LocationType.BIN)
        .then(setLocations)
        .catch(console.error);
    }
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
          <>
            <ChooseLocationModal
              locations={locations}
              currentLocation={location}
              disabled={!hasStockInPermission || isRejected}
              onSave={(locationId) =>
                handleSaveLocation(row.detailId, locationId)
              }
            />
          </>
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
            locations={defectLocations}
            currentLocation={location}
            disabled={!hasStockInPermission || isRejected}
            onSave={(locationId) =>
              handleSaveLocation(row.detailId, locationId, defectLocations)
            }
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
    const isConfirmed = await confirm({
      title: "Confirm Storage Location",
      message:
        "Are you sure you want to confirm the storage location for all these batches?",
    });

    if (!isConfirmed) return;

    await handleConfirm();
  };

  const fetchLocations = useCallback(async () => {
    const res = await getLocationByType(
      importData.warehouse.id,
      LocationType.BIN,
    );

    setLocations(res);
  }, [importData.warehouse.id]);

  const fetchDefectWarehouses = useCallback(async () => {
    const res = await getWarehouses(WarehouseType.DEFECT);
    setDefectWarehouses(res);
    if (res.length > 0) {
      setSelectedDefectWarehouseId(res[0].id);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLocations().catch(console.error);
  }, [fetchLocations]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDefectWarehouses().catch(console.error);
  }, [fetchDefectWarehouses]);

  useEffect(() => {
    if (!selectedDefectWarehouseId) return;

    getLocationByType(selectedDefectWarehouseId, LocationType.BIN)
      .then(setDefectLocations)
      .catch(console.error);
  }, [selectedDefectWarehouseId]);

  useEffect(() => {
    if (!locations.length) return;
    if (isCompleted || isRejected) return;

    setImportData((prev) => ({
      ...prev,
      details: prev.details.map((detail) => {
        if (!detail.batch) return detail;
        if (detail.batch.location) return detail;
        if (detail.batch.status === BatchStatus.FAULT) return detail;

        return {
          ...detail,
          batch: {
            ...detail.batch,
            location: locations[0],
          },
        };
      }),
    }));
  }, [locations, setImportData, isCompleted, isRejected]);

  useEffect(() => {
    if (!defectLocations.length) return;
    if (isCompleted || isRejected) return;

    setImportData((prev) => ({
      ...prev,
      details: prev.details.map((detail) => {
        if (!detail.batch) return detail;
        if (detail.batch.status !== BatchStatus.FAULT) return detail;
        if (detail.batch.location) return detail;

        return {
          ...detail,
          batch: {
            ...detail.batch,
            location: defectLocations[0],
          },
        };
      }),
    }));
  }, [defectLocations, setImportData, isCompleted, isRejected]);

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
