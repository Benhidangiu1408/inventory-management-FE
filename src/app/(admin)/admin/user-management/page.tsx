"use client";
import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import CustomizableTable from "@/components/table/CustomizableTable";
import { userData } from "@/components/table/TableData";
import { userColumns } from "@/components/table/CustomizableTableHeader";
import Filter, { DateRange } from "@/components/Filter";
import { useMemo, useState } from "react";
import { isDateWithinRange, parseFlexibleDate } from "@/lib/utils";

export default function UserManagementPage() {
  const [dateRange, setDateRange] = useState<DateRange>({});

  const filteredUsers = useMemo(() => {
    if (!dateRange.from && !dateRange.to) {
      return userData;
    }

    return userData.filter((row) =>
      isDateWithinRange(parseFlexibleDate(row.lastLogin), dateRange),
    );
  }, [dateRange]);

  return (
    <div>
      <PageBreadcrumb pageTitle="User Management" />
      <div className="rounded-2xl border border-[#E4E7EC] bg-white">
        <Filter
          type="user"
          onDateRangeChange={(range) => {
            setDateRange(range);
            // setPage(1);
          }}
          dateRangePlaceholder={{
            from: "Last login (from)",
            to: "Last login (to)",
          }}
        />
        <div className="p-6">
          <CustomizableTable
            headers={userColumns}
            data={filteredUsers}
          ></CustomizableTable>
        </div>
      </div>
    </div>
  );
}
