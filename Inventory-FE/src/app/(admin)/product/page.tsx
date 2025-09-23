"use client";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CustomizableTable from "@/components/Ky_components/CustomizableTable";
import Filter from "@/components/TA_List/Filter";
import Pagination from "@/components/tables/Pagination";

import React, { useState } from "react";
import { productMasterData } from "@/components/Ky_components/TableData";
import { productMasterColumns } from "@/components/Ky_components/TableHeader";

export default function ProductPage() {
  const [page, setPage] = useState(1);

  return (
    <div>
      <PageBreadcrumb pageTitle="Product List" />
      <div>
        <div className="rounded-2xl border border-[#E4E7EC] bg-white">
          <Filter type="product" />
          <div className="p-6">
            <CustomizableTable
              headers={productMasterColumns}
              data={productMasterData}
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
