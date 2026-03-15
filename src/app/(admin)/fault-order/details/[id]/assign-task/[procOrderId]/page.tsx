"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import Button from "@/default_components/ui/button/Button";
import GeneralInfoSection from "@/components/GeneralInformation";
import Select from "@/default_components/form/Select";
import CustomizableTable from "@/components/table/CustomizableTable";
import type { Column } from "@/components/table/CustomizableTable";
import {
  faultBatchColumns,
  type FaultBatch as FaultBatchRow,
  type TaskItem,
} from "@/components/table/CustomizableTableHeader";
import { faultOrderService } from "@/services/InventoryManagementService";
import { getAllUsersByRoleAction } from "@/actions/user";
import {
  getFaultOrderAction,
  updateFaultOrderStatusAction,
  updateFaultBatchProcessOrderAction,
  updateTasksStatusAction,
} from "@/actions/faultHandling";
import type { User } from "@/interfaces/userManagementType";

import {
  FaultBatchStatus,
  FaultOrderStatus,
  type FaultBatchProcessOrder,
  FaultProcessOrderStatus,
  FaultProcessOrderType,
  TaskStatus,
  type FaultBatch,
} from "@/interfaces/inventoryManagementType";

const DATE_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const formatDisplayDate = (value?: string | null) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return DATE_FORMATTER.format(date);
};

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

const formatDisplayDateTime = (value?: string | null) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return DATE_TIME_FORMATTER.format(date);
};

const formatDueDateTimeForApi = (value: string) => {
  if (!value) {
    return null;
  }

  if (value.length === 16) {
    return `${value}:00`;
  }

  return value;
};

const openDateTimePicker = (target: EventTarget | null) => {
  if (!(target instanceof HTMLInputElement)) {
    return;
  }

  if (typeof target.showPicker === "function") {
    target.showPicker();
  }
};

const mapProcessStatusToLabel = (status: FaultProcessOrderStatus) => {
  switch (status) {
    case FaultProcessOrderStatus.IN_PROGRESS:
      return "In progress";
    case FaultProcessOrderStatus.COMPLETED:
      return "Completed";
    case FaultProcessOrderStatus.CANCELLED:
      return "Canceled";
    case FaultProcessOrderStatus.REJECTED:
      return "Rejected";
    case FaultProcessOrderStatus.FAILED:
      return "Failed";
    case FaultProcessOrderStatus.APPROVED:
      return "Approved";
    default:
      return status;
  }
};

const mapProcessTypeToLabel = (type: FaultProcessOrderType) => {
  switch (type) {
    case FaultProcessOrderType.RETURNED:
      return "Returned";
    case FaultProcessOrderType.CANCELLED:
      return "Canceled";
    case FaultProcessOrderType.SHORTAGE:
      return "Shortage";
    default:
      return "Other";
  }
};

const mapTaskStatusToLabel = (status?: TaskStatus): TaskItem["status"] => {
  switch (status) {
    case TaskStatus.IN_PROGRESS:
      return "In Progress";
    case TaskStatus.COMPLETED:
      return "Completed";
    case TaskStatus.CREATED:
      return "Not Started";
    default:
      return "Blocked";
  }
};

const mapTaskLabelToStatus = (status: TaskItem["status"]): TaskStatus => {
  switch (status) {
    case "In Progress":
      return TaskStatus.IN_PROGRESS;
    case "Completed":
      return TaskStatus.COMPLETED;
    case "Not Started":
      return TaskStatus.CREATED;
    default:
      return TaskStatus.FAILED;
  }
};

const mapBatchStatusToLabel = (
  status?: FaultBatchStatus,
): FaultBatchRow["status"] => {
  switch (status) {
    case FaultBatchStatus.RESOLVED:
      return "Completed";
    case FaultBatchStatus.PROCESSING:
      return "In progress";
    default:
      return "Pending";
  }
};

const mapBatchLabelToStatus = (
  status: FaultBatchRow["status"],
): FaultBatchStatus => {
  switch (status) {
    case "Completed":
      return FaultBatchStatus.RESOLVED;
    case "In progress":
      return FaultBatchStatus.PROCESSING;
    default:
      return FaultBatchStatus.REPORTED;
  }
};

const buildFaultBatchRows = (batches?: FaultBatch[]): FaultBatchRow[] => {
  if (!batches?.length) {
    return [];
  }

  return batches.map((batch) => ({
    id: batch.id,
    code: batch.code ?? `FB-${batch.id}`,
    date: formatDisplayDate(batch.createdAt),
    status: mapBatchStatusToLabel(batch.handlingStatus),
    checked: batch.handlingStatus === FaultBatchStatus.RESOLVED,
  }));
};

const BATCH_STATUS_OPTIONS = [
  { value: "Pending", label: "Pending" },
  { value: "In progress", label: "In Progress" },
  { value: "Completed", label: "Completed" },
] as const;

