"use client";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Filter from "@/components/TA_List/Filter";
import Pagination from "@/components/tables/Pagination";

import React, { useState } from "react";
import { categoryData } from "@/components/Ky_components/TableData";
import {
  categoryColumns,
  subCategoryColumns,
} from "@/components/Ky_components/TableHeader";
import ExpandableTable from "@/components/Ky_components/ExpandableTable";

export default function CategoryPage() {
  const [page, setPage] = useState(1);

  return (
    <div>
      <PageBreadcrumb pageTitle="Category List" />
      <div>
        <div className="rounded-2xl border border-[#E4E7EC] bg-white">
          <Filter type="category" />
          <div className="p-6">
            <ExpandableTable
              headers={categoryColumns}
              subTableHeaders={subCategoryColumns}
              data={categoryData}
              subTableData="subcategories"
              title="Categories"
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
