"use client";
import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import CustomizableTable from "@/components/table/CustomizableTable";
import Filter, { DateRange } from "@/components/Filter";

import React, { useMemo, useState } from "react";
import { orderData } from "@/components/table/TableData";
import { orderColumns } from "@/components/table/CustomizableTableHeader";
import { isDateWithinRange, parseFlexibleDate } from "@/lib/utils";

export default function FaultOrderPage() {
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
        <div className="rounded-2xl border border-[#E4E7EC] bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <Filter
            type="fault order"
            onDateRangeChange={(range) => {
              setDateRange(range);
              // setPage(1);
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
        </div>
      </div>
    </div>
  );
}
