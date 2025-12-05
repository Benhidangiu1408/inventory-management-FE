import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import CustomizableTable from "@/components/table/CustomizableTable";
import { WarehouseGeneral } from "@/interfaces/warehouseManagementType";
import { warehouseService } from "@/services/WarehouseManagementService";
import { ApiError } from "@/lib/api-mask";
import { warehouseHeaders } from "@/components/table/CustomizableTableHeader";
import Link from "next/link";
import Button from "@/default_components/ui/button/Button";
import { Plus } from "lucide-react";

export default async function WarehousePage() {
  // Handle initial page data
  let data: WarehouseGeneral[] = [];
  let errorMsg = null;

  try {
    data = await warehouseService.getAll();
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(`API Error ${error.status}: ${error.message}`);
      errorMsg = `Could not load data from server.\nError Code: ${error.status}\nMessage: ${error.message}`;
    }
  }
  if (errorMsg) return <div className="text-red-500">{errorMsg}</div>;
  return (
    <div>
      <PageBreadcrumb
        pageTitle="Warehouse"
        filters={["warehouse-management"]}
      />
      <div>
        <div className="default-card p-6">
          <div className="mb-4">
            <Link href={`/warehouse-management/warehouse/new`}>
              <Button
                size="sm"
                variant="primary"
                startIcon={<Plus size={16} />}
              >
                New Warehouse
              </Button>
            </Link>
          </div>
          <CustomizableTable headers={warehouseHeaders} data={data} />
        </div>
      </div>
    </div>
  );
}
