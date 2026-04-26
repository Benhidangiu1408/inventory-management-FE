import { cookies } from "next/headers";
import AssignTaskClientPage from "@/components/fault-order/AssignTaskClientPage";
import { User } from "@/interfaces/userManagementType";
import { userManagementService } from "@/services/UserManagementService";
import {
  FaultBatchProcessOrder,
  FaultOrderPermission,
  FaultOrderSummary,
} from "@/interfaces/inventoryManagementType";
import { faultOrderService } from "@/services/InventoryManagementService";
import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import GeneralInfoSection from "@/components/GeneralInformation";

export default async function AssignTaskPage({
  params,
}: {
  params: Promise<{
    id: string;
    procOrderId: string;
  }>;
}) {
  const cookieStore = await cookies();
  const { id, procOrderId } = await params;
  const faultOrderId = Number(id);
  const processOrderId = Number(procOrderId);
  const currentUserId = Number(cookieStore.get("userId")?.value);

  let error: string | null = null;
  let data: FaultBatchProcessOrder | null = null;
  let faultOrderData: FaultOrderSummary | null = null;
  let userData: User[] = [];

  try {
    data =
      await faultOrderService.getFaultBatchProcessOrderWithDetails(
        processOrderId,
      );
    faultOrderData = await faultOrderService.getFaultOrder(faultOrderId);
    userData = await userManagementService.getAllByPermissionCode(
      FaultOrderPermission.FAULT_HANDLER,
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    error = `Could not load data from server. ${e.message}`;
  }

  if (error || !data) {
    return (
      <div>
        <PageBreadcrumb
          pageTitle={`Assign Task Detail`}
          filters={["details", "assign-task"]}
        />
        <div className="default-card border-red-200 p-6 text-red-700 dark:border-red-700 dark:text-red-800">
          {error ?? "Unable to load fault order details."}
        </div>
      </div>
    );
  }

  const summaryInfoItems = [
    {
      label: "Fault Type",
      value: data.type.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()),
    },
    {
      label: "Status",
      value: data.status
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase()),
    },
    {
      label: "Created Date",
      value: data.createdAt
        ? new Date(data.createdAt as string).toLocaleDateString("en-GB")
        : "-",
    },
    // {
    //   label: "Process Date",
    //   value: data.processedAt
    //     ? new Date(data.processedAt as string).toLocaleDateString("en-GB")
    //     : "-",
    // },
    {
      label: "Order Created By",
      value: data?.creatorUsername ?? "-",
    },
    { label: "Analyzed By", value: faultOrderData?.analyzerUsername ?? "-" },

    { label: "Approved By", value: data.approvedByUsername ?? "-" },
    {
      label: "Task Assigner",
      value: faultOrderData?.taskAssigneeUsername ?? "-",
    },
  ];

  return (
    <div>
      <PageBreadcrumb
        pageTitle={`Assign Task #${data.id}`}
        filters={["details", "assign-task"]}
      />
      <div className="flex flex-col gap-6">
        <GeneralInfoSection title="Summary" items={summaryInfoItems} />
        <AssignTaskClientPage
          faultOrderId={faultOrderId}
          currentUserId={currentUserId}
          taskAssignerUserId={faultOrderData?.taskAssigneeId ?? null}
          initialProcessOrderData={data}
          initialOwners={userData ?? []}
        />
      </div>
    </div>
  );
}
