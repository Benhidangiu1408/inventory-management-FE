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

  // console.log(importData);

  const quantityCheckData: QuantityCheckRow[] = importData.details.map(
    (detail) => ({
      detailId: detail.id,
      productVariantId: detail.productVariant.id,
      name: detail.productVariant.product.name,
      description: detail.productVariant.description,
      expectedQuantity: detail.expectedQuantity ?? 0,
      actualQuantity: detail.actualQuantity ?? 0,
      variance: (detail.actualQuantity ?? 0) - (detail.expectedQuantity ?? 0),
      reason: detail.reason ?? "",
    }),
  );

  const [rows, setRows] = useState<QuantityCheckRow[]>(quantityCheckData);
  // const [dirtyRows, setDirtyRows] = useState<QuantityCheckRow[]>([]);

  const updateRow = (detailId: number, changes: Partial<QuantityCheckRow>) => {
    setRows((prev) =>
      prev.map((row) => {
        if (row.detailId !== detailId) return row;

        const updated = { ...row, ...changes };

        // setDirtyRows((dirty) => {
        //   const exists = dirty.find((d) => d.detailId === detailId);
        //   if (exists) {
        //     return dirty.map((d) => (d.detailId === detailId ? updated : d));
        //   }
        //   return [...dirty, updated];
        // });

        return {
          ...updated,
          variance:
            (updated.actualQuantity ?? 0) - (updated.expectedQuantity ?? 0),
        };
      }),
    );
  };

  const handleConfirm = async () => {
    const originalMap = new Map(importData.details.map((d) => [d.id, d]));

    const changedDetails = rows.map((row) => {
      const original = originalMap.get(row.detailId);
      if (!original) return null;

      const hasActualChanged =
        row.actualQuantity !== (original.actualQuantity ?? 0);

      const hasReasonChanged = (row.reason ?? "") !== (original.reason ?? "");

      if (!hasActualChanged && !hasReasonChanged) return null;

      return {
        id: row.detailId,
        actualQuantity: row.actualQuantity,
        reason: row.reason,
      };
    });

    const changeDetailsWithoutNull: ImportSheetDetailUpdateReq[] =
      changedDetails.filter((item) => item !== null);

    const data: ImportSheetUpdateReq = {
      details: changeDetailsWithoutNull,
    };

    setLoading(true);

    const res = await inboundOutboundService.updateImportSheet(
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

  // const quantityCheckData: QuantityCheckRow[] = [
  //   {
  //     name: "Product 1",
  //     expectedQuantity: 10,
  //     actualQuantity: 10,
  //     variance: 0,
  //     reason: "Reason 1",
  //   },
  // ];

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
