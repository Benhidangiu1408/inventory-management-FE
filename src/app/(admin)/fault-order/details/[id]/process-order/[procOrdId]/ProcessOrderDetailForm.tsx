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
        <div className="space-y-6">
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
    </div>
  );
}
