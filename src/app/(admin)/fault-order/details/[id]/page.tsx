import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import { cookies } from "next/headers";
import StatusBox from "@/components/TA_common/StatusBox";
import ComponentCard from "@/default_components/common/ComponentCard";
import {
  FaultOrderSummary,
  FaultOrderPermission,
} from "@/interfaces/inventoryManagementType";
import FaultOrderDetailClient from "./FaultOrderDetailClient";
import AnalyzerAssigneeSelect from "./AnalyzerAssigneeSelect";
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
  const canAssignUser =
    permissions?.includes(FaultOrderPermission.ASSIGN) ?? false;
  const canCreateProcessOrder =
    permissions?.includes(FaultOrderPermission.CREATE) ?? false;

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

  const analysisActionLabel =
    permissions?.includes(FaultOrderPermission.ANALYZE) ||
    currentUserId === data.analyzerId ||
    currentUserId === data.questionCreatorId
      ? "Analyze"
      : permissions?.includes(FaultOrderPermission.VIEW_ANALYSIS) ||
          currentUserId === data.taskAssigneeId
        ? "View Analysis"
        : null;

  const taskActionLabel =
    permissions?.includes(FaultOrderPermission.ASSIGN_TASK) ||
    currentUserId === data.taskAssigneeId
      ? "Assign Tasks"
      : permissions?.includes(FaultOrderPermission.DO_TASK)
        ? "Do Task"
        : permissions?.includes(FaultOrderPermission.VIEW_TASK)
          ? "View Task"
          : null;

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
