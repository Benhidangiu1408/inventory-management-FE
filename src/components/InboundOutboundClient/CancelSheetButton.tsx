// CancelSheetButton.tsx
"use client";

import {
  updateExportSheet,
  updateImportSheet,
} from "@/actions/inbound-outbound";
import { Loading } from "@/components/TA_common/Loading";
import Button from "@/default_components/ui/button/Button";
import { useConfirmModal } from "@/hooks/useConfirmModal";
import { SheetStatus } from "@/interfaces/inventoryManagementType";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function CancelSheetButton({
  disabled,
  type = "import",
}: {
  disabled: boolean;
  type?: string;
}) {
  const { confirm, ConfirmationModal } = useConfirmModal();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { id } = useParams();

  const handleCancel = async () => {
    const ok = await confirm({
      title: "Cancel sheet",
      message: "Are you want to cancel the sheet ?",
    });
    if (!ok) return;
    setLoading(true);
    try {
      if (type !== "export") {
        await updateImportSheet(id as string, {
          status: SheetStatus.REJECTED,
        });
      } else {
        await updateExportSheet(id as string, {
          status: SheetStatus.REJECTED,
        });
      }
      toast.success("Cancel Sheet Successfully");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loading />}
      {ConfirmationModal}
      <Button
        variant="danger"
        size="sm"
        disabled={disabled || loading}
        onClick={handleCancel}
      >
        Cancel
      </Button>
    </>
  );
}
