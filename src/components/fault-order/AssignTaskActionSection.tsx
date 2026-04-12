import { type Dispatch, type SetStateAction } from "react";
import CustomizableTable, {
  type Column,
} from "@/components/table/CustomizableTable";
import type { TaskItem } from "@/components/table/CustomizableTableHeader";
import Select from "@/default_components/form/Select";
import Button from "@/default_components/ui/button/Button";
import {
  TaskStatus,
  type FaultTask,
} from "@/interfaces/inventoryManagementType";
import type { User } from "@/interfaces/userManagementType";

type NewTaskDraft = {
  task: string;
  dueDate: string;
  status: TaskStatus;
  assignedUserId: string;
};

type TaskTableRow = TaskItem & { id: number; assignedUserId: number | null };

const TASK_STATUS_OPTIONS = [
  { value: TaskStatus.CREATED, label: "Not Started" },
  { value: TaskStatus.IN_PROGRESS, label: "In Progress" },
  { value: TaskStatus.COMPLETED, label: "Completed" },
  { value: TaskStatus.FAILED, label: "Blocked" },
] as const;

const openDateTimePicker = (target: EventTarget | null) => {
  if (!(target instanceof HTMLInputElement)) {
    return;
  }

  if (typeof target.showPicker === "function") {
    target.showPicker();
  }
};

type AssignTaskActionSectionProps = {
  canAssignTasks: boolean;
  isAddingTask: boolean;
  isSavingTask: boolean;
  isLoadingOwners: boolean;
  owners: User[];
  newTaskDraft: NewTaskDraft;
  setNewTaskDraft: Dispatch<SetStateAction<NewTaskDraft>>;
  onStartNewTask: () => void;
  onCancelNewTask: () => void;
  onConfirmNewTask: () => void;
  taskRows: TaskTableRow[];
  taskColumns: Column<TaskTableRow>[];
};

export default function AssignTaskActionSection({
  canAssignTasks,
  isAddingTask,
  isSavingTask,
  isLoadingOwners,
  owners,
  newTaskDraft,
  setNewTaskDraft,
  onStartNewTask,
  onCancelNewTask,
  onConfirmNewTask,
  taskRows,
  taskColumns,
}: AssignTaskActionSectionProps) {
  const ownerOptions = owners.map((owner) => ({
    value: String(owner.id),
    label: owner.username ?? "-",
  }));

  return (
    <div>
      <h2 className="text-xl font-semibold">Action</h2>
      {canAssignTasks ? (
        <Button
          className="my-4 w-full text-xl"
          onClick={onStartNewTask}
          disabled={isAddingTask}
        >
          + New Task
        </Button>
      ) : null}

      {isAddingTask && canAssignTasks && (
        <div className="mb-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
          <div className="mb-2 text-sm font-medium text-blue-700">New Task</div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Task <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Task description"
                value={newTaskDraft.task}
                onChange={(event) =>
                  setNewTaskDraft((prev) => ({
                    ...prev,
                    task: event.target.value,
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
                options={ownerOptions}
                placeholder={
                  isLoadingOwners ? "Loading owners..." : "Select owner"
                }
                disablePlaceholderOpt
                value={newTaskDraft.assignedUserId}
                onChange={(event) =>
                  setNewTaskDraft((prev) => ({
                    ...prev,
                    assignedUserId: event.target.value,
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
                onFocus={(event) => openDateTimePicker(event.currentTarget)}
                onClick={(event) => openDateTimePicker(event.currentTarget)}
                onChange={(event) =>
                  setNewTaskDraft((prev) => ({
                    ...prev,
                    dueDate: event.target.value,
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
                options={TASK_STATUS_OPTIONS.map((option) => ({
                  value: option.value,
                  label: option.label,
                }))}
                disablePlaceholderOpt
                value={newTaskDraft.status}
                onChange={(event) =>
                  setNewTaskDraft((prev) => ({
                    ...prev,
                    status: event.target.value as NewTaskDraft["status"],
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
              onClick={onCancelNewTask}
              disabled={isSavingTask}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={onConfirmNewTask}
              disabled={isSavingTask}
            >
              {isSavingTask ? "Saving..." : "Confirm"}
            </Button>
          </div>
        </div>
      )}

      <CustomizableTable headers={taskColumns} data={taskRows} />
    </div>
  );
}
