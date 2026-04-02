import { CreateProductForm } from "@/components/form/CreateProductForm";
import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import { Suspense } from "react";
import { Category, UnitResponse } from "@/interfaces/warehouseManagementType";
import {
  categoryService,
  unitService,
} from "@/services/WarehouseManagementService";

export default async function CreateProductPage() {
  let categoryData: Category[] = [];
  let unitData: UnitResponse[] = [];
  let errorMsg = null;

  try {
    categoryData = await categoryService.getAll();
    unitData = await unitService.getAll();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    errorMsg = `Could not load data from server. ${error.message}`;
  }
  if (errorMsg) return <div className="text-red-500">{errorMsg}</div>;
  return (
    <div>
      <PageBreadcrumb pageTitle="Create Product" filters={["catalog"]} />
      <Suspense fallback={<div className="mt-4 text-sm text-gray-600">Loading…</div>}>
        <CreateProductForm category={categoryData} unit={unitData} />
      </Suspense>
    </div>
  );
}
