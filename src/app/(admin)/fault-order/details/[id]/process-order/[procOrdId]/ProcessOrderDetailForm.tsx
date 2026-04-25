"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import {
  analyzeFaultBatchProcessOrderAction,
  updateFaultBatchProcessOrderQuestionAction,
  updateProcessOrderDecisionAction,
} from "@/actions/faultHandling";
import Label from "@/default_components/form/Label";
import Input from "@/default_components/form/input/InputField";
import TextArea from "@/default_components/form/input/TextArea";
import Button from "@/default_components/ui/button/Button";
import {
  Analyze,
  FaultProcessOrderStatus,
  FaultProcessOrderType,
  FaultQuestion,
  type FaultBatchProcessOrder,
} from "@/interfaces/inventoryManagementType";
import { useAuth } from "@/context/AuthContext";
import ComponentCard from "@/default_components/common/ComponentCard";
import Radio from "@/default_components/form/input/Radio";
import { useFieldArray, useForm } from "react-hook-form";

// type FaultBatchRowStatus = "Pending" | "In progress" | "Completed";
// type TaskRowStatus = "Not Started" | "In Progress" | "Completed" | "Blocked";

type ProcessOrderDetailFormProps = {
  processOrder: FaultBatchProcessOrder;
  currentUserId: number | null;
  questionCreatorId: number | null;
  analyzerId: number | null;
};
type ProcessOrderFormValues = {
  whatHappened: string;
  impact: string;
  rootCause: string;
  questions: FaultQuestion[];
  faultType: FaultProcessOrderType;
  decision: FaultProcessOrderStatus;
  comment: string;
};

// const DATE_FORMATTER = new Intl.DateTimeFormat("en-GB", {
//   day: "2-digit",
//   month: "2-digit",
//   year: "numeric",
// });

// const formatDisplayDate = (value?: string | null) => {
//   if (!value) return "-";

//   const date = new Date(value);
//   if (Number.isNaN(date.getTime())) {
//     return "-";
//   }

//   return DATE_FORMATTER.format(date);
// };

// const mapBatchStatusToLabel = (
//   status?: FaultBatchStatus,
// ): FaultBatchRowStatus => {
//   switch (status) {
//     case FaultBatchStatus.RESOLVED:
//       return "Completed";
//     case FaultBatchStatus.PROCESSING:
//       return "In progress";
//     default:
//       return "Pending";
//   }
// };

// const mapProcessStatusToLabel = (status: FaultProcessOrderStatus) => {
//   switch (status) {
//     case FaultProcessOrderStatus.IN_PROGRESS:
//       return "In progress";
//     case FaultProcessOrderStatus.COMPLETED:
//       return "Completed";
//     case FaultProcessOrderStatus.CANCELLED:
//       return "Canceled";
//     case FaultProcessOrderStatus.REJECTED:
//       return "Rejected";
//     case FaultProcessOrderStatus.FAILED:
//       return "Failed";
//     default:
//       return status;
//   }
// };

// const mapTaskStatusToLabel = (status?: TaskStatus): TaskRowStatus => {
//   switch (status) {
//     case TaskStatus.IN_PROGRESS:
//       return "In Progress";
//     case TaskStatus.COMPLETED:
//       return "Completed";
//     case TaskStatus.CREATED:
//       return "Not Started";
//     default:
//       return "Blocked";
//   }
// };

// const buildFaultBatchRows = (batches?: FaultBatch[]) => {
//   if (!batches?.length) {
//     return [];
//   }

//   return batches.map((batch) => ({
//     id: batch.id,
//     code: batch.code ?? `FB-${batch.id}`,
//     date: formatDisplayDate(batch.createdAt),
//     status: mapBatchStatusToLabel(batch.handlingStatus),
//     checked: batch.handlingStatus === FaultBatchStatus.RESOLVED,
//   }));
// };

