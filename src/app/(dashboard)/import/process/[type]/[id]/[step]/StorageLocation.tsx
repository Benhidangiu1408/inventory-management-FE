"use client";

import Select, { Option } from "@/default_components/form/Select";
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
} from "@/interfaces/inboundOutboundType";
import { useCallback, useEffect, useState } from "react";
import { inboundOutboundService } from "@/services/InboundOutboundService";
import { useImport } from "@/context/ImportContext";
import { LocationType } from "@/interfaces/warehouseManagementType";
import Button from "@/default_components/ui/button/Button";
import { useQualityCheck } from "@/context/QualityCheckContext";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loading } from "@/components/TA_common/Loading";
import { useConfirmModal } from "@/hooks/useConfirmModal";
import { SheetStatus } from "@/interfaces/inventoryManagementType";

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

  const { importData, setImportData } = useImport();
  const { qcData } = useQualityCheck();

  const [locations, setLocations] = useState<LocationResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const { confirm, ConfirmationModal } = useConfirmModal();

  const isCompleted = importData.status === SheetStatus.COMPLETED;

  const options: Option[] = locations.map((location) => ({
    value: String(location.id),
    label: `${location.code} - ${location.name}`,
  }));

  const firstLocationValue = locations[0]?.id ?? 0;

  const buildStorageData = (
    statuses: QCSheetDetailStatus[],
  ): StorageLocationCheckRow[] => {
    return importData.details
      .filter((detail) => {
        const foundedQcDetail = qcData?.details.find(
          (qcDetail) => qcDetail.batch.id === detail.batch?.id,
        );

        return statuses.includes(
          foundedQcDetail?.status as QCSheetDetailStatus,
        );
      })
      .map((detail) => ({
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
      render: (value, row) => (
        <Select
          className="h-[38px]"
          disabled={isCompleted}
          value={value}
          options={options}
          onChange={(e) =>
            updateRows(row.detailId, {
              storageLocation: e.target.value,
            })
          }
        />
      ),
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

    setLoading(true);
    await inboundOutboundService.setBatchLocations(id as string, data);

    setLoading(false);
    toast.success("Storage Location Successfully");
    router.refresh();

    // console.log(res);
    // console.log(importData);
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
          const newLocation = locations.find(
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
    const res = await inboundOutboundService.getLocationByType(
      importData.warehouse.id,
      LocationType.BIN,
    );

    setLocations(res);
  }, [importData.warehouse.id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLocations().catch(console.error);
  }, [fetchLocations]);

  useEffect(() => {
    if (!locations.length) return;

    setImportData((prev) => ({
      ...prev,
      details: prev.details.map((detail) => {
        if (!detail.batch) return detail;

        if (detail.batch.location) return detail;

        return {
          ...detail,
          batch: {
            ...detail.batch,
            location: locations[0],
          },
        };
      }),
    }));
  }, [locations, setImportData]);

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
              title="Passed Products"
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
              title="Failed Products"
              quantity={storageFailData.length}
            />
            <CustomizableTable<StorageLocationCheckRow>
              headers={storageLocationColumn}
              data={storageFailData}
              getRowId={(params) => String(params.data.detailId)}
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleOpenConfirmModal} disabled={isCompleted}>
              Confirm Storage Location
            </Button>
          </div>
        </div>
      </InfoBox>
    </div>
  );
}
