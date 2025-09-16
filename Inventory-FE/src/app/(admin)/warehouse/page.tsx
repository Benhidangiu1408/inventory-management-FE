"use client"
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CustomizableTable from "@/components/Ky_components/CustomizableTable";
import Filter from "@/components/TA_List/Filter";
import Pagination from "@/components/tables/Pagination";

import React, { useState } from "react";
import { warehouseTableData } from "@/components/Ky_components/TableData";
import { WarehouseRow, warehouseTableHeader } from "@/components/Ky_components/TableHeader";

export default function WarehousePage() {
  const [page, setPage] = useState(1);

  return (
    <div>
      <PageBreadcrumb pageTitle="Warehouse List" />
      <div>
        <div className="rounded-2xl border border-[#E4E7EC] bg-white">
          <Filter type="warehouse" />
          <CustomizableTable<WarehouseRow> headers={warehouseTableHeader} data={warehouseTableData}/>
          <Pagination currentPage={page} totalPages={6} onPageChange={setPage}></Pagination>
        </div>
      </div>
    </div>
  );
}