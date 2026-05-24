"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  faCalendar,
  faCube,
  faFilter,
  faMagnifyingGlass,
  faWarehouse,
} from "@fortawesome/free-solid-svg-icons";
import CustomFilter from "@/components/TA_common/CustomFilter";
import FilterItem from "@/components/TA_common/FilterItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ImportCreateRow,
  ProductTempRow,
} from "../../interfaces/interface.table";
import CustomizableTable, { Column } from "../table/CustomizableTable";
import Input from "../../default_components/form/input/InputField";
import Checkbox from "../../default_components/form/input/Checkbox";
import { ProductVariantResponse } from "@/interfaces/inboundOutboundType";
import Select from "@/default_components/form/Select";

type CreateModalProps = {
  productVariants: ProductVariantResponse[];
  onSelectedProductsChange?: (products: ProductTempRow[]) => void;
  onHasInvalidChange?: (hasInvalid: boolean) => void;
};

export default function CreateModal({
  productVariants,
  onSelectedProductsChange,
  onHasInvalidChange,
}: CreateModalProps) {
  const variants = productVariants.map((variant) => {
    return {
      checkBox: false,
      productId: variant.id.toString(),
      name: variant.product.name,
      description: variant.description,
      unit: variant.product.baseUnit,
      unitId: variant.product.baseUnit.id,
      unitConversions: variant.product.unitConversions,
      pickQuantity: "",
    };
  });

  const [data, setData] = useState<ImportCreateRow[]>(variants ?? []);

  // Notify parent whenever selected products change
  useEffect(() => {
    const checkedItems = data.filter((item) => item.checkBox);

    const invalidItems = checkedItems.filter(
      (item) => item.pickQuantity === "" || Number(item.pickQuantity) <= 0,
    );

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
        weight:
          selectedItem.weight !== "" && selectedItem.weight !== undefined
            ? Number(selectedItem.weight)
            : undefined,
        length:
          selectedItem.length !== "" && selectedItem.length !== undefined
            ? Number(selectedItem.length)
            : undefined,
        width:
          selectedItem.width !== "" && selectedItem.width !== undefined
            ? Number(selectedItem.width)
            : undefined,
        height:
          selectedItem.height !== "" && selectedItem.height !== undefined
            ? Number(selectedItem.height)
            : undefined,
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

  const handleDimensionChange = useCallback(
    (
      productId: string,
      field: "weight" | "length" | "width" | "height",
      value: string,
    ) => {
      setData((prev) =>
        prev.map((item) =>
          item.productId === productId ? { ...item, [field]: value } : item,
        ),
      );
    },
    [],
  );

  const columns: Column<ImportCreateRow>[] = useMemo(
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
        label: "Pick Quantity",
        key: "pickQuantity",
        render: (_, row) => (
          <Input
            type="number"
            className="h-[35px]"
            value={String(row.pickQuantity || "")}
            onChange={(e) =>
              handlePickQuantityChange(row.productId, e.target.value)
            }
          />
        ),
      },
      ...(
        ["weight", "length", "width", "height"] as (
          | "weight"
          | "length"
          | "width"
          | "height"
        )[]
      ).map((field) => ({
        label: field.charAt(0).toUpperCase() + field.slice(1),
        key: field as keyof ImportCreateRow,
        render: (
          _: ImportCreateRow[keyof ImportCreateRow],
          row: ImportCreateRow,
        ) => (
          <Input
            type="number"
            className="h-[35px] w-[80px]"
            value={String(row[field] ?? "")}
            placeholder="-"
            onChange={(e) =>
              handleDimensionChange(row.productId, field, e.target.value)
            }
          />
        ),
      })),
    ],
    [
      handleCheckboxChange,
      handlePickQuantityChange,
      handleUnitChange,
      handleDimensionChange,
    ],
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="default-card">
        <div className="flex flex-col gap-6 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faCube} />
              <span className="font-bold">Available Products</span>
              <div className="rounded-2xl bg-gray-300 p-2">
                {data.length} products found
              </div>
            </div>
          </div>
          <div className="default-card overflow-hidden p-6">
            <CustomizableTable<ImportCreateRow>
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
