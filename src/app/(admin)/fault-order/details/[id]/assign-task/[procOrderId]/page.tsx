import {
  getFaultBatchProcessOrderWithDetailsAction,
  getFaultOrderAction,
} from "@/actions/faultHandling";
import { getAllUsersByRoleAction } from "@/actions/user";
import { cookies } from "next/headers";
import AssignTaskClientPage from "./AssignTaskClientPage";

type AssignTaskPageProps = {
  params: Promise<{
    id: string;
    procOrderId: string;
  }>;
};

const parseValidUserId = (rawValue?: string) => {
  const parsed = Number(rawValue);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
};

export default async function AssignTaskPage({ params }: AssignTaskPageProps) {
  const cookieStore = await cookies();
  const { id, procOrderId } = await params;
  const faultOrderId = Number(id);
  const processOrderId = Number(procOrderId);
  const currentUserId = parseValidUserId(cookieStore.get("userId")?.value);

  if (Number.isNaN(processOrderId) || Number.isNaN(faultOrderId)) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
        Invalid process order id.
      </div>
    );
  }

  const [processOrderResult, ownersResult, faultOrderResult] =
    await Promise.all([
      getFaultBatchProcessOrderWithDetailsAction(processOrderId),
      getAllUsersByRoleAction(1),
      getFaultOrderAction(faultOrderId),
    ]);

  return (
    <AssignTaskClientPage
      faultOrderId={faultOrderId}
      processOrderId={processOrderId}
      currentUserId={currentUserId}
      taskAssignerUserId={faultOrderResult.data?.taskAssigneeId ?? null}
      initialProcessOrderData={processOrderResult.data ?? null}
      initialProcessOrderError={
        processOrderResult.error ??
        (processOrderResult.data
          ? null
          : "Unable to load process order details.")
      }
      initialOwners={ownersResult.data ?? []}
      initialOwnersError={ownersResult.error}
    />
  );
}
