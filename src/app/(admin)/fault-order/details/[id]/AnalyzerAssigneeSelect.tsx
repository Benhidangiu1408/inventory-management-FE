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
};

export default function AnalyzerAssigneeSelect({
  faultOrderId,
  users,
  initialAnalyzerId,
  initialAssigneeId,
}: AnalyzerAssigneeSelectProps) {
  const [analyzerId, setAnalyzerId] = useState<number | null>(
    initialAnalyzerId ?? null,
  );
  const [assigneeId, setAssigneeId] = useState<number | null>(
    initialAssigneeId ?? null,
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (
    nextAnalyzerId: number | null,
    nextAssigneeId: number | null,
  ) => {
    setIsSaving(true);
    const { error } = await assignAnalyzerAndAssigneeAction(faultOrderId, {
      analyzerUserId: nextAnalyzerId,
      assigneeUserId: nextAssigneeId,
    });
    setIsSaving(false);

    if (error) {
      toast.error(`Failed to save: ${error}`);
    } else {
      toast.success("Saved successfully");
    }
  };

  const handleAnalyzerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value ? Number(e.target.value) : null;
    setAnalyzerId(value);
    void handleSave(value, assigneeId);
  };

  const handleAssigneeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value ? Number(e.target.value) : null;
    setAssigneeId(value);
    void handleSave(analyzerId, value);
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
        disabled={isSaving}
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
        disabled={isSaving}
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
