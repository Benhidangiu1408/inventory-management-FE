"use client"
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CustomizableTable from "@/components/Ky_components/CustomizableTable";
import Filter from "@/components/TA_List/Filter";
import Pagination from "@/components/tables/Pagination";

import React, { useState } from "react";
import { warehouseTableData } from "@/components/Ky_components/TableData";
import { warehouseTableHeader } from "@/components/Ky_components/TableHeader";

export default function CategoryPage() {
  const [page, setPage] = useState(1);

  return (
    <div>
      <PageBreadcrumb pageTitle="Category List" />
      <div>
        <div className="rounded-2xl border border-[#E4E7EC] bg-white">
          <Filter type="category" />
          <CustomizableTable headers={warehouseTableHeader} data={warehouseTableData}></CustomizableTable>
          <Pagination currentPage={page} totalPages={6} onPageChange={setPage}></Pagination>
        </div>
      </div>
    </div>
  );
}