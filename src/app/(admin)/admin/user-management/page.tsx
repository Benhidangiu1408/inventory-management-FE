"use client";
import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import CustomizableTable from "@/components/table/CustomizableTable";
import { userData } from "@/components/table/TableData";
import { userColumns } from "@/components/table/CustomizableTableHeader";
import Filter, { DateRange } from "@/components/Filter";
import { useEffect, useMemo, useState } from "react";
import { isDateWithinRange, parseFlexibleDate } from "@/lib/utils";

export default function UserManagementPage() {
  const [dateRange, setDateRange] = useState<DateRange>({});
  const [users, setUsers] = useState<Awaited<ReturnType<typeof userData>>>([]);

  const memoColumns = useMemo(() => userColumns, []);

  useEffect(() => {
    let isMounted = true;

    const loadUsers = async () => {
      const rows = await userData();
      if (isMounted) {
        setUsers(rows);
      }
    };

    loadUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredUsers = useMemo(() => {
    if (!dateRange.from && !dateRange.to) {
      return users;
    }

    return users.filter((row) =>
      isDateWithinRange(parseFlexibleDate(row.createdDate), dateRange),
    );
  }, [dateRange, users]);

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
            headers={memoColumns}
            data={filteredUsers}
          ></CustomizableTable>
        </div>
      </div>
    </div>
  );
}
