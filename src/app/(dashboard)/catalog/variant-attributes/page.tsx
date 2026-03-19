import { ModalAttributesForm } from "@/components/form/ModalAttributesForm";
import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import { AttributeResponse } from "@/interfaces/warehouseManagementType";
import { attributesService } from "@/services/WarehouseManagementService";

export default async function VariantAttributesPage() {
  // Handle initial page data
  let data: AttributeResponse[] = [];
  let errorMsg = null;

  try {
    data = await attributesService.getAll();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    errorMsg = `Could not load data from server. ${error.message}`;
  }
  if (errorMsg) return <div className="text-red-500">{errorMsg}</div>;

  return (
    <div>
      <PageBreadcrumb pageTitle="Attributes" filters={["catalog"]} />
      <div className="default-card">
        <ModalAttributesForm data={data} />
      </div>
    </div>
  );
}
