"use client";

import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import { assignAnalyzerAndAssigneeAction } from "@/actions/faultHandling";
import type { User } from "@/interfaces/userManagementType";
import Select from "@/default_components/form/Select";
import Label from "@/default_components/form/Label";
import { Controller, useForm } from "react-hook-form";
import { AssignFaultOrderUsersRequest } from "@/interfaces/inventoryManagementType";

type AnalyzerAssigneeSelectProps = {
  faultOrderId: number;
  users: User[];
  initialAnalyzerId?: number | null;
  initialAnalyzerName?: string | null;
  initialAssigneeId?: number | null;
  initialAssigneeName?: string | null;
  initialQuestionCreatorId?: number | null;
  initialQuestionCreatorName?: string | null;
  canAssignUser: boolean;
};

export default function AnalyzerAssigneeSelect({
  faultOrderId,
  users,
  initialAnalyzerId,
  initialAnalyzerName,
  initialAssigneeId,
  initialAssigneeName,
  initialQuestionCreatorId,
  initialQuestionCreatorName,
  canAssignUser,
}: AnalyzerAssigneeSelectProps) {
  const { control, setValue, getValues } =
    useForm<AssignFaultOrderUsersRequest>({
      defaultValues: {
        analyzerUserId: initialAnalyzerId ?? null,
        assigneeUserId: initialAssigneeId ?? null,
        questionCreatorUserId: initialQuestionCreatorId ?? null,
      },
    });
  const [isSaving, setIsSaving] = useState(false);

  // Safely map users AND inject ghosts
  const userOptions = useMemo(() => {
    const options = users.map((user) => ({
      value: String(user.id),
      label: `${user.firstName} ${user.lastName}`.trim() || user.username,
    }));

    // Helper to add a user if they are missing from the current active staff list
    const ensureOptionExists = (id?: number | null, name?: string | null) => {
      if (id && !options.some((opt) => opt.value === String(id))) {
        options.push({
          value: String(id),
          label: `${name || `User ID ${id}`} (No longer have permission!)`,
        });
      }
    };
    ensureOptionExists(initialAnalyzerId, initialAnalyzerName);
    ensureOptionExists(initialAssigneeId, initialAssigneeName);
    ensureOptionExists(initialQuestionCreatorId, initialQuestionCreatorName);
    return options;
  }, [
    users,
    initialAnalyzerId,
    initialAnalyzerName,
    initialAssigneeId,
    initialAssigneeName,
    initialQuestionCreatorId,
    initialQuestionCreatorName,
  ]);

  const onSelectChange = async (
    field: keyof AssignFaultOrderUsersRequest,
    val: string,
  ) => {
    if (!canAssignUser) return;
    const nextId = val ? Number(val) : null;
    const prevId = getValues(field); // RHF gets the current state instantly
    if (nextId === prevId) return;
    // Optimistically update RHF state instantly
    setValue(field, nextId);

    try {
      setIsSaving(true);
      await assignAnalyzerAndAssigneeAction(faultOrderId, getValues());
      toast.success("Assignment saved successfully");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // ROLLBACK: The server failed, so revert the UI to the previous ID
      setValue(field, prevId);
      toast.error(
        `Failed to assign user: ${error.message ?? "An unexpected error occurred"}`,
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div>
        <Label className="font-semibold">Root Cause Analyzer:</Label>
        <Controller
          name="analyzerUserId"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value ? String(field.value) : ""}
              onChange={(e) => onSelectChange("analyzerUserId", e.target.value)}
              disabled={isSaving || !canAssignUser}
              options={userOptions}
              placeholder="-- Select user --"
              disablePlaceholderOpt={false}
            />
          )}
        />
      </div>

      <div>
        <Label className="font-semibold">Task Assigner:</Label>
        <Controller
          name="assigneeUserId"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value ? String(field.value) : ""}
              onChange={(e) => onSelectChange("assigneeUserId", e.target.value)}
              disabled={isSaving || !canAssignUser}
              options={userOptions}
              placeholder="-- Select user --"
              disablePlaceholderOpt={false}
            />
          )}
        />
      </div>

      <div>
        <Label className="font-semibold">Question Creator:</Label>
        <Controller
          name="questionCreatorUserId"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value ? String(field.value) : ""}
              onChange={(e) =>
                onSelectChange("questionCreatorUserId", e.target.value)
              }
              disabled={isSaving || !canAssignUser}
              options={userOptions}
              placeholder="-- Select user --"
              disablePlaceholderOpt={false}
            />
          )}
        />
      </div>
    </div>
  );
}
