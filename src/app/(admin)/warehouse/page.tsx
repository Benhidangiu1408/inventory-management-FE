"use client";
import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import CustomizableTable from "@/components/table/CustomizableTable";
import Filter from "@/components/Filter";
import Pagination from "@/default_components/tables/Pagination";

import React, { useState } from "react";
import { warehouseTableData } from "@/default_components/Ky_components/TableData";
import {
  WarehouseRow,
  warehouseTableHeader,
} from "@/components/table/CustomizableTableHeader";

export default function WarehousePage() {
  const [page, setPage] = useState(1);

  return (
    <div>
      <PageBreadcrumb pageTitle="Warehouse List" />
      <div>
        <div className="rounded-2xl border border-[#E4E7EC] bg-white">
          <Filter type="warehouse" />
          <div className="p-6">
            <CustomizableTable<WarehouseRow>
              headers={warehouseTableHeader}
              data={warehouseTableData}
            />
          </div>
          <Pagination
            currentPage={page}
            totalPages={6}
            onPageChange={setPage}
          ></Pagination>
        </div>
      </div>
    </div>
  );
}
