import {
  type FaultBatch as FaultBatchRow,
  type TaskItem,
} from "@/components/table/CustomizableTableHeader";
import {
  FaultBatchStatus,
  FaultProcessOrderStatus,
  FaultProcessOrderType,
  TaskStatus,
  type FaultBatch,
  type FaultTask,
} from "@/interfaces/inventoryManagementType";

export type TaskTableRow = TaskItem & { id: number; assignedUserId: number | null };

export type NewTaskDraft = {
  task: string;
  dueDate: string;
  status: TaskStatus;
  assignedUserId: string;
};

export const getDefaultNewTaskDraft = (): NewTaskDraft => ({
  task: "",
  dueDate: "",
  status: TaskStatus.CREATED,
  assignedUserId: "",
});

const DATE_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

export const formatDisplayDate = (value?: string | null) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return DATE_FORMATTER.format(date);
};

export const formatDisplayDateTime = (value?: string | null) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return DATE_TIME_FORMATTER.format(date);
};

export const formatDueDateTimeForApi = (value: string) => {
  if (!value) {
    return null;
  }

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate.toISOString();
};

export const openDateTimePicker = (target: EventTarget | null) => {
  if (!(target instanceof HTMLInputElement)) {
    return;
  }

  if (typeof target.showPicker === "function") {
    target.showPicker();
  }
};

export const mapProcessStatusToLabel = (status: FaultProcessOrderStatus) => {
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

export const mapProcessTypeToLabel = (type: FaultProcessOrderType) => {
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

export const mapTaskStatusToLabel = (status?: TaskStatus): TaskItem["status"] => {
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

export const mapTaskLabelToStatus = (status: TaskItem["status"]): TaskStatus => {
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

export const mapBatchStatusToLabel = (
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

export const mapBatchLabelToStatus = (
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

export const buildFaultBatchRows = (
  batches?: FaultBatch[],
  tasks?: FaultTask[],
): FaultBatchRow[] => {
  if (!batches?.length) {
    return [];
  }

  return batches.map((batch) => {
    const taskIdStr = batch.taskId ? String(batch.taskId) : "";
    const taskName =
      tasks?.find((task) => String(task.id ?? "") === taskIdStr)?.task ?? "";

    return {
      id: batch.id,
      code: batch.code ?? `FB-${batch.id}`,
      date: formatDisplayDate(batch.createdAt),
      status: mapBatchStatusToLabel(batch.handlingStatus),
      checked: batch.handlingStatus === FaultBatchStatus.RESOLVED,
      taskId: taskIdStr,
      taskName,
    };
  });
};

export const buildTaskRows = (tasks?: FaultTask[]): TaskTableRow[] => {
  return (tasks ?? []).map((task) => ({
    id: task.id ?? -1,
    task: task.task ?? "-",
    owner: task.assignedUsername ?? "-",
    assignedUserId: task.assignedUserId ?? null,
    dueDate: formatDisplayDateTime(task.dueDate),
    status: mapTaskStatusToLabel(task.status),
  }));
};

export const BATCH_STATUS_OPTIONS = [
  { value: "Pending", label: "Pending" },
  { value: "In progress", label: "In Progress" },
  { value: "Completed", label: "Completed" },
] as const;

export const TASK_STATUS_LABEL_OPTIONS = [
  { value: "Not Started", label: "Not Started" },
  { value: "In Progress", label: "In Progress" },
  { value: "Completed", label: "Completed" },
  { value: "Blocked", label: "Blocked" },
] as const;

export const TASK_STATUS_OPTIONS = [
  { value: TaskStatus.CREATED, label: "Not Started" },
  { value: TaskStatus.IN_PROGRESS, label: "In Progress" },
  { value: TaskStatus.COMPLETED, label: "Completed" },
  { value: TaskStatus.FAILED, label: "Blocked" },
] as const;
