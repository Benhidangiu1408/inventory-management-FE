import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import { cookies } from "next/headers";
import StatusBox from "@/components/TA_common/StatusBox";
import ComponentCard from "@/default_components/common/ComponentCard";
import {
  FaultOrderSummary,
  FaultOrderPermission,
  FaultOrderStatus,
} from "@/interfaces/inventoryManagementType";
import FaultOrderDetailClient from "@/components/fault-order/FaultOrderDetailClient";
import AnalyzerAssigneeSelect from "@/components/fault-order/AnalyzerAssigneeSelect";
import { faultOrderService } from "@/services/InventoryManagementService";
import { userManagementService } from "@/services/UserManagementService";
import { User } from "@/interfaces/userManagementType";

export default async function FaultOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const cookieStore = await cookies();
  const { id } = await params;
  const faultOrderId = Number(id);
  const currentUserId = Number(cookieStore.get("userId")?.value);
  const permissions = cookieStore.get("permissions")?.value;

  let error: string | null = null;
  let data: FaultOrderSummary | null = null;
  let userData: User[] = [];

  try {
    data = await faultOrderService.getFaultOrder(faultOrderId);
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
          pageTitle="Fault Order Detail"
          filters={["details"]}
          status={<StatusBox />}
        />
        <div className="default-card border-red-200 p-6 text-red-700 dark:border-red-700 dark:text-red-800">
          {error ?? "Unable to load fault order details."}
        </div>
      </div>
    );
  }

  const canAssignUser =
    (permissions?.includes(FaultOrderPermission.ASSIGN) &&
      data.status != FaultOrderStatus.COMPLETED) ??
    false;
  const canCreateProcessOrder =
    (permissions?.includes(FaultOrderPermission.CREATE) &&
      data.status != FaultOrderStatus.COMPLETED) ??
    false;

  const analysisActionLabel =
    currentUserId === data.analyzerId ||
    currentUserId === data.questionCreatorId
      ? "Analyze"
      : "View Analysis";

  const taskActionLabel =
    currentUserId === data.taskAssigneeId ? "Assign Tasks" : "View Tasks";

  return (
    <div>
      <PageBreadcrumb
        pageTitle={
          data.code ? `Fault Order ${data.code}` : "Fault Order Detail"
        }
        filters={["details"]}
        status={<StatusBox status={data.status} />}
      />
      <div className="flex flex-col gap-6">
        <ComponentCard title="Personnel Assignment">
          <AnalyzerAssigneeSelect
            faultOrderId={faultOrderId}
            users={userData ?? []}
            initialAnalyzerId={data.analyzerId}
            initialAnalyzerName={data.analyzerUsername}
            initialAssigneeId={data.taskAssigneeId}
            initialAssigneeName={data.taskAssigneeUsername}
            initialQuestionCreatorId={data.questionCreatorId}
            initialQuestionCreatorName={data.questionCreatorUsername}
            canAssignUser={canAssignUser}
          />
        </ComponentCard>

        <FaultOrderDetailClient
          currentUserId={currentUserId}
          faultOrderId={faultOrderId}
          initialFaultBatches={data.faultBatches ?? []}
          initialProcessingOrders={data.processOrders ?? []}
          canCreateProcessOrder={canCreateProcessOrder}
          analysisActionLabel={analysisActionLabel}
          taskActionLabel={taskActionLabel}
        />
      </div>
    </div>
  );
}
