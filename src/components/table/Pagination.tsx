import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import Input from "@/default_components/form/input/InputField";
import { Dispatch, FormEvent, SetStateAction, useCallback } from "react";
import Select from "@/default_components/form/Select";

type PaginationProps = {
  currentPage: number;
  totalPage: number;
  onBtnFirst: () => void;
  onBtnLast: () => void;
  onBtnPrevious: () => void;
  onBtnNext: () => void;
  onBtnPage: (page: number) => void;
  setPageSize: Dispatch<SetStateAction<number>>;
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPage,
  onBtnFirst,
  onBtnLast,
  onBtnPrevious,
  onBtnNext,
  onBtnPage,
  setPageSize,
}) => {
  // Page to display
  const renderPages = () => {
    if (totalPage < 6)
      return Array.from({ length: totalPage }, (_, i) => i + 1);
    const pages: (number | string)[] = [];
    if (currentPage > 2) pages.push("...");
    // Page window
    let start = Math.max(0, currentPage - 1);
    let end = Math.min(totalPage - 1, currentPage + 1);
    // Adjust window if near start or end
    if (currentPage <= 2) {
      start = 0;
      end = 3;
    } else if (currentPage >= totalPage - 3) {
      start = totalPage - 4;
      end = totalPage - 1;
    }
    // Push page number
    for (let i = start; i <= end; i++) {
      pages.push(i + 1);
    }
    // Show dots before the last page
    if (currentPage < totalPage - 3) {
      pages.push("...");
    }
    return pages;
  };
  // Handle page input
  const handleGotoPage = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const inputVal = new FormData(e.currentTarget).get("gotoPageInput");
      const pageNum = parseInt(inputVal as string, 10);
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPage) {
        onBtnPage(pageNum - 1);
      } else {
        e.currentTarget.reset();
      }
    },
    [onBtnPage, totalPage],
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4 px-6 py-4 sm:justify-between">
      <div className={"flex items-center justify-center gap-2"}>
        {/*Prev Btn */}
        <div className={"flex"}>
          <button
            onClick={onBtnFirst}
            disabled={currentPage === 0}
            className="default-button shadow-theme-xs mx-0.5 flex items-center justify-center gap-2 p-2 sm:p-2.5"
          >
            <ChevronsLeft size={20} />
          </button>
          <button
            onClick={onBtnPrevious}
            disabled={currentPage === 0}
            className="default-button shadow-theme-xs mx-0.5 flex items-center justify-center gap-2 p-2 sm:p-2.5"
          >
            <ChevronLeft size={20} />
          </button>
        </div>
        {/*Page number */}
        <span className="block text-sm font-medium text-gray-700 sm:hidden dark:text-gray-400">
          Page {currentPage + 1} of {totalPage}
        </span>
        <div className="mx-1 hidden cursor-default items-center gap-1 sm:flex">
          {renderPages().map((page, idx) =>
            page === "..." ? (
              <span
                key={idx}
                className="flex h-10 w-10 items-center justify-center text-sm font-medium text-gray-700 dark:text-gray-400"
              >
                {page}
              </span>
            ) : (
              <button
                key={idx}
                onClick={() => {
                  onBtnPage((page as number) - 1);
                }}
                className={`${
                  currentPage + 1 === page
                    ? "bg-brand-500 hover:bg-brand-600 text-white"
                    : "hover:bg-brand-500 text-gray-700 hover:text-white dark:text-gray-400 dark:hover:text-white"
                } default-button flex h-10 w-10 items-center justify-center text-sm font-medium`}
              >
                {page}
              </button>
            ),
          )}
        </div>
        {/*Next Btn*/}
        <div className={"flex gap-1"}>
          <button
            onClick={onBtnNext}
            disabled={currentPage + 1 === totalPage}
            className="default-button shadow-theme-xs flex items-center justify-center gap-2 p-2 sm:p-2.5"
          >
            <ChevronRight size={20} />
          </button>
          <button
            onClick={onBtnLast}
            disabled={currentPage + 1 === totalPage}
            className="default-button shadow-theme-xs flex items-center justify-center gap-2 p-2 sm:p-2.5"
          >
            <ChevronsRight size={20} />
          </button>
        </div>
      </div>
      <div className={"flex w-full justify-center gap-5 sm:gap-20"}>
        {/* Row per page Selector */}
        <div className={"flex items-center gap-2"}>
          <Select
            options={[
              { label: "10", value: "10" },
              { label: "20", value: "20" },
              { label: "50", value: "50" },
              { label: "100", value: "100" },
            ]}
            defaultValue={"10"}
            onChange={(e) => {
              setPageSize(parseInt(e.target.value, 10));
            }}
            className={"!w-[70px] !pr-0"}
          />
          <div className={"text-nowrap"}>Row/page</div>
        </div>
        {/* Go to page input */}
        <form
          className={"flex items-center justify-center gap-2"}
          onSubmit={handleGotoPage}
        >
          <div>Page</div>
          <Input
            name={"gotoPageInput"}
            defaultValue={1}
            className={"!h-fit !w-24"}
          />
          <button
            className={
              "default-button shadow-theme-xs mx-0.5 flex h-10 w-10 items-center justify-center gap-2 p-2 sm:p-2.5"
            }
          >
            Go
          </button>
        </form>
      </div>
    </div>
  );
};

export default Pagination;
