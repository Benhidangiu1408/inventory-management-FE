"use client";

import InfoBox from "@/components/TA_create_page/InfoBox";
import CustomizableTable, {
  Column,
} from "@/components/table/CustomizableTable";
import { useImport } from "@/context/ImportContext";
import Select from "@/default_components/form/Select";
import Button from "@/default_components/ui/button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCodeCompare, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

interface ProductMappingRow {
  detailId: number;
  index: number;
  rawProductName: string;
  rawSku: string;
  rawUnit: string;
  systemProductId: string;
  systemUnitId: string;
}

export default function ProductMappingPage() {
  const router = useRouter();
  const { type, id } = useParams();
  const { importData } = useImport();

  const productOptions = useMemo(
    () =>
      importData.details
        .filter((detail) => detail.productVariant)
        .map((detail) => ({
          value: String(detail.productVariant!.id),
          label: `${detail.productVariant!.product.name} - ${detail.productVariant!.description}`,
        })),
    [importData.details],
  );

  const initRows = useMemo<ProductMappingRow[]>(
    () =>
      importData.details.map((detail, idx) => ({
        detailId: detail.id,
        index: idx + 1,
        rawProductName: detail.rawProductName ?? "N/A",
        rawSku: detail.rawSku ?? "N/A",
        rawUnit: detail.rawUnitName ?? "N/A",
        systemProductId: detail.productVariant
          ? String(detail.productVariant.id)
          : "",
        systemUnitId: String(
          detail.unit?.id ?? detail.productVariant?.product.baseUnit.id ?? "",
        ),
      })),
    [importData.details],
  );

  const [rows, setRows] = useState<ProductMappingRow[]>(initRows);
  useEffect(() => {
    setRows(initRows);
  }, [initRows]);

  const getUnitOptions = useCallback(
    (row: ProductMappingRow) => {
      const selectedProduct = importData.details.find(
        (detail) => String(detail.productVariant?.id) === row.systemProductId,
      )?.productVariant?.product;

      if (!selectedProduct) {
        return [];
      }

      return [
        {
          value: String(selectedProduct.baseUnit.id),
          label: selectedProduct.baseUnit.name,
        },
        ...selectedProduct.unitConversions.map((conversion) => ({
          value: String(conversion.fromUnit.id),
          label: conversion.fromUnit.name,
        })),
      ];
    },
    [importData.details],
  );

  const handleChangeSystemProduct = useCallback(
    (detailId: number, productId: string) => {
      setRows((prev) =>
        prev.map((row) => {
          if (row.detailId !== detailId) return row;
          const foundDetail = importData.details.find(
            (detail) => String(detail.productVariant?.id) === productId,
          );
          return {
            ...row,
            systemProductId: productId,
            systemUnitId: foundDetail
              ? String(foundDetail.productVariant?.product.baseUnit.id ?? "")
              : "",
          };
        }),
      );
    },
    [importData.details],
  );

  const handleChangeSystemUnit = (detailId: number, unitId: string) => {
    setRows((prev) =>
      prev.map((row) =>
        row.detailId === detailId ? { ...row, systemUnitId: unitId } : row,
      ),
    );
  };

  const unmatchedCount = useMemo(
    () =>
      rows.filter((row) => !row.systemProductId || !row.systemUnitId).length,
    [rows],
  );

  const canContinue = unmatchedCount === 0 && rows.length > 0;

  const mappingColumns: Column<ProductMappingRow>[] = useMemo(
    () => [
      {
        key: "index",
        label: "#",
        width: 70,
      },
      {
        key: "rawProductName",
        label: "Raw product name",
        minWidth: 220,
        render: (value) => (
          <span className="text-sm text-gray-700">{String(value)}</span>
        ),
      },
      {
        key: "rawSku",
        label: "Raw SKU",
        minWidth: 170,
        render: (value) => (
          <span className="text-sm text-gray-700">{String(value)}</span>
        ),
      },
      {
        key: "rawUnit",
        label: "Raw unit",
        minWidth: 130,
        render: (value) => (
          <span className="text-sm text-gray-700">{String(value)}</span>
        ),
      },
      {
        key: "systemProductId",
        label: "System product",
        minWidth: 340,
        render: (value, row) => (
          <div className="flex items-center gap-2">
            <Select
              value={String(value)}
              onChange={(e) =>
                handleChangeSystemProduct(row.detailId, e.target.value)
              }
              options={productOptions}
              placeholder="-- Select product --"
              className="h-[38px] flex-1 py-0 text-sm"
            />
            <Button
              size="sm"
              variant="outline"
              type="button"
              className="h-[38px] text-sm"
            >
              <FontAwesomeIcon icon={faPlus} />
              New
            </Button>
          </div>
        ),
      },
      {
        key: "systemUnitId",
        label: "System unit",
        render: (value, row) => {
          const unitOptions = getUnitOptions(row);
          return (
            <Select
              value={String(value)}
              onChange={(e) =>
                handleChangeSystemUnit(row.detailId, e.target.value)
              }
              options={unitOptions}
              placeholder="Unit"
              className="h-[38px] w-full py-0 text-sm"
            />
          );
        },
      },
      {
        key: "detailId",
        label: "Status",
        minWidth: 140,
        render: (_, row) => {
          const isMapped = Boolean(row.systemProductId && row.systemUnitId);

          return isMapped ? (
            <span className="text-success-600 inline-flex items-center gap-2 text-sm font-medium">
              <span className="bg-success-600 h-1.5 w-1.5 rounded-full" />
              Mapped
            </span>
          ) : (
            <span className="text-warning-600 inline-flex items-center gap-2 text-sm font-medium">
              <span className="bg-warning-600 h-1.5 w-1.5 rounded-full" />
              Pending
            </span>
          );
        },
      },
    ],
    [getUnitOptions, handleChangeSystemProduct, productOptions],
  );

  return (
    <div>
      <InfoBox
        icon={<FontAwesomeIcon icon={faCodeCompare} />}
        title="Product Mapping"
        description="Map supplier products to system products before proceeding"
      >
        <div className="flex flex-col gap-6 p-6">
          <div className="flex justify-end">
            <div className="bg-warning-50 text-warning-600 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium">
              <span className="bg-warning-600 h-1.5 w-1.5 rounded-full" />
              {unmatchedCount} unmatched
            </div>
          </div>

          <CustomizableTable<ProductMappingRow>
            headers={mappingColumns}
            data={rows}
            getRowId={(params) => String(params.data.detailId)}
          />

          <div className="flex items-center justify-between gap-4">
            <p className="text-xs text-gray-500">
              All products must be mapped before proceeding to quantity check
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                type="button"
                className="h-[38px] text-sm"
                onClick={() => router.back()}
              >
                Back
              </Button>
              <Button
                type="button"
                className="h-[38px] text-sm"
                disabled={!canContinue}
                onClick={() =>
                  router.push(`/import/process/${type}/${id}/quantity-check`)
                }
              >
                Next: Quantity check
              </Button>
            </div>
          </div>
        </div>
      </InfoBox>
    </div>
  );
}
