import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import GeneralInfoSection from "@/components/GeneralInformation";
import { InventoryCheckSheetData } from "@/interfaces/inventoryManagementType";
import { inventoryCheckService } from "@/services/InventoryManagementService";
import { InventoryCheckWorkSheet } from "@/components/InventoryCheckWorkSheet";
import { cookies } from "next/headers";

export default async function InventoryCheckDetailPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;
  let data: InventoryCheckSheetData | null = null;
  const cookieStore = await cookies();
  const userId = Number(cookieStore.get("userId")?.value);
  const hasPermissions =
    cookieStore.get("permissions")?.value.includes("SCHEDULE_STOCKTAKING") ??
    false;
  let errorMsg = null;

  try {
    data = await inventoryCheckService.getDetail(Number(id));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    errorMsg = `Could not load data from server. ${error.message}`;
  }
  if (errorMsg) return <div className="text-red-500">{errorMsg}</div>;

  const generalInfoItems = [
    { label: "Code", value: data?.header.code },
    { label: "Warehouse Name", value: data?.header.warehouseName },
    { label: "Assigner", value: data?.header.creatorName },
    { label: "Assignee", value: data?.header.assigneeName },
    { label: "Status", value: data?.header.status },
    ...(data?.header.status === "APPROVED" || data?.header.status === "REJECTED"
      ? [
          {
            label:
              data.header.status === "APPROVED" ? "Approved By" : "Rejected By",
            value: data.header.approvalName || "-",
          },
        ]
      : [
          {
            label: "Cycle Check",
            value: data?.header.isCycleCheck
              ? `Every ${data.header.cycleIntervalDays} day(s)`
              : "None",
          },
        ]),

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
        <InventoryCheckWorkSheet
          currentUser={userId}
          initialData={data}
          hasPerms={hasPermissions}
        />
      </div>
    </div>
  );
}
