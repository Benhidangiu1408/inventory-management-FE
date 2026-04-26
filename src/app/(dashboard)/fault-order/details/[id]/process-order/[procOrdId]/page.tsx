import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import { cookies } from "next/headers";
import ProcessOrderDetailForm from "@/components/fault-order/ProcessOrderDetailForm";
import {
  FaultBatchProcessOrder,
  FaultOrderSummary,
} from "@/interfaces/inventoryManagementType";
import { faultOrderService } from "@/services/InventoryManagementService";
import GeneralInfoSection from "@/components/GeneralInformation";

type ProcessOrderDetailPageProps = {
  params: Promise<{
    id: string;
    procOrdId: string;
  }>;
};

export default async function ProcessOrderDetailPage({
  params,
}: ProcessOrderDetailPageProps) {
  const cookieStore = await cookies();
  const { id, procOrdId } = await params;
  const faultOrderId = Number(id);
  const processOrderId = Number(procOrdId);
  const currentUserId = Number(cookieStore.get("userId")?.value);

  let error: string | null = null;
  let data: FaultBatchProcessOrder | null = null;
  let faultOrderData: FaultOrderSummary | null = null;
  let questionCreatorId: number | null = null;
  let analyzerId: number | null = null;

  try {
    data =
      await faultOrderService.getFaultBatchProcessOrderWithDetails(
        processOrderId,
      );
    faultOrderData = await faultOrderService.getFaultOrder(faultOrderId);
    questionCreatorId = faultOrderData?.questionCreatorId ?? null;
    analyzerId = faultOrderData?.analyzerId ?? null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    error = `Could not load data from server. ${e.message}`;
  }
  if (error || !data) {
    return (
      <div className="default-card border-red-200 p-6 text-red-700 dark:border-red-700 dark:text-red-800">
        {error ?? "Unable to load process order details."}
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
    { label: "Analyzed By", value: faultOrderData?.analyzerUsername ?? "-" },
    {
      label: "Questioned By",
      value: faultOrderData?.questionCreatorUsername ?? "-",
    },

    { label: "Approved By", value: data.approvedByUsername ?? "-" },
  ];

  return (
    <div>
      <PageBreadcrumb
        pageTitle={`Process Order #${data.id}`}
        filters={["details", "process-order"]}
      />
      <div className="flex flex-col gap-6">
        <GeneralInfoSection title="Summary" items={summaryInfoItems} />
        <GeneralInfoSection
          title="Root Cause"
          items={[
            {
              label: "",
              value: (data?.rootCause as string) || (
                <div className="text-gray-400 italic">No root cause</div>
              ),
            },
          ]}
        />
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
