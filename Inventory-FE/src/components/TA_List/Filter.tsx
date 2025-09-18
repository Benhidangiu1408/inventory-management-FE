"use client";

import { faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import DatePicker from "../form/date-picker";
import Button from "../ui/button/Button";
import Link from "next/link";

interface FilterProps {
  type:
    | "import"
    | "export"
    | "warehouse"
    | "product"
    | "category"
    | "inventory check"
    | "fault order";
}

export default function Filter({ type }: FilterProps) {
  const selectList = [
    {
      title: "Warehouse",
      options: [
        { value: "1", label: "Option 1" },
        { value: "2", label: "Option 2" },
        { value: "3", label: "Option 3" },
        { value: "4", label: "Option 4" },
        { value: "5", label: "Option 5" },
      ],
    },
    {
      title: "Suppliers",
      options: [
        { value: "1", label: "Option 1" },
        { value: "2", label: "Option 2" },
        { value: "3", label: "Option 3" },
        { value: "4", label: "Option 4" },
        { value: "5", label: "Option 5" },
      ],
    },
    {
      title: "Status",
      options: [
        { value: "1", label: "Option 1" },
        { value: "2", label: "Option 2" },
        { value: "3", label: "Option 3" },
        { value: "4", label: "Option 4" },
        { value: "5", label: "Option 5" },
      ],
    },
  ];

  return (
    <div className="flex items-center justify-between gap-20 border-b border-[#E4E7EC] p-6">
      <div className="flex flex-1 gap-3">
        <div className="relative flex-1">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="absolute top-1/2 left-4 -translate-y-1/2"
          />
          <Input
            type="text"
            placeholder="Search or type command..."
            className="pl-12"
          />
        </div>
        <div className="flex-1">
          <DatePicker
            id="date-picker-import"
            label=""
            placeholder="Select a date"
            onChange={(dates, currentDateString) => {
              // Handle your logic
              console.log({ dates, currentDateString });
            }}
          />
        </div>
        {selectList.map((item, index) => (
          <div key={index} className="flex-1">
            <Select options={item.options} onChange={() => {}} />
          </div>
        ))}
      </div>
      <Link href={`/${type}/new`}>
        <Button
          size="sm"
          variant="primary"
          startIcon={<FontAwesomeIcon icon={faPlus} />}
          className="capitalize"
        >
          New {type}
        </Button>
      </Link>
    </div>
  );
}
