"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { assignAnalyzerAndAssigneeAction } from "@/actions/faultHandling";
import type { User } from "@/interfaces/userManagementType";

type AnalyzerAssigneeSelectProps = {
  faultOrderId: number;
  users: User[];
  initialAnalyzerId?: number | null;
  initialAssigneeId?: number | null;
  initialQuestionCreatorId?: number | null;
  canAssignUser: boolean;
};

export default function AnalyzerAssigneeSelect({
  faultOrderId,
  users,
  initialAnalyzerId,
  initialAssigneeId,
  initialQuestionCreatorId,
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

  const handleSave = async (
    nextAnalyzerId: number | null,
    nextAssigneeId: number | null,
    nextQuestionCreatorId?: number | null,
  ) => {
    if (!canAssignUser) {
      return;
    }

    setIsSaving(true);
    const { error } = await assignAnalyzerAndAssigneeAction(faultOrderId, {
      analyzerUserId: nextAnalyzerId,
      assigneeUserId: nextAssigneeId,
      questionCreatorUserId: nextQuestionCreatorId ?? null,
    });
    setIsSaving(false);

    if (error) {
      toast.error(`Failed to save: ${error}`);
    } else {
      toast.success("Saved successfully");
    }
  };

  const handleAnalyzerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!canAssignUser) {
      return;
    }

    const value = e.target.value ? Number(e.target.value) : null;
    setAnalyzerId(value);
    void handleSave(value, assigneeId, questionCreatorId);
  };

  const handleAssigneeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!canAssignUser) {
      return;
    }

    const value = e.target.value ? Number(e.target.value) : null;
    setAssigneeId(value);
    void handleSave(analyzerId, value, questionCreatorId);
  };

  const handleQuestionCreatorChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    if (!canAssignUser) {
      return;
    }

    const value = e.target.value ? Number(e.target.value) : null;
    setQuestionCreatorId(value);
    void handleSave(analyzerId, assigneeId, value);
  };

  const selectClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50";

  return (
    <>
      <label className="font-semibold text-black">Root Cause Analyzer:</label>
      <select
        className={selectClass}
        value={analyzerId ?? ""}
        onChange={handleAnalyzerChange}
        disabled={isSaving || !canAssignUser}
      >
        <option value="">-- Select user --</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.firstName} {user.lastName}
          </option>
        ))}
      </select>

      <label className="font-semibold text-black">Task Assigner:</label>
      <select
        className={selectClass}
        value={assigneeId ?? ""}
        onChange={handleAssigneeChange}
        disabled={isSaving || !canAssignUser}
      >
        <option value="">-- Select user --</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.firstName} {user.lastName}
          </option>
        ))}
      </select>

      <label className="font-semibold text-black">Question Creator:</label>
      <select
        className={selectClass}
        value={questionCreatorId ?? ""}
        onChange={handleQuestionCreatorChange}
        disabled={isSaving || !canAssignUser}
      >
        <option value="">-- Select user --</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.firstName} {user.lastName}
          </option>
        ))}
      </select>
    </>
  );
}
