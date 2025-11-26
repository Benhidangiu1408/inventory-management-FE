import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import ActivityLog from "@/default_components/TA_common/ActivityLog";

import UtilityBar from "@/default_components/TA_common/UtilityBar";
import GeneralInfoSection from "@/default_components/Ky_components/GeneralInformation";
// import CustomizableTable from "@/components/table/CustomizableTable";
// import { categoryProductColumns } from "@/components/table/CustomizableTableHeader";
// import { categoryProductData } from "@/default_components/Ky_components/TableData";

export default function CategoryDetailPage() {
  const generalInfoItems = [
    {
      label: "Category ID",
      value: "CAT-001",
    },
    {
      label: "Category Name",
      value: "Soft Drink",
    },
    {
      label: "Created By",
      value: "John Doe",
    },
    {
      label: "Status",
      value: "Active",
    },
  ];

  return (
    <div>
      <PageBreadcrumb pageTitle="Category Detail" />
      <div className="flex flex-col gap-6">
        <UtilityBar />
        <div className="flex justify-between gap-6">
          <div className="flex flex-3 flex-col gap-6">
            <GeneralInfoSection
              title="General Information"
              items={generalInfoItems}
            />
            <div className="rounded-2xl border border-gray-200 p-6">
              <h2 className="mb-3 font-medium">Products</h2>
              {/* <CustomizableTable
                headers={categoryProductColumns}
                data={categoryProductData}
              /> */}
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-6">
            <ActivityLog />
          </div>
        </div>
      </div>
    </div>
  );
}
