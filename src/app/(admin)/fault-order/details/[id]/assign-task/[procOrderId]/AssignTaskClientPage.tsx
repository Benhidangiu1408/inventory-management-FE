"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import GeneralInfoSection from "@/components/GeneralInformation";
import Select from "@/default_components/form/Select";
import type { Column } from "@/components/table/CustomizableTable";
import {
  faultBatchColumns,
  type FaultBatch as FaultBatchRow,
} from "@/components/table/CustomizableTableHeader";
import {
  assignTaskToFaultBatchAction,
  createTasksForProcessOrderAction,
  getFaultOrderAction,
  markFaultBatchesFixedAction,
  updateFaultBatchProcessOrderAction,
  updateFaultOrderStatusAction,
  updateTasksStatusAction,
} from "@/actions/faultHandling";
import type { User } from "@/interfaces/userManagementType";
import {
  FaultOrderStatus,
  type FaultBatchProcessOrder,
  FaultProcessOrderStatus,
  TaskStatus,
} from "@/interfaces/inventoryManagementType";
import AssignTaskActionSection from "@/components/fault-order/AssignTaskActionSection";
import AssignTaskProcessingSection from "@/components/fault-order/AssignTaskProcessingSection";
import {
  BATCH_STATUS_OPTIONS,
  buildFaultBatchRows,
  buildTaskRows,
  formatDueDateTimeForApi,
  formatDisplayDate,
  formatDisplayDateTime,
  getDefaultNewTaskDraft,
  mapBatchLabelToStatus,
  mapProcessStatusToLabel,
  mapProcessTypeToLabel,
  mapTaskLabelToStatus,
  mapTaskStatusToLabel,
  TASK_STATUS_LABEL_OPTIONS,
  type TaskTableRow,
} from "./assignTaskUtils";

type AssignTaskClientPageProps = {
  faultOrderId: number;
  processOrderId: number;
  currentUserId: number | null;
  taskAssignerUserId: number | null;
  initialProcessOrderData: FaultBatchProcessOrder | null;
  initialProcessOrderError: string | null;
  initialOwners: User[];
  initialOwnersError: string | null;
};

