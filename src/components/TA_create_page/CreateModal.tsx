"use client";

import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  type RefObject,
} from "react";
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
// import Pagination from "@/default_components/tables/Pagination";
import Input from "../../default_components/form/input/InputField";
import Checkbox from "../../default_components/form/input/Checkbox";

type CreateModalProps = {
  getSelectedProductsRef?: RefObject<(() => ProductTempRow[]) | null>;
};

export default function CreateModal({
  getSelectedProductsRef,
}: CreateModalProps) {
  const [data, setData] = useState<ImportCreateRow[]>([
    {
      checkBox: false,
      productId: "1",
      name: "Laptop Dell XPS 15",
      stock: 150,
      unit: "Cái",
      quantity: "150",
      pickQuantity: "",
    },
    {
      checkBox: false,
      productId: "2",
      name: "Mouse Logitech MX Master",
      stock: 200,
      unit: "Cái",
      quantity: "200",
      pickQuantity: "",
    },
    {
      checkBox: false,
      productId: "3",
      name: "Keyboard Mechanical RGB",
      stock: 85,
      unit: "Cái",
      quantity: "85",
      pickQuantity: "",
    },
    {
      checkBox: false,
      productId: "4",
      name: "Monitor Samsung 27 inch",
      stock: 120,
      unit: "Cái",
      quantity: "120",
      pickQuantity: "",
    },
    {
      checkBox: false,
      productId: "5",
      name: "Webcam Logitech C920",
      stock: 90,
      unit: "Cái",
      quantity: "90",
      pickQuantity: "",
    },
    {
      checkBox: false,
      productId: "6",
      name: "USB Cable Type-C",
      stock: 300,
      unit: "Cái",
      quantity: "300",
      pickQuantity: "",
    },
    {
      checkBox: false,
      productId: "7",
      name: "Headphone Sony WH-1000XM4",
      stock: 75,
      unit: "Cái",
      quantity: "75",
      pickQuantity: "",
    },
    {
      checkBox: false,
      productId: "8",
      name: "SSD Samsung 1TB",
      stock: 180,
      unit: "Cái",
      quantity: "180",
      pickQuantity: "",
    },
    {
      checkBox: false,
      productId: "9",
      name: "RAM DDR4 16GB",
      stock: 250,
      unit: "Thanh",
      quantity: "250",
      pickQuantity: "",
    },
    {
      checkBox: false,
      productId: "10",
      name: "Power Bank 20000mAh",
      stock: 160,
      unit: "Cái",
      quantity: "160",
      pickQuantity: "",
    },
    {
      checkBox: false,
      productId: "11",
      name: "Laptop Stand Aluminum",
      stock: 95,
      unit: "Cái",
      quantity: "95",
      pickQuantity: "",
    },
    {
      checkBox: false,
      productId: "12",
      name: "HDMI Cable 2.0",
      stock: 220,
      unit: "Cái",
      quantity: "220",
      pickQuantity: "",
    },
  ]);

  // Keep data ref in sync to avoid re-creating function in useEffect
  const dataRef = useRef(data);
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  // Expose function to get selected products (only set once, reads from dataRef.current)
  useEffect(() => {
    if (getSelectedProductsRef) {
      getSelectedProductsRef.current = () => {
        const selected = dataRef.current
          .filter(
            (item) =>
              item.checkBox &&
              item.pickQuantity !== "" &&
              Number(item.pickQuantity) > 0,
          )
          .map((item) => ({
            name: item.name,
            expectedQuantity: Number(item.pickQuantity),
          }));
        console.log("Current data:", dataRef.current);
        console.log("Selected products from modal:", selected);
        return selected;
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        label: "Stock",
        key: "stock",
      },
      {
        label: "Unit",
        key: "unit",
      },
      {
        label: "Quantity",
        key: "quantity",
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
          {/* <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} /> */}
        </div>
      </div>
    </div>
  );
}
