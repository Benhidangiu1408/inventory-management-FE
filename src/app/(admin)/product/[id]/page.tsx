import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import ActivityLog from "@/default_components/TA_common/ActivityLog";

import UtilityBar from "@/default_components/TA_common/UtilityBar";
import GeneralInfoSection from "@/default_components/Ky_components/GeneralInformation";
import CustomizableTable from "@/components/table/CustomizableTable";
import { storageBatchColumns } from "@/components/table/TableHeader";
import { storageBatchData } from "@/default_components/Ky_components/TableData";

export default function ProductDetailPage() {
  const generalInfoItems = [
    {
      label: "Product Code",
      value: "PR-001",
    },
    {
      label: "Product Name",
      value: "Gundam Freedom",
    },
    {
      label: "Category",
      value: "Toy",
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
      <PageBreadcrumb pageTitle="Product Detail" />
      <div className="flex flex-col gap-6">
        <UtilityBar />
        <div className="flex justify-between gap-6">
          <div className="flex flex-3 flex-col gap-6">
            <GeneralInfoSection
              title="General Information"
              items={generalInfoItems}
            />
            <div className="rounded-2xl border border-gray-200 p-6">
              <h2 className="mb-3 font-medium">Product Batches</h2>
              <CustomizableTable
                headers={storageBatchColumns}
                data={storageBatchData}
              />
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
