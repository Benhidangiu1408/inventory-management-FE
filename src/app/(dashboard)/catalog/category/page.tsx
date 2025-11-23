import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";

import AccordionTable from "@/components/table/AccordionTable";
import {
  categoryHeaders,
  subCategoryHeaders,
} from "@/components/table/AccordionTableHeader";
import { getCategories } from "@/services/WarehouseManagementService";
import { Category } from "@/interfaces/warehouseManagementType";
import { ModalCategoryForm } from "@/components/form/ModalCategoryForm";

export default async function CategoryPage() {
  let data: Category[] = [];
  // try {
  //   data = await getCategories();
  // } catch (e) {
  //   console.log(e);
  // }
  // console.log(data);

  return (
    <div>
      <PageBreadcrumb pageTitle="Category" filters={["catalog"]} />
      <div>
        <div className="default-card">
          <div className={"pt-6 pl-6"}>
            <ModalCategoryForm />
          </div>
          <div className="p-6">
            <AccordionTable
              headers={categoryHeaders}
              subTableHeaders={subCategoryHeaders}
              subTableKey={"subcategories"}
              data={data}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
