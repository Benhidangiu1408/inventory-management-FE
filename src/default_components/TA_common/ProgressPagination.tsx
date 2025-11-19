"use client";

import React from "react";

type ProgressPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

const ProgressPagination: React.FC<ProgressPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const percentage = totalPages > 0 ? (currentPage / totalPages) * 100 : 0;

  const handleBarClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
    const rect = (
      event.currentTarget as HTMLDivElement
    ).getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const ratio = rect.width > 0 ? clickX / rect.width : 0;
    const pageFromClick = clamp(
      Math.round(ratio * (totalPages - 1)) + 1,
      1,
      totalPages,
    );
    if (pageFromClick !== currentPage) onPageChange(pageFromClick);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (event.key === "ArrowRight") {
      onPageChange(clamp(currentPage + 1, 1, totalPages));
    } else if (event.key === "ArrowLeft") {
      onPageChange(clamp(currentPage - 1, 1, totalPages));
    } else if (event.key === "Home") {
      onPageChange(1);
    } else if (event.key === "End") {
      onPageChange(totalPages);
    }
  };

  return (
    <div>
      <div className="my-3 flex w-full items-center justify-center gap-3">
        <button
          onClick={() => onPageChange(clamp(currentPage - 1, 1, totalPages))}
          disabled={currentPage === 1}
          className="shadow-theme-xs flex h-10 items-center justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
        >
          Previous
        </button>

        <div className="flex w-full max-w-xl flex-col items-center gap-2">
          <div className="w-full">
            <div
              role="slider"
              aria-label="Pagination progress"
              aria-valuemin={1}
              aria-valuemax={totalPages}
              aria-valuenow={currentPage}
              tabIndex={0}
              onKeyDown={handleKeyDown}
              onClick={handleBarClick}
              className="relative h-3 cursor-pointer rounded-full bg-gray-200 select-none dark:bg-gray-700"
            >
              <div
                className="bg-brand-500 h-3 rounded-full transition-all"
                style={{ width: `${isFinite(percentage) ? percentage : 0}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2"
                style={{
                  left: `calc(${isFinite(percentage) ? percentage : 0}% - 8px)`,
                }}
              >
                <div className="bg-brand-500 h-4 w-4 rounded-full border-2 border-white shadow dark:border-gray-900" />
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => onPageChange(clamp(currentPage + 1, 1, totalPages))}
          disabled={currentPage === totalPages}
          className="shadow-theme-xs flex h-10 items-center justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
        >
          Next
        </button>
      </div>
      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        {currentPage} / {totalPages}
      </div>
    </div>
  );
};

export default ProgressPagination;
