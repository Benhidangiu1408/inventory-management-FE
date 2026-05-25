"use client";

import Input from "@/default_components/form/input/InputField";
import InfoBox from "@/components/TA_create_page/InfoBox";
import Button from "@/default_components/ui/button/Button";
import { QualityCheckRow } from "@/interfaces/interface.table";
import CustomizableTable, {
  Column,
} from "@/components/table/CustomizableTable";
import { faCircleCheck, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQualityCheck } from "@/context/QualityCheckContext";
import { useImport } from "@/context/ImportContext";
import Select, { Option } from "@/default_components/form/Select";
import {
  QCSheetDetailStatus,
  QCSheetUpdateReq,
} from "@/interfaces/inboundOutboundType";
import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SheetStatus } from "@/interfaces/inventoryManagementType";
import toast from "react-hot-toast";
import { Loading } from "@/components/TA_common/Loading";
import { useConfirmModal } from "@/hooks/useConfirmModal";
import { updateQCSheet } from "@/actions/inbound-outbound";
import { useAuth } from "@/context/AuthContext";
import { UserPermissions } from "@/interfaces/userManagementType";
import { ApiError } from "next/dist/server/api-utils";

export default function QualityCheckPage() {
  const { qcData, setQCData, isDirty, setIsDirty } = useQualityCheck();
  const { importData } = useImport();
  const { confirm, ConfirmationModal } = useConfirmModal();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const isCompleted = importData.status === SheetStatus.COMPLETED;
  const { user } = useAuth();
  const hasStockInPermission = user?.permissions.includes(
    UserPermissions.STOCK_IN,
  );

  const isCreated = qcData?.status === SheetStatus.CREATED;

  const handleOpenConfirmModal = async () => {
    if (rows.length === 0) {
      toast.error("Nothing to save");
      return;
    }

    try {
      const isConfirmed = await confirm({
        title: "Confirm Quality Check",
        message:
          "Are you sure you want to confirm the quality check for all these batches?",
      });

      if (!isConfirmed) return;

      await handleConfirmQCSheet();
    } catch (err) {
      console.error(err);
      if (err instanceof ApiError) toast.error(err.message);
    }
  };

  const updateRows = useCallback(
    (detailId: number, changes: Partial<QualityCheckRow>) => {
      setIsDirty(true);
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
      { key: "unit", label: "Unit" },
      {
        key: "qualityStatus",
        label: "Quality Status",
        render: (value, row) => (
          <Select
            // If the row is already decided (PASS/FAIL/SKIP),
            // hide PENDING so user can't switch back to it.
            options={
              value === QCSheetDetailStatus.PENDING
                ? options
                : options.filter(
                    (opt) => opt.value !== QCSheetDetailStatus.PENDING,
                  )
            }
            value={value}
            className="h-[38px]"
            disabled={isCompleted}
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
            disabled={isCompleted}
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
            disabled={isCompleted}
            onBlur={(e) =>
              updateRows(row.detailId, {
                notes: e.target.value,
              })
            }
          />
        ),
      },
    ],
    [options, updateRows],
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
        unit: detail.batch.unit.name ?? "",
      })) ?? [],
    [qcData],
  );

  const handleConfirmQCSheet = async () => {
    if (!qcData) return;

    const pendingRows = rows.filter(
      (row) => row.qualityStatus === QCSheetDetailStatus.PENDING,
    );

    if (pendingRows.length > 0) {
      toast.error(
        `${pendingRows.length} item(s) are still PENDING. Please set a status for all items before saving.`,
      );
      return;
    }

    const invalidRows = rows.filter(
      (row) =>
        (row.qualityStatus == QCSheetDetailStatus.SKIPPED ||
          row.qualityStatus == QCSheetDetailStatus.FAILED) &&
        (!row.reason.trim() || !row.notes.trim()),
    );

    if (invalidRows.length > 0) {
      toast.error(
        `Please provide reason and notes for all FAILED or SKIPPED items (${invalidRows.length} item(s) missing).`,
      );
      return;
    }

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

    const res = await updateQCSheet(qcData?.id, data);

    setLoading(false);

    setQCData(res);
    setIsDirty(false);

    toast.success("Quality Check Successfully");
    router.refresh();
  };

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
            <Button
              onClick={handleOpenConfirmModal}
              disabled={isCompleted}
              className={isDirty ? "bg-warning-500 hover:bg-warning-600" : ""}
            >
              {isDirty && <FontAwesomeIcon icon={faTriangleExclamation} className="mr-1" />}Save
            </Button>
          </div>
        </div>
      </InfoBox>
    </div>
  );
}
