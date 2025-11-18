"use client";
import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import CustomizableTable from "@/default_components/Ky_components/CustomizableTable";
import Filter from "@/default_components/TA_List/Filter";
import Pagination from "@/default_components/tables/Pagination";

import React, { useState } from "react";
import { orderData } from "@/default_components/Ky_components/TableData";
import { orderColumns } from "@/default_components/Ky_components/TableHeader";

export default function FaultOrderPage() {
  const [page, setPage] = useState(1);

  return (
    <div>
      <PageBreadcrumb pageTitle="Fault Order List" />
      <div>
        <div className="rounded-2xl border border-[#E4E7EC] bg-white">
          <Filter type="fault order" />
          <div className="p-6">
            <CustomizableTable
              headers={orderColumns}
              data={orderData}
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
