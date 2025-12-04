import { CreateVariantForm } from "@/components/form/CreateVariantForm";
import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import { AttributeResponse } from "@/interfaces/warehouseManagementType";
import { ApiError } from "@/lib/api-mask";
import { attributesService } from "@/services/WarehouseManagementService";

export default async function CreateVariantPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  let attributeData: AttributeResponse[] = [];
  let errorMsg = null;
  const { id } = await params;

  try {
    attributeData = await attributesService.getAll();
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
        pageTitle="Create Product Variant"
        filters={["catalog", "variant", `${id}`]}
      />
      <CreateVariantForm availableAttributes={attributeData} />
    </div>
  );
}
