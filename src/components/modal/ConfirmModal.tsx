"use client";

import Button from "@/default_components/ui/button/Button";
import { Modal } from "@/default_components/ui/modal";

type ConfirmModalProps = {
  isOpen: boolean;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({
  isOpen,
  title = "Confirm Action",
  message = "Are you sure you want to continue?",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      className="max-w-[600px] p-5 lg:p-10"
    >
      <h4 className="text-title-sm mb-7 font-semibold text-gray-800 dark:text-white/90">
        {title}
      </h4>
      <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
        {message}
      </p>
      <div className="mt-8 flex w-full items-center justify-end gap-3">
        <Button size="sm" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button size="sm" onClick={onConfirm}>
          Confirm
        </Button>
      </div>
    </Modal>
  );
}
