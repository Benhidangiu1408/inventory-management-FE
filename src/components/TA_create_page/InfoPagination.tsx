"use client";

import { useState } from "react";
// import Pagination from "@/default_components/tables/Pagination";
import ProgressPagination from "@/components/TA_common/ProgressPagination";
import ProcessPagination from "@/components/TA_common/ProcessPagination";
import { TAPagination } from "@/components/TA_common/TAPagination";

interface InfoPaginationProps {
  totalPages?: number;
  paginationType?: "info" | "progress" | "process";
}

export default function InfoPagination({
  totalPages = 1,
  paginationType = "info",
}: InfoPaginationProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      {paginationType === "info" ? (
        <TAPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      ) : paginationType === "progress" ? (
        <ProgressPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      ) : (
        <ProcessPagination />
      )}
    </div>
  );
}
