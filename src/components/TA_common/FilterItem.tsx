"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Input from "../../default_components/form/input/InputField";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import DatePicker from "../../default_components/form/date-picker";
import { Hook } from "flatpickr/dist/types/options";
import Select, { Option } from "../../default_components/form/Select";

interface FilterItemProps {
  type: "input" | "select" | "date";
  label: string;
  options?: Option[];
  onInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDateChange?: Hook | Hook[];
  onSelectChange?: (value: string) => void;
  value?: string | number;
  placeholder?: string;
  className?: string;
  icon?: IconProp;
}

export default function FilterItem({
  type,
  label,
  options,
  onInputChange,
  onDateChange,
  onSelectChange,
  value,
  placeholder,
  className,
  icon,
}: FilterItemProps) {
  if (type === "input") {
    return (
      <div className={`relative flex-1 ${className ?? ""}`}>
        {icon && (
          <FontAwesomeIcon
            icon={icon}
            className="absolute top-1/2 left-4 -translate-y-1/2"
          />
        )}
        <Input
          type="text"
          placeholder={placeholder ?? ""}
          className={`pl-12 ${className ?? ""}`}
          onChange={onInputChange}
          defaultValue={value}
          aria-label={label ?? ""}
        />
      </div>
    );
  }

  if (type === "date") {
    return (
      <div className={`flex-1 ${className ?? ""}`}>
        <DatePicker
          id="date-picker-import"
          // label={label}
          placeholder={placeholder ?? ""}
          onChange={onDateChange}
          aria-label={label ?? ""}
        />
      </div>
    );
  }

  if (type === "select") {
    const safeOptions: Option[] = options ?? [];
    const handleSelectChange = onSelectChange ?? (() => {});
    return (
      <div className={`relative flex-1 ${className ?? ""}`}>
        {icon && (
          <FontAwesomeIcon
            icon={icon}
            className="absolute top-1/2 left-4 -translate-y-1/2"
          />
        )}
        <Select
          options={safeOptions}
          placeholder={placeholder ?? ""}
          onChange={handleSelectChange}
          className={`pl-12 ${className ?? ""}`}
          aria-label={label ?? ""}
        />
      </div>
    );
  }
}
