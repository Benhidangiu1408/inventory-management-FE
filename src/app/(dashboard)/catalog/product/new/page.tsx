import { CreateProductForm } from "@/components/form/CreateProductForm";
import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import { Category, UnitResponse } from "@/interfaces/warehouseManagementType";
import { ApiError } from "@/lib/api-mask";
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
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(`API Error ${error.status}: ${error.message}`);
      errorMsg = `Could not load categories from server.\nError Code: ${error.status}\nMessage: ${error.message}`;
    }
  }
  if (errorMsg) return <div className="text-red-500">{errorMsg}</div>;
  return (
    <div>
      <PageBreadcrumb pageTitle="Create Product" filters={["catalog"]} />
      <CreateProductForm category={categoryData} unit={unitData} />
    </div>
  );
}
