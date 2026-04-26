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
  FaultOrderPermission,
  FaultProcessOrderStatus,
  FaultProcessOrderType,
  FaultQuestion,
  type FaultBatchProcessOrder,
} from "@/interfaces/inventoryManagementType";
import { useAuth } from "@/context/AuthContext";
import ComponentCard from "@/default_components/common/ComponentCard";
import Radio from "@/default_components/form/input/Radio";
import { useFieldArray, useForm } from "react-hook-form";

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

export default function ProcessOrderDetailForm({
  processOrder,
  currentUserId,
  questionCreatorId,
  analyzerId,
}: ProcessOrderDetailFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const initialDecision =
    processOrder.status === FaultProcessOrderStatus.COMPLETED
      ? FaultProcessOrderStatus.APPROVED
      : processOrder.status === FaultProcessOrderStatus.FAILED ||
          processOrder.status === FaultProcessOrderStatus.CANCELLED
        ? FaultProcessOrderStatus.REJECTED
        : processOrder.status;
  // Form state
  const {
    register,
    control,
    getValues,
    resetField,
    formState: { dirtyFields },
  } = useForm<ProcessOrderFormValues>({
    defaultValues: {
      whatHappened: processOrder.whatHappened ?? "",
      impact: processOrder.impact ?? "",
      rootCause: processOrder.rootCause ?? "",
      questions: processOrder.questions,
      faultType: processOrder.type ?? FaultProcessOrderType.OTHER,
      decision: initialDecision,
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
    user?.permissions.includes(FaultOrderPermission.APPROVE) &&
    (processOrder.status == FaultProcessOrderStatus.IN_PROGRESS ||
      processOrder.status == FaultProcessOrderStatus.REJECTED);
  const canEditQuestions =
    currentUserId === questionCreatorId &&
    (processOrder.status == FaultProcessOrderStatus.IN_PROGRESS ||
      processOrder.status == FaultProcessOrderStatus.REJECTED);
  const canAnswerQuestions =
    currentUserId === analyzerId &&
    (processOrder.status == FaultProcessOrderStatus.IN_PROGRESS ||
      processOrder.status == FaultProcessOrderStatus.REJECTED);

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
            type: data.faultType, // mapped from custom form name
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

        if (updatedOrderFromServer) {
          resetField("whatHappened", {
            defaultValue: updatedOrderFromServer.whatHappened ?? "",
          });
          resetField("impact", {
            defaultValue: updatedOrderFromServer.impact ?? "",
          });
          resetField("rootCause", {
            defaultValue: updatedOrderFromServer.rootCause ?? "",
          });
          resetField("faultType", {
            defaultValue:
              updatedOrderFromServer.type ?? FaultProcessOrderType.OTHER,
          });
          resetField("questions", {
            defaultValue: updatedOrderFromServer.questions ?? [],
          });
        }

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
          status: data.decision, // mapped from custom form name
          note: data.comment.trim(), // mapped from custom form name
        });

        if (res) {
          resetField("decision", {
            defaultValue: res.status ?? FaultProcessOrderStatus.APPROVED,
          });
          resetField("comment", { defaultValue: res.note ?? "" });
        }

        toast.success("Decision submitted successfully.");
        router.refresh();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error(error.message || "Failed to submit decision.");
      }
    });
  };

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
        {/* 1. The Dynamic Wrapper Block (Dark Mode Ready) */}
        <div
          className={`space-y-6 rounded-xl border p-5 transition-colors ${
            initialDecision === FaultProcessOrderStatus.APPROVED
              ? "border-green-200 bg-green-50/50 dark:border-green-900/50 dark:bg-green-900/10"
              : initialDecision === FaultProcessOrderStatus.REJECTED
                ? "border-red-200 bg-red-50/50 dark:border-red-900/50 dark:bg-red-900/10"
                : "border-transparent bg-transparent"
          }`}
        >
          {/* Approver info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <Label>Decision Maker</Label>
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
                type="datetime-local"
                defaultValue={
                  processOrder.approveAt
                    ? (() => {
                        const d = new Date(processOrder.approveAt as string);
                        const yyyy = d.getFullYear();
                        const mm = String(d.getMonth() + 1).padStart(2, "0");
                        const dd = String(d.getDate()).padStart(2, "0");
                        const hh = String(d.getHours()).padStart(2, "0");
                        const min = String(d.getMinutes()).padStart(2, "0");

                        return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
                      })()
                    : ""
                }
                disabled
                className="bg-gray-100"
              />
            </div>
          </div>

          {/* Decision Radios */}
          <div className="flex gap-6">
            <div
              className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 transition-colors ${
                initialDecision === FaultProcessOrderStatus.APPROVED
                  ? "border-green-300 bg-green-100/50 dark:border-green-800 dark:bg-green-900/30"
                  : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
              }`}
            >
              <Radio
                label="Approve"
                id="approveBtn"
                value={FaultProcessOrderStatus.APPROVED}
                disabled={!canApproveProcessOrder || isPending}
                className={`font-medium ${
                  initialDecision === FaultProcessOrderStatus.APPROVED
                    ? "text-green-800 dark:text-green-400"
                    : "text-gray-700 dark:text-gray-300"
                }`}
                {...register("decision")}
              />
            </div>
            <div
              className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 transition-colors ${
                initialDecision === FaultProcessOrderStatus.REJECTED
                  ? "border-red-300 bg-red-100/50 dark:border-red-800 dark:bg-red-900/30"
                  : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
              }`}
            >
              <Radio
                label="Reject"
                id="rejectBtn"
                value={FaultProcessOrderStatus.REJECTED}
                disabled={!canApproveProcessOrder || isPending}
                className={`font-medium ${
                  initialDecision === FaultProcessOrderStatus.REJECTED
                    ? "text-red-800 dark:text-red-400"
                    : "text-gray-700 dark:text-gray-300"
                }`}
                {...register("decision")}
              />
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label>Comment</Label>
            <TextArea
              rows={4}
              placeholder="Write your comment..."
              disabled={!canApproveProcessOrder || isPending}
              className="bg-white/60 dark:bg-gray-900/50"
              {...register("comment")}
            />
          </div>
        </div>

        {canApproveProcessOrder && (
          <Button
            variant="primary"
            onClick={onSubmitDecision}
            disabled={isPending || !isDecisionDirty}
            className="mt-6"
          >
            {isPending ? "Saving..." : "Submit Decision"}
          </Button>
        )}
      </ComponentCard>
    </div>
  );
}