const TASK_STATUS_LABEL_OPTIONS = [
  { value: "Not Started", label: "Not Started" },
  { value: "In Progress", label: "In Progress" },
  { value: "Completed", label: "Completed" },
  { value: "Blocked", label: "Blocked" },
] as const;

type TaskTableRow = TaskItem & { id: number };

export default function AssignTaskPage() {
  const params = useParams<{ id: string; procOrderId: string }>();
  const faultOrderId = Number(params?.id);
  const procOrderId = params?.procOrderId;
  const processOrderId = Number(procOrderId);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processOrderData, setProcessOrderData] =
    useState<FaultBatchProcessOrder | null>(null);
  const [faultBatchRows, setFaultBatchRows] = useState<FaultBatchRow[]>([]);
  const [updatingBatchIds, setUpdatingBatchIds] = useState<number[]>([]);
  const [taskRows, setTaskRows] = useState<TaskTableRow[]>([]);
  const [updatingTaskIds, setUpdatingTaskIds] = useState<number[]>([]);
  const [owners, setOwners] = useState<User[]>([]);
  const [isLoadingOwners, setIsLoadingOwners] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isSavingTask, setIsSavingTask] = useState(false);
  const [newTaskDraft, setNewTaskDraft] = useState<{
    task: string;
    dueDate: string;
    status: TaskStatus;
    assignedUserId: string;
  }>({
    task: "",
    dueDate: "",
    status: TaskStatus.CREATED,
    assignedUserId: "",
  });

  const syncFaultOrderStatusFromProcessOrders = useCallback(async () => {
    if (Number.isNaN(faultOrderId)) {
      return;
    }

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

  useEffect(() => {
    if (Number.isNaN(processOrderId)) {
      setError("Invalid process order id.");
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const loadProcessOrder = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response =
          await faultOrderService.getFaultBatchProcessOrderWithDetails(
            processOrderId,
          );

        if (!isMounted) return;

        setProcessOrderData(response);
        setFaultBatchRows(buildFaultBatchRows(response.faultBatches));
        setTaskRows(
          (response.tasks ?? []).map((task) => ({
            id: task.id ?? -1,
            task: task.task ?? "-",
            owner: task.assignedUsername ?? "-",
            dueDate: formatDisplayDateTime(task.dueDate),
            status: mapTaskStatusToLabel(task.status),
          })),
        );
      } catch (fetchError: unknown) {
        if (!isMounted) return;
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Unable to load process order details.",
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProcessOrder();

    return () => {
      isMounted = false;
    };
  }, [processOrderId]);

  useEffect(() => {
    let isMounted = true;

    const loadOwners = async () => {
      setIsLoadingOwners(true);
      try {
        const { data, error: usersError } = await getAllUsersByRoleAction(1);
        if (!isMounted) {
          return;
        }

        if (usersError) {
          toast.error(usersError);
          return;
        }

        setOwners(data ?? []);
      } catch {
        if (isMounted) {
          toast.error("Unable to load owners.");
        }
      } finally {
        if (isMounted) {
          setIsLoadingOwners(false);
        }
      }
    };

    loadOwners();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleConfirmNewTask = useCallback(async () => {
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
        owners.find((owner) => String(owner.id) === newTaskDraft.assignedUserId)
          ?.username ?? "-";

      const created = await faultOrderService.createTasksForProcessOrder(
        processOrderId,
        [
          {
            task: newTaskDraft.task.trim(),
            due_date: formatDueDateTimeForApi(newTaskDraft.dueDate),
            status: newTaskDraft.status,
            assignedUser: { id: Number(newTaskDraft.assignedUserId) },
          },
        ],
      );

      const newRows: TaskTableRow[] = created.map((t) => ({
        id: t.id ?? -1,
        task: t.task ?? "-",
        owner: t.assignedUsername ?? selectedOwnerName,
        dueDate: formatDisplayDateTime(t.dueDate),
        status: mapTaskStatusToLabel(t.status),
      }));

      const hadNoTasksBefore = taskRows.length === 0;

      setTaskRows((prev) => [...prev, ...newRows]);

      if (hadNoTasksBefore && newRows.length > 0) {
        await updateProcessOrderStatus(FaultProcessOrderStatus.IN_PROGRESS);
      }

      setIsAddingTask(false);
      setNewTaskDraft({
        task: "",
        dueDate: "",
        status: TaskStatus.CREATED,
        assignedUserId: "",
      });
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
    newTaskDraft,
    owners,
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
        await faultOrderService.markFaultBatchesFixed([
          {
            id: batchId,
            handlingStatus: mapBatchLabelToStatus(nextStatus),
          },
        ]);
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
    [],
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
    [taskRows, updateProcessOrderStatus],
  );

  const faultBatchColumnsWithStatusSelect = useMemo<Column<FaultBatchRow>[]>(
    () =>
      faultBatchColumns.map((column) => {
        if (column.key !== "status") {
          return column;
        }

        return {
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
              disabled={updatingBatchIds.includes(row.id)}
              className="h-9 py-1.5"
            />
          ),
        };
      }),
    [handleBatchStatusChange, updatingBatchIds],
  );

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
            disabled={row.id <= 0 || updatingTaskIds.includes(row.id)}
            className="h-9 py-1.5"
          />
        ),
      },
    ],
    [handleTaskStatusChange, updatingTaskIds],
  );

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-700">
        Loading process order details...
      </div>
    );
  }

  if (Number.isNaN(processOrderId)) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
        Invalid process order id.
      </div>
    );
  }

  if (error || !processOrderData) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
        {error ?? "Unable to load process order details."}
      </div>
    );
  }

  const TASK_STATUS_OPTIONS = [
    { value: TaskStatus.CREATED, label: "Not Started" },
    { value: TaskStatus.IN_PROGRESS, label: "In Progress" },
    { value: TaskStatus.COMPLETED, label: "Completed" },
    { value: TaskStatus.FAILED, label: "Blocked" },
  ] as const;

  const OWNER_OPTIONS = owners.map((owner) => ({
    value: String(owner.id),
    label: owner.username,
  }));

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

          {/* Action Table */}
          <div>
            <h2 className="text-xl font-semibold">Action</h2>
            <Button
              className="my-4 w-full text-xl"
              onClick={() => {
                setIsAddingTask(true);
                setNewTaskDraft({
                  task: "",
                  dueDate: "",
                  status: TaskStatus.CREATED,
                  assignedUserId: "",
                });
              }}
              disabled={isAddingTask}
            >
              + New Task
            </Button>

            {isAddingTask && (
              <div className="mb-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
                <div className="mb-2 text-sm font-medium text-blue-700">
                  New Task
                </div>
                <div className="grid grid-cols-4 gap-3">
                  <div className="col-span-3 sm:col-span-1">
                    <label className="mb-1 block text-xs font-medium text-gray-600">
                      Task <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Task description"
                      value={newTaskDraft.task}
                      onChange={(e) =>
                        setNewTaskDraft((prev) => ({
                          ...prev,
                          task: e.target.value,
                        }))
                      }
                      className="h-9 w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">
                      Owner <span className="text-red-500">*</span>
                    </label>
                    <Select
                      options={OWNER_OPTIONS}
                      placeholder={
                        isLoadingOwners ? "Loading owners..." : "Select owner"
                      }
                      disablePlaceholderOpt
                      value={newTaskDraft.assignedUserId}
                      onChange={(e) =>
                        setNewTaskDraft((prev) => ({
                          ...prev,
                          assignedUserId: e.target.value,
                        }))
                      }
                      disabled={isLoadingOwners || isSavingTask}
                      className="h-9 py-1.5"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">
                      Due Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={newTaskDraft.dueDate}
                      onFocus={(e) => openDateTimePicker(e.currentTarget)}
                      onClick={(e) => openDateTimePicker(e.currentTarget)}
                      onChange={(e) =>
                        setNewTaskDraft((prev) => ({
                          ...prev,
                          dueDate: e.target.value,
                        }))
                      }
                      className="h-9 w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">
                      Status
                    </label>
                    <Select
                      options={TASK_STATUS_OPTIONS.map((o) => ({
                        value: o.value,
                        label: o.label,
                      }))}
                      disablePlaceholderOpt
                      value={newTaskDraft.status}
                      onChange={(e) =>
                        setNewTaskDraft((prev) => ({
                          ...prev,
                          status: e.target.value as TaskStatus,
                        }))
                      }
                      className="h-9 py-1.5"
                    />
                  </div>
                </div>
                <div className="mt-3 flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setIsAddingTask(false);
                      setNewTaskDraft({
                        task: "",
                        dueDate: "",
                        status: TaskStatus.CREATED,
                        assignedUserId: "",
                      });
                    }}
                    disabled={isSavingTask}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={handleConfirmNewTask}
                    disabled={isSavingTask}
                  >
                    {isSavingTask ? "Saving..." : "Confirm"}
                  </Button>
                </div>
              </div>
            )}

            <CustomizableTable
              headers={taskColumnsWithStatusSelect}
              data={taskRows}
            />
          </div>

          {/* Batch Table */}
          <div>
            <h2 className="pb-4 text-xl font-semibold">Processing</h2>
            {/* <Button className="my-4 w-full text-xl">+ Add Batch</Button> */}
            <CustomizableTable
              headers={faultBatchColumnsWithStatusSelect}
              data={faultBatchRows}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
