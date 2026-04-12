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

type FaultBatchRowStatus = "Pending" | "In progress" | "Completed";
type TaskRowStatus = "Not Started" | "In Progress" | "Completed" | "Blocked";

type ProcessOrderDetailFormProps = {
  processOrder: FaultBatchProcessOrder;
  currentUserId: number | null;
  questionCreatorId: number | null;
  analyzerId: number | null;
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

const formatDateInputValue = (value?: string | null) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
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
  const {user}= useAuth();
  const canApproveProcessOrder = user?.permissions.includes(Analyze.APPROVE);
  const canEditQuestions =
    currentUserId !== null &&
    questionCreatorId !== null &&
    currentUserId === questionCreatorId;
  const canAnswerQuestions =
    currentUserId !== null &&
    analyzerId !== null &&
    currentUserId === analyzerId;
  const approveDisplayUser = canApproveProcessOrder
    ? currentUserId
      ? String(currentUserId)
      : ""
    : (processOrder.approvedByUsername ?? "");
  const approveDisplayDate = canApproveProcessOrder
    ? formatDateInputValue(new Date().toISOString())
    : formatDateInputValue(processOrder.approveAt);

  const summaryInfoItems = [
    { label: "Fault Type", value: mapProcessTypeToLabel(processOrder.type) },
    { label: "Root Cause", value: processOrder.rootCause ?? "-" },
    { label: "Status", value: mapProcessStatusToLabel(processOrder.status) },
    {
      label: "Created Date",
      value: formatDisplayDate(
        processOrder.processedAt ?? processOrder.createdAt,
      ),
    },
    { label: "Analyzed By", value: processOrder.creatorUsername ?? "-" },
    { label: "Approved By", value: processOrder.approvedByUsername ?? "-" },
  ];

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

    const approverUserId = canApproveProcessOrder ? currentUserId : null;

    const nextStatus = canApproveProcessOrder
      ? decision === "approve"
        ? FaultProcessOrderStatus.APPROVED
        : FaultProcessOrderStatus.REJECTED
      : processOrder.status;

    startTransition(async () => {
      if (canApproveProcessOrder && !approverUserId) {
        toast.error("Cannot determine current approver user id.");
        return;
      }

      if (canApproveProcessOrder && approverUserId) {
        const { error: approvalError } = await updateProcessOrderApprovalAction(
          processOrder.id,
          approverUserId,
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
    <div className="flex justify-between gap-6">
      <div className="flex flex-3 flex-col gap-6">
        <GeneralInfoSection title="Summary" items={summaryInfoItems} />

        <h2 className="text-xl font-semibold">Problem Description</h2>
        <div className="flex items-center gap-4">
          <Label className="mb-0 shrink-0">What happened?</Label>
          <div className="min-w-0 flex-1">
            <Input
              value={whatHappened}
              disabled={!canAnswerQuestions}
              onChange={(event) => setWhatHappened(event.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Label className="mb-0 shrink-0">What is impacted?</Label>
          <div className="min-w-0 flex-1">
            <Input
              value={impact}
              disabled={!canAnswerQuestions}
              onChange={(event) => setImpact(event.target.value)}
            />
          </div>
        </div>

        <h2 className="text-xl font-semibold">5+ Whys</h2>
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

        <h2 className="text-xl font-semibold">Root Causes</h2>
        <Input
          value={rootCause}
          disabled={!canAnswerQuestions}
          onChange={(event) => setRootCause(event.target.value)}
        />

        <div className="my-4 space-y-3">
          <Label className="mb-5 text-xl font-semibold">Fault Type</Label>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="faultType"
                value={FaultProcessOrderType.RETURNED}
                checked={faultType === FaultProcessOrderType.RETURNED}
                disabled={!canAnswerQuestions}
                onChange={() => setFaultType(FaultProcessOrderType.RETURNED)}
              />
              Return to supplier
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="faultType"
                value={FaultProcessOrderType.CANCELLED}
                checked={faultType === FaultProcessOrderType.CANCELLED}
                disabled={!canAnswerQuestions}
                onChange={() => setFaultType(FaultProcessOrderType.CANCELLED)}
              />
              Cancel batch
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="faultType"
                value={FaultProcessOrderType.WAREHOUSE_TRANSFER}
                checked={faultType === FaultProcessOrderType.WAREHOUSE_TRANSFER}
                disabled={!canAnswerQuestions}
                onChange={() =>
                  setFaultType(FaultProcessOrderType.WAREHOUSE_TRANSFER)
                }
              />
              Warehouse Transfer
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="faultType"
                value={FaultProcessOrderType.OTHER}
                checked={
                  faultType === FaultProcessOrderType.OTHER ||
                  faultType === FaultProcessOrderType.SHORTAGE
                }
                disabled={!canAnswerQuestions}
                onChange={() => setFaultType(FaultProcessOrderType.OTHER)}
              />
              Other
            </label>
          </div>

          {/* <Input placeholder="Specify other reason..." /> */}
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Decision</h2>

          {/* Approver info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">
                Approver
              </label>
              <Input
                type="text"
                defaultValue={approveDisplayUser}
                disabled
                className="bg-gray-100"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">Date</label>
              <Input
                type="date"
                defaultValue={approveDisplayDate}
                disabled
                className="bg-gray-100"
              />
            </div>
          </div>

          {/* Decision */}
          <div className="space-y-3">
            <div className="flex gap-6">
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-50">
                <input
                  type="radio"
                  value="approve"
                  checked={decision === "approve"}
                  disabled={!canApproveProcessOrder}
                  onChange={() => setDecision("approve")}
                />
                <span className="font-medium text-green-600">Approve</span>
              </label>

              <label className="flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-50">
                <input
                  type="radio"
                  value="reject"
                  checked={decision === "reject"}
                  disabled={!canApproveProcessOrder}
                  onChange={() => setDecision("reject")}
                />
                <span className="font-medium text-red-600">Reject</span>
              </label>
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Comment</h2>
            <textarea
              className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              rows={4}
              placeholder="Write your comment..."
              value={comment}
              disabled={!canApproveProcessOrder}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            size="sm"
            variant="primary"
            onClick={handleSave}
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Confirm"}
          </Button>
        </div>

        {/* Reserved blocks kept for future task and batch detail tables. */}
        {taskRows.length > 0 || processingRows.length > 0 ? (
          <div className="hidden">
            <GeneralInfoSection title="Handle" items={handleInfoItems} />
            <GeneralInfoSection title="Resolve" items={resolveInfoItems} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
