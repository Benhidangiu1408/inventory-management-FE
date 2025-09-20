"use client";
import {
  FilterSearch,
  FilterDate,
  FilterSelect,
  FilterButton,
} from "./FilterComponents";

export interface FilterItem {
  type: "search" | "date" | "select";
  label?: string;
  options?: { value: string; label: string }[];
}

interface FilterBarProps {
  type: string;
  items: FilterItem[];
  onFilterChange?: (
    filters: Record<string, string | string[] | Date[]>,
  ) => void;
}

export default function FilterBar({ type, items }: FilterBarProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-gray-200 p-4">
      <div className="flex flex-1 flex-wrap gap-4">
        {items.map((item, i) => {
          if (item.type === "search") return <FilterSearch key={i} />;
          if (item.type === "date") return <FilterDate key={i} />;
          if (item.type === "select")
            return (
              <FilterSelect
                key={i}
                label={item.label}
                options={item.options ?? []}
              />
            );
          return null;
        })}
      </div>
      <FilterButton type={type} />
    </div>
  );
}
