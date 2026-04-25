"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import {
  updateFaultBatchProcessOrderAction,
  updateProcessOrderApprovalAction,
} from "@/actions/faultHandling";
import GeneralInfoSection from "@/components/GeneralInformation";
import Label from "@/default_components/form/Label";
import Input from "@/default_components/form/input/InputField";
import TextArea from "@/default_components/form/input/TextArea";
import Button from "@/default_components/ui/button/Button";
import {
  Analyze,
  FaultBatchStatus,
  FaultProcessOrderStatus,
  FaultProcessOrderType,
  TaskStatus,
  type CreateFaultQuestionRequest,
  type FaultBatch,
  type FaultBatchProcessOrder,
} from "@/interfaces/inventoryManagementType";
import { useAuth } from "@/context/AuthContext";
import ComponentCard from "@/default_components/common/ComponentCard";
import Radio from "@/default_components/form/input/Radio";

type FaultBatchRowStatus = "Pending" | "In progress" | "Completed";
type TaskRowStatus = "Not Started" | "In Progress" | "Completed" | "Blocked";

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
  questions: { question: string; answer: string }[];
  faultType: FaultProcessOrderType;
  decision: "approve" | "reject";
  comment: string;
};

type WhyQuestionFormItem = {
  question: string;
  answer: string;
};

const DATE_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const DEFAULT_WHY_QUESTIONS = [
  "Why was the batch marked as faulty during inbound inspection?",
  "Why were the items damaged / wrong / not matching the specification?",
  "Why was the issue not detected before shipment from the supplier?",
  "Why did the supplier fail to follow the QC or packaging standards?",
  "Why did our system or purchasing process not detect or prevent this faulty batch earlier?",
];

const formatDisplayDate = (value?: string | null) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return DATE_FORMATTER.format(date);
};

const mapBatchStatusToLabel = (
  status?: FaultBatchStatus,
): FaultBatchRowStatus => {
  switch (status) {
    case FaultBatchStatus.RESOLVED:
      return "Completed";
    case FaultBatchStatus.PROCESSING:
      return "In progress";
    default:
      return "Pending";
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
    default:
      return status;
  }
};

