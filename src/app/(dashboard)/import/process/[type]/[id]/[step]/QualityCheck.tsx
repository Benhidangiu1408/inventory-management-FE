"use client";

import Input from "@/default_components/form/input/InputField";
import InfoBox from "@/components/TA_create_page/InfoBox";
// import InfoPagination from "@/default_components/TA_create_page/InfoPagination";
import Button from "@/default_components/ui/button/Button";
import { QualityCheckRow } from "@/interfaces/interface.table";
import CustomizableTable, {
  Column,
} from "@/components/table/CustomizableTable";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQualityCheck } from "@/context/QualityCheckContext";
import Select, { Option } from "@/default_components/form/Select";
import {
  QCSheetDetailStatus,
  QCSheetUpdateReq,
} from "@/interfaces/inboundOutboundType";
import { useCallback, useMemo, useState } from "react";
import { SheetStatus } from "@/interfaces/inventoryManagementType";
import { inboundOutboundService } from "@/services/InboundOutboundService";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loading } from "@/components/TA_common/Loading";
import { useConfirmModal } from "@/hooks/useConfirmModal";

export default function QualityCheckPage() {
  const router = useRouter();
  const { type, id } = useParams();

  const { qcData, setQCData } = useQualityCheck();

  const { confirm, ConfirmationModal } = useConfirmModal();

  const [loading, setLoading] = useState(false);

  const isCreated = qcData?.status === SheetStatus.CREATED;

  const handleConfirmQCSheet = async () => {
    if (!qcData) return;

    const data: QCSheetUpdateReq = {
      status: SheetStatus.APPROVED,
      details: qcData?.details.map((detail) => ({
        id: detail.id,
        status: detail.status,
        reason: detail.reason,
        notes: detail.notes,
      })),
    };

    setLoading(true);

    const res = await inboundOutboundService.updateQCSheet(qcData?.id, data);

    setLoading(false);

    setQCData(res);
    router.push(`/import/process/${type}/${id}/storage-location`);
    toast.success("Quality Check Successfully");
  };

  const handleOpenConfirmModal = async () => {
    const isConfirmed = await confirm({
      title: "Confirm Quality Check",
      message:
        "Are you sure you want to confirm the quality check for all these batches?",
    });

    if (!isConfirmed) return;

    await handleConfirmQCSheet();
  };

  const updateRows = useCallback(
    (detailId: number, changes: Partial<QualityCheckRow>) => {
      setQCData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          details: prev.details.map((detail) => {
            if (detail.id !== detailId) return detail;
            return {
              ...detail,
              status:
                changes.qualityStatus ??
                detail.status ??
                QCSheetDetailStatus.PENDING,
              reason: changes.reason ?? detail.reason ?? "",
              notes: changes.notes ?? detail.notes ?? "",
            };
          }),
        };
      });
    },
    [setQCData],
  );

  const options: Option[] = useMemo(
    () => [
      {
        label: "PENDING",
        value: QCSheetDetailStatus.PENDING,
      },
      {
        label: "PASS",
        value: QCSheetDetailStatus.PASSED,
      },
      {
        label: "FAIL",
        value: QCSheetDetailStatus.FAILED,
      },
      {
        label: "SKIP",
        value: QCSheetDetailStatus.SKIPPED,
      },
    ],
    [],
  );

  const qualityCheckColumn: Column<QualityCheckRow>[] = useMemo(
    () => [
      { key: "batchCode", label: "Batch Code" },
      { key: "name", label: "Product Name" },
      { key: "description", label: "Description" },
      { key: "quantity", label: "Quantity" },
      {
        key: "qualityStatus",
        label: "Quality Status",
        render: (value, row) => (
          <Select
            options={options}
            value={value}
            className="h-[38px]"
            disabled={!isCreated}
            onChange={(e) =>
              updateRows(row.detailId, {
                qualityStatus: e.target.value as QCSheetDetailStatus,
              })
            }
          />
        ),
      },
      {
        key: "reason",
        label: "Reason",
        render: (value, row) => (
          <Input
            className="h-[35px]"
            defaultValue={value}
            disabled={!isCreated}
            onBlur={(e) =>
              updateRows(row.detailId, {
                reason: e.target.value,
              })
            }
          />
        ),
      },
      {
        key: "notes",
        label: "Notes",
        render: (value, row) => (
          <Input
            className="h-[35px]"
            defaultValue={value}
            disabled={!isCreated}
            onBlur={(e) =>
              updateRows(row.detailId, {
                notes: e.target.value,
              })
            }
          />
        ),
      },
    ],
    [options, updateRows, isCreated],
  );

  const rows: QualityCheckRow[] = useMemo(
    () =>
      qcData?.details.map((detail) => ({
        detailId: detail.id,
        batchCode: detail.batch.code,
        name: detail.batch.productVariant.product.name,
        description: detail.batch.productVariant.description,
        quantity: detail.batch.initialQuantity,
        qualityStatus: detail.status,
        reason: detail.reason ?? "",
        notes: detail.notes ?? "",
      })) ?? [],
    [qcData],
  );

  return (
    <div>
      {loading && <Loading />}
      {ConfirmationModal}
      <InfoBox
        icon={<FontAwesomeIcon icon={faCircleCheck} />}
        title="Quality Check"
      >
        <div className="p-6">
          <CustomizableTable<QualityCheckRow>
            headers={qualityCheckColumn}
            data={rows}
            getRowId={(params) => String(params.data.detailId)}
          />

          <div className="flex justify-end">
            <Button onClick={handleOpenConfirmModal} disabled={!isCreated}>
              Confirm Check Quality
            </Button>
          </div>
        </div>
      </InfoBox>
    </div>
  );
}
