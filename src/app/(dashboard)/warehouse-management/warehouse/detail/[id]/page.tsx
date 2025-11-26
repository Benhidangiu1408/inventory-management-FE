import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import GeneralInfoSection from "@/components/GeneralInformation";

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
        <div className="flex justify-between gap-6">
          <div className="flex flex-3 flex-col gap-6">
            <GeneralInfoSection
              title="General Information"
              items={generalInfoItems}
            />
            <div className="rounded-2xl border border-gray-200 p-6"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
