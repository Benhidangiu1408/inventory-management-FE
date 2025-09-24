"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Checkbox from "@/components/form/input/Checkbox";
import Select from "@/components/form/Select";
import CustomizableTable, {
  Column,
  TableProps,
} from "@/components/Ky_components/CustomizableTable";
import CustomFilter from "@/components/TA_common/CustomFilter";
import FilterItem from "@/components/TA_common/FilterItem";
import TableBox from "@/components/TA_common/TableBox";
import Pagination from "@/components/tables/Pagination";
import { ImportCreateRow } from "@/interfaces/interface.table";
// import Filter from "@/components/TA_List/Filter";
import {
  faCalendar,
  faFilter,
  faMagnifyingGlass,
  faWarehouse,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
  ];

  const data: ImportCreateRow[] = [
    {
      checkBox: false,
      productId: "1",
      name: "Product 1",
      stock: 100,
      unit: "Unit 1",
      quantity: "100",
    },
    {
      checkBox: false,
      productId: "2",
      name: "Product 2",
      stock: 200,
      unit: "Unit 2",
      quantity: "200",
    },
  ];

  const table: TableProps<ImportCreateRow> = {
    headers: columns,
    data,
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Create Import" />

      <div className="flex flex-col gap-6">
        <ComponentCard
          title="Choose your Warehouse"
          startIcon={<FontAwesomeIcon icon={faWarehouse} />}
        >
          <Select options={[]} onChange={() => {}} />
        </ComponentCard>

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
              label="Status"
              placeholder="Status"
              icon={faFilter}
              options={[{ label: "Active", value: "active" }]}
            />
            <FilterItem
              type="date"
              label="Date"
              placeholder="Date"
              icon={faCalendar}
            />
          </CustomFilter>
          <div className="p-6">
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
