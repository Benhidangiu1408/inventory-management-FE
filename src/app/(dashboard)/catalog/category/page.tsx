import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";

import { getCategories } from "@/services/WarehouseManagementService";
import { Category } from "@/interfaces/warehouseManagementType";
import { ModalCategoryForm } from "@/components/form/ModalCategoryForm";
import { ApiError } from "@/lib/api-mask";

export default async function CategoryPage() {
  // Handle initial page data
  let data: Category[] = [];
  let errorMsg = null;

  try {
    data = await getCategories();
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(`API Error ${error.status}: ${error.message}`);
      errorMsg = `Could not load categories from server.\nError Code: ${error.status}\nMessage: ${error.message}`;
    }
  }
  if (errorMsg) return <div className="text-red-500">{errorMsg}</div>;

  return (
    <div>
      <PageBreadcrumb pageTitle="Category" filters={["catalog"]} />
      <div>
        <div className="default-card">
          <ModalCategoryForm data={data} />
        </div>
      </div>
    </div>
  );
}
