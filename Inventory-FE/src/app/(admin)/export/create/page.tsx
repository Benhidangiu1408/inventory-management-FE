"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import CustomizableTable, {
  Column,
  TableProps,
} from "@/components/Ky_components/CustomizableTable";
import CustomFilter from "@/components/TA_common/CustomFilter";
import FilterItem from "@/components/TA_common/FilterItem";
import Pagination from "@/components/tables/Pagination";
import Button from "@/components/ui/button/Button";
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
  const columns: Column<ImportCreateRow>[] = [
    {
      label: "Check Box",
      key: "checkBox",
      render: () => (
        <div className="flex justify-center">
          <Checkbox checked={false} onChange={() => {}} />
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
      render: () => <Input type="number" className="" onChange={() => {}} />,
    },
  ];

  const data: ImportCreateRow[] = [
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
  ];

  const table: TableProps<ImportCreateRow> = {
    headers: columns,
    data,
  };

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
            <Pagination
              currentPage={1}
              totalPages={1}
              onPageChange={() => {}}
            />
          </div>
        </div>
      </div>
    </>
  );
}
