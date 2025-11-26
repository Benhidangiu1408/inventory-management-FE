"use client";
import Input from "@/default_components/form/input/InputField";
import Label from "@/default_components/form/Label";
import MultiSelect from "@/default_components/form/MultiSelect";
import Select from "@/default_components/form/Select";
import Checkbox from "@/default_components/form/input/Checkbox";
import { ChevronDownIcon } from "../../../../icons";
import { useState } from "react";
import Calendar from "@/default_components/calendar/Calendar";
import Button from "@/default_components/ui/button/Button";
import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";

export default function NewInventoryAuditPage() {
  const [formData, setFormData] = useState({
    warehouseName: "",
    inspector: "",
    date: "",
    isCycle: false,
    product: [] as string[],
  });

  const warehouseOpts = [
    { value: "WH-001", label: "WH-001 Warehouse 1" },
    { value: "WH-002", label: "WH-002 Warehouse 2" },
    { value: "WH-003", label: "WH-003 Warehouse 3" },
  ];
  const userOpts = [
    { value: "1", label: "VCK" },
    { value: "2", label: "TA" },
    { value: "3", label: "N" },
  ];
  const productOpts = [
    { value: "0", text: "All", selected: false },
    { value: "1", text: "B", selected: false },
    { value: "2", text: "C", selected: false },
    { value: "3", text: "D", selected: false },
    { value: "4", text: "E", selected: false },
    { value: "5", text: "Option 1", selected: false },
    { value: "6", text: "Option 2", selected: false },
    { value: "7", text: "Option 3", selected: false },
    { value: "8", text: "Option 4", selected: false },
    { value: "9", text: "Option 5", selected: false },
  ];
  return (
    <div>
      <PageBreadcrumb pageTitle="New Inventory Check" />
      <div className="mb-6 flex justify-center">
        <form
          className="w-[70%]"
          onSubmit={(e) => {
            e.preventDefault();
            console.log(formData);
          }}
        >
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
            <div className="col-span-1">
              <Label>Warehouse Name</Label>
              <div className="relative">
                <Select
                  className="dark:bg-dark-900"
                  options={warehouseOpts}
                  onChange={(val) =>
                    setFormData({
                      ...formData,
                      warehouseName: val.target.value,
                    })
                  }
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                  <ChevronDownIcon />
                </span>
              </div>
            </div>

            <div className="col-span-1">
              <Label>Assigned Inspector</Label>
              <div className="relative">
                <Select
                  className="dark:bg-dark-900"
                  options={userOpts}
                  onChange={(val) =>
                    setFormData({ ...formData, inspector: val.target.value })
                  }
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                  <ChevronDownIcon />
                </span>
              </div>
            </div>

            <div className="col-span-1 flex gap-4 sm:col-span-2">
              <div className="w-[70%]">
                <Label>Scheduled Date</Label>
                <Input
                  type="datetime-local"
                  defaultValue={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
              </div>
              <div className="flex items-center justify-center pt-5">
                <Checkbox
                  checked={formData.isCycle}
                  onChange={(val) =>
                    setFormData({ ...formData, isCycle: val.target.checked })
                  }
                  label="Cycle Check"
                />
              </div>
            </div>

            <div className="col-span-1 sm:col-span-2">
              <MultiSelect
                label="Scheduled Product"
                options={productOpts}
                onChange={(val) => setFormData({ ...formData, product: val })}
              />
            </div>
          </div>
          <div className="flex h-[45px] gap-3">
            <Button variant="exempt_outline">Clear</Button>
            <Button>Save</Button>
          </div>
        </form>
      </div>
      <div>
        <div className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
          Assigned Inspector Schedules
        </div>
        <Calendar />
      </div>
    </div>
  );
}
