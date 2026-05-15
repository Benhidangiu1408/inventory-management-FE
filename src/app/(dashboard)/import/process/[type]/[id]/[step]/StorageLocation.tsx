"use client";

import Select, { Option } from "@/default_components/form/Select";
import Input from "@/default_components/form/input/InputField";
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
  QCSheetDetailStatus,
  SetBatchLocationReq,
  WarehoseResponse,
} from "@/interfaces/inboundOutboundType";
import { useCallback, useEffect, useState } from "react";
import { useImport } from "@/context/ImportContext";
import {
  LocationType,
  WarehouseType,
} from "@/interfaces/warehouseManagementType";
import Button from "@/default_components/ui/button/Button";
import { useQualityCheck } from "@/context/QualityCheckContext";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loading } from "@/components/TA_common/Loading";
import { useConfirmModal } from "@/hooks/useConfirmModal";
import { SheetStatus } from "@/interfaces/inventoryManagementType";
import {
  getLocationByType,
  getWarehouses,
  setBatchLocations,
} from "@/actions/inbound-outbound";
import { useAuth } from "@/context/AuthContext";
import { UserPermissions } from "@/interfaces/userManagementType";

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
  const { qcData } = useQualityCheck();

  console.log(importData);

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

  const options: Option[] = locations.map((location) => ({
    value: String(location.id),
    label: `${location.code} - ${location.name}`,
  }));

  const defectWarehouseOptions: Option[] = defectWarehouses.map((w) => ({
    value: String(w.id),
    label: w.name,
  }));

  const defectLocationOptions: Option[] = defectLocations.map((location) => ({
    value: String(location.id),
    label: `${location.code} - ${location.name}`,
  }));

  const firstLocationValue = locations[0]?.id ?? 0;

  const buildStorageData = (
    statuses: QCSheetDetailStatus[],
  ): StorageLocationCheckRow[] => {
    const filterData = importData.details.filter((detail) => {
      const foundedQcDetail = qcData?.details.find(
        (qcDetail) => qcDetail.batch.id === detail.batch?.id,
      );

      return statuses.includes(foundedQcDetail?.status as QCSheetDetailStatus);
    });

    return filterData.map((detail) => ({
      detailId: detail.id,
      batchCode: detail.batch?.code ?? "",
      name: detail.batch?.productVariant.product.name ?? "",
      description: detail.batch?.productVariant.description ?? "",
      quantity: detail.batch?.initialQuantity ?? 0,
      storageLocation:
        detail.batch?.location?.id?.toString() ?? String(firstLocationValue),
      notes: "",
    }));
  };

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
      render: (value, row) => {
        if (isCompleted) {
          const foundDetail = importData.details.find(
            (detail) => detail.id === row.detailId,
          );

          const location = foundDetail?.batch?.location;
          return location ? (
            <span>{`${location.code} - ${location.name}`}</span>
          ) : (
            <span className="text-gray-400 italic">
              This batch has been moved to Fault Handle section
            </span>
          );
        }
        return (
          <Select
            className="h-[38px]"
            disabled={!hasStockInPermission || isRejected}
            value={row.storageLocation}
            options={options}
            onChange={(e) =>
              updateRows(row.detailId, {
                storageLocation: e.target.value,
              })
            }
          />
        );
      },
      width: 375,
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
      render: (value, row) => {
        if (isCompleted) {
          const foundDetail = importData.details.find(
            (detail) => detail.id === row.detailId,
          );

          const location = foundDetail?.batch?.location;
          return location ? (
            <span>{`${location.code} - ${location.name}`}</span>
          ) : (
            <span className="text-gray-400 italic">
              This batch has been moved to Fault Handle section
            </span>
          );
        }
        return (
          <Select
            className="h-[38px]"
            disabled={!hasStockInPermission || isRejected}
            value={value}
            options={defectLocationOptions}
            onChange={(e) =>
              updateRows(
                row.detailId,
                {
                  storageLocation: e.target.value,
                },
                defectLocations,
              )
            }
          />
        );
      },
      width: 375,
    },
  ];

  const storagePassData: StorageLocationCheckRow[] = buildStorageData([
    QCSheetDetailStatus.PASSED,
    QCSheetDetailStatus.SKIPPED,
  ]);

  const storageFailData: StorageLocationCheckRow[] = buildStorageData([
    QCSheetDetailStatus.FAILED,
  ]);

  const handleConfirm = async () => {
    const data: SetBatchLocationReq[] = importData.details.map((detail) => ({
      importSheetDetailId: detail.id,
      locationId: detail.batch!.location!.id,
    }));

    const locationIds = data.map((d) => d.locationId);
    const hasDuplicate = new Set(locationIds).size !== locationIds.length;
    if (hasDuplicate) {
      toast.error("Duplicate locations are not allowed");
      return;
    }

    setLoading(true);
    await setBatchLocations(id as string, data);

    setLoading(false);
    toast.success("Storage Location Successfully");
    router.refresh();
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

  const updateRows = (
    detailId: number,
    changes: Partial<StorageLocationCheckRow>,
    locationList: LocationResponse[] = locations,
  ) => {
    setImportData((prev) => ({
      ...prev,
      details: prev.details.map((detail) => {
        if (detail.id !== detailId) return detail;

        if (!detail.batch) return detail;

        let currentBatchLocation = detail.batch.location;

        if (
          String(currentBatchLocation?.id ?? firstLocationValue) !==
          changes.storageLocation
        ) {
          const newLocation = locationList.find(
            (location) => String(location.id) === changes.storageLocation,
          );

          if (newLocation) {
            currentBatchLocation = newLocation;
          }
        }

        return {
          ...detail,
          batch: {
            ...detail.batch,
            location: currentBatchLocation,
          },
        };
      }),
    }));
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

    const failedBatchIds = new Set(
      qcData?.details
        .filter((d) => d.status === QCSheetDetailStatus.FAILED)
        .map((d) => d.batch.id) ?? [],
    );

    setImportData((prev) => ({
      ...prev,
      details: prev.details.map((detail) => {
        if (!detail.batch) return detail;
        if (detail.batch.location) return detail;
        if (failedBatchIds.has(detail.batch.id)) return detail;

        return {
          ...detail,
          batch: {
            ...detail.batch,
            location: locations[0],
          },
        };
      }),
    }));
  }, [locations, setImportData, qcData, isCompleted, isRejected]);

  useEffect(() => {
    if (!defectLocations.length) return;
    if (isCompleted || isRejected) return;

    const failedBatchIds = new Set(
      qcData?.details
        .filter((d) => d.status === QCSheetDetailStatus.FAILED)
        .map((d) => d.batch.id) ?? [],
    );

    setImportData((prev) => ({
      ...prev,
      details: prev.details.map((detail) => {
        if (!detail.batch) return detail;
        if (!failedBatchIds.has(detail.batch.id)) return detail;

        const isValidDefectLocation = defectLocations.some(
          (l) => l.id === detail.batch!.location?.id,
        );
        if (isValidDefectLocation) return detail;

        return {
          ...detail,
          batch: {
            ...detail.batch,
            location: defectLocations[0],
          },
        };
      }),
    }));
  }, [defectLocations, qcData, setImportData, isCompleted, isRejected]);

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
