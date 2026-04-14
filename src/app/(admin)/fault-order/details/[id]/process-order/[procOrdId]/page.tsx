import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import { cookies } from "next/headers";

import Button from "@/default_components/ui/button/Button";
import {
  getFaultBatchProcessOrderWithDetailsAction,
  getFaultOrderAction,
} from "@/actions/faultHandling";
import { Analyze } from "@/interfaces/inventoryManagementType";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExport } from "@fortawesome/free-solid-svg-icons";
import ProcessOrderDetailForm from "./ProcessOrderDetailForm";

type ProcessOrderDetailPageProps = {
  params: Promise<{
    id: string;
    procOrdId: string;
  }>;
};

const parseValidUserId = (rawValue?: string) => {
  const parsed = Number(rawValue);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
};

export default async function FaultOrderDetailPage({
  params,
}: ProcessOrderDetailPageProps) {
  const cookieStore = await cookies();
  const { id, procOrdId } = await params;
  const processOrderId = Number(procOrdId);
  const currentUserId = parseValidUserId(cookieStore.get("userId")?.value);

  if (Number.isNaN(processOrderId)) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
        Invalid process order id.
      </div>
    );
  }

  const { data, error } =
    await getFaultBatchProcessOrderWithDetailsAction(processOrderId);

  if (error || !data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
        {error ?? "Unable to load process order details."}
      </div>
    );
  }

  const routeFaultOrderId = Number(id);
  const faultOrderId = Number.isNaN(routeFaultOrderId)
    ? data.faultOrderId
    : routeFaultOrderId;

  let questionCreatorId: number | null = null;
  let analyzerId: number | null = null;

  if (!Number.isNaN(faultOrderId)) {
    const { data: faultOrder } = await getFaultOrderAction(faultOrderId);
    questionCreatorId = faultOrder?.questionCreatorId ?? null;
    analyzerId = faultOrder?.analyzerId ?? null;
  }

  return (
    <div>
      <PageBreadcrumb
        pageTitle={`Process Order #${data.id}`}
        filters={["details", "process-order"]}
      />
      <div className="flex flex-col gap-6">
        {/* <UtilityBar /> */}
        <div className="flex justify-end rounded-2xl border border-gray-200 p-3">
          <Button
            size="sm"
            variant="primary"
            startIcon={<FontAwesomeIcon icon={faFileExport} />}
          >
            Export
          </Button>
        </div>
        <ProcessOrderDetailForm
          processOrder={data}
          currentUserId={currentUserId}
          questionCreatorId={questionCreatorId}
          analyzerId={analyzerId}
        />
      </div>
    </div>
  );
}
