"use client";
import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import Filter from "@/default_components/TA_List/Filter";
import Pagination from "@/default_components/tables/Pagination";

import React, { useState } from "react";
import { categoryData } from "@/default_components/Ky_components/TableData";
import {
  categoryColumns,
  subCategoryColumns,
} from "@/default_components/Ky_components/TableHeader";
import ExpandableTable from "@/default_components/Ky_components/ExpandableTable";

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
