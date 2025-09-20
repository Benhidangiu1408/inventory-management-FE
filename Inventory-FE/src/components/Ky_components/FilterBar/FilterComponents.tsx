"use client";
import { useState } from "react";
import { faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import DatePicker from "@/components/form/date-picker";
import Button from "@/components/ui/button/Button";
import Link from "next/link";

export function FilterSearch({
  placeholder,
  onChange,
}: {
  placeholder?: string;
  onChange: (val: string) => void;
}) {
  const [value, setValue] = useState("");

  return (
    <div className="relative flex-1">
      <FontAwesomeIcon
        icon={faMagnifyingGlass}
        className="absolute top-1/2 left-4 -translate-y-1/2"
      />
      <Input
        placeholder={placeholder ?? "Search..."}
        className="pl-12"
        onChange={onChange()}
      />
    </div>
  );
}
