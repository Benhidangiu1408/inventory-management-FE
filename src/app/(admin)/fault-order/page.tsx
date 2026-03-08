"use client";
import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import CustomizableTable from "@/components/table/CustomizableTable";
import Filter from "@/components/Filter";

import React from "react";
import { orderData } from "@/components/table/TableData";
import { orderColumns } from "@/components/table/CustomizableTableHeader";
// import { isDateWithinRange, parseFlexibleDate } from "@/lib/utils";

export default function FaultOrderPage() {
  

  return (
    <div>
      <PageBreadcrumb pageTitle="Fault Order List" />
      <div>
        <div className="rounded-2xl border border-[#E4E7EC] bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <Filter
            type="fault order"
          />
          <div className="p-6">
            <CustomizableTable
              headers={orderColumns}
              data={orderData}
            ></CustomizableTable>
          </div>
        </div>
      </div>
    </div>
  );
}
