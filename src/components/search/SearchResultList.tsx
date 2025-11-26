import { NavItemSearch } from "@/components/layout/AppHeader";
import SearchResultItem from "@/components/search/SearchResultItem";

interface SearchResultListProps {
  resultList: NavItemSearch[];
  onItemClick: () => void;
}

export default function SearchResultList({
  resultList,
  onItemClick,
}: SearchResultListProps) {
  return (
    <div className="shadow-theme-xs absolute top-12 right-0 left-0 flex flex-col rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-[#101828]">
      {resultList &&
        resultList.map((item) => (
          <SearchResultItem
            key={`${item.parentName || "root"}-${item.name}`}
            parentName={item.parentName ?? undefined}
            name={item.name}
            path={item.path ?? ""}
            onClick={onItemClick}
          />
        ))}
    </div>
  );
}
