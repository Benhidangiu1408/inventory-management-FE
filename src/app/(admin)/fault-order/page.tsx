"use client";
import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import CustomizableTable from "@/components/table/CustomizableTable";
import Filter, { DateRange } from "@/components/Filter";
import Pagination from "@/default_components/tables/Pagination";

import React, { useMemo, useState } from "react";
import { orderData } from "@/default_components/Ky_components/TableData";
import { orderColumns } from "@/components/table/TableHeader";
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
            dateRangePlaceholder={{
              from: "Order date (from)",
              to: "Order date (to)",
            }}
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
