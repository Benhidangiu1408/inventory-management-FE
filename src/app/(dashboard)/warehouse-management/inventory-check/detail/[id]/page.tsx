import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import GeneralInfoSection from "@/components/GeneralInformation";
import { InventoryCheckSheetData } from "@/interfaces/inventoryManagementType";
import { inventoryCheckService } from "@/services/InventoryManagementService";
import { ApiError } from "@/lib/api-mask";
import { InventoryCheckWorkSheet } from "@/components/InventoryCheckWorkSheet";

export default async function InventoryCheckDetailPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;
  let data: InventoryCheckSheetData | null = null;
  let errorMsg = null;

  try {
    data = await inventoryCheckService.getDetail(Number(id));
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(`API Error ${error.status}: ${error.message}`);
      errorMsg = `Could not load data from server.\nError Code: ${error.status}\nMessage: ${error.message}`;
    }
  }
  if (errorMsg) return <div className="text-red-500">{errorMsg}</div>;

  const generalInfoItems = [
    { label: "Code", value: data?.header.code },
    { label: "Warehouse Name", value: data?.header.warehouseName },
    { label: "Assignee", value: "John Doe" },
    { label: "Status", value: data?.header.status },
    {
      label: "Note",
      value: (data?.header.note as string) || (
        <div className="text-gray-400 italic">No Note</div>
      ),
    },
  ];
  return (
    <div>
      <PageBreadcrumb
        pageTitle="Inventory Check Detail"
        filters={["warehouse-management", "detail"]}
      />
      <div className="flex flex-col gap-6">
        <GeneralInfoSection items={generalInfoItems} />
        <div className="default-card flex flex-col gap-6 p-6">
          <InventoryCheckWorkSheet initialData={data} />
        </div>
      </div>
    </div>
  );
}
