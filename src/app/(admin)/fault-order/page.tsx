"use client";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CustomizableTable from "@/components/Ky_components/CustomizableTable";
import Filter, { DateRange } from "@/components/TA_List/Filter";
import Pagination from "@/components/tables/Pagination";

import React, { useMemo, useState } from "react";
import { orderData } from "@/components/Ky_components/TableData";
import { orderColumns } from "@/components/Ky_components/TableHeader";
import { isDateWithinRange, parseFlexibleDate } from "@/lib/utils";

export default function FaultOrderPage() {
  const [page, setPage] = useState(1);
  const [dateRange, setDateRange] = useState<DateRange>({});

  const filteredOrders = useMemo(() => {
    if (!dateRange.from && !dateRange.to) {
      return orderData;
    }

    return orderData.filter((row) =>
      isDateWithinRange(parseFlexibleDate(row.date), dateRange),
    );
  }, [dateRange]);

  return (
    <div>
      <PageBreadcrumb pageTitle="Fault Order List" />
      <div>
        <div className="rounded-2xl border border-[#E4E7EC] bg-white">
          <Filter
            type="fault order"
            onDateRangeChange={(range) => {
              setDateRange(range);
              setPage(1);
            }}
            dateRangePlaceholder={{ from: "Order date (from)", to: "Order date (to)" }}
          />
          <div className="p-6">
            <CustomizableTable
              headers={orderColumns}
              data={filteredOrders}
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