const mapTaskStatusToLabel = (status?: TaskStatus): TaskRowStatus => {
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

const buildFaultBatchRows = (batches?: FaultBatch[]) => {
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

const buildInitialWhyQuestions = (
  processOrder: FaultBatchProcessOrder,
): WhyQuestionFormItem[] =>
  DEFAULT_WHY_QUESTIONS.map((fallbackQuestion, index) => {
    const question = processOrder.questions?.[index];

    return {
      question: question?.question ?? fallbackQuestion,
      answer: question?.answer ?? "",
    };
  });

export default function ProcessOrderDetailForm({
  processOrder,
  currentUserId,
  questionCreatorId,
  analyzerId,
}: ProcessOrderDetailFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  // Form state
  const [whatHappened, setWhatHappened] = useState(
    processOrder.whatHappened ?? "",
  );
  const [impact, setImpact] = useState(processOrder.impact ?? "");
  const [rootCause, setRootCause] = useState(processOrder.rootCause ?? "");
  const [whyQuestions, setWhyQuestions] = useState(() =>
    buildInitialWhyQuestions(processOrder),
  );
  const [faultType, setFaultType] = useState<FaultProcessOrderType>(
    processOrder.type,
  );
  const [decision, setDecision] = useState<"approve" | "reject">(
    processOrder.status === FaultProcessOrderStatus.REJECTED ||
      processOrder.status === FaultProcessOrderStatus.CANCELLED
      ? "reject"
      : "approve",
  );
  const [comment, setComment] = useState(processOrder.note ?? "");

  // Permissions
  const { user } = useAuth();
  const canApproveProcessOrder = user?.permissions.includes(Analyze.APPROVE);
  const canEditQuestions =
    currentUserId !== null &&
    questionCreatorId !== null &&
    currentUserId === questionCreatorId;
  const canAnswerQuestions =
    currentUserId !== null &&
    analyzerId !== null &&
    currentUserId === analyzerId;

  const handleInfoItems = [
    { label: "Process Order ID", value: processOrder.id },
    { label: "Create Date", value: formatDisplayDate(processOrder.createdAt) },
    {
      label: "Return Date",
      value: formatDisplayDate(processOrder.processedAt),
    },
    { label: "Expected Arrival Date", value: "-" },
    { label: "Status", value: mapProcessStatusToLabel(processOrder.status) },
    { label: "Return To", value: "-" },
    { label: "Handled By", value: processOrder.creatorUsername ?? "-" },
    { label: "Note", value: processOrder.note ?? "-" },
  ];

  const resolveInfoItems = [
    {
      label: "Resolve Date",
      value: formatDisplayDate(processOrder.processedAt),
    },
    { label: "Resolve Image", value: "-" },
    { label: "Resolve By", value: processOrder.approvedByUsername ?? "-" },
    { label: "Status", value: mapProcessStatusToLabel(processOrder.status) },
  ];

  const taskRows = (processOrder.tasks ?? []).map((task) => ({
    task: task.task ?? "-",
    owner: task.assignedUsername ?? "-",
    dueDate: formatDisplayDate(task.dueDate),
    status: mapTaskStatusToLabel(task.status),
  }));

  const processingRows = buildFaultBatchRows(processOrder.faultBatches);

  const updateWhyQuestion = (
    index: number,
    key: keyof WhyQuestionFormItem,
    value: string,
  ) => {
    setWhyQuestions((current) =>
      current.map((item, currentIndex) =>
        currentIndex === index ? { ...item, [key]: value } : item,
      ),
    );
  };

  const handleSave = () => {
    const normalizedComment = comment.trim();
    const normalizedRootCause = (
      canAnswerQuestions ? rootCause : (processOrder.rootCause ?? "")
    ).trim();
    const normalizedWhatHappened = (
      canAnswerQuestions ? whatHappened : (processOrder.whatHappened ?? "")
    ).trim();
    const normalizedImpact = (
      canAnswerQuestions ? impact : (processOrder.impact ?? "")
    ).trim();
    const nextFaultType = canAnswerQuestions ? faultType : processOrder.type;

    const questions: CreateFaultQuestionRequest[] = whyQuestions
      .map((item, index) => {
        const originalQuestion = processOrder.questions?.[index];
        const normalizedQuestion = (
          canEditQuestions
            ? item.question
            : (originalQuestion?.question ?? item.question)
        ).trim();
        const normalizedAnswer = (
          canAnswerQuestions
            ? item.answer
            : (originalQuestion?.answer ?? item.answer)
        ).trim();

        return {
          question: normalizedQuestion,
          answer: normalizedAnswer || null,
        };
      })
      .filter((item) => item.question.length > 0);

    const nextStatus = canApproveProcessOrder
      ? decision === "approve"
        ? FaultProcessOrderStatus.APPROVED
        : FaultProcessOrderStatus.REJECTED
      : processOrder.status;

    startTransition(async () => {
      if (canApproveProcessOrder) {
        const { error: approvalError } = await updateProcessOrderApprovalAction(
          processOrder.id,
        );

        if (approvalError) {
          toast.error(approvalError);
          return;
        }
      }

      const { error: processOrderError } =
        await updateFaultBatchProcessOrderAction(processOrder.id, {
          status: nextStatus,
          type: nextFaultType,
          note: normalizedComment,
          rootCause: normalizedRootCause || null,
          whatHappened: normalizedWhatHappened || null,
          impact: normalizedImpact || null,
          questions,
        });

      if (processOrderError) {
        const shouldFallbackToCancelled =
          canApproveProcessOrder &&
          decision === "reject" &&
          processOrderError.includes("fault_batch_process_order_status_check");

        if (!shouldFallbackToCancelled) {
          toast.error(processOrderError);
          return;
        }

        const { error: retryError } = await updateFaultBatchProcessOrderAction(
          processOrder.id,
          {
            status: FaultProcessOrderStatus.CANCELLED,
            type: nextFaultType,
            note: normalizedComment,
            rootCause: normalizedRootCause || null,
            whatHappened: normalizedWhatHappened || null,
            impact: normalizedImpact || null,
            questions,
          },
        );

        if (retryError) {
          toast.error(retryError);
          return;
        }
      }

      toast.success("Process order saved successfully.");
      router.refresh();
    });
  };

  return (
    <div className="flex flex-3 flex-col gap-6">
      <ComponentCard title="Problem Description">
        <div className="flex w-full">
          <div className="flex h-11 min-w-[150] items-center justify-center rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
            <span className="whitespace-nowrap">What happened?</span>
          </div>
          <div className="w-full">
            <Input
              className="rounded-l-none"
              value={whatHappened}
              disabled={!canAnswerQuestions}
              onChange={(event) => setWhatHappened(event.target.value)}
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
              value={impact}
              disabled={!canAnswerQuestions}
              onChange={(event) => setImpact(event.target.value)}
            />
          </div>
        </div>
      </ComponentCard>
      <ComponentCard title="5+ Whys Analysis">
        <div className="space-y-4">
          {whyQuestions.map((item, index) => (
            <div
              key={`why-question-${index}`}
              className="flex items-center gap-4"
            >
              <div className="w-1/3 shrink-0">
                <TextArea
                  rows={2}
                  className="resize-none !text-gray-800 dark:!text-white/90"
                  value={item.question}
                  disabled={!canEditQuestions}
                  onChange={(event) =>
                    updateWhyQuestion(index, "question", event.target.value)
                  }
                />
              </div>
              <div className="flex-1">
                <Input
                  placeholder="Answer"
                  value={item.answer}
                  disabled={!canAnswerQuestions}
                  onChange={(event) =>
                    updateWhyQuestion(index, "answer", event.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </ComponentCard>
      <ComponentCard title="Resolutions">
        <div>
          <Label className="font-semibold">Root Causes</Label>
          <Input
            value={rootCause}
            disabled={!canAnswerQuestions}
            onChange={(event) => setRootCause(event.target.value)}
          />
        </div>
        <div className="my-4">
          <Label className="mb-3 font-semibold">Fault Type</Label>
          <div className="flex items-center gap-6">
            <Radio
              label="Return to supplier"
              id="faultTypeReturn"
              name="faultType"
              value={FaultProcessOrderType.RETURNED}
              checked={faultType === FaultProcessOrderType.RETURNED}
              disabled={!canAnswerQuestions}
              onChange={() => setFaultType(FaultProcessOrderType.RETURNED)}
            />
            <Radio
              label="Cancel batch"
              id="faultTypeCancel"
              name="faultType"
              value={FaultProcessOrderType.CANCELLED}
              checked={faultType === FaultProcessOrderType.CANCELLED}
              disabled={!canAnswerQuestions}
              onChange={() => setFaultType(FaultProcessOrderType.CANCELLED)}
            />
            <Radio
              label="Warehouse Transfer"
              id="faultTypeTransfer"
              name="faultType"
              value={FaultProcessOrderType.WAREHOUSE_TRANSFER}
              checked={faultType === FaultProcessOrderType.WAREHOUSE_TRANSFER}
              disabled={!canAnswerQuestions}
              onChange={() =>
                setFaultType(FaultProcessOrderType.WAREHOUSE_TRANSFER)
              }
            />
            <Radio
              label="Other"
              name="faultType"
              id="faultTypeOther"
              value={FaultProcessOrderType.OTHER}
              checked={
                faultType === FaultProcessOrderType.OTHER ||
                faultType === FaultProcessOrderType.SHORTAGE
              }
              disabled={!canAnswerQuestions}
              onChange={() => setFaultType(FaultProcessOrderType.OTHER)}
            />
          </div>
        </div>
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
          <div className="flex gap-6">
            <div
              className={`cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 ${canApproveProcessOrder ? "hover:bg-gray-50" : ""}`}
            >
              <Radio
                label="Approve"
                id="approveBtn"
                value="approve"
                checked={decision === "approve"}
                disabled={!canApproveProcessOrder}
                onChange={() => setDecision("approve")}
                className={`font-medium ${canApproveProcessOrder ? "text-green-600" : ""}`}
              />
            </div>
            <div
              className={`cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 ${canApproveProcessOrder ? "hover:bg-gray-50" : ""}`}
            >
              <Radio
                label="Reject"
                id="rejectBtn"
                value="reject"
                checked={decision === "reject"}
                disabled={!canApproveProcessOrder}
                onChange={() => setDecision("reject")}
                className={`font-medium ${canApproveProcessOrder ? "text-red-600" : ""}`}
              />
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label>Comment</Label>
            <TextArea
              rows={4}
              placeholder="Write your comment..."
              value={comment}
              disabled={!canApproveProcessOrder}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </div>
        <Button variant="primary" onClick={handleSave} disabled={isPending}>
          {isPending
            ? "Saving..."
            : canApproveProcessOrder
              ? "Approve"
              : "Confirm"}
        </Button>
      </ComponentCard>

      {/* Reserved blocks kept for future task and batch detail tables. */}
      {taskRows.length > 0 || processingRows.length > 0 ? (
        <div className="hidden">
          <GeneralInfoSection title="Handle" items={handleInfoItems} />
          <GeneralInfoSection title="Resolve" items={resolveInfoItems} />
        </div>
      ) : null}
    </div>
  );
}
