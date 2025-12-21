"use client";

import { useState, useCallback, useMemo } from "react";
import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import Checkbox from "@/default_components/form/input/Checkbox";
import Input from "@/default_components/form/input/InputField";
import CustomizableTable, {
  Column,
  TableProps,
} from "@/components/table/CustomizableTable";
import CustomFilter from "@/components/TA_common/CustomFilter";
import FilterItem from "@/components/TA_common/FilterItem";
// import Pagination from "@/default_components/tables/Pagination";
import Button from "@/default_components/ui/button/Button";
import { ImportCreateRow } from "@/interfaces/interface.table";
import {
  faBoxOpen,
  faCalendar,
  faCube,
  faFilter,
  faMagnifyingGlass,
  faWarehouse,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function CreateImportPage() {
  const [data, setData] = useState<ImportCreateRow[]>([
    {
      checkBox: false,
      productId: "1",
      name: "Product 1",
      stock: 100,
      unit: "Unit 1",
      quantity: "100",
      pickQuantity: "",
    },
    {
      checkBox: false,
      productId: "2",
      name: "Product 2",
      stock: 200,
      unit: "Unit 2",
      quantity: "200",
      pickQuantity: "",
    },
  ]);

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

  const table: TableProps<ImportCreateRow> = useMemo(
    () => ({
      headers: columns,
      data,
      getRowId: (params) => params.data.productId,
    }),
    [columns, data],
  );

  return (
    <>
      <PageBreadcrumb pageTitle="Create Export" />

      <div className="flex flex-col gap-6">
        {/* <ComponentCard
          title="Choose your Warehouse"
          startIcon={<FontAwesomeIcon icon={faWarehouse} />}
        >
          <Select options={[]} onChange={() => {}} />
        </ComponentCard> */}

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
                  248 products found
                </div>
              </div>

              <Link href="/export/new" className="">
                <Button
                  startIcon={<FontAwesomeIcon icon={faBoxOpen} />}
                  variant="primary"
                  className=""
                >
                  Pick Up
                </Button>
              </Link>
            </div>
            <CustomizableTable<ImportCreateRow> {...table} />
            {/* <Pagination
              currentPage={1}
              totalPages={1}
              onPageChange={() => {}}
            /> */}
          </div>
        </div>
      </div>
    </>
  );
}
