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
    ],
    [handleCheckboxChange, handlePickQuantityChange, handleUnitChange],
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="default-card">
        {/* <CustomFilter>
          <FilterItem
            type="input"
            label="Search"
            placeholder="Search"
            icon={faMagnifyingGlass}
          />
          <FilterItem
            type="select"
            label="Status"
            placeholder="Status"
            icon={faFilter}
            options={[{ label: "Active", value: "active" }]}
          />
          <FilterItem
            type="select"
            label="Warehouse"
            placeholder="Warehouse"
            icon={faWarehouse}
            options={[{ label: "Active", value: "active" }]}
          />
          <FilterItem
            type="date"
            label="Date"
            placeholder="Date"
            icon={faCalendar}
          />
        </CustomFilter> */}
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
          <div className="default-card overflow-hidden">
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
