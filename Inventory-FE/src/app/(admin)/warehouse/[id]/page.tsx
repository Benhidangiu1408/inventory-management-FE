import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ActivityLog from "@/components/TA_common/ActivityLog";

import UtilityBar from "@/components/TA_common/UtilityBar";
import CustomizableTable from "@/components/Ky_components/CustomizableTable";
import GeneralInfoSection from "@/components/Ky_components/GeneralInformation";
import { storedProductHeaders } from "@/components/Ky_components/TableHeader";
import { storedProductData } from "@/components/Ky_components/TableData";

export default function WarehouseDetailPage() {
  const generalInfoItems = [
    {
      label: "Warehouse Code",
      value: "WH-001",
    },
    {
      label: "Warehouse Name",
      value: "Warehouse 1",
    },
    {
      label: "Location",
      value: "Los Angeles",
    },
    {
      label: "Manager",
      value: "John Doe",
    },
    {
      label: "Status",
      value: "Active",
    },
    {
      label: "Type",
      value: "Temporary Storage",
    },
  ];

  return (
    <div>
      <PageBreadcrumb pageTitle="Warehouse Detail" />
      <div className="flex flex-col gap-6">
        <UtilityBar />
        <div className="flex justify-between gap-6">
          <div className="flex flex-3 flex-col gap-6">
            <GeneralInfoSection
              title="General Information"
              items={generalInfoItems}
            />
            <div className="rounded-2xl border border-gray-200 p-6">
              <h2 className="mb-3 font-medium">Storage Products</h2>
              <CustomizableTable
                headers={storedProductHeaders}
                data={storedProductData}
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
