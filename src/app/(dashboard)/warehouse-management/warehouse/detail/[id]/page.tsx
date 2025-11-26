import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import GeneralInfoSection from "@/components/GeneralInformation";
import { warehouseService } from "@/services/WarehouseManagementService";
import { ApiError } from "@/lib/api-mask";
import { WarehouseDetail } from "@/interfaces/warehouseManagementType";

export default async function WarehouseDetailPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;
  let data: WarehouseDetail | null = null;
  let errorMsg = null;

  try {
    data = await warehouseService.getDetail(id);
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(`API Error ${error.status}: ${error.message}`);
      errorMsg = `Could not load categories from server.\nError Code: ${error.status}\nMessage: ${error.message}`;
    }
  }
  if (errorMsg) return <div className="text-red-500">{errorMsg}</div>;

  const generalInfoItems = [
    { label: "Code", value: data?.code },
    { label: "Warehouse Name", value: data?.name },
    { label: "Address", value: data?.address },
    { label: "Manager", value: "John Doe" },
    { label: "Status", value: data?.status },
    { label: "Type", value: data?.type },
  ];
  return (
    <div>
      <PageBreadcrumb
        pageTitle="Warehouse Detail"
        filters={["warehouse-management", "detail"]}
      />
      <div className="flex flex-col gap-6">
        <div className="flex justify-between gap-6">
          <div className="flex flex-3 flex-col gap-6">
            <GeneralInfoSection
              title="General Information"
              items={generalInfoItems}
            />
            <div className="default-card p-6"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