export default function ProcessOrderDetailForm({
  processOrder,
  currentUserId,
  questionCreatorId,
  analyzerId,
}: ProcessOrderDetailFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  // Form state
  const {
    register,
    control,
    getValues,
    reset,
    formState: { dirtyFields, defaultValues },
  } = useForm<ProcessOrderFormValues>({
    defaultValues: {
      whatHappened: processOrder.whatHappened ?? "",
      impact: processOrder.impact ?? "",
      rootCause: processOrder.rootCause ?? "",
      questions: processOrder.questions,
      faultType: processOrder.type ?? FaultProcessOrderType.OTHER,
      decision: processOrder.status ?? FaultProcessOrderStatus.APPROVED,
      comment: processOrder.note ?? "",
    },
  });
  // 3. Manage the 5-Whys Array
  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  // Permissions
  const { user } = useAuth();
  const canApproveProcessOrder =
    user?.permissions.includes(Analyze.APPROVE) &&
    processOrder.status === FaultProcessOrderStatus.IN_PROGRESS;
  const canEditQuestions =
    currentUserId === questionCreatorId &&
    processOrder.status == FaultProcessOrderStatus.IN_PROGRESS;
  const canAnswerQuestions =
    currentUserId === analyzerId &&
    processOrder.status == FaultProcessOrderStatus.IN_PROGRESS;

  const isAnalysisDirty = Boolean(
    dirtyFields.whatHappened ||
      dirtyFields.impact ||
      dirtyFields.rootCause ||
      dirtyFields.faultType ||
      dirtyFields.questions,
  );

  // Checks if any Approver fields were modified
  const isDecisionDirty = Boolean(dirtyFields.decision || dirtyFields.comment);

  // --- ACTION 1: Save Analysis & Questions ---
  const onSaveAnalysis = () => {
    const data = getValues();

    startTransition(async () => {
      try {
        let updatedOrderFromServer: FaultBatchProcessOrder | null = null;

        if (canEditQuestions) {
          const validQuestions = data.questions.filter(
            (q) => q.question.trim() !== "",
          );
          const res = await updateFaultBatchProcessOrderQuestionAction(
            processOrder.id,
            validQuestions,
          );
          updatedOrderFromServer = res;
        }

        if (canAnswerQuestions) {
          const analyzerPayload = {
            type: data.faultType,
            rootCause: data.rootCause.trim() || null,
            whatHappened: data.whatHappened.trim() || null,
            impact: data.impact.trim() || null,
            questions: data.questions,
          };
          const res = await analyzeFaultBatchProcessOrderAction(
            processOrder.id,
            analyzerPayload,
          );
          updatedOrderFromServer = res;
        }

        reset(
          {
            ...defaultValues, // Protects the Approver fields
            whatHappened: updatedOrderFromServer?.whatHappened ?? "",
            impact: updatedOrderFromServer?.impact ?? "",
            rootCause: updatedOrderFromServer?.rootCause ?? "",
            questions: updatedOrderFromServer?.questions ?? [],
            faultType:
              updatedOrderFromServer?.type ?? FaultProcessOrderType.OTHER,
          },
          { keepValues: true },
        );
        toast.success("Analysis saved successfully.");
        router.refresh();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error(error.message || "Failed to save analysis.");
      }
    });
  };

  // --- ACTION 2: Submit Approver Decision ---
  const onSubmitDecision = () => {
    const data = getValues();

    startTransition(async () => {
      try {
        const res = await updateProcessOrderDecisionAction(processOrder.id, {
          status: data.decision,
          note: data.comment.trim(),
        });
        reset(
          {
            ...defaultValues, // Protects the Approver fields
            comment: res.note ?? "",
            decision: res.status,
          },
          { keepValues: true },
        );
        toast.success("Decision submitted successfully.");
        router.refresh();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error(error.message || "Failed to submit decision.");
      }
    });
  };

  // const handleInfoItems = [
  //   { label: "Process Order ID", value: processOrder.id },
  //   { label: "Create Date", value: formatDisplayDate(processOrder.createdAt) },
  //   {
  //     label: "Return Date",
  //     value: formatDisplayDate(processOrder.processedAt),
  //   },
  //   { label: "Expected Arrival Date", value: "-" },
  //   { label: "Status", value: mapProcessStatusToLabel(processOrder.status) },
  //   { label: "Return To", value: "-" },
  //   { label: "Handled By", value: processOrder.creatorUsername ?? "-" },
  //   { label: "Note", value: processOrder.note ?? "-" },
  // ];

  // const resolveInfoItems = [
  //   {
  //     label: "Resolve Date",
  //     value: formatDisplayDate(processOrder.processedAt),
  //   },
  //   { label: "Resolve Image", value: "-" },
  //   { label: "Resolve By", value: processOrder.approvedByUsername ?? "-" },
  //   { label: "Status", value: mapProcessStatusToLabel(processOrder.status) },
  // ];

  // const taskRows = (processOrder.tasks ?? []).map((task) => ({
  //   task: task.task ?? "-",
  //   owner: task.assignedUsername ?? "-",
  //   dueDate: formatDisplayDate(task.dueDate),
  //   status: mapTaskStatusToLabel(task.status),
  // }));

  // const processingRows = buildFaultBatchRows(processOrder.faultBatches);

  // const updateWhyQuestion = (
  //   index: number,
  //   key: keyof WhyQuestionFormItem,
  //   value: string,
  // ) => {
  //   setWhyQuestions((current) =>
  //     current.map((item, currentIndex) =>
  //       currentIndex === index ? { ...item, [key]: value } : item,
  //     ),
  //   );
  // };

  return (
    <div className="flex flex-col gap-6">
      <ComponentCard title="Analyze Process Order">
        <Label className="text-xl font-semibold">Problem Description</Label>
        <div className="flex w-full">
          <div className="flex h-11 min-w-[150] items-center justify-center rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
            <span className="whitespace-nowrap">What happened?</span>
          </div>
          <div className="w-full">
            <Input
              className="rounded-l-none"
              disabled={!canAnswerQuestions || isPending}
              {...register("whatHappened")}
            />
          </div>
        </div>
        <div className="flex w-full">
          <div className="flex h-11 min-w-[150] items-center justify-center rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
            <span className="whitespace-nowrap">What is impacted?</span>
          </div>
          <div className="w-full">
            <Input
              className="rounded-l-none"
              disabled={!canAnswerQuestions || isPending}
              {...register("impact")}
            />
          </div>
        </div>
        <Label className="text-xl font-semibold">5+ Whys Analysis</Label>
        <div className="space-y-4">
          {fields.length === 0 && (
            <p className="text-sm text-gray-500">
              No questions have been created yet.
            </p>
          )}
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-4">
              <div className="w-1/3 shrink-0">
                <TextArea
                  rows={2}
                  className="resize-none"
                  disabled={!canEditQuestions || isPending}
                  {...register(`questions.${index}.question` as const)}
                />
              </div>
              <div className="flex flex-1 gap-2">
                <div className="w-full">
                  <Input
                    placeholder="Answer"
                    disabled={!canAnswerQuestions || isPending}
                    {...register(`questions.${index}.answer` as const)}
                  />
                </div>
                {canEditQuestions && (
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => remove(index)}
                    disabled={isPending}
                    className="px-3"
                  >
                    X
                  </Button>
                )}
              </div>
            </div>
          ))}
          {canEditQuestions && (
            <Button
              variant="outline"
              onClick={() => append({ question: "", answer: "" })}
              disabled={isPending}
              className="mt-2 w-full"
            >
              + Add Question
            </Button>
          )}
        </div>
        <Label className="text-xl font-semibold">Resolutions</Label>
        <div>
          <Label className="font-semibold">Root Causes</Label>
          <Input
            disabled={!canAnswerQuestions || isPending}
            {...register("rootCause")}
          />
        </div>
        <div className="my-4">
          <Label className="mb-3 font-semibold">Fault Type</Label>
          <div className="flex items-center gap-6">
            <Radio
              label="Return to supplier"
              id="faultTypeReturn"
              value={FaultProcessOrderType.RETURNED}
              disabled={!canAnswerQuestions || isPending}
              {...register("faultType")}
            />
            <Radio
              label="Cancel batch"
              id="faultTypeCancel"
              value={FaultProcessOrderType.CANCELLED}
              disabled={!canAnswerQuestions || isPending}
              {...register("faultType")}
            />
            <Radio
              label="Warehouse Transfer"
              id="faultTypeTransfer"
              value={FaultProcessOrderType.WAREHOUSE_TRANSFER}
              disabled={!canAnswerQuestions || isPending}
              {...register("faultType")}
            />
            <Radio
              label="Other"
              id="faultTypeOther"
              value={FaultProcessOrderType.OTHER}
              disabled={!canAnswerQuestions || isPending}
              {...register("faultType")}
            />
          </div>
        </div>
        {(canAnswerQuestions || canEditQuestions) && (
          <div className="mt-6 flex">
            <Button
              variant="primary"
              onClick={onSaveAnalysis}
              disabled={isPending || !isAnalysisDirty}
            >
              {isPending ? "Saving..." : "Submit Form"}
            </Button>
          </div>
        )}
      </ComponentCard>
      <ComponentCard title="Decision">
        <div className="space-y-6">
          {/* Approver info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <Label>Approver</Label>
              <Input
                type="text"
                defaultValue={processOrder.approvedByUsername ?? ""}
                disabled
                className="bg-gray-100"
              />
            </div>
            <div className="flex flex-col">
              <Label>Approved Date</Label>
              <Input
                type="date"
                defaultValue={
                  processOrder.approveAt
                    ? new Date(
                        processOrder.approveAt as string,
                      ).toLocaleDateString("en-GB")
                    : ""
                }
                disabled
                className="bg-gray-100"
              />
            </div>
          </div>
          {/* Decision */}
          {processOrder.status == FaultProcessOrderStatus.IN_PROGRESS && (
            <div className="flex gap-6">
              <div
                className={`cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 ${canApproveProcessOrder ? "hover:bg-gray-50" : ""}`}
              >
                <Radio
                  label="Approve"
                  id="approveBtn"
                  value={FaultProcessOrderStatus.APPROVED}
                  disabled={!canApproveProcessOrder || isPending}
                  className={`font-medium ${canApproveProcessOrder ? "text-green-600" : ""}`}
                  {...register("decision")}
                />
              </div>
              <div
                className={`cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 ${canApproveProcessOrder ? "hover:bg-gray-50" : ""}`}
              >
                <Radio
                  label="Reject"
                  id="rejectBtn"
                  value={FaultProcessOrderStatus.REJECTED}
                  disabled={!canApproveProcessOrder || isPending}
                  className={`font-medium ${canApproveProcessOrder ? "text-red-600" : ""}`}
                  {...register("decision")}
                />
              </div>
            </div>
          )}
          {/* Comment */}
          <div className="space-y-2">
            <Label>Comment</Label>
            <TextArea
              rows={4}
              placeholder="Write your comment..."
              disabled={!canApproveProcessOrder || isPending}
              {...register("comment")}
            />
          </div>
        </div>
        {canApproveProcessOrder && (
          <Button
            variant="primary"
            onClick={onSubmitDecision}
            disabled={isPending || !isDecisionDirty}
          >
            {isPending ? "Saving..." : "Submit Decision"}
          </Button>
        )}
      </ComponentCard>

      {/* Reserved blocks kept for future task and batch detail tables. */}
      {/* {taskRows.length > 0 || processingRows.length > 0 ? (
        <div className="hidden">
          <GeneralInfoSection title="Handle" items={handleInfoItems} />
          <GeneralInfoSection title="Resolve" items={resolveInfoItems} />
        </div>
      ) : null} */}
    </div>
  );
}
