"use client";

import { useState } from "react";
import Pagination from "../tables/Pagination";
import ProgressPagination from "../TA_common/ProgressPagination";

interface InfoPaginationProps {
  totalPages: number;
  paginationType?: "info" | "progress";
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
      ) : (
        <ProgressPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
