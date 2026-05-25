"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { faCube } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ExportCreateRow,
  ProductTempRow,
} from "../../interfaces/interface.table";
import CustomizableTable, { Column } from "../table/CustomizableTable";
import Input from "../../default_components/form/input/InputField";
import Checkbox from "../../default_components/form/input/Checkbox";
import {
  AttributeResponse,
  ProductVariantStockResponse,
} from "@/interfaces/inboundOutboundType";
import Select from "@/default_components/form/Select";

type ExportCreateModalProps = {
  productVariants: ProductVariantStockResponse[];
  onSelectedProductsChange?: (products: ProductTempRow[]) => void;
  onHasInvalidChange?: (hasInvalid: boolean) => void;
};

export default function ExportCreateModal({
  productVariants,
  onSelectedProductsChange,
  onHasInvalidChange,
}: ExportCreateModalProps) {
  const variants: ExportCreateRow[] = productVariants.map((variant) => ({
    checkBox: false,
    productId: variant.id.toString(),
    name: variant.product.name,
    description: variant.description,
    unit: variant.product.baseUnit,
    unitId: variant.product.baseUnit.id,
    unitConversions: variant.product.unitConversions,
    pickQuantity: "",
    stockQuantity: variant.stockQuantity,
    attributes: variant.attributes ?? [],
  }));

  const [data, setData] = useState<ExportCreateRow[]>(variants ?? []);

  useEffect(() => {
    const checkedItems = data.filter((item) => item.checkBox);

    const invalidItems = checkedItems.filter((item) => {
      if (item.pickQuantity === "" || Number(item.pickQuantity) <= 0)
        return true;
      const conversion = item.unitConversions.find(
        (c) => c.fromUnit.id === item.unitId,
      );
      const effectiveStock =
        item.unitId === item.unit.id || !conversion
          ? item.stockQuantity
          : Math.floor(item.stockQuantity / conversion.conversionRate);
      return Number(item.pickQuantity) > effectiveStock;
    });

    onHasInvalidChange?.(invalidItems.length > 0);

    if (!onSelectedProductsChange) return;

    const selected: ProductTempRow[] = checkedItems
      .filter(
        (item) => item.pickQuantity !== "" && Number(item.pickQuantity) > 0,
      )
      .map((selectedItem) => ({
        detailId: 0,
        id: Number(selectedItem.productId),
        name: selectedItem.name,
        expectedQuantity: Number(selectedItem.pickQuantity),
        description: selectedItem.description ?? "",
        unit:
          selectedItem.unitId === selectedItem.unit.id
            ? selectedItem.unit
            : (selectedItem.unitConversions.find(
                (c) => c.fromUnit.id === selectedItem.unitId,
              )?.fromUnit ?? selectedItem.unit),
        attributes: selectedItem.attributes,
      }));

    onSelectedProductsChange(selected);
  }, [data, onSelectedProductsChange, onHasInvalidChange]);

  const handleCheckboxChange = useCallback(
    (productId: string, checked: boolean) => {
      setData((prev) =>
        prev.map((item) =>
          item.productId === productId ? { ...item, checkBox: checked } : item,
        ),
      );
    },
    [],
  );

  const handlePickQuantityChange = useCallback(
    (productId: string, value: string) => {
      setData((prev) =>
        prev.map((item) =>
          item.productId === productId
            ? { ...item, pickQuantity: value }
            : item,
        ),
      );
    },
    [],
  );

  const handleUnitChange = useCallback((productId: string, unitId: string) => {
    setData((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, unitId: Number(unitId) }
          : item,
      ),
    );
  }, []);

  const columns: Column<ExportCreateRow>[] = useMemo(
    () => [
      {
        label: "Check Box",
        key: "checkBox",
        render: (_, row) => (
          <div className="flex h-full items-center justify-center">
            <Checkbox
              checked={row.checkBox}
              onChange={(e) =>
                handleCheckboxChange(row.productId, e.target.checked)
              }
            />
          </div>
        ),
      },
      {
        label: "Product ID",
        key: "productId",
      },
      {
        label: "Name",
        key: "name",
      },
      {
        label: "Description",
        key: "description",
      },
      {
        label: "Attributes",
        key: "attributes",
        filter: false,
        render: (attrs) => {
          const attributeArray = attrs as AttributeResponse[];
          if (!Array.isArray(attributeArray) || attributeArray.length === 0)
            return <span className="text-gray-400 italic">Default</span>;
          return (
            <div className="flex h-full w-full flex-wrap items-center justify-center gap-1 py-1">
              {attributeArray.map((attr) => (
                <span
                  key={attr.id}
                  className="inline-flex items-center rounded border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
                >
                  <span className="mr-1 font-semibold">{attr.name}:</span>{" "}
                  {attr.value}
                </span>
              ))}
            </div>
          );
        },
      },
      {
        label: "Unit",
        key: "unitId",
        render: (_, row) => (
          <Select
            className="h-[38px]"
            options={[
              {
                value: String(row.unit.id),
                label: row.unit.name,
              },
              ...row.unitConversions.map((item) => ({
                value: String(item.fromUnit.id),
                label: item.fromUnit.name,
              })),
            ]}
            value={String(row.unitId)}
            onChange={(e) => handleUnitChange(row.productId, e.target.value)}
          />
        ),
      },
      {
        label: "Stock Quantity",
        key: "stockQuantity",
        valueGetter: (row) => {
          if (row.unitId === row.unit.id) return row.stockQuantity;
          const conversion = row.unitConversions.find(
            (c) => c.fromUnit.id === row.unitId,
          );
          if (!conversion) return row.stockQuantity;
          return Math.floor(row.stockQuantity / conversion.conversionRate);
        },
        render: (value, row) => {
          const unitAbb =
            row.unitId === row.unit.id
              ? row.unit.abb
              : (row.unitConversions.find((c) => c.fromUnit.id === row.unitId)
                  ?.fromUnit.abb ?? row.unit.abb);
          return (
            <span>
              {value as number}{" "}
              <span className="text-xs text-gray-500">{unitAbb}</span>
            </span>
          );
        },
      },
      {
        label: "Pick Quantity",
        key: "pickQuantity",
        autoHeight: true,
        render: (_, row) => {
          const conversion = row.unitConversions.find(
            (c) => c.fromUnit.id === row.unitId,
          );
          const effectiveStock =
            row.unitId === row.unit.id || !conversion
              ? row.stockQuantity
              : Math.floor(row.stockQuantity / conversion.conversionRate);
          const isExceeded =
            row.pickQuantity !== "" &&
            Number(row.pickQuantity) > effectiveStock;
          return (
            <div className="flex flex-col gap-1">
              <Input
                type="number"
                className={`h-[35px] ${isExceeded ? "border-red-500" : ""}`}
                value={String(row.pickQuantity || "")}
                onChange={(e) =>
                  handlePickQuantityChange(row.productId, e.target.value)
                }
              />
              {isExceeded && (
                <span className="text-xs text-red-500">
                  Exceeds stock ({effectiveStock})
                </span>
              )}
            </div>
          );
        },
      },
    ],
    [handleCheckboxChange, handlePickQuantityChange, handleUnitChange],
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="default-card">
        <div className="flex flex-col gap-6 p-6">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faCube} />
            <span className="font-bold">Available Products</span>
            <div className="rounded-2xl bg-gray-300 p-2">
              {data.length} products found
            </div>
          </div>
          <div className="default-card overflow-hidden p-6">
            <CustomizableTable<ExportCreateRow>
              headers={columns}
              data={data}
              getRowId={(params) => params.data.productId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
