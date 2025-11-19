"use client";

import { faChevronDown, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select from "@/default_components/form/Select";
import DatePicker from "@/default_components/form/date-picker";
import Button from "@/default_components/ui/button/Button";
import Link from "next/link";
import { useCallback, useEffect, useId, useState } from "react";

export type DateRange = {
  from?: Date;
  to?: Date;
  fromText?: string;
  toText?: string;
};

interface FilterProps {
  type:
    | "import"
    | "export"
    | "warehouse"
    | "product"
    | "category"
    | "inventory-check"
    | "fault order"
    | "user"
    | "permission"
    | "role";
  onDateRangeChange?: (dateRange: DateRange) => void;
  dateRangePlaceholder?: {
    from?: string;
    to?: string;
  };
}

export default function Filter({
  type,
  onDateRangeChange,
  dateRangePlaceholder,
}: FilterProps) {
  const fromInputId = useId();
  const toInputId = useId();
  const [range, setRange] = useState<DateRange>({});
  const placeholders = {
    from: dateRangePlaceholder?.from ?? "From date",
    to: dateRangePlaceholder?.to ?? "To date",
  };

  const handleDateChange = useCallback(
    (key: "from" | "to") =>
      (selectedDates: Date[], currentDateString: string) => {
        const selectedDate = selectedDates[0]
          ? new Date(selectedDates[0])
          : undefined;

        setRange((prev) => {
          return {
            ...prev,
            [key]: selectedDate,
            [`${key}Text`]: currentDateString || undefined,
          };
        });
      },
    [],
  );

  useEffect(() => {
    onDateRangeChange?.(range);
  }, [range, onDateRangeChange]);

  // const selectList = [
  //   {
  //     title: "Warehouse",
  //     options: [
  //       { value: "1", label: "Option 1" },
  //       { value: "2", label: "Option 2" },
  //       { value: "3", label: "Option 3" },
  //       { value: "4", label: "Option 4" },
  //       { value: "5", label: "Option 5" },
  //     ],
  //   },
  //   {
  //     title: "Suppliers",
  //     options: [
  //       { value: "1", label: "Option 1" },
  //       { value: "2", label: "Option 2" },
  //       { value: "3", label: "Option 3" },
  //       { value: "4", label: "Option 4" },
  //       { value: "5", label: "Option 5" },
  //     ],
  //   },
  //   {
  //     title: "Status",
  //     options: [
  //       { value: "1", label: "Option 1" },
  //       { value: "2", label: "Option 2" },
  //       { value: "3", label: "Option 3" },
  //       { value: "4", label: "Option 4" },
  //       { value: "5", label: "Option 5" },
  //     ],
  //   },
  // ];

  return (
    <div className="flex items-center justify-between gap-20 border-b border-[#E4E7EC] p-6">
      <div className="flex flex-1 gap-3">
        {type != "role" && (
          <div className="flex-1">
            <DatePicker
              id={`${fromInputId}-from`}
              label=""
              placeholder={placeholders.from}
              onChange={handleDateChange("from")}
            />
          </div>
        )}

        {type != "role" && (
          <div className="flex-1">
            <DatePicker
              id={`${toInputId}-to`}
              label=""
              placeholder={placeholders.to}
              onChange={handleDateChange("to")}
            />
          </div>
        )}

        {type === "role" && (
          <div className="relative flex-1">
            <FontAwesomeIcon
              icon={faChevronDown}
              className="absolute top-1/2 left-4 -translate-y-1/2"
            />
            <Select
              defaultValue="Role"
              onChange={() => {}}
              options={[
                { value: "Admin", label: "Admin" },
                { value: "Manager", label: "Manager" },
                { value: "Staff", label: "Staff" },
              ]}
              className="pl-12"
            />
          </div>
        )}
      </div>
      <Link href={`/${type}/new`}>
        <Button
          size="sm"
          variant="primary"
          startIcon={<FontAwesomeIcon icon={faPlus} />}
          className="capitalize"
        >
          New {type.split(/[-_]/).join(" ")}
        </Button>
      </Link>
      {type === "role" && (
        <Link href={`/${type}/new`}>
          <Button
            size="sm"
            variant="primary"
            startIcon={<FontAwesomeIcon icon={faPlus} />}
            className="capitalize"
          >
            New permission
          </Button>
        </Link>
      )}
    </div>
  );
}
