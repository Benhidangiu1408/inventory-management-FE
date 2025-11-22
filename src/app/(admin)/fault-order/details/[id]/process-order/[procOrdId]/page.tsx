"use client";
import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";

import UtilityBar from "@/default_components/TA_common/UtilityBar";
import CustomizableTable from "@/components/table/CustomizableTable";
import {
  faultBatchColumns,
  taskColumns,
} from "@/components/table/CustomizableTableHeader";
import { faultBatchData2 } from "@/default_components/Ky_components/TableData";
import Button from "@/default_components/ui/button/Button";
import GeneralInfoSection from "@/default_components/Ky_components/GeneralInformation";
import FileInput from "@/default_components/form/input/FileInput";
import Label from "@/default_components/form/Label";
import Input from "@/default_components/form/input/InputField";

export default function FaultOrderDetailPage() {
  const handleInfoItems = [
    { label: "Process Order ID", value: "SI-2025-001" },
    { label: "Create Date", value: "01/01/2025" },
    { label: "Return Date", value: "01/01/2025" },
    { label: "Expected Arrival Date", value: "01/01/2025" },
    { label: "Status", value: "In progress" },
    { label: "Return To", value: "ABC Supplier" },
    { label: "Handled By", value: "John Doe" },
    { label: "Note", value: "ABC" },
  ];

  const resolveInfoItems = [
    { label: "Resolve Date", value: "01/01/2025" },
    { label: "Resolve Image", value: "" },
    { label: "Resolve By", value: "John Doe" },
    { label: "Status", value: "ABC" },
  ];

  const summaryInfoItems = [
    { label: "Fault Type", value: "SI-2025-001" },
    { label: "Fault Reason", value: "Product defect" },
    { label: "Processing Date", value: "01/01/2025" },
    { label: "Status", value: "Pending" },
    { label: "Handled By", value: "John Doe" },
    { label: "Note", value: "ABC" },
  ];
  return (
    <div>
      <PageBreadcrumb
        pageTitle="Process Order #1"
        filters={["details", "process-order"]}
      />
      <div className="flex flex-col gap-6">
        <UtilityBar />
        <div className="flex justify-between gap-6">
          <div className="flex flex-3 flex-col gap-6">
            {/* Summary */}
            <GeneralInfoSection title="Summary" items={summaryInfoItems} />
            {/* Inputs */}
            <h2 className="m-3 font-medium">Problem Description</h2>
            <div>
              <Label>What happended?</Label>
              <FileInput />
            </div>
            <div>
              <Label>What is impacted?</Label>
              <FileInput />
            </div>
            <h2 className="m-3 font-medium">Reasons</h2>
            <div>
              <Label>Why is it happening?</Label>
              <FileInput />
            </div>
            <div>
              <Label>Why is that?</Label>
              <FileInput />
            </div>
            <div>
              <Label>Why is that?</Label>
              <FileInput />
            </div>
            <div>
              <Label>Why is that?</Label>
              <FileInput />
            </div>
            <div>
              <Label>Why is that?</Label>
              <FileInput />
            </div>
            {/* <div>
              <Label>How?</Label>
              <FileInput />
            </div> */}
            <h2 className="mt-3 font-medium">Root Causes</h2>
            <Input />
            {/* Action Table */}
            <div>
              <h2 className="m-3 font-medium">Action</h2>
              <Button className="my-4 w-full">+ New Task</Button>
              <CustomizableTable headers={taskColumns} data={[]} />
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
            {/* Approve */}
            <h2 className="mt-3 font-medium">Approval</h2>
            <div className="grid grid-cols-2">
              <Input placeholder="Name:" type="text"></Input>
              <Input placeholder="Date:" type="date"></Input>
            </div>
            <div className="flex gap-4">
              <GeneralInfoSection title=" Handle" items={handleInfoItems} />
              <GeneralInfoSection title="Resolve" items={resolveInfoItems} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
