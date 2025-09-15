"use client";

import Pagination from "../tables/Pagination";

export default function InfoPagination() {
  return (
    <div>
      <Pagination
        currentPage={1}
        totalPages={1}
        onPageChange={(page: number) => {}}
      />
    </div>
  );
}
