"use client";

import { useModal } from "@/hooks/useModal";
import { Modal } from "@/default_components/ui/modal";
import Button from "@/default_components/ui/button/Button";
import { ReactNode } from "react";

type ModalProps = {
  width?: string;
  title?: string;
  startIcon?: ReactNode;
  isLoading?: boolean;
  openBtnTitle: string;
  formId?: string;
  modalContent: ReactNode;
  onSave?: (f: () => void) => void;
};

export default function CustomContentModalBox({
  width,
  title,
  startIcon,
  isLoading = false,
  openBtnTitle,
  formId,
  modalContent,
  onSave,
}: ModalProps) {
  const { isOpen, openModal, closeModal } = useModal();
  const handleSave = () => {
    if (onSave) onSave(closeModal);
  };

  return (
    <div>
      {/* 1. The Trigger Button (Opens the Modal) */}
      <Button size="sm" onClick={openModal} startIcon={startIcon}>
        {openBtnTitle}
      </Button>
      {/* Modal */}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className={`${width ? width : "max-w-[584px]"} p-5 lg:p-10`}
      >
        {/* Modal Header & content */}
        {title && (
          <h4 className="text-title-sm mb-7 font-semibold text-gray-800 dark:text-white/90">
            {title}
          </h4>
        )}
        <div className={"mb-6"}>{modalContent}</div>
        {/* Modal Footer */}
        <div className="flex w-full items-center justify-end gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={closeModal}
            disabled={isLoading}
          >
            Close
          </Button>
          <Button
            type={formId ? "submit" : "button"}
            form={formId}
            size="sm"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
