import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
// import { cookies } from "next/headers";

// import UtilityBar from "@/components/TA_common/UtilityBar";
import {
  type FaultBatch as FaultBatchRow,
  type ProcessingOrder,
  type AssignedFaultBatch,
} from "@/components/table/CustomizableTableHeader";
import StatusBox from "@/components/TA_common/StatusBox";
import Button from "@/default_components/ui/button/Button";
import {
  FaultBatchStatus,
  FaultProcessOrderType,
  type FaultBatch as FaultBatchResponse,
  type FaultBatchProcessOrderSummary,
} from "@/interfaces/inventoryManagementType";
import { getFaultOrderAction } from "@/actions/faultHandling";
import { getAllUsersByRoleAction } from "@/actions/user";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExport } from "@fortawesome/free-solid-svg-icons";
import FaultOrderDetailClient from "./FaultOrderDetailClient";
import AnalyzerAssigneeSelect from "./AnalyzerAssigneeSelect";

type FaultOrderDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const DATE_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const formatDisplayDate = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }
  return DATE_FORMATTER.format(date);
};

const mapBatchStatusToLabel = (
  status?: FaultBatchStatus,
): FaultBatchRow["status"] => {
  switch (status) {
    case FaultBatchStatus.RESOLVED:
      return "Completed";
    case FaultBatchStatus.PROCESSING:
      return "In progress";
    default:
      return "Pending";
  }
};

// const mapPriorityToLabel = (
//   faultOrder?: FaultOrderDetail | null,
// ): FaultBatchRow["priority"] => {
//   const normalized = faultOrder?.priorityName?.toLowerCase();
//   if (normalized === "high") return "High";
//   if (normalized === "low") return "Low";
//   return "Medium";
// };

const buildFaultBatchRows = (
  batches?: FaultBatchResponse[],
): FaultBatchRow[] => {
  if (!batches?.length) {
    return [];
  }

  const getProcessOrderId = (batch: FaultBatchResponse) =>
    batch.faultBatchProcessOrder?.id ?? batch.faultBatchProcessOrderId;

  // const priorityLabel = mapPriorityToLabel(faultOrder);

  return batches
    .filter((batch) => !getProcessOrderId(batch))
    .map((batch) => ({
      id: batch.id,
      code: batch.code ?? `FB-${batch.id}`,
      date: formatDisplayDate(batch.createdAt),
      status: mapBatchStatusToLabel(batch.handlingStatus),
      checked: batch.handlingStatus === FaultBatchStatus.RESOLVED,
    }));
};

const buildAssignedFaultBatchRow = (
  batches?: FaultBatchResponse[],
): AssignedFaultBatch[] => {
  if (!batches?.length) {
    return [];
  }

  const getProcessOrderId = (batch: FaultBatchResponse) =>
    batch.faultBatchProcessOrder?.id ?? batch.faultBatchProcessOrderId;

  return batches
    .map((batch) => {
      const processOrderId = getProcessOrderId(batch);
      if (!processOrderId) {
        return null;
      }

      return {
        id: batch.id,
        code: batch.code ?? `FB-${batch.id}`,
        orderId: processOrderId,
        date: formatDisplayDate(batch.createdAt),
        status: mapBatchStatusToLabel(batch.handlingStatus),
        checked: batch.handlingStatus === FaultBatchStatus.RESOLVED,
      };
    })
    .filter((row): row is AssignedFaultBatch => row !== null);
};

const mapProcessOrderTypeToLabel = (
  type: FaultProcessOrderType,
): ProcessingOrder["orderType"] => {
  switch (type) {
    case FaultProcessOrderType.RETURNED:
      return "Returned";
    case FaultProcessOrderType.CANCELLED:
      return "Canceled";
    default:
      return "Other";
  }
};

const buildProcessOrderRows = (
  orders?: FaultBatchProcessOrderSummary[],
): ProcessingOrder[] => {
  if (!orders?.length) {
    return [];
  }

  return orders.map((order) => ({
    orderId: order.id,
    orderType: mapProcessOrderTypeToLabel(order.type),
    action: "",
  }));
};

export default async function FaultOrderDetailPage({
  params,
}: FaultOrderDetailPageProps) {
  // const cookieStore = await cookies();
  const { id } = await params;
  const faultOrderId = Number(id);
  // const currentUserId = Number(cookieStore.get("userId")?.value);
  const currentUserId = 1;
  console.log("Received fault order id:", { faultOrderId });
  if (Number.isNaN(faultOrderId)) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
        Invalid fault order id.
      </div>
    );
  }

  const { data, error } = await getFaultOrderAction(faultOrderId);
  console.log("Fetched fault order detail:", { data, error });
  if (error || !data) {
    return (
      <div>
        <PageBreadcrumb
          pageTitle="Fault Order Detail"
          filters={["details"]}
          status={<StatusBox />}
        />
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          {error ?? "Unable to load fault order details."}
        </div>
      </div>
    );
  }

  const faultBatchRows = buildFaultBatchRows(data.faultBatches);
  const assignedFaultBatchRows = buildAssignedFaultBatchRow(data.faultBatches);
  const processingOrderRows = buildProcessOrderRows(data.processOrders);

  const { data: users } = await getAllUsersByRoleAction(1);

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
        <div className="flex justify-end rounded-2xl border border-gray-200 p-3">
          <Button
            size="sm"
            variant="primary"
            startIcon={<FontAwesomeIcon icon={faFileExport} />}
          >
            Export
          </Button>
        </div>
        <div className="grid grid-cols-[auto_1fr_auto_1fr] items-center gap-2">
          <AnalyzerAssigneeSelect
            faultOrderId={faultOrderId}
            users={users ?? []}
            initialAnalyzerId={data.analyzerId}
            initialAssigneeId={data.taskAssigneeId}
          />
        </div>
        <FaultOrderDetailClient
          currentUserId={currentUserId}
          faultOrderId={faultOrderId}
          routeOrderId={id}
          initialFaultBatchRows={faultBatchRows}
          initialAssignedFaultBatchRows={assignedFaultBatchRows}
          initialProcessingOrderRows={processingOrderRows}
        />
      </div>
    </div>
  );
}
