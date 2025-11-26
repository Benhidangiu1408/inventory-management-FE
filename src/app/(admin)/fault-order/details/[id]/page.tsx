"use client";
import { useRouter, usePathname } from "next/navigation";
import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";

import UtilityBar from "@/default_components/TA_common/UtilityBar";
import CustomizableTable from "@/components/table/CustomizableTable";
import {
  faultBatchColumns,
  processingOrderColumns,
} from "@/components/table/CustomizableTableHeader";
import {
  faultBatchData,
  processingOrderData,
} from "@/default_components/Ky_components/TableData";
import StatusBox from "@/default_components/TA_common/StatusBox";
import Button from "@/default_components/ui/button/Button";

export default function FaultOrderDetailPage() {
  const route = useRouter();
  const pathName = usePathname();
  return (
    <div>
      <PageBreadcrumb
        pageTitle="Fault Order Detail"
        filters={["details"]}
        status={<StatusBox />}
      />
      <div className="flex flex-col gap-6">
        <UtilityBar />
        <div className="flex justify-between gap-6">
          <div className="flex flex-3 flex-col gap-6">
            <div className="rounded-2xl border border-gray-200 p-6">
              <div className="my-3 flex items-center justify-between">
                <h2 className="mb-3 font-medium">Fault Batches</h2>
                <Button
                  onClick={() => route.push(pathName + "/process-order/PO1")}
                >
                  Handle
                </Button>
              </div>
              <CustomizableTable
                headers={faultBatchColumns}
                data={faultBatchData}
              />
            </div>
            <div className="rounded-2xl border border-gray-200 p-6">
              <h2 className="mb-3 font-medium">Processing Order List</h2>
              <CustomizableTable
                headers={processingOrderColumns}
                data={processingOrderData}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
