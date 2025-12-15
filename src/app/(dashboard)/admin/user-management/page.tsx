"use client";
import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import CustomizableTable from "@/components/table/CustomizableTable";
import { userData } from "@/components/table/TableData";
import { userColumns } from "@/components/table/CustomizableTableHeader";
import Filter, { DateRange } from "@/components/Filter";
import { useEffect, useMemo, useState } from "react";
import { isDateWithinRange, parseFlexibleDate } from "@/lib/utils";
import { Role } from "@/interfaces/userManagementType";
import {
  roleAssignment,
  userManagementService,
} from "@/services/UserManagementService";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export default function UserManagementPage() {
  const [dateRange, setDateRange] = useState<DateRange>({});
  const [users, setUsers] = useState<Awaited<ReturnType<typeof userData>>>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const memoColumns = useMemo(() => userColumns(roles), [roles]);

  useEffect(() => {
    let isMounted = true;

    const loadUsers = async () => {
      const rows = await userData();
      const formatted = rows.map((u) => ({
        ...u,
        createdDate: u.createdDate ? new Date(u.createdDate) : null,
      }));
      const sorted = formatted.sort(
        (a, b) => Number(a.id ?? 0) - Number(b.id ?? 0),
      );
      if (isMounted) {
        setUsers(sorted);
      }
    };

    loadUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadRoles = async () => {
      try {
        const res = await roleAssignment.getAllRole();
        if (isMounted) {
          setRoles(res);
        }
      } catch (e) {
        console.error("Failed to fetch roles:", e);
      }
    };

    loadRoles();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredUsers = useMemo(() => {
    if (!dateRange.from && !dateRange.to) {
      return users;
    }

    return users.filter((row) => isDateWithinRange(row.createdDate, dateRange));
  }, [dateRange, users]);

  const searchParams = useSearchParams();
  useEffect(() => {
    if (searchParams.get("created") === "1") {
      toast.success("User created successfully!");
    }
  }, []);

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
            from: "Created Date (from)",
            to: "Created Date (to)",
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
