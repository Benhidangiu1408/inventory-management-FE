import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";

import { categoryService } from "@/services/WarehouseManagementService";
import { Category } from "@/interfaces/warehouseManagementType";
import { ModalCategoryForm } from "@/components/form/ModalCategoryForm";

export default async function CategoryPage() {
  // Handle initial page data
  let data: Category[] = [];
  let errorMsg = null;

  try {
    data = await categoryService.getAll();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    errorMsg = `Could not load data from server. ${error.message}`;
  }
  if (errorMsg) return <div className="text-red-500">{errorMsg}</div>;

  return (
    <div>
      <PageBreadcrumb pageTitle="Category" filters={["catalog"]} />
      <div className="default-card">
        <ModalCategoryForm data={data} />
      </div>
    </div>
  );
}
