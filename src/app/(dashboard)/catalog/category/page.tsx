import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";

import AccordionTable from "@/components/table/AccordionTable";
import {
  categoryHeaders,
  subCategoryHeaders,
} from "@/components/table/AccordionTableHeader";
import { getCategories } from "@/services/WarehouseManagementService";

export default async function CategoryPage() {
  const data = await getCategories();
  console.log(data);
  return (
    <div>
      <PageBreadcrumb pageTitle="Category" filters={["catalog"]} />
      <div>
        <div className="default-card">
          {/*<Filter type="category" />*/}
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