export default function AssignTaskClientPage({
  faultOrderId,
  processOrderId,
  currentUserId,
  taskAssignerUserId,
  initialProcessOrderData,
  initialProcessOrderError,
  initialOwners,
  initialOwnersError,
}: AssignTaskClientPageProps) {
  const [processOrderData, setProcessOrderData] = useState(
    initialProcessOrderData,
  );
  const [faultBatchRows, setFaultBatchRows] = useState<FaultBatchRow[]>(() =>
    buildFaultBatchRows(
      initialProcessOrderData?.faultBatches,
      initialProcessOrderData?.tasks,
    ),
  );
  const [updatingBatchIds, setUpdatingBatchIds] = useState<number[]>([]);
  const [taskRows, setTaskRows] = useState<TaskTableRow[]>(() =>
    buildTaskRows(initialProcessOrderData?.tasks),
  );
  const [updatingTaskIds, setUpdatingTaskIds] = useState<number[]>([]);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isSavingTask, setIsSavingTask] = useState(false);
  const [newTaskDraft, setNewTaskDraft] = useState(getDefaultNewTaskDraft);

  useEffect(() => {
    if (initialOwnersError) {
      toast.error(initialOwnersError);
    }
  }, [initialOwnersError]);

  const canAssignTasks = useMemo(() => {
    if (!currentUserId || currentUserId <= 0) {
      return false;
    }

    if (!taskAssignerUserId || taskAssignerUserId <= 0) {
      return false;
    }

    return currentUserId === taskAssignerUserId;
  }, [currentUserId, taskAssignerUserId]);

  const taskOwnerByTaskId = useMemo(() => {
    const ownerMap = new Map<number, number>();

    taskRows.forEach((task) => {
      if (
        task.id > 0 &&
        task.assignedUserId !== null &&
        task.assignedUserId > 0
      ) {
        ownerMap.set(task.id, task.assignedUserId);
      }
    });

    return ownerMap;
  }, [taskRows]);

  const canCurrentUserUpdateTask = useCallback(
    (taskId: number) => {
      if (!currentUserId || currentUserId <= 0 || taskId <= 0) {
        return false;
      }

      return taskOwnerByTaskId.get(taskId) === currentUserId;
    },
    [currentUserId, taskOwnerByTaskId],
  );

  const canCurrentUserUpdateBatch = useCallback(
    (batch: FaultBatchRow) => {
      if (!currentUserId || currentUserId <= 0) {
        return false;
      }

      const mappedTaskId = Number(batch.taskId);
      if (!Number.isInteger(mappedTaskId) || mappedTaskId <= 0) {
        return false;
      }

      return taskOwnerByTaskId.get(mappedTaskId) === currentUserId;
    },
    [currentUserId, taskOwnerByTaskId],
  );

  const syncFaultOrderStatusFromProcessOrders = useCallback(async () => {
    const { data: faultOrder, error: faultOrderError } =
      await getFaultOrderAction(faultOrderId);

    if (faultOrderError || !faultOrder) {
      if (faultOrderError) {
        toast.error(faultOrderError);
      }
      return;
    }

    const processOrders = faultOrder.processOrders ?? [];
    if (!processOrders.length) {
      return;
    }

    const nextFaultOrderStatus = processOrders.every(
      (order) => order.status === FaultProcessOrderStatus.COMPLETED,
    )
      ? FaultOrderStatus.COMPLETED
      : FaultOrderStatus.IN_PROGRESS;

    if (faultOrder.status === nextFaultOrderStatus) {
      return;
    }

    const { error: updateError } = await updateFaultOrderStatusAction(
      faultOrderId,
      nextFaultOrderStatus,
    );

    if (updateError) {
      toast.error(updateError);
    }
  }, [faultOrderId]);

  const updateProcessOrderStatus = useCallback(
    async (nextStatus: FaultProcessOrderStatus) => {
      if (!processOrderData || processOrderData.status === nextStatus) {
        return true;
      }

      const { data, error: updateError } =
        await updateFaultBatchProcessOrderAction(processOrderId, {
          status: nextStatus,
          type: processOrderData.type,
          note: processOrderData.note ?? undefined,
          rootCause: processOrderData.rootCause ?? null,
          whatHappened: processOrderData.whatHappened ?? null,
          impact: processOrderData.impact ?? null,
          questions: (processOrderData.questions ?? [])
            .map((question) => ({
              question: question.question,
              answer: question.answer ?? null,
            }))
            .filter((question) => question.question.trim().length > 0),
        });

      if (updateError) {
        toast.error(updateError);
        return false;
      }

      setProcessOrderData((prev) => {
        if (!prev) {
          return prev;
        }

        return {
          ...prev,
          ...(data ?? {}),
          status: data?.status ?? nextStatus,
        };
      });

      await syncFaultOrderStatusFromProcessOrders();

      return true;
    },
    [processOrderData, processOrderId, syncFaultOrderStatusFromProcessOrders],
  );

  const handleStartNewTask = useCallback(() => {
    if (!canAssignTasks) {
      toast.error(
        "Only the assigned task assigner can create tasks for this process order.",
      );
      return;
    }

    setIsAddingTask(true);
    setNewTaskDraft(getDefaultNewTaskDraft());
  }, [canAssignTasks]);

  const handleCancelNewTask = useCallback(() => {
    setIsAddingTask(false);
    setNewTaskDraft(getDefaultNewTaskDraft());
  }, []);

  const handleConfirmNewTask = useCallback(async () => {
    if (!canAssignTasks) {
      toast.error(
        "Only the assigned task assigner can create tasks for this process order.",
      );
      return;
    }

    if (!newTaskDraft.task.trim()) {
      toast.error("Task description is required.");
      return;
    }

    if (!newTaskDraft.assignedUserId) {
      toast.error("Owner is required.");
      return;
    }

    setIsSavingTask(true);
    try {
      const selectedOwnerName =
        initialOwners.find(
          (owner) => String(owner.id) === newTaskDraft.assignedUserId,
        )?.username ?? "-";

      const { data: created, error: createTaskError } =
        await createTasksForProcessOrderAction(processOrderId, [
          {
            task: newTaskDraft.task.trim(),
            due_date: formatDueDateTimeForApi(newTaskDraft.dueDate),
            status: newTaskDraft.status,
            assignedUser: { id: Number(newTaskDraft.assignedUserId) },
          },
        ]);

      if (createTaskError || !created) {
        throw new Error(createTaskError ?? "Failed to create task.");
      }

      const newRows: TaskTableRow[] = created.map((task) => ({
        id: task.id ?? -1,
        task: task.task ?? "-",
        owner: task.assignedUsername ?? selectedOwnerName,
        assignedUserId:
          task.assignedUserId ?? Number(newTaskDraft.assignedUserId),
        dueDate: formatDisplayDateTime(task.dueDate),
        status: mapTaskStatusToLabel(task.status),
      }));

      const hadNoTasksBefore = taskRows.length === 0;

      setTaskRows((prev) => [...prev, ...newRows]);

      if (hadNoTasksBefore && newRows.length > 0) {
        await updateProcessOrderStatus(FaultProcessOrderStatus.IN_PROGRESS);
      }

      setIsAddingTask(false);
      setNewTaskDraft(getDefaultNewTaskDraft());
      toast.success("Task created successfully.");
    } catch (saveError: unknown) {
      toast.error(
        saveError instanceof Error
          ? saveError.message
          : "Failed to create task.",
      );
    } finally {
      setIsSavingTask(false);
    }
  }, [
    canAssignTasks,
    initialOwners,
    newTaskDraft,
    processOrderId,
    taskRows.length,
    updateProcessOrderStatus,
  ]);

  const handleBatchStatusChange = useCallback(
    async (
      batchId: number,
      nextStatus: FaultBatchRow["status"],
      previousStatus: FaultBatchRow["status"],
    ) => {
      if (nextStatus === previousStatus) {
        return;
      }

      const targetBatch = faultBatchRows.find((row) => row.id === batchId);
      if (!targetBatch || !canCurrentUserUpdateBatch(targetBatch)) {
        toast.error(
          "Only the selected task owner can update this batch status.",
        );
        return;
      }

      setFaultBatchRows((prevRows) =>
        prevRows.map((row) =>
          row.id === batchId
            ? {
                ...row,
                status: nextStatus,
                checked: nextStatus === "Completed",
              }
            : row,
        ),
      );

      setUpdatingBatchIds((prev) =>
        prev.includes(batchId) ? prev : [...prev, batchId],
      );

      try {
        const { error: updateError } = await markFaultBatchesFixedAction([
          {
            id: batchId,
            handlingStatus: mapBatchLabelToStatus(nextStatus),
          },
        ]);

        if (updateError) {
          throw new Error(updateError);
        }
      } catch (updateError: unknown) {
        setFaultBatchRows((prevRows) =>
          prevRows.map((row) =>
            row.id === batchId
              ? {
                  ...row,
                  status: previousStatus,
                  checked: previousStatus === "Completed",
                }
              : row,
          ),
        );

        toast.error(
          updateError instanceof Error
            ? updateError.message
            : "Failed to update batch status.",
        );
      } finally {
        setUpdatingBatchIds((prev) => prev.filter((id) => id !== batchId));
      }
    },
    [canCurrentUserUpdateBatch, faultBatchRows],
  );

  const handleBatchTaskChange = useCallback(
    async (batchId: number, nextTaskId: string, previousTaskId: string) => {
      if (!canAssignTasks) {
        toast.error(
          "Only the assigned task assigner can assign tasks to batches.",
        );
        return;
      }

      if (nextTaskId === previousTaskId) {
        return;
      }

      const nextTaskName =
        taskRows.find((task) => String(task.id) === nextTaskId)?.task ?? "";

      setFaultBatchRows((prevRows) =>
        prevRows.map((row) =>
          row.id === batchId
            ? {
                ...row,
                taskId: nextTaskId,
                taskName: nextTaskName,
              }
            : row,
        ),
      );

      setUpdatingBatchIds((prev) =>
        prev.includes(batchId) ? prev : [...prev, batchId],
      );

      try {
        const taskIdNumber = nextTaskId ? Number(nextTaskId) : null;
        const { data, error } = await assignTaskToFaultBatchAction(
          batchId,
          taskIdNumber,
        );

        if (error || !data) {
          throw new Error(error ?? "Failed to assign task.");
        }

        setProcessOrderData((prev) => {
          if (!prev) {
            return prev;
          }

          const updatedBatches = (prev.faultBatches ?? []).map((batch) =>
            batch.id === batchId
              ? { ...batch, taskId: data.taskId ?? null }
              : batch,
          );

          return {
            ...prev,
            faultBatches: updatedBatches,
          };
        });

        toast.success("Task assignment updated.");
      } catch (error: unknown) {
        const previousTaskName =
          taskRows.find((task) => String(task.id) === previousTaskId)?.task ??
          "";

        setFaultBatchRows((prevRows) =>
          prevRows.map((row) =>
            row.id === batchId
              ? {
                  ...row,
                  taskId: previousTaskId,
                  taskName: previousTaskName,
                }
              : row,
          ),
        );

        toast.error(
          error instanceof Error ? error.message : "Failed to assign task.",
        );
      } finally {
        setUpdatingBatchIds((prev) => prev.filter((id) => id !== batchId));
      }
    },
    [canAssignTasks, taskRows],
  );

  const handleTaskStatusChange = useCallback(
    async (
      taskId: number,
      nextStatus: TaskTableRow["status"],
      previousStatus: TaskTableRow["status"],
    ) => {
      if (nextStatus === previousStatus) {
        return;
      }

      if (taskId <= 0) {
        toast.error("This task cannot be updated because it has no valid id.");
        return;
      }

      if (!canCurrentUserUpdateTask(taskId)) {
        toast.error("Only the task owner can update task status.");
        return;
      }

      setTaskRows((prevRows) =>
        prevRows.map((row) =>
          row.id === taskId
            ? {
                ...row,
                status: nextStatus,
              }
            : row,
        ),
      );

      setUpdatingTaskIds((prev) =>
        prev.includes(taskId) ? prev : [...prev, taskId],
      );

      try {
        const { error: updateError } = await updateTasksStatusAction({
          taskIds: [taskId],
          status: mapTaskLabelToStatus(nextStatus),
        });

        if (updateError) {
          throw new Error(updateError);
        }

        const nextTaskRows = taskRows.map((row) =>
          row.id === taskId
            ? {
                ...row,
                status: nextStatus,
              }
            : row,
        );

        const areAllTasksCompleted =
          nextTaskRows.length > 0 &&
          nextTaskRows.every(
            (row) => mapTaskLabelToStatus(row.status) === TaskStatus.COMPLETED,
          );

        if (areAllTasksCompleted) {
          await updateProcessOrderStatus(FaultProcessOrderStatus.COMPLETED);
        } else {
          await updateProcessOrderStatus(FaultProcessOrderStatus.IN_PROGRESS);
        }
      } catch (updateError: unknown) {
        setTaskRows((prevRows) =>
          prevRows.map((row) =>
            row.id === taskId
              ? {
                  ...row,
                  status: previousStatus,
                }
              : row,
          ),
        );

        toast.error(
          updateError instanceof Error
            ? updateError.message
            : "Failed to update task status.",
        );
      } finally {
        setUpdatingTaskIds((prev) => prev.filter((id) => id !== taskId));
      }
    },
    [canCurrentUserUpdateTask, taskRows, updateProcessOrderStatus],
  );

  const faultBatchColumnsWithStatusSelect = useMemo<
    Column<FaultBatchRow>[]
  >(() => {
    const taskOptions = taskRows.map((task) => ({
      value: String(task.id),
      label: task.task,
    }));

    return faultBatchColumns.reduce<Column<FaultBatchRow>[]>((acc, column) => {
      if (column.key === "status") {
        acc.push({
          ...column,
          render: (value, row) => (
            <Select
              options={BATCH_STATUS_OPTIONS.map((option) => ({
                value: option.value,
                label: option.label,
              }))}
              disablePlaceholderOpt={false}
              placeholder="Select status"
              value={value as string}
              onChange={(event) =>
                handleBatchStatusChange(
                  row.id,
                  event.target.value as FaultBatchRow["status"],
                  row.status,
                )
              }
              disabled={
                updatingBatchIds.includes(row.id) ||
                !canCurrentUserUpdateBatch(row)
              }
              className="h-9 py-1.5"
            />
          ),
        });

        acc.push({
          label: "Task",
          key: "taskName",
          filter: "agSetColumnFilter",
          filterParams: {
            values: taskOptions.map((option) => option.label),
          },
          render: (_, row) =>
            canAssignTasks ? (
              <Select
                options={taskOptions.map((option) => ({
                  value: option.value,
                  label: option.label,
                }))}
                disablePlaceholderOpt={false}
                placeholder="Select task"
                value={row.taskId ?? ""}
                onChange={(event) =>
                  handleBatchTaskChange(
                    row.id,
                    event.target.value,
                    row.taskId ?? "",
                  )
                }
                disabled={updatingBatchIds.includes(row.id)}
                className="h-9 py-1.5"
              />
            ) : (
              <span>{row.taskName || "-"}</span>
            ),
        });

        return acc;
      }

      acc.push(column);
      return acc;
    }, []);
  }, [
    canAssignTasks,
    canCurrentUserUpdateBatch,
    handleBatchStatusChange,
    handleBatchTaskChange,
    taskRows,
    updatingBatchIds,
  ]);

  const taskColumnsWithStatusSelect = useMemo<Column<TaskTableRow>[]>(
    () => [
      { label: "Task", key: "task" },
      { label: "Owner", key: "owner" },
      { label: "Due Date", key: "dueDate" },
      {
        label: "Status",
        key: "status",
        render: (value, row) => (
          <Select
            options={TASK_STATUS_LABEL_OPTIONS.map((option) => ({
              value: option.value,
              label: option.label,
            }))}
            disablePlaceholderOpt={false}
            placeholder="Select status"
            value={value as string}
            onChange={(event) =>
              handleTaskStatusChange(
                row.id,
                event.target.value as TaskTableRow["status"],
                row.status,
              )
            }
            disabled={
              row.id <= 0 ||
              updatingTaskIds.includes(row.id) ||
              !canCurrentUserUpdateTask(row.id)
            }
            className="h-9 py-1.5"
          />
        ),
      },
    ],
    [canCurrentUserUpdateTask, handleTaskStatusChange, updatingTaskIds],
  );

  if (!processOrderData) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
        {initialProcessOrderError ?? "Unable to load process order details."}
      </div>
    );
  }

  const summaryInfoItems = [
    { label: "Process Order ID", value: processOrderData.id },
    {
      label: "Status",
      value: mapProcessStatusToLabel(processOrderData.status),
    },
    {
      label: "Order Type",
      value: mapProcessTypeToLabel(processOrderData.type),
    },
    {
      label: "Created At",
      value: formatDisplayDate(processOrderData.createdAt),
    },
    { label: "Handled By", value: processOrderData.creatorUsername ?? "-" },
    { label: "Approved By", value: processOrderData.approvedByUsername ?? "-" },
  ];

  return (
    <div>
      <PageBreadcrumb
        pageTitle={`Assign Task #${processOrderData.id}`}
        filters={["details", "assign-task"]}
      />
      <div className="flex flex-col">
        <div className="flex flex-3 flex-col gap-3">
          <GeneralInfoSection title="Summary" items={summaryInfoItems} />

          <AssignTaskActionSection
            canAssignTasks={canAssignTasks}
            isAddingTask={isAddingTask}
            isSavingTask={isSavingTask}
            isLoadingOwners={false}
            owners={initialOwners}
            newTaskDraft={newTaskDraft}
            setNewTaskDraft={setNewTaskDraft}
            onStartNewTask={handleStartNewTask}
            onCancelNewTask={handleCancelNewTask}
            onConfirmNewTask={handleConfirmNewTask}
            taskRows={taskRows}
            taskColumns={taskColumnsWithStatusSelect}
          />

          <AssignTaskProcessingSection
            faultBatchRows={faultBatchRows}
            faultBatchColumns={faultBatchColumnsWithStatusSelect}
          />
        </div>
      </div>
    </div>
  );
}
