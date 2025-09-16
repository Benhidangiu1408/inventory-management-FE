"use client";

import { useState } from "react";
import Pagination from "../tables/Pagination";

interface InfoPaginationProps {
  totalPages: number;
}

export default function InfoPagination({
  totalPages = 1,
}: InfoPaginationProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
