"use client";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CustomizableTable from "@/components/Ky_components/CustomizableTable";
import Filter from "@/components/TA_List/Filter";
import Pagination from "@/components/tables/Pagination";

import React, { useState } from "react";
import { categoryData } from "@/components/Ky_components/TableData";
import { categoryColumns } from "@/components/Ky_components/TableHeader";

export default function CategoryPage() {
  const [page, setPage] = useState(1);

  return (
    <div>
      <PageBreadcrumb pageTitle="Category List" />
      <div>
        <div className="rounded-2xl border border-[#E4E7EC] bg-white">
          <Filter type="category" />
          <div className="p-6">
            <CustomizableTable
              headers={categoryColumns}
              data={categoryData}
            ></CustomizableTable>
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
