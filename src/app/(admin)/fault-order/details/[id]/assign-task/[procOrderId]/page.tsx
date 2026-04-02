import { getFaultBatchProcessOrderWithDetailsAction } from "@/actions/faultHandling";
import { getAllUsersByRoleAction } from "@/actions/user";
import AssignTaskClientPage from "./AssignTaskClientPage";

type AssignTaskPageProps = {
  params: Promise<{
    id: string;
    procOrderId: string;
  }>;
};

export default async function AssignTaskPage({ params }: AssignTaskPageProps) {
  const { id, procOrderId } = await params;
  const faultOrderId = Number(id);
  const processOrderId = Number(procOrderId);

  if (Number.isNaN(processOrderId) || Number.isNaN(faultOrderId)) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
        Invalid process order id.
      </div>
    );
  }

  const [processOrderResult, ownersResult] = await Promise.all([
    getFaultBatchProcessOrderWithDetailsAction(processOrderId),
    getAllUsersByRoleAction(1),
  ]);

  return (
    <AssignTaskClientPage
      faultOrderId={faultOrderId}
      processOrderId={processOrderId}
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
