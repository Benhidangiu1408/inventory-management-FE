import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import Filter from "@/components/Filter";
import Pagination from "@/default_components/tables/Pagination";

import ExpandableTable from "@/components/table/ExpandableTable";
import { Badge } from "lucide-react";

export default function CategoryPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Category" filters={["catalog"]} />
      <div>
        <div className="default-card">
          {/*<Filter type="category" />*/}
          <div className="p-6"></div>
        </div>
      </div>
    </div>
  );
}
