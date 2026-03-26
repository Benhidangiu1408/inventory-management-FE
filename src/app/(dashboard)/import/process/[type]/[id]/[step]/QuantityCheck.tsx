"use client";

import { confirmImportSheet } from "@/actions/inbound-outbound";
import { Loading } from "@/components/TA_common/Loading";
import InfoBox from "@/components/TA_create_page/InfoBox";
import CustomizableTable, {
  Column,
} from "@/components/table/CustomizableTable";
import { useImport } from "@/context/ImportContext";
import Input from "@/default_components/form/input/InputField";
import Button from "@/default_components/ui/button/Button";
import { useConfirmModal } from "@/hooks/useConfirmModal";
import {
  ImportSheetDetailUpdateReq,
  ImportSheetUpdateReq,
} from "@/interfaces/inboundOutboundType";
import {
  QuantityCheckParentRow,
  QuantityCheckRow,
} from "@/interfaces/interface.table";
import { SheetStatus } from "@/interfaces/inventoryManagementType";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ImportProcessPage() {
  const router = useRouter();

  const { type, id } = useParams();

  const { importData, setImportData } = useImport();

  const { confirm, ConfirmationModal } = useConfirmModal();

  const [loading, setLoading] = useState(false);
  const isCreated = importData.status === SheetStatus.CREATED;

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
  }));

  const updateRow = (detailId: number, changes: Partial<QuantityCheckRow>) => {
    setImportData((prev) => ({
      ...prev,
      details: prev.details.map((detail) => {
        if (detail.id !== detailId) return detail;

        return {
          ...detail,
          actualQuantity: changes.actualQuantity ?? detail.actualQuantity ?? 0,
          reason: changes.reason ?? detail.reason ?? "",
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
      }),
    );

    const data: ImportSheetUpdateReq = { details };

    setLoading(true);

    const res = await confirmImportSheet(importData.id, data);

    setImportData(res);

    setLoading(false);

    toast.success("Updated Quantity Check Successfully");

    router.push(`/import/process/${type}/${id}/quality-check`);
  };

  const handleOpenConfirmModal = async () => {
    const isConfirmed = await confirm({
      title: "Confirm Quantity Check",
      message:
        "Are you sure you want to confirm the quantity check for all these batches?",
    });

    if (!isConfirmed) return;

    await handleConfirm();
  };

  const quantityCheckColumn: Column<QuantityCheckRow>[] = [
    {
      key: "productVariantId",
      label: "Product Variant ID",
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
            disabled={!isCreated}
            onBlur={(e) =>
              updateRow(row.detailId, {
                actualQuantity: Number(e.target.value),
              })
            }
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
      key: "reason",
      label: "Reason",
      render: (value, row) => {
        return (
          <Input
            defaultValue={value}
            className="h-[35px]"
            disabled={!isCreated}
            onBlur={(e) =>
              updateRow(row.detailId, {
                reason: e.target.value,
              })
            }
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
            <Button onClick={handleOpenConfirmModal} disabled={!isCreated}>
              Confirm Check Quantity
            </Button>
          </div>
        </div>
      </InfoBox>
    </div>
  );
}
