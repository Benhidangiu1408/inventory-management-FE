import { ModalUnitForm } from "@/components/form/ModalUnitForm";
import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import { UnitResponse } from "@/interfaces/warehouseManagementType";
import { ApiError } from "@/lib/api-mask";
import { unitService } from "@/services/WarehouseManagementService";

export default async function UnitPage() {
  // Handle initial page data
  let data: UnitResponse[] = [];
  let errorMsg = null;

  try {
    data = await unitService.getAll();
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(`API Error ${error.status}: ${error.message}`);
      errorMsg = `Could not load data from server.\nError Code: ${error.status}\nMessage: ${error.message}`;
    }
  }
  if (errorMsg) return <div className="text-red-500">{errorMsg}</div>;

  return (
    <div>
      <PageBreadcrumb pageTitle="Units" filters={["catalog"]} />
      <div className="default-card">
        <ModalUnitForm data={data} />
      </div>
    </div>
  );
}
