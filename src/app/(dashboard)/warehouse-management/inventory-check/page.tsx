import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import CustomizableTable from "@/components/table/CustomizableTable";
import { inventoryCheckSheetHeaders } from "@/components/table/CustomizableTableHeader";
import Link from "next/link";
import Button from "@/default_components/ui/button/Button";
import { Plus } from "lucide-react";
import { InventoryCheckResponse } from "@/interfaces/inventoryManagementType";
import { inventoryCheckService } from "@/services/InventoryManagementService";
import { cookies } from "next/headers";

export default async function InventoryCheckPage() {
  let data: InventoryCheckResponse[] = [];
  let errorMsg = null;
  const cookieStore = await cookies();
  const permissions = cookieStore.get("permissions")?.value;

  try {
    data = await inventoryCheckService.getAll();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    errorMsg = `Could not load data from server. ${error.message}`;
  }
  if (errorMsg) return <div className="text-red-500">{errorMsg}</div>;
  return (
    <div>
      <PageBreadcrumb
        pageTitle="Inventory Check"
        filters={["warehouse-management"]}
      />
      <div>
        <div className="default-card p-6">
          {permissions?.includes("SCHEDULE_STOCKTAKING") && (
            <div className="mb-6 flex justify-end px-1 pt-2">
              <Link href={`/warehouse-management/inventory-check/new`}>
                <Button
                  size="sm"
                  variant="primary"
                  startIcon={<Plus size={16} />}
                >
                  Schedule Inventory Check
                </Button>
              </Link>
            </div>
          )}
          <CustomizableTable headers={inventoryCheckSheetHeaders} data={data} />
        </div>
      </div>
    </div>
  );
}
