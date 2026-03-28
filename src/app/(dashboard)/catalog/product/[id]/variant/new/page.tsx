import { CreateVariantForm } from "@/components/form/CreateVariantForm";
import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import { Suspense } from "react";
import { AttributeResponse } from "@/interfaces/warehouseManagementType";
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    errorMsg = `Could not load data from server. ${error.message}`;
  }
  if (errorMsg) return <div className="text-red-500">{errorMsg}</div>;
  return (
    <div>
      <PageBreadcrumb
        pageTitle="Create Product Variant"
        filters={["catalog", "variant", `${id}`]}
      />
      <Suspense fallback={<div className="mt-4 text-sm text-gray-600">Loading…</div>}>
        <CreateVariantForm availableAttributes={attributeData} />
      </Suspense>
    </div>
  );
}
