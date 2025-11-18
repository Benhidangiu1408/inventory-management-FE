"use client";
import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import CustomizableTable from "@/default_components/Ky_components/CustomizableTable";
import { userData } from "@/default_components/Ky_components/TableData";
import { userColumns } from "@/default_components/Ky_components/TableHeader";
import Filter from "@/default_components/TA_List/Filter";
import Pagination from "@/default_components/tables/Pagination";
import { useState } from "react";

export default function UserManagementPage() {
  const [page, setPage] = useState(1);

  return (
    <div>
      <PageBreadcrumb pageTitle="User Management" />
      <div className="rounded-2xl border border-[#E4E7EC] bg-white">
        <Filter type="category" />
        <div className="p-6">
          <CustomizableTable
            headers={userColumns}
            data={userData}
          ></CustomizableTable>
        </div>
        <Pagination
          currentPage={page}
          totalPages={6}
          onPageChange={setPage}
        ></Pagination>
      </div>
    </div>
  );
}
