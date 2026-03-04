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

type CreateModalProps = {
  productVariants: ProductVariantResponse[];
  onSelectedProductsChange?: (product: ProductTempRow | null) => void;
};

const mockData: ImportCreateRow[] = [
  {
    checkBox: false,
    productId: "1",
    name: "Laptop Dell XPS 15",
    unit: "Cái",
    pickQuantity: "",
    description: "Hihi",
  },
  {
    checkBox: false,
    productId: "2",
    name: "Mouse Logitech MX Master",
    unit: "Cái",
    pickQuantity: "",
    description: "Hihi",
  },
  {
    checkBox: false,
    productId: "3",
    name: "Keyboard Mechanical RGB",
    unit: "Cái",
    pickQuantity: "",
    description: "Hihi",
  },
  {
    checkBox: false,
    productId: "4",
    name: "Monitor Samsung 27 inch",
    unit: "Cái",
    pickQuantity: "",
    description: "Hihi",
  },
  {
    checkBox: false,
    productId: "5",
    name: "Webcam Logitech C920",
    unit: "Cái",
    pickQuantity: "",
    description: "Hihi",
  },
  {
    checkBox: false,
    productId: "6",
    name: "USB Cable Type-C",
    unit: "Cái",
    pickQuantity: "",
    description: "Hihi",
  },
  {
    checkBox: false,
    productId: "7",
    name: "Headphone Sony WH-1000XM4",
    unit: "Cái",
    pickQuantity: "",
    description: "Hihi",
  },
  {
    checkBox: false,
    productId: "8",
    name: "SSD Samsung 1TB",
    unit: "Cái",
    pickQuantity: "",
    description: "Hihi",
  },
  {
    checkBox: false,
    productId: "9",
    name: "RAM DDR4 16GB",
    unit: "Thanh",
    pickQuantity: "",
    description: "Hihi",
  },
  {
    checkBox: false,
    productId: "10",
    name: "Power Bank 20000mAh",
    unit: "Cái",
    pickQuantity: "",
    description: "Hihi",
  },
  {
    checkBox: false,
    productId: "11",
    name: "Laptop Stand Aluminum",
    unit: "Cái",
    pickQuantity: "",
    description: "Hihi",
  },
  {
    checkBox: false,
    productId: "12",
    name: "HDMI Cable 2.0",
    unit: "Cái",
    pickQuantity: "",
    description: "Hihi",
  },
];

export default function CreateModal({
  productVariants,
  onSelectedProductsChange,
}: CreateModalProps) {
  const variants = productVariants.map((variant) => {
    return {
      checkBox: false,
      productId: variant.id.toString(),
      name: variant.product.name,
      description: variant.description,
      unit: "Piece",
      pickQuantity: "",
    };
  });

  const [data, setData] = useState<ImportCreateRow[]>(variants ?? mockData);

  // Notify parent whenever selected products change
  useEffect(() => {
    if (!onSelectedProductsChange) return;
    const selectedItem = data.find(
      (item) =>
        item.checkBox &&
        item.pickQuantity !== "" &&
        Number(item.pickQuantity) > 0,
    );

    const selected: ProductTempRow | null = selectedItem
      ? {
          id: Number(selectedItem.productId),
          name: selectedItem.name,
          expectedQuantity: Number(selectedItem.pickQuantity),
          description: selectedItem.description ?? "",
        }
      : null;

    console.log("Current data:", data);
    console.log("Selected product from modal:", selected);
    onSelectedProductsChange(selected);
  }, [data, onSelectedProductsChange]);

  const handleCheckboxChange = useCallback(
    (productId: string, checked: boolean) => {
      setData((prev) =>
        prev.map((item) =>
          item.productId === productId
            ? { ...item, checkBox: checked }
            : { ...item, checkBox: false },
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
        key: "unit",
      },

      {
        label: "Pick Quantity",
        key: "pickQuantity",
        render: (_, row) => (
          <Input
            type="number"
            className="h-full"
            value={String(row.pickQuantity || "")}
            onChange={(e) =>
              handlePickQuantityChange(row.productId, e.target.value)
            }
          />
        ),
      },
    ],
    [handleCheckboxChange, handlePickQuantityChange],
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-[#E4E7EC] bg-white">
        <CustomFilter>
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
        </CustomFilter>
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
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
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
