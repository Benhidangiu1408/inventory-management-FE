import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import Filter from "@/components/Filter";

import AccordionTable from "@/components/table/AccordionTable";
import {
  batchColumns,
  productColumns,
} from "@/components/table/AccordionTableHeader";
import { productData } from "@/default_components/Ky_components/TableData";

export default async function CategoryPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Category" filters={["catalog"]} />
      <div>
        <div className="default-card">
          {/*<Filter type="category" />*/}
          <div className="p-6">
            <AccordionTable
              headers={productColumns}
              subTableHeaders={batchColumns}
              subTableKey={"batches"}
              data={productData}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
