"use client";

import { confirmQuantityCheck } from "@/actions/inbound-outbound";
import { Loading } from "@/components/TA_common/Loading";
import InfoBox from "@/components/TA_create_page/InfoBox";
import CustomizableTable, {
  Column,
} from "@/components/table/CustomizableTable";
import { useAuth } from "@/context/AuthContext";
import { useImport } from "@/context/ImportContext";
import Input from "@/default_components/form/input/InputField";
import Button from "@/default_components/ui/button/Button";
import { useConfirmModal } from "@/hooks/useConfirmModal";
import {
  ImportSheetDetailUpdateReq,
  ImportSheetUpdateReq,
} from "@/interfaces/inboundOutboundType";
import { QuantityCheckRow } from "@/interfaces/interface.table";
import { SheetStatus } from "@/interfaces/inventoryManagementType";
import { UserPermissions } from "@/interfaces/userManagementType";
import { faCircleCheck, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format } from "date-fns";
import { useParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ImportProcessPage() {
  const { type, id } = useParams();

  const { importData, setImportData, isDirty, setIsDirty } = useImport();

  const { user } = useAuth();
  const hasStockInPermission = user?.permissions.includes(
    UserPermissions.STOCK_IN,
  );

  const { confirm, ConfirmationModal } = useConfirmModal();

  const [loading, setLoading] = useState(false);
  const isCreated = importData.status === SheetStatus.CREATED;
  const isCompleted = importData.status === SheetStatus.COMPLETED;
  const isDisabled = isCompleted || !hasStockInPermission;

  const rows: QuantityCheckRow[] = importData.details.map((detail) => ({
    detailId: detail.id,
    productVariantId: detail.productVariant.id,
    name: detail.productVariant.product.name,
    description: detail.productVariant.description,
    expectedQuantity: detail.expectedQuantity ?? 0,
    actualQuantity: detail.actualQuantity ?? 0,
    variance: (detail.actualQuantity ?? 0) - (detail.expectedQuantity ?? 0),
    reason: detail.reason ?? "",
    unit: detail.unit?.name ?? "",
    expirationDate: detail.expirationDate,
  }));

  const updateRow = (detailId: number, changes: Partial<QuantityCheckRow>) => {
    setIsDirty(true);
    setImportData((prev) => ({
      ...prev,
      details: prev.details.map((detail) => {
        if (detail.id !== detailId) return detail;

        return {
          ...detail,
          actualQuantity: changes.actualQuantity ?? detail.actualQuantity ?? 0,
          reason: changes.reason ?? detail.reason ?? "",
          expirationDate: changes.expirationDate !== undefined ? changes.expirationDate : detail.expirationDate,
        };
      }),
    }));
  };

  const handleConfirm = async () => {
    const details: ImportSheetDetailUpdateReq[] = importData.details.map(
      (detail) => ({
        id: detail.id,
        actualQuantity: detail.actualQuantity,
        reason: detail.reason,
        expirationDate: detail.expirationDate,
      }),
    );

    const data: ImportSheetUpdateReq = { details };

    setLoading(true);

    const res = await confirmQuantityCheck(importData.id, data);

    setImportData(res);
    setIsDirty(false);

    setLoading(false);

    toast.success("Updated Quantity Check Successfully");
  };

  const handleOpenConfirmModal = async () => {
    if (rows.length === 0) {
      toast.error("Nothing to save");
      return;
    }

    const isConfirmed = await confirm({
      title: "Confirm Quantity Check",
      message:
        "Are you sure you want to confirm the quantity check for all these batches?",
    });

    if (!isConfirmed) return;

    const missingDateRows = rows.filter((row) => !row.expirationDate);

    if (missingDateRows.length > 0) {
      toast.error(
        `${missingDateRows.length} item(s) are missing an expiration date. Please fill in before saving.`,
      );
      return;
    }

    const invalidRows = rows.filter(
      (row) =>
        row.actualQuantity !== row.expectedQuantity && !row.reason?.trim(),
    );

    if (invalidRows.length > 0) {
      toast.error(
        `${invalidRows.length} batches have extra or missing quantities. Please provide a reason.`,
      );
      return;
    }

    await handleConfirm();
  };

  const quantityCheckColumn: Column<QuantityCheckRow>[] = [
    {
      key: "detailId",
      label: "Import Sheet Detail ID",
    },
    {
      key: "name",
      label: "Product Name",
    },
    {
      key: "description",
      label: "Description",
    },
    {
      key: "expectedQuantity",
      label: "Expected Quantity",
    },
    {
      key: "actualQuantity",
      label: "Actual Quantity",
      render: (value, row) => {
        return (
          <Input
            className="h-[35px]"
            defaultValue={value}
            type="number"
            disabled={isDisabled}
            onBlur={(e) => {
              const newValue = Number(e.target.value);
              if (newValue === row.actualQuantity) return;
              updateRow(row.detailId, { actualQuantity: newValue });
            }}
          />
        );
      },
    },
    {
      key: "unit",
      label: "Unit",
    },
    {
      key: "variance",
      label: "Variance",
      render: (value, row) => {
        return (
          <div
            className={`${Number(value) === 0 ? "text-success-500" : Number(value) > 0 ? "text-warning-500" : "text-error-500"} font-bold`}
          >
            {Number(value) > 0 && "+"} {value}
          </div>
        );
      },
    },
    {
      key: "expirationDate",
      label: "Expiration Date",
      minWidth: 220,
      render: (value, row) => {
        const dateValue = value
          ? format(new Date(value as string), "yyyy-MM-dd'T'HH:mm")
          : "";
        return (
          <Input
            type="datetime-local"
            className="h-[35px]"
            defaultValue={dateValue}
            disabled={isDisabled}
            onBlur={(e) => {
              const iso = e.target.value
                ? new Date(e.target.value).toISOString()
                : undefined;
              if (iso === row.expirationDate) return;
              updateRow(row.detailId, { expirationDate: iso });
            }}
          />
        );
      },
    },
    {
      key: "reason",
      label: "Reason",
      render: (value, row) => {
        return (
          <Input
            defaultValue={value}
            className="h-[35px]"
            disabled={isDisabled}
            onBlur={(e) => {
              if (e.target.value === row.reason) return;
              updateRow(row.detailId, { reason: e.target.value });
            }}
          />
        );
      },
    },
  ];

  return (
    <div>
      {loading && <Loading />}
      {ConfirmationModal}
      <InfoBox
        icon={<FontAwesomeIcon icon={faCircleCheck} />}
        title="Quantity Check"
      >
        <div className="p-6">
          <CustomizableTable<QuantityCheckRow>
            headers={quantityCheckColumn}
            data={rows}
            getRowId={(params) => String(params.data.detailId)}
          />

          <div className="flex justify-end">
            <Button
              onClick={handleOpenConfirmModal}
              disabled={isDisabled}
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
