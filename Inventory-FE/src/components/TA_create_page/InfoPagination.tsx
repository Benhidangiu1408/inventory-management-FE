"use client";

import { useState } from "react";
import Pagination from "../tables/Pagination";
import ProgressPagination from "../TA_common/ProgressPagination";
import ProcessPagination from "@/components/TA_common/ProcessPagination";

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
        <Pagination
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
