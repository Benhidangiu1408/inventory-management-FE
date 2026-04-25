"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import CustomizableTable, {
  type Column,
} from "@/components/table/CustomizableTable";
import {
  detailFaultBatchColumns,
  detailAssignedFaultBatchColumns,
  detailProcessingOrderColumns,
} from "@/components/table/CustomizableTableHeader";
import Button from "@/default_components/ui/button/Button";
import { createFaultBatchProcessOrderAction } from "@/actions/faultHandling";
import {
  FaultProcessOrderStatus,
  FaultProcessOrderType,
  type FaultBatch,
  type FaultBatchProcessOrderSummary,
} from "@/interfaces/inventoryManagementType";
import ComponentCard from "@/default_components/common/ComponentCard";
import Checkbox from "@/default_components/form/input/Checkbox";

type FaultOrderDetailClientProps = {
  currentUserId: number | null;
  faultOrderId: number;
  initialFaultBatches: FaultBatch[];
  initialProcessingOrders: FaultBatchProcessOrderSummary[];
  canCreateProcessOrder: boolean;
  analysisActionLabel: "Analyze" | "View Analysis" | null;
  taskActionLabel: "Assign Tasks" | "Do Task" | "View Task" | null;
};

export default function FaultOrderDetailClient({
  currentUserId,
  faultOrderId,
  initialFaultBatches,
  initialProcessingOrders,
  canCreateProcessOrder,
  analysisActionLabel,
  taskActionLabel,
}: FaultOrderDetailClientProps) {
  const router = useRouter();
  const [selectedBatchIds, setSelectedBatchIds] = useState<Set<number>>(
    new Set(),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Filter the raw data directly from the server props
  const unassignedBatches = useMemo(
    () => initialFaultBatches.filter((b) => !b.faultBatchProcessOrderId),
    [initialFaultBatches],
  );
  const assignedBatches = useMemo(
    () => initialFaultBatches.filter((b) => b.faultBatchProcessOrderId),
    [initialFaultBatches],
  );
  const toggleBatch = (batchId: number) => {
    setSelectedBatchIds((prev) => {
      const next = new Set(prev);
      if (next.has(batchId)) {
        next.delete(batchId);
      } else {
        next.add(batchId);
      }
      return next;
    });
  };

  // 2. Inject Actions into Headers
  const faultBatchColumnsWithToggle = useMemo<Column<FaultBatch>[]>(
    () => [
      ...detailFaultBatchColumns,
      {
        label: "Actions",
        key: "id",
        width: 90,
        render: (_, row) => {
          // if (row.handlingStatus === "RESOLVED") {
          //   return (
          //     <FontAwesomeIcon
          //       icon={faTrashCan}
          //       className="cursor-not-allowed text-gray-300 dark:text-gray-600"
          //     />
          //   );
          // }
          return (
            <div className="flex h-full w-full items-center justify-center">
              <Checkbox
                checked={selectedBatchIds.has(row.id)}
                onChange={() => toggleBatch(row.id)}
              />
            </div>
          );
        },
      },
    ],
    [selectedBatchIds],
  );

  const processingOrderColumnsWithActions = useMemo<
    Column<FaultBatchProcessOrderSummary>[]
  >(
    () => [
      ...detailProcessingOrderColumns,
      ...(analysisActionLabel || taskActionLabel
        ? [
            {
              label: "Action",
              key: "id",
              autoHeight: true,
              width: 250,
              render: (_, row) => (
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {analysisActionLabel && (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() =>
                        router.push(
                          `/fault-order/details/${faultOrderId}/process-order/${row.id}`,
                        )
                      }
                    >
                      {analysisActionLabel}
                    </Button>
                  )}
                  {taskActionLabel && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        router.push(
                          `/fault-order/details/${faultOrderId}/assign-task/${row.id}`,
                        )
                      }
                    >
                      {taskActionLabel}
                    </Button>
                  )}
                </div>
              ),
            } as Column<FaultBatchProcessOrderSummary>,
          ]
        : []),
    ],
    [analysisActionLabel, faultOrderId, router, taskActionLabel],
  );

  // 3. Submitting to Server
  const handleCreateProcessOrder = async () => {
    if (!canCreateProcessOrder) return;
    const selectedIds = Array.from(selectedBatchIds);
    if (!selectedIds.length) {
      toast.error("Please select at least one pending fault batch.");
      return;
    }
    if (!currentUserId) {
      toast.error("Session error: Cannot determine user.");
      return;
    }
    try {
      setIsSubmitting(true);
      const data = await createFaultBatchProcessOrderAction({
        faultOrderId,
        creatorUserId: currentUserId,
        status: FaultProcessOrderStatus.IN_PROGRESS,
        type: FaultProcessOrderType.OTHER,
        faultBatchIds: selectedIds,
      });

      toast.success("Investigation created successfully.");
      setSelectedBatchIds(new Set());
      router.refresh();
      router.push(
        `/fault-order/details/${faultOrderId}/process-order/${data.id}`,
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message ?? "Failed to create process order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="default-card p-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="mb-3 font-medium text-black dark:text-white">
              Fault Batches
            </h2>
            {canCreateProcessOrder && (
              <Button
                onClick={handleCreateProcessOrder}
                disabled={selectedBatchIds.size === 0 || isSubmitting}
                size="sm"
              >
                {isSubmitting ? "Handling..." : "Handle Selected"}
              </Button>
            )}
          </div>
          <CustomizableTable
            headers={faultBatchColumnsWithToggle}
            data={unassignedBatches}
          />
        </div>

        <div className="default-card p-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="mb-3 font-medium text-black dark:text-white">
              Assigned Fault Batches
            </h2>
          </div>
          <CustomizableTable
            headers={detailAssignedFaultBatchColumns}
            data={assignedBatches}
          />
        </div>
      </div>

      <ComponentCard title="Processing Order List">
        <CustomizableTable
          headers={processingOrderColumnsWithActions}
          data={initialProcessingOrders}
        />
      </ComponentCard>
    </>
  );
}
