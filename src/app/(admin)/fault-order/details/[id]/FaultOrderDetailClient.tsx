"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

import CustomizableTable, {
  type Column,
} from "@/components/table/CustomizableTable";
import {
  assignedFaultBatchColumns,
  processingOrderColumns,
  type AssignedFaultBatch,
  type FaultBatch,
  type ProcessingOrder,
} from "@/components/table/CustomizableTableHeader";
import Button from "@/default_components/ui/button/Button";
import {
  createFaultBatchProcessOrderAction,
  getFaultOrderAction,
} from "@/actions/faultHandling";
import {
  FaultProcessOrderStatus,
  FaultProcessOrderType,
  type FaultOrderDetail,
} from "@/interfaces/inventoryManagementType";

type FaultOrderDetailClientProps = {
  currentUserId: number | null;
  faultOrderId: number;
  routeOrderId: string;
  initialFaultBatchRows: FaultBatch[];
  initialAssignedFaultBatchRows: AssignedFaultBatch[];
  initialProcessingOrderRows: ProcessingOrder[];
};

export default function FaultOrderDetailClient({
  currentUserId,
  faultOrderId,
  routeOrderId,
  initialFaultBatchRows,
  initialAssignedFaultBatchRows,
  initialProcessingOrderRows,
}: FaultOrderDetailClientProps) {
  const router = useRouter();
  const toFaultBatchStatus = (
    handlingStatus?: string | null,
  ): FaultBatch["status"] => {
    if (handlingStatus === "RESOLVED") return "Completed";
    if (handlingStatus === "PROCESSING") return "In progress";
    return "Pending";
  };

  const [faultBatchRows, setFaultBatchRows] = useState(initialFaultBatchRows);
  const [assignedFaultBatchRows, setAssignedFaultBatchRows] = useState(
    initialAssignedFaultBatchRows,
  );
  const [processingOrderRows, setProcessingOrderRows] = useState(
    initialProcessingOrderRows,
  );
  const [selectedBatchIds, setSelectedBatchIds] = useState<Set<number>>(
    new Set(),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pendingBatchRows = useMemo(
    () =>
      faultBatchRows.filter(
        (batch) =>
          batch.status.toLowerCase() === "pending" &&
          !assignedFaultBatchRows.some((assigned) => assigned.id === batch.id),
      ),
    [faultBatchRows, assignedFaultBatchRows],
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

  const faultBatchColumnsWithToggle = useMemo<Column<FaultBatch>[]>(
    () => [
      { label: "ID", key: "id" },
      { label: "Fault Batch Code", key: "code" },
      { label: "Date", key: "date" },
      { label: "Status", key: "status" },
      {
        label: "Actions",
        key: "checked",
        render: (_, row) => {
          if (row.status.toLowerCase() !== "pending") {
            return (
              <FontAwesomeIcon
                icon={faTrashCan}
                className="cursor-not-allowed text-gray-300"
              />
            );
          }

          return (
            <input
              type="checkbox"
              checked={selectedBatchIds.has(row.id)}
              onChange={() => toggleBatch(row.id)}
            />
          );
        },
      },
    ],
    [selectedBatchIds],
  );

  const handleCreateProcessOrder = async () => {
    const selectedIds = Array.from(selectedBatchIds);
    if (!selectedIds.length) {
      toast.error("Please select at least one pending fault batch.");
      return;
    }

    if (!currentUserId || currentUserId <= 0) {
      toast.error("Cannot determine current user.");
      return;
    }

    setIsSubmitting(true);

    const { data, error } = await createFaultBatchProcessOrderAction({
      faultOrderId,
      creatorUserId: currentUserId,
      status: FaultProcessOrderStatus.IN_PROGRESS,
      type: FaultProcessOrderType.OTHER,
      faultBatchIds: selectedIds,
    });

    if (error || !data?.id) {
      setIsSubmitting(false);
      toast.error(error ?? "Failed to create process order.");
      return;
    }

    const latest = await getFaultOrderAction(faultOrderId);
    if (latest.data) {
      const refreshed: FaultOrderDetail = latest.data;

      if (refreshed.faultBatches) {
        const updatedFaultBatchRows = refreshed.faultBatches.map((batch) => ({
          id: batch.id,
          code: batch.code ?? `FB-${batch.id}`,
          date: batch.createdAt
            ? new Intl.DateTimeFormat("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }).format(new Date(batch.createdAt))
            : "-",
          status: toFaultBatchStatus(batch.handlingStatus),
          checked: batch.handlingStatus === "RESOLVED",
        }));
        setFaultBatchRows(updatedFaultBatchRows);
      }
    }

    const selectedBatchLookup = new Set(selectedIds);
    const selectedRows = faultBatchRows.filter((row) =>
      selectedBatchLookup.has(row.id),
    );

    setAssignedFaultBatchRows((prev) => [
      ...prev,
      ...selectedRows.map((row) => ({
        id: row.id,
        code: row.code,
        orderId: data.id,
        date: row.date,
        status: "In progress" as AssignedFaultBatch["status"],
        checked: false,
      })),
    ]);

    setProcessingOrderRows((prev) => [
      ...prev,
      {
        orderId: data.id,
        orderType: "Other",
        action: "",
      },
    ]);

    setSelectedBatchIds(new Set());
    setIsSubmitting(false);

    router.push(
      `/fault-order/details/${routeOrderId}/process-order/${data.id}`,
    );
  };

  return (
    <div className="flex justify-between gap-6">
      <div className="flex flex-3 flex-col gap-6">
        <div className="grid grid-cols-2">
          <div className="rounded-2xl border border-gray-200 p-6">
            <div className="my-3 flex items-center justify-between">
              <h2 className="mb-3 font-medium">Fault Batches</h2>
              <Button
                onClick={handleCreateProcessOrder}
                disabled={!pendingBatchRows.length || isSubmitting}
              >
                {isSubmitting ? "Handling..." : "Handle"}
              </Button>
            </div>
            <CustomizableTable
              headers={faultBatchColumnsWithToggle}
              data={faultBatchRows}
            />
          </div>
          <div className="rounded-2xl border border-gray-200 p-6">
            <div className="my-3 flex items-center justify-between">
              <h2 className="mb-3 font-medium">Assigned Fault Batches</h2>
            </div>
            <CustomizableTable
              headers={assignedFaultBatchColumns}
              data={assignedFaultBatchRows}
            />
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 p-6">
          <h2 className="mb-3 font-medium">Processing Order List</h2>
          <CustomizableTable
            headers={processingOrderColumns}
            data={processingOrderRows}
          />
        </div>
      </div>
    </div>
  );
}
