"use client";

import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import Checkbox from "@/default_components/form/input/Checkbox";
import Input from "@/default_components/form/input/InputField";
import CustomizableTable, {
  Column,
  TableProps,
} from "@/components/table/CustomizableTable";
import CustomFilter from "@/components/TA_common/CustomFilter";
import FilterItem from "@/components/TA_common/FilterItem";
import Button from "@/default_components/ui/button/Button";
import { ImportCreateRow } from "@/interfaces/interface.table";
// import Filter from "@/components/TA_List/Filter";
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
      render: () => <Input type="number" className="" onChange={() => {}} />,
    },
  ];

  const data: ImportCreateRow[] = [];

  const table: TableProps<ImportCreateRow> = {
    headers: columns,
    data,
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Create Import" />
      <div className="flex flex-col gap-6">
        <div className="default-card">
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

              <Link href="/import/new" className="">
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
