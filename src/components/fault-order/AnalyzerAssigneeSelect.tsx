"use client";

import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import { assignAnalyzerAndAssigneeAction } from "@/actions/faultHandling";
import type { User } from "@/interfaces/userManagementType";
import Select from "@/default_components/form/Select";
import Label from "@/default_components/form/Label";

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
  const [analyzerId, setAnalyzerId] = useState<number | null>(
    initialAnalyzerId ?? null,
  );
  const [assigneeId, setAssigneeId] = useState<number | null>(
    initialAssigneeId ?? null,
  );
  const [questionCreatorId, setQuestionCreatorId] = useState<number | null>(
    initialQuestionCreatorId ?? null,
  );
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
          label: `${name || `User ID ${id}`} (Permission Changed)`,
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
    type: "analyzer" | "assignee" | "questionCreator",
    val: string,
  ) => {
    if (!canAssignUser) return;
    const nextId = val ? Number(val) : null;

    // Capture the previous state in case we need to roll back
    const prevId =
      type === "analyzer"
        ? analyzerId
        : type === "assignee"
          ? assigneeId
          : questionCreatorId;

    // Optimistically update the UI instantly
    if (type === "analyzer") setAnalyzerId(nextId);
    if (type === "assignee") setAssigneeId(nextId);
    if (type === "questionCreator") setQuestionCreatorId(nextId);

    // Build the payload using the NEW value for the changed field,
    // and the CURRENT state for the others
    const payload = {
      analyzerUserId: type === "analyzer" ? nextId : analyzerId,
      assigneeUserId: type === "assignee" ? nextId : assigneeId,
      questionCreatorUserId:
        type === "questionCreator" ? nextId : questionCreatorId,
    };

    try {
      setIsSaving(true);
      await assignAnalyzerAndAssigneeAction(faultOrderId, payload);
      toast.success("Assignment saved successfully");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // ROLLBACK: The server failed, so revert the UI to the previous ID
      if (type === "analyzer") setAnalyzerId(prevId);
      if (type === "assignee") setAssigneeId(prevId);
      if (type === "questionCreator") setQuestionCreatorId(prevId);
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
        <Select
          value={analyzerId ? String(analyzerId) : ""}
          onChange={(e) => onSelectChange("analyzer", e.target.value)}
          disabled={isSaving || !canAssignUser}
          options={userOptions}
          placeholder="-- Select user --"
          disablePlaceholderOpt={false}
        />
      </div>

      <div>
        <Label className="font-semibold">Task Assigner:</Label>
        <Select
          value={assigneeId ? String(assigneeId) : ""}
          onChange={(e) => onSelectChange("assignee", e.target.value)}
          disabled={isSaving || !canAssignUser}
          options={userOptions}
          placeholder="-- Select user --"
          disablePlaceholderOpt={false}
        />
      </div>

      <div>
        <Label className="font-semibold">Question Creator:</Label>
        <Select
          value={questionCreatorId ? String(questionCreatorId) : ""}
          onChange={(e) => onSelectChange("questionCreator", e.target.value)}
          disabled={isSaving || !canAssignUser}
          options={userOptions}
          placeholder="-- Select user --"
          disablePlaceholderOpt={false}
        />
      </div>
    </div>
  );
}
