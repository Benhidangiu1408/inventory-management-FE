import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import CustomizableTable from "@/components/table/CustomizableTable";

import { faultOrderHeader } from "@/components/table/CustomizableTableHeader";
import type { FaultOrderSummary } from "@/interfaces/inventoryManagementType";
import { faultOrderService } from "@/services/InventoryManagementService";

export default async function FaultOrderPage() {
  let data: FaultOrderSummary[] = [];
  let errorMsg = null;

  try {
    data = await faultOrderService.getAllFaultOrders();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    errorMsg = `Could not load data from server. ${error.message}`;
  }
  if (errorMsg) return <div className="text-red-500">{errorMsg}</div>;

  return (
    <div>
      <PageBreadcrumb pageTitle="Fault Order List" />
      <div>
        <div className="default-card p-6">
          <CustomizableTable headers={faultOrderHeader} data={data} />
        </div>
      </div>
    </div>
  );
}
