"use client";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CustomizableTable from "@/components/Ky_components/CustomizableTable";
import Filter from "@/components/TA_List/Filter";
import Pagination from "@/components/tables/Pagination";
// import Label from "@/components/form/Label";
// import Input from "@/components/form/input/InputField";
// import Select from "@/components/form/Select";
// import MultiSelect from "@/components/form/MultiSelect";
// import { ChevronDownIcon } from "@/icons";

import React, { useState } from "react";
import { inventoryCheckOrders } from "@/components/Ky_components/TableData";
import { inventoryCheckOrderHeaders } from "@/components/Ky_components/TableHeader";
// import CustomContentModalBox from "@/components/Ky_components/CustomContentModalBox";

export default function WarehousePage() {
  const [page, setPage] = useState(1);
  // const [formData, setFormData] = useState({
  //   warehouseName: "",
  //   inspector: "",
  //   date: "",
  //   product: [] as string[],
  // });

  // const warehouseOpts = [
  //   { value: "WH-001", label: "WH-001 Warehouse 1" },
  //   { value: "WH-002", label: "WH-002 Warehouse 2" },
  //   { value: "WH-003", label: "WH-003 Warehouse 3" },
  // ];
  // const userOpts = [
  //   { value: "1", label: "VCK" },
  //   { value: "2", label: "TA" },
  //   { value: "3", label: "N" },
  // ];
  // const productOpts = [
  //   { value: "0", text: "All", selected: false },
  //   { value: "1", text: "B", selected: false },
  //   { value: "2", text: "C", selected: false },
  //   { value: "3", text: "D", selected: false },
  //   { value: "4", text: "E", selected: false },
  //   { value: "5", text: "Option 1", selected: false },
  //   { value: "6", text: "Option 2", selected: false },
  //   { value: "7", text: "Option 3", selected: false },
  //   { value: "8", text: "Option 4", selected: false },
  //   { value: "9", text: "Option 5", selected: false },
  // ];

  // const NewAuditForm = (
  //   <form>
  //     <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
  //       New Inventory Audit
  //     </h4>
  //     <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
  //       <div className="col-span-1">
  //         <Label>Warehouse Name</Label>
  //         <div className="relative">
  //           <Select
  //             className="dark:bg-dark-900"
  //             options={warehouseOpts}
  //             onChange={(val) =>
  //               setFormData({ ...formData, warehouseName: val })
  //             }
  //           />
  //           <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">
  //             <ChevronDownIcon />
  //           </span>
  //         </div>
  //       </div>

  //       <div className="col-span-1">
  //         <Label>Assigned Inspector</Label>
  //         <div className="relative">
  //           <Select
  //             className="dark:bg-dark-900"
  //             options={userOpts}
  //             onChange={(val) => setFormData({ ...formData, inspector: val })}
  //           />
  //           <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">
  //             <ChevronDownIcon />
  //           </span>
  //         </div>
  //       </div>

  //       <div className="col-span-1 sm:col-span-2">
  //         <Label>Scheduled Date</Label>
  //         <Input
  //           type="date"
  //           defaultValue={formData.date}
  //           onChange={(e) => setFormData({ ...formData, date: e.target.value })}
  //         />
  //       </div>

  //       <div className="col-span-1 sm:col-span-2">
  //         <MultiSelect
  //           label="Scheduled Product"
  //           options={productOpts}
  //           onChange={(val) => setFormData({ ...formData, product: val })}
  //         />
  //       </div>
  //     </div>
  //   </form>
  // );

  return (
    <div>
      <PageBreadcrumb pageTitle="Inventory Check List" />
      <div>
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <Filter type="inventory-check" />
          {/* <CustomContentModalBox
            onSave={() => {
              console.log(formData);
            }}
            btnName={"New Audit"}
            modalContent={NewAuditForm}
          /> */}
          <div className="p-6">
            <CustomizableTable
              headers={inventoryCheckOrderHeaders}
              data={inventoryCheckOrders}
            ></CustomizableTable>
          </div>
          <Pagination
            currentPage={page}
            totalPages={6}
            onPageChange={setPage}
          ></Pagination>
        </div>
      </div>
    </div>
  );
}
