"use client";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CustomizableTable from "@/components/Ky_components/CustomizableTable";
import { userData } from "@/components/Ky_components/TableData";
import { userColumns } from "@/components/Ky_components/TableHeader";
import Filter from "@/components/TA_List/Filter";
import Pagination from "@/components/tables/Pagination";
import { useState } from "react";

export default function UserManagementPage() {
  const [page, setPage] = useState(1);

  return (
    <div>
      <PageBreadcrumb pageTitle="User Management" />
      <div className="rounded-2xl border border-[#E4E7EC] bg-white">
        <Filter type="category" />
        <CustomizableTable
          headers={userColumns}
          data={userData}
        ></CustomizableTable>
        <Pagination
          currentPage={page}
          totalPages={6}
          onPageChange={setPage}
        ></Pagination>
      </div>
    </div>
  );
}
