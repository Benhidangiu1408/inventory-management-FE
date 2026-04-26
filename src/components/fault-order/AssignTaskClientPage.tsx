"use client";

import { useCallback, useMemo, useTransition } from "react";
import toast from "react-hot-toast";
import {
  getTaskColumns,
  getTaskFaultBatchColumns,
} from "@/components/table/CustomizableTableHeader";
import {
  assignTaskToFaultBatchAction,
  markFaultBatchesFixedAction,
  updateTaskStatusAction,
} from "@/actions/faultHandling";
import type { User } from "@/interfaces/userManagementType";
import {
  type FaultBatchProcessOrder,
  TaskStatus,
  FaultTask,
  TaskBatchResponse,
  FaultBatch,
  FaultBatchStatus,
  FaultProcessOrderStatus,
} from "@/interfaces/inventoryManagementType";
import CustomizableTable from "@/components/table/CustomizableTable";
import ComponentCard from "@/default_components/common/ComponentCard";
import AddTaskForm from "@/components/fault-order/AddTaskForm";
import { useRouter } from "next/navigation";

type AssignTaskClientPageProps = {
  faultOrderId: number;
  currentUserId: number;
  taskAssignerUserId: number | null;
  initialProcessOrderData: FaultBatchProcessOrder;
  initialOwners: User[];
};

export default function AssignTaskClientPage({
  currentUserId,
  taskAssignerUserId,
  initialProcessOrderData,
  initialOwners,
}: AssignTaskClientPageProps) {
  // State manage
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Permission
  const canAssignTasks = useMemo(() => {
    return (
      currentUserId === taskAssignerUserId &&
      initialProcessOrderData.status == FaultProcessOrderStatus.APPROVED
    );
  }, [currentUserId, initialProcessOrderData.status, taskAssignerUserId]);

  const handleBatchStatusChange = useCallback(
    (batchId: number, status: FaultBatchStatus) => {
      startTransition(async () => {
        try {
          await markFaultBatchesFixedAction({
            batchId,
            status,
          });
          router.refresh();
          toast.success("Batch Status update successfully");
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          toast.error(error.message ?? "Failed to update batch status.");
        }
      });
    },
    [router],
  );

  const handleTaskAssign = useCallback(
    (batchId: number, taskId: number) => {
      startTransition(async () => {
        try {
          await assignTaskToFaultBatchAction(batchId, taskId);
          router.refresh();
          toast.success("Assign batch to task successfully.");
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          toast.error(error.message ?? "Failed to assign task.");
        }
      });
    },
    [router],
  );

  const handleTaskStatusChange = useCallback(
    (taskId: number, newStatus: TaskStatus) => {
      startTransition(async () => {
        try {
          await updateTaskStatusAction({ taskId: taskId, status: newStatus });
          toast.success("Task status update successfully");
          router.refresh();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          toast.error(error.message ?? "Failed to update task status.");
        }
      });
    },
    [router],
  );
  const taskColumns = getTaskColumns(
    currentUserId,
    isPending,
    canAssignTasks,
    initialProcessOrderData.status == FaultProcessOrderStatus.APPROVED,
    handleTaskStatusChange,
  );
  const taskBatchData: TaskBatchResponse[] = useMemo(() => {
    return (
      initialProcessOrderData.faultBatches?.map((batch: FaultBatch) => {
        const correspondTask = initialProcessOrderData.tasks?.find(
          (t) => t.id == batch.taskId,
        );
        return {
          ...batch,
          taskId: batch.taskId,
          taskName: correspondTask?.task,
          assignedUserId: correspondTask?.assignedUserId,
          assignedUserUsername: correspondTask?.assignedUsername,
        } as TaskBatchResponse;
      }) ?? []
    );
  }, [initialProcessOrderData]);

  const TaskFaultBatchColumns = getTaskFaultBatchColumns(
    currentUserId,
    canAssignTasks,
    initialProcessOrderData.status == FaultProcessOrderStatus.APPROVED,
    initialProcessOrderData.tasks as FaultTask[],
    handleTaskAssign,
    handleBatchStatusChange,
    isPending,
  );

  return (
    <div className="flex flex-col gap-6">
      <ComponentCard title="Task Managment">
        <AddTaskForm
          canAssignTasks={canAssignTasks}
          processOrderId={initialProcessOrderData.id}
          owners={initialOwners}
        />
        <CustomizableTable
          headers={taskColumns}
          data={initialProcessOrderData.tasks as FaultTask[]}
        />
      </ComponentCard>

      <ComponentCard title="Assign Batch">
        <CustomizableTable
          headers={TaskFaultBatchColumns}
          data={taskBatchData}
        />
      </ComponentCard>
    </div>
  );
}
