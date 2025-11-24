import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import CustomizableTable from "@/components/table/CustomizableTable";
import { WarehouseGeneral } from "@/interfaces/warehouseManagementType";
import { warehouseService } from "@/services/WarehouseManagementService";
import { ApiError } from "@/lib/api-mask";
import { warehouseHeaders } from "@/components/table/CustomizableTableHeader";

export default async function WarehousePage() {
  // Handle initial page data
  let data: WarehouseGeneral[] = [];
  let errorMsg = null;

  try {
    data = await warehouseService.getAll();
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(`API Error ${error.status}: ${error.message}`);
      errorMsg = `Could not load categories from server.\nError Code: ${error.status}\nMessage: ${error.message}`;
    }
  }
  if (errorMsg) return <div className="text-red-500">{errorMsg}</div>;
  return (
    <div>
      <PageBreadcrumb
        pageTitle="Warehouse List"
        filters={["warehouse-management"]}
      />
      <div>
        <div className="default-card">
          <CustomizableTable headers={warehouseHeaders} data={data} />
        </div>
      </div>
    </div>
  );
}
