"use client";

import { useState } from "react";
import Input from "@/default_components/form/input/InputField";
import toast from "react-hot-toast";

export default function EditableQuantity({
  initialValue,
  onSave,
}: {
  initialValue: number;
  onSave: (value: number) => Promise<void>;
}) {
  const [value, setValue] = useState(initialValue);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (value === initialValue) return;
    setSaving(true);
    try {
      await onSave(value);
      toast.success("Updated successfully");
    } catch {
      toast.error("Failed to update quantity");
      setValue(initialValue);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Input
      type="number"
      min={0}
      value={value}
      disabled={saving}
      className="h-[38px] w-10"
      onChange={(e) => setValue(Number(e.target.value))}
      onBlur={handleSave}
      onKeyDown={(e) => {
        if (e.key === "Enter") (e.target as HTMLInputElement).blur();
      }}
    />
  );
}
