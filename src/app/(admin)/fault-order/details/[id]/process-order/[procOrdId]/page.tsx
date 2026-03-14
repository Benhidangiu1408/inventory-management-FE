import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";

import Button from "@/default_components/ui/button/Button";
import { getFaultBatchProcessOrderWithDetailsAction } from "@/actions/faultHandling";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExport } from "@fortawesome/free-solid-svg-icons";
import ProcessOrderDetailForm from "./ProcessOrderDetailForm";

type ProcessOrderDetailPageProps = {
  params: Promise<{
    id: string;
    procOrdId: string;
  }>;
};

export default async function FaultOrderDetailPage({
  params,
}: ProcessOrderDetailPageProps) {
  const { procOrdId } = await params;
  const processOrderId = Number(procOrdId);

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
        <ProcessOrderDetailForm processOrder={data} />
      </div>
    </div>
  );
}
