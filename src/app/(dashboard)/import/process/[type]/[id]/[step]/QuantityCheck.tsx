"use client";

import { Loading } from "@/components/TA_common/Loading";
import InfoBox from "@/components/TA_create_page/InfoBox";
import CustomizableTable, {
  Column,
} from "@/components/table/CustomizableTable";
import { useImport } from "@/context/ImportContext";
import Input from "@/default_components/form/input/InputField";
import Button from "@/default_components/ui/button/Button";
import {
  ImportSheetDetailUpdateReq,
  ImportSheetUpdateReq,
} from "@/interfaces/inboundOutboundType";
import { QuantityCheckRow } from "@/interfaces/interface.table";
import { inboundOutboundService } from "@/services/InboundOutboundService";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ImportProcessPage() {
  const { importData, setImportData } = useImport();

  const [loading, setLoading] = useState(false);

  const rows: QuantityCheckRow[] = importData.details.map((detail) => ({
    detailId: detail.id,
    productVariantId: detail.productVariant.id,
    name: detail.productVariant.product.name,
    description: detail.productVariant.description,
    expectedQuantity: detail.expectedQuantity ?? 0,
    actualQuantity: detail.actualQuantity ?? 0,
    variance: (detail.actualQuantity ?? 0) - (detail.expectedQuantity ?? 0),
    reason: detail.reason ?? "",
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

    const res = await inboundOutboundService.confirmImportSheet(
      importData.id,
      data,
    );

    setImportData(res);

    setLoading(false);

    toast.success("Updated Quantity Check Successfully");
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
      key: "variance",
      label: "Variance",
    },
    {
      key: "reason",
      label: "Reason",
      render: (value, row) => {
        return (
          <Input
            defaultValue={value}
            className="h-[35px]"
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
      <InfoBox
        icon={<FontAwesomeIcon icon={faCircleCheck} />}
        title="Quantity Check"
      >
        <div className="p-6">
          <CustomizableTable<QuantityCheckRow>
            headers={quantityCheckColumn}
            data={rows}
          />

          <div className="flex justify-end">
            <Button onClick={handleConfirm}>Confirm Check Quantity</Button>
          </div>
        </div>
      </InfoBox>
    </div>
  );
}
