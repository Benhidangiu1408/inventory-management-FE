"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  InventoryCheckSheetData,
  SheetStatus,
} from "@/interfaces/inventoryManagementType";
import Button from "@/default_components/ui/button/Button";
import { CheckCircle, Play, Save, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import AccordionTable from "./table/AccordionTable";
import {
  getIcSheetBatchSubheaders,
  icSheetBatchSubheadersReadOnly,
  icSheetProductHeaders,
} from "./table/AccordionTableHeader";
import { useConfirmModal } from "@/hooks/useConfirmModal";
import {
  inventoryCheckApproveAction,
  inventoryCheckCompleteAction,
  inventoryCheckRejectAction,
  inventoryCheckStartAction,
  inventoryCheckSubmitAction,
} from "@/actions/inventory-check";

export function InventoryCheckWorkSheet({
  initialData,
  currentUser,
}: {
  initialData: InventoryCheckSheetData | null;
  currentUser: number;
}) {
  const { id } = useParams();
  const sheetId = Number(id);
  const [data, setData] = useState<InventoryCheckSheetData | null>(initialData);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { confirm, ConfirmationModal } = useConfirmModal();

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  // Updates on every keystroke (Drafting)
  const handleLocalChange = useCallback(
    (
      detailId: number,
      field: "draftQuantity" | "draftFaults",
      value: number | boolean,
    ) => {
      setData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          products: prev.products.map((group) => ({
            ...group,
            batches: group.batches.map((batch) =>
              batch.detailId === detailId
                ? { ...batch, [field]: value }
                : batch,
            ),
          })),
        };
      });
    },
    [],
  );

  // Updates when API succeeds (Confirming)
  const handleBatchSave = useCallback(
    async (detailId: number, scannedQuantity: number, hasFaults: boolean) => {
      if (currentUser !== data?.header.assigneeId) {
        toast.error("You're not the assigned employee!");
        return;
      }
      try {
        setLoading(true);
        await inventoryCheckSubmitAction({
          detailId,
          scannedQuantity,
          hasFaults,
        });
        // If the API succeeds, update the local React state
        setData((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            products: prev.products.map((group) => ({
              ...group,
              batches: group.batches.map((batch) => {
                if (batch.detailId === detailId) {
                  return {
                    ...batch,
                    scannedQuantity: scannedQuantity,
                    hasFaults: hasFaults,
                    draftQuantity: undefined, // Clear drafts upon save
                    draftFaults: undefined,
                  };
                }
                return batch;
              }),
            })),
          };
        });
        toast.success("Inventory Check Detail Submitted");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error(error.message ?? "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    },
    [currentUser, data?.header.assigneeId],
  );

  // Generate Headers with the callback closure
  const editableHeaders = useMemo(
    () =>
      getIcSheetBatchSubheaders(loading, handleBatchSave, handleLocalChange),
    [loading, handleBatchSave, handleLocalChange],
  );
  const { header, products } = data as InventoryCheckSheetData;

  // Action
  const handleStart = useCallback(async () => {
    if (currentUser !== initialData?.header.assigneeId) {
      toast.error("You're not the assigned employee!");
      return;
    }
    try {
      setLoading(true);
      await inventoryCheckStartAction(sheetId);
      toast.success("Inventory Check Started!");
      router.refresh();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message ?? "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sheetId]);
  const handleComplete = useCallback(async () => {
    const ok = await confirm({
      title: "Confirm Stocktaking Completion",
      message:
        "Are you sure you want to finalize this stock check?\nOnce finalized, the stock results will be locked and cannot be modified.",
    });
    if (!ok) return;
    try {
      setLoading(true);
      await inventoryCheckCompleteAction(sheetId);
      toast.success("Inventory Check Completed! Ready for review.");
      router.replace("/warehouse-management/inventory-check");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message ?? "An unexpected error occurred");
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sheetId]);
  const handleApprove = useCallback(async () => {
    if (currentUser !== initialData?.header.creatorId) {
      toast.error("Only the manager can approve!");
      return;
    }
    const ok = await confirm({
      title: "Approve Inventory Check Result",
      message:
        "Once approved, the stock results will be stored and use for future report.",
    });
    if (!ok) return;
    try {
      setLoading(true);
      await inventoryCheckApproveAction(sheetId, Number(currentUser));
      toast.success("Sheet Approved");
      router.replace("/warehouse-management/inventory-check");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message ?? "An unexpected error occurred");
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sheetId]);
  const handleReject = useCallback(async () => {
    if (currentUser !== initialData?.header.creatorId) {
      toast.error("Only the manager can reject!");
      return;
    }
    const ok = await confirm({
      title: "Reject Inventory Check Result",
      message:
        "Once rejected, the stock results will be put away and the employee will need to recheck.",
    });
    if (!ok) return;
    try {
      setLoading(true);
      await inventoryCheckRejectAction(sheetId, currentUser);
      toast.success("Sheet Rejected");
      router.replace("/warehouse-management/inventory-check");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message ?? "An unexpected error occurred");
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sheetId]);

  // --- STATE: NOT STARTED ---
  if (header.status === SheetStatus.CREATED) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center space-y-6 text-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Ready to Start?</h2>
          <p className="mt-2 max-w-md text-gray-500">
            Starting this check will freeze the current system inventory counts
            for comparison. Only click this when you are physically ready to
            count.
          </p>
        </div>

        {
          <Button
            size="md"
            onClick={handleStart}
            disabled={loading}
            startIcon={<Play size={18} />}
          >
            Start Inventory Check
          </Button>
        }
      </div>
    );
  }
  // State: Complete
  if (header.status === SheetStatus.COMPLETED) {
    return (
      <div className="space-y-6">
        {ConfirmationModal}
        <div className="flex items-center justify-between rounded-lg border border-blue-100 bg-blue-50 p-4">
          <div>
            <h2 className="text-lg font-bold text-blue-900">Review Required</h2>
            <p className="text-sm text-blue-700">
              Check completed. Please review variances and approve or reject.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="danger"
              onClick={handleReject}
              disabled={loading}
              startIcon={<XCircle size={18} />}
            >
              Reject
            </Button>
            <Button
              variant="success"
              onClick={handleApprove}
              disabled={loading}
              startIcon={<CheckCircle size={18} />}
            >
              Approve
            </Button>
          </div>
        </div>

        {/* Read Only Table */}
        <AccordionTable
          loading={loading}
          headers={icSheetProductHeaders}
          subTableHeaders={icSheetBatchSubheadersReadOnly}
          subTableKey={"batches"}
          data={products}
        />
      </div>
    );
  }
  // State approve/reject
  if (
    header.status === SheetStatus.APPROVED ||
    header.status === SheetStatus.REJECTED
  ) {
    const isApproved = header.status === SheetStatus.APPROVED;
    return (
      <div className="space-y-6">
        <div
          className={`flex items-center gap-3 rounded-lg border p-4 ${isApproved ? "bg-success-50 border-success-100" : "bg-error-50 border-error-100"}`}
        >
          {isApproved ? (
            <CheckCircle className="text-success-600" />
          ) : (
            <XCircle className="text-error-600" />
          )}
          <div>
            <h2
              className={`font-bold ${isApproved ? "text-success-900" : "text-error-900"}`}
            >
              {isApproved
                ? "Inventory Check Approved"
                : "Inventory Check Rejected"}
            </h2>
            <p
              className={`text-sm ${isApproved ? "text-success-700" : "text-error-700"}`}
            >
              This sheet is closed and cannot be modified.
            </p>
          </div>
        </div>
        <AccordionTable
          headers={icSheetProductHeaders}
          subTableHeaders={icSheetBatchSubheadersReadOnly}
          subTableKey={"batches"}
          data={products}
        />
      </div>
    );
  }

  // --- STATE: IN PROGRESS (The Worksheet) ---
  return (
    <div className="space-y-6">
      {ConfirmationModal}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{header.code}</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
            In Progress
          </span>
          <Button
            size="sm"
            disabled={loading}
            onClick={handleComplete}
            startIcon={<Save size={18} />}
          >
            Complete Check
          </Button>
        </div>
      </div>

      {/* The Rows Table */}
      <AccordionTable
        loading={loading || !data}
        headers={icSheetProductHeaders}
        subTableHeaders={editableHeaders}
        subTableKey={"batches"}
        data={products}
        getRowId={(params) => params.data.productSku}
        subTableGetRowId={(params) => String(params.data.detailId)}
      />
    </div>
  );
}
