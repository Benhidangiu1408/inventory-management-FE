import Select from "@/default_components/form/Select";
import Button from "@/default_components/ui/button/Button";
import { CreateFaultTaskRequest } from "@/interfaces/inventoryManagementType";
import type { User } from "@/interfaces/userManagementType";
import Label from "@/default_components/form/Label";
import Input from "@/default_components/form/input/InputField";
import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import { createTaskForProcessOrderAction } from "@/actions/faultHandling";
import { useRouter } from "next/navigation";

type NewTaskDraft = {
  task: string;
  dueDate: string;
  assignedUserId: string;
};

type AssignTaskActionSectionProps = {
  canAssignTasks: boolean;
  processOrderId: number;
  owners: User[];
};

export default function AddTaskForm({
  canAssignTasks,
  processOrderId,
  owners,
}: AssignTaskActionSectionProps) {
  const ownerOptions = owners.map((owner) => ({
    value: String(owner.id),
    label: owner.username ?? "-",
  }));

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<NewTaskDraft>({
    defaultValues: {
      task: "",
      dueDate: "",
      assignedUserId: "",
    },
  });
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isSavingTask, setIsSavingTask] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: NewTaskDraft) => {
    setIsSavingTask(true);
    const payload: CreateFaultTaskRequest = {
      task: data.task,
      assignedUserId: Number(data.assignedUserId),
      dueDate: new Date(data.dueDate).toISOString(),
    };
    try {
      await createTaskForProcessOrderAction(processOrderId, payload);
      toast.success("Task created successfully.");
      router.refresh();
      setIsAddingTask(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message ?? "An unexpected error occurred");
    } finally {
      setIsSavingTask(false);
    }
  };

  return (
    <>
      {canAssignTasks && (
        <Button
          className="my-4 w-full"
          onClick={() => {
            setIsAddingTask(true);
            reset();
          }}
          disabled={isAddingTask}
        >
          + New Task
        </Button>
      )}

      {isAddingTask && canAssignTasks && (
        <div className="mb-3 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800/50 dark:bg-blue-900/20">
          <div className="mb-3 text-sm font-medium text-blue-700 dark:text-blue-400">
            New Task
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-1 xl:grid-cols-3">
              <div className="h-full flex-1 items-start">
                <Label className="text-xs">
                  Task <span className="text-red-500">*</span>
                </Label>
                <Input
                  className="bg-white"
                  placeholder="Task description"
                  {...register("task", {
                    required: "Task description is required",
                  })}
                  error={!!errors.task}
                  hint={errors.task?.message}
                />
              </div>

              <div className="h-full flex-1 items-start">
                <Label className="text-xs">
                  Handler <span className="text-red-500">*</span>
                </Label>
                <Select
                  options={ownerOptions}
                  placeholder="Select owner"
                  disabled={isSavingTask}
                  className="h-[42px]" // Matches standard Input height
                  {...register("assignedUserId", {
                    required: "Handler is required",
                  })}
                  error={!!errors.assignedUserId}
                  hint={errors.assignedUserId?.message}
                />
              </div>

              <div className="h-full flex-1 items-start">
                <Label className="text-xs">Due Date & Time</Label>
                <Input
                  type="datetime-local"
                  className="bg-white"
                  {...register("dueDate", {
                    required: "Due date is required",
                  })}
                  error={!!errors.dueDate}
                  hint={errors.dueDate?.message}
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setIsAddingTask(false);
                }}
                disabled={isSavingTask}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="primary"
                type="submit"
                disabled={!isDirty || isSavingTask}
              >
                {isSavingTask ? "Saving..." : "Add"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
