"use client";

import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import Button from "@/default_components/ui/button/Button";
import GeneralInfoSection from "@/components/GeneralInformation";
import CustomizableTable from "@/components/table/CustomizableTable";
import {
  faultBatchColumns,
  taskColumns,
  type TaskItem,
} from "@/components/table/CustomizableTableHeader";
import { faultBatchData2 } from "@/components/table/TableData";

const summaryInfoItems = [
  { label: "Process Order ID", value: "-" },
  { label: "Status", value: "-" },
  { label: "Order Type", value: "-" },
  { label: "Created At", value: "-" },
];

export default function AssignTaskPage() {
  return (
    <div>
      <PageBreadcrumb
        pageTitle="Assign Task"
        filters={["details", "assign-task"]}
      />
      <div className="flex flex-col gap-6">
        <div className="flex flex-3 flex-col gap-6">
          <GeneralInfoSection title="Summary" items={summaryInfoItems} />

          {/* Action Table */}
          <div>
            <h2 className="m-3 font-medium">Action</h2>
            <Button className="my-4 w-full">+ New Task</Button>
            <CustomizableTable headers={taskColumns} data={[] as TaskItem[]} />
          </div>

          {/* Batch Table */}
          <div>
            <h2 className="m-3 font-medium">Processing</h2>
            <Button className="my-4 w-full">+ Add Batch</Button>
            <CustomizableTable
              headers={faultBatchColumns}
              data={faultBatchData2}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
